import BottomSheet from "@devvie/bottom-sheet";
import { StatusBar } from "expo-status-bar";
import LottieView from "lottie-react-native";
import moment from "moment";
import React, { useContext, useEffect, useRef, useState } from "react";
import {
  FlatList,
  Image,
  Linking,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Circle, Path } from "react-native-svg";
import Profile from "../assets/icon.png";
import Button from "../components/Button";
import { TaraLogo, TaraMic,TaraPlay,TaraHold } from "../components/CustomIcon";
import ParagraphText from "../components/ParagraphText";
import {
  fetchConversations,
  fetchInboxMessages,
  fetchSeenChatStatus,
  fetchTypingStatus,
  fetchUser,
  insertChat,
  translateText,
  updateSeenStatus,
  updateTypingStatus,
} from "../config/hooks";
import { AuthContext } from "../context/authContext";
import { getAutoChat,getRiderInfo,uploadAudio,hookConf } from "../config/hooks";
import { Audio } from 'expo-av';
import { isAudioFile,SoundWave } from "../config/functions";


const InboxScreen = ({ route, navigation }) => {
  const [senderID, setSenderID] = useState(null);
  const [receiverID, setReceiverID] = useState(null);
  const [chatRedirect, setRedirect] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [seenMsg, setSeenMsg] = useState({});
  const [userInfo, setUserInfo] = useState([]);
 

  const { user } = useContext(AuthContext);

  const [selectedChat, setSelectedChat] = useState({
    senderId: null,
    receiverId: null,
    active: false,
  });

  useEffect(() => {
    if (route.params) {
      const { purpose, receiver, sender, channel } = route.params;
      if (route.params) {
        if (purpose == "chat") {
          setReceiverID(receiver);
          setSenderID(sender);
          setRedirect(purpose);
          setSelectedChat({
            senderId: sender || user?.userId,
            receiverId: receiver,
            active: true,
            group: channel
          });
        }
      }
    }
  }, [route.params, user?.userId]);

  useEffect(() => {
    // fetching all the inbox messages of the user
    const fetchMessages = async () => {
      setIsLoading(true);

      try {
        await fetchInboxMessages(user?.userId, async (item) => {
          if (item.status === "success") {
            const newUsersInfo = [];

            for (const data of item.data) {
              try {
                // the id of messages receiver
                const id = data.participants.find(
                  (index) => index !== senderID || index !== user?.userId
                );

                const res = await fetchUser(id, user);
                if (res.status === "success") {
                  newUsersInfo.push({
                    id,
                    name: res.data?.Username,
                  });

                  setReceiverID(id);
                }

                // fetch the seen status for inbox to config
                await fetchSeenChatStatus(
                  user?.userId,
                  id,
                  data?.lastMessageId,
                  (item) => {
                    // set the last message id
                    setSeenMsg({ id: data?.lastMessageId, active: item.data });
                  }
                );
              } catch (err) {
                console.error(err);
              }
            }

            setUserInfo((prev) => [...prev, ...newUsersInfo]);
            setMessages(item.data);
            setIsLoading(false);
          }
        });
      } catch (error) {
        console.log(error);
      }
    };

    fetchMessages();
  }, [user?.userId]);

  const handleChatOpen = (senderId) => {
    setSelectedChat({
      senderId: user?.userId,
      receiverId: senderId,
      active: true,
    });
  };

  const handleCloseChat = () => {
    setSelectedChat((prev) => ({ ...prev, active: false }));
    navigation.setParams({ purpose: null }); // Clear route params
  };

  return (
    <View className="w-full h-full bg-white relative ">
      <StatusBar style="dark" />
      <View className="h-full px-6 py-10">
        <View className="w-full flex flex-row items-center justify-between py-2">
          <Pressable onPress={() => navigation.goBack()}>
            <Svg
              xmlns="http://www.w3.org/2000/svg"
              width={30}
              height={30}
              viewBox="0 0 24 24"
              fill="#374957"
            >
              <Path d="M19 11H9l3.29-3.29a1 1 0 0 0 0-1.42 1 1 0 0 0-1.41 0l-4.29 4.3A2 2 0 0 0 6 12a2 2 0 0 0 .59 1.4l4.29 4.3a1 1 0 1 0 1.41-1.42L9 13h10a1 1 0 0 0 0-2Z" />
            </Svg>
          </Pressable>
          <Text className="text-xl font-semibold">Messages</Text>

          <Text className="text-xl font-semibold opacity-0">hello</Text>
        </View>

        {isLoading ? (
          <Text className="text-base text-center mt-24">Loading...</Text>
        ) : messages.length === 0 ? (
          <Text className="text-base text-center mt-24">
            No messages available
          </Text>
        ) : (
          <MessageList
            senderId={user?.userId || senderID}
            receiverId={receiverID}
            messages={messages}
            userInfo={userInfo}
            seen={seenMsg}
            onChatOpen={handleChatOpen}
          />
        )}
      </View>

      {selectedChat.active && (
        <Chat
          group={selectedChat.group}
          navigation={navigation}
          redirect={chatRedirect}
          senderId={selectedChat.senderId}
          receiverId={selectedChat.receiverId}
          close={handleCloseChat}
        />
      )}
    </View>
  );
};

const MessageList = ({
  messages,
  senderId,
  receiverId,
  userInfo,
  seen,
  onChatOpen,
}) => {
  return (
    <FlatList
      data={messages}
      keyExtractor={(item) => item.id}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ gap: 10 }}
      renderItem={({ item }) => {
        // id of the message sender
        const id = item.participants.find((index) => index !== senderId);
        // to get the user id and name of the sender
        const sender = userInfo.find((user) => user.id == id);

        return (
          <ChatList
            key={item.id}
            senderId={senderId}
            receiverId={receiverId}
            msgId={item.lastMessageId}
            status={item.status}
            lastMessage={item.lastMessage}
            lastSenderId={item.lastSenderId}
            senderName={sender?.name}
            seen={seen}
            datetime={item.datetime}
            onPress={() => onChatOpen(id)}
          />
        );
      }}
    />
  );
};

const ChatList = ({
  senderId,
  receiverId,
  msgId,
  senderName,
  status,
  seen,
  datetime,
  lastMessage,
  lastSenderId,
  onPress,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="w-full flex flex-row gap-x-4 justify-between "
    >
      <View className="flex flex-row gap-x-3 justify-start ">
        <Image
          source={Profile}
          className="w-14 h-14 bg-neutral-500 rounded-xl object-cover"
        />

        <View>
          <Text className="text-base font-bold">{senderName}</Text>
          <Text className={`text-sm text-neutral-500`}>
            {lastMessage.length > 30
              ? lastSenderId === senderId
                ? "You: " + lastMessage.substring(0, 30) + "..."
                : lastMessage.substring(0, 30) + "..."
              : lastSenderId === senderId
              ? "You: " + lastMessage
              : lastMessage}
          </Text>
        </View>
      </View>

      <View className="flex gap-y-1 items-end">
        <Text className="text-sm text-neutral-500">
          {moment(datetime).fromNow()}
        </Text>
        {status === "active" && (
          <View className="bg-green-500 px-4 rounded-md">
            <Text className="text-white text-sm">Active</Text>
          </View>
        )}

        {status === "expired" && (
          <View className="bg-slate-300 px-4 rounded-md">
            <Text className="text-white text-sm">Expired</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const Chat = ({ group, navigation, redirect, senderId, receiverId, close }) => {
  const scrollViewRef = useRef(null);
  const [msg, setMsg] = useState("");
  const [activeAutoReport, setActiveAutoReport] = useState(false);
  const [useAudioCall, setAudioCall] = useState(false);
  const [chats, setChat] = useState([]);
  const [typing, setTyping] = useState({ id: null, active: false });
  const [playbackSound, setPlaybackSound] = useState(null);
  const conversationId = [senderId, receiverId].sort().join("_");
  const [isLoading, setIsLoading] = useState(false);
  const [msgIds, setMsgIds] = useState(null);
  const [translatedMessage, setTranslatedMessage] = useState({});
  const [receiverData, setReceiverData] = useState(null);
  const [authToken,setAuthToken] = useState(null)
  const { user } = useContext(AuthContext);
  const expiredSession = true;
  const [audioPlaying,setAudioPlaying] = useState(false)
  const [selected,setSelected] = useState(null)
  const handleOnChange = async (value) => {
    setMsg(value);
    await updateTypingStatus(conversationId, senderId, value !== "");
  };

  useEffect(() => {
    const loadReceiverData = async () => {
      setIsLoading(true);
      try {
        //const res = await fetchUser(receiverId, user);
        const res = await getRiderInfo(receiverId, user);
       
        if (res.status == "1") {
          setReceiverData(res.data);
          setIsLoading(false);
        }
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    };

    const readyToken = async () =>{
      setAuthToken(await hookConf(user))
    }

    readyToken();
    loadReceiverData();
  }, [receiverId]);

  useEffect(() => {
    // sender typing functionallity
    const typingStatus = async () => {
      
      try {
        await fetchTypingStatus(conversationId, (item) => {
          if (item.status === "success") {
            setTyping({
              id: Object.keys(item.data).find((key) => item.data[key] === true),
              active: item.data[senderId] || false,
            });
          }
        });
      } catch (error) {
        console.log(error);
      }
    };

    const fetchConvos = async () => {
      try {
        await fetchConversations(conversationId, async (item) => {
          if (item.status === "success") {
            // fetching message id and receiver Id for updating seen status
            setMsgIds(
              item.data.map((msg) => ({
                id: msg.id,
                receiverId: msg.receiverId,
              }))
            );

            setChat(item.data);
          }
        });
      } catch (error) {
        console.log(error);
      }
    };

    fetchConvos();
    typingStatus();

    return () => {};
  }, [senderId, receiverId, conversationId]);

  const updateMsgSeenStatus = async () => {
    try {
      for (const data of msgIds) {
        await updateSeenStatus(conversationId, senderId, data?.id);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (text) => {
    setAudioCall(false)
    try {
      if (!text || text === "") return;

      const res = await insertChat(senderId, receiverId, text);

      // dissable the typing component
      typing({ id: 0, active: false });
      await updateTypingStatus(conversationId, senderId, false);

      // clear input
      setMsg("");
    } catch (error) {
      console.log(error);
    }
  };

  const toggleTranslation = async (id, text) => {
    try {
      const res = await translateText(text, user);

      if (res.status === "success") {
        console.log("translate text res: ", res.data);

        setTranslatedMessage((prev) => ({ ...prev, [id]: res.data?.to }));
      }
    } catch (error) {
      console.log(error);
    }
  };


  const playAudio = async (url,id) => {
    if (!url) {
      console.warn("No audio URL to play.");
      return;
    }
    setSelected(id)
    const server_audio = `https://dwayon.tech/api/audio/recording/${url}`;
    try {
      console.log('Playing audio from URL:',server_audio);
      if (playbackSound) {
        await playbackSound.unloadAsync(); // Unload previous sound if playing
        setAudioPlaying(false)
      }
      const { sound } = await Audio.Sound.createAsync({ uri: server_audio }); // Load from URL
      setAudioPlaying(true)
      setPlaybackSound(sound)
        // Set up playback status listener
        sound.setOnPlaybackStatusUpdate((status) => {
          if (status.didJustFinish) {
            setAudioPlaying(false)
            setSelected(null)
          }
        });
      await sound.playAsync();
    } catch (error) {
      console.error('Error playing audio', error);
    }
  };

  return (
    <View className="w-full h-full bg-white absolute inset-0 z-50">
      <StatusBar style="dark" />
      <View className="h-full  relative">
        <View className="w-full flex flex-row items-center justify-between  px-6 pt-12 pb-4">
          <Pressable
            onPress={redirect == "chat" ? () => navigation.goBack() : close}
          >
            <Svg
              xmlns="http://www.w3.org/2000/svg"
              width={30}
              height={30}
              viewBox="0 0 24 24"
              fill="#374957"
            >
              <Path d="M19 11H9l3.29-3.29a1 1 0 0 0 0-1.42 1 1 0 0 0-1.41 0l-4.29 4.3A2 2 0 0 0 6 12a2 2 0 0 0 .59 1.4l4.29 4.3a1 1 0 1 0 1.41-1.42L9 13h10a1 1 0 0 0 0-2Z" />
            </Svg>
          </Pressable>
          <View className="flex-row gap-x-6 justify-start items-center">
        
            <Pressable onPress={() => setActiveAutoReport(true)}>
              <LottieView
                source={require("../assets/animation/eye-watch.json")}
                autoPlay
                loop
                width={40}
                height={40}
              />
            </Pressable>
          </View>
        </View>

        <View className="flex-1">
          <ScrollView
            ref={scrollViewRef}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={async (width, height) => {
              scrollViewRef.current?.scrollTo({ y: height, animated: true });
              await updateMsgSeenStatus();
            }}
            className="px-8"
          >
            <View className="w-full pt-2">
              <View className="w-full flex items-center gap-y-2">
                <Image
                  source={{uri:receiverData?.Photo}}
                  className="w-20 h-20 bg-neutral-100 rounded-xl object-cover"
                />

                <Text className="text-xl text-center font-bold">
                  {receiverData?.Legal_Name}
                </Text>

                <ParagraphText
                  fontSize="sm"
                  align="center"
                  textColor="text-neutral-700"
                >
                  This chat remains active for 24 hours with the driver,
                  allowing you to reach out if you left any items. After that,
                  the session will close.
                </ParagraphText>
              </View>

              <View className="w-full py-8 flex gap-y-4 justify-end">
                {/* messages */}
                {chats?.map((item) => {
                  return (
                    <View key={item.id}>
                      {senderId === item.senderId ? (
                        <View className="w-full flex items-end">
                          {
                            isAudioFile(item.message) ? (
                              <Pressable onPress={()=>playAudio(item.message,item.id)} className="max-w-['80%'] bg-gray-100 px-4 py-3 rounded-xl overflow-hidden">
                              <View className="flex-row justify-start items-center gap-x-2">
                                {
                                  selected == item.id && audioPlaying ? (
                                    <TaraHold size={20} color="#404040" />
                                  ):(
                                    <TaraPlay size={20} color="#404040" />
                                  )
                                }
                                
                              <>
                              {
                                selected == item.id && audioPlaying ? (
                                  <View className="flex-row justify-center items-center">
                                      <LottieView
                                  source={require("../assets/animation/audio.json")}
                                  autoPlay
                                  loop
                                  width={210}
                                  height={65}
                                />
                                </View>
                                ):(
                                  <SoundWave text={item.message} />
                                )
                              }
                              
                              </>
                              </View>
                            </Pressable>
                            ):(
                              <View className="max-w-['80%']  bg-slate-100 px-4 py-3 rounded-xl">
                              <Text className="text-black text-base">
                                {item.message}
                              </Text>
                            </View>
                            )
                            
                          }
                          <View className="flex flex-row">
                            <Text className="p-1 text-slate-400 text-xs">
                              {moment(item.datetime).fromNow()}
                            </Text>
                            {item.seen && (
                              <View className="flex flex-row  items-center">
                                <Svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  xmlSpace="preserve"
                                  width={10}
                                  height={10}
                                  style={{
                                    enableBackground: "new 0 0 512.19 512.19",
                                  }}
                                  fill="#94a3b8"
                                  viewBox="0 0 512.19 512.19"
                                >
                                  <Circle
                                    cx={256.095}
                                    cy={256.095}
                                    r={85.333}
                                  />
                                  <Path d="M496.543 201.034C463.455 147.146 388.191 56.735 256.095 56.735S48.735 147.146 15.647 201.034c-20.862 33.743-20.862 76.379 0 110.123 33.088 53.888 108.352 144.299 240.448 144.299s207.36-90.411 240.448-144.299c20.862-33.744 20.862-76.38 0-110.123zM256.095 384.095c-70.692 0-128-57.308-128-128s57.308-128 128-128 128 57.308 128 128c-.071 70.663-57.337 127.929-128 128z" />
                                </Svg>

                                <Text className="p-1 text-slate-400 text-xs">
                                  Seen
                                </Text>
                              </View>
                            )}
                          </View>
                        </View>
                      ) : (
                        <View className="w-full flex items-start">
                          {
                            isAudioFile(item.message) ? (
                          <Pressable onPress={()=>playAudio(item.message,item.id)} className="max-w-['80%'] bg-gray-100 px-4 py-3 rounded-xl overflow-hidden">
                            <View className="flex-row justify-start items-center gap-x-2">
                              {
                                selected == item.id && audioPlaying ? (
                                  <TaraHold size={20} color="#404040" />
                                ):(
                                  <TaraPlay size={20} color="#404040" />
                                )
                              }
                              
                            <>
                            {
                              selected == item.id && audioPlaying ? (
                                <View className="flex-row justify-center items-center">
                                    <LottieView
                                source={require("../assets/animation/audio.json")}
                                autoPlay
                                loop
                                width={210}
                                height={65}
                              />
                              </View>
                              ):(
                                <SoundWave text={item.message} />
                              )
                            }
                            
                            </>
                            </View>
                          </Pressable>
                            ):(
                            <View className="max-w-['80%'] border border-slate-300 px-4 py-3 rounded-xl">
                            <Text className="text-black text-base">
                              {translatedMessage[item.id] ?? item.message}
                            </Text>
                            <Text
                              onPress={() =>
                                toggleTranslation(item.id, item.message)
                              }
                              className="text-blue-600 underline text-xs"
                            >
                              See translation
                            </Text>
                          </View>
                            )
                          }
                          
                          <Text className="p-1 text-neutral-500 text-xs">
                            {moment(item.datetime).fromNow()}
                          </Text>
                        </View>
                      )}
                    </View>
                  );
                })}

                {typing.id === receiverId && typing && (
                  <View>
                    <LottieView
                      source={require("../assets/animation/typing.json")}
                      autoPlay
                      loop
                      width={60}
                      height={60}
                    />
                  </View>
                )}
              </View>
            </View>
          </ScrollView>

          {expiredSession ? (
            <ChatSessionExpired />
          ) : (
            <View className="w-full px-6 pb-8 bg-white">
              <SuggestedChats setChat={(text) => handleSubmit(text)} />
              <View className="w-full border border-slate-400 p-2 rounded-2xl flex flex-row gap-x-2 items-start justify-between">
                <TextInput
                  className="flex-1 text-base"
                  multiline={true}
                  value={msg}
                  onChangeText={handleOnChange}
                  placeholder="Type your message"
                />

                <View className="flex-row justify-center items-center gap-x-2">
                <TouchableOpacity onPress={() => setAudioCall(true)}>
                <TaraMic size={25} color="#3b82f6" />
                </TouchableOpacity>
                <Pressable
                  onPress={() => handleSubmit(msg)}
                  className="p-2 bg-blue-50 rounded-xl"
                >
                  <Svg
                    xmlns="http://www.w3.org/2000/svg"
                    xmlSpace="preserve"
                    width={25}
                    height={25}
                    style={{
                      enableBackground: "new 0 0 512.308 512.308",
                    }}
                    fill="#3b82f6"
                    viewBox="0 0 512.308 512.308"
                  >
                    <Path d="M505.878 36.682 110.763 431.69a63.318 63.318 0 0 0 27.413 6.4h67.669a21.187 21.187 0 0 1 15.083 6.251l36.672 36.651a106.043 106.043 0 0 0 75.157 31.317 107.276 107.276 0 0 0 34.261-5.653c38.05-12.475 65.726-45.46 71.403-85.099l72.085-342.4a63.12 63.12 0 0 0-4.628-42.475zM433.771 1.652 92.203 73.61C33.841 81.628-6.971 135.44 1.047 193.802a106.67 106.67 0 0 0 30.228 60.885l36.651 36.651a21.336 21.336 0 0 1 6.251 15.104v67.669a63.315 63.315 0 0 0 6.4 27.413L475.627 6.41a62.525 62.525 0 0 0-41.856-4.758z" />
                  </Svg>
                </Pressable>
                </View>
              </View>
            </View>
          )}
        </View>
      </View>

      <AutoReport
        open={activeAutoReport}
        onClose={() => setActiveAutoReport(false)}
      />

      {useAudioCall && <AudioCall sendAudio={handleSubmit} auth={authToken} close={setAudioCall} />}
    </View>
  );
};

const SuggestedChats = ({ setChat }) => {
  const { user } = useContext(AuthContext);
  const [chatList, setChatList] = useState([]);


  useEffect(()=>{
    const pullauto = async () =>{
      const sdg = await getAutoChat(user);
      if (sdg.status == 1) {
        setChatList(sdg.suggested_chats);
    }
    }

    pullauto();
  },[user])

  return (
    <FlatList
      data={chatList}
      renderItem={({ item, index }) => (
        <ChatOptions
          {...item}
          onPress={() => setChat(item.txt)}
          index={index}
        />
      )}
      keyExtractor={(item) => item.id}
      horizontal
      showsHorizontalScrollIndicator={false}
    />
  );
};

const ChatOptions = (props) => {
  return (
    <View className="p-2">
      <TouchableOpacity
        onPress={props.onPress}
        activeOpacity={0.7}
        className="p-2 bg-neutral-100
        rounded-xl text-center"
      >
        <Text className="text-sm">{props.txt}</Text>
      </TouchableOpacity>
    </View>
  );
};

const ChatSessionExpired = () => {
  return (
    <View className="w-full min-h-24 p-4 bg-red-500">
      <Text className="text-white text-center text-xl font-bold">
        Chat session expired
      </Text>
      <Text className="text-white text-center text-sm">
        To learn more check out our{" "}
        <Text
          onPress={() => Linking.openURL("https://taranapo.com/faqs/")}
          className="text-blue-100 font-normal underline"
        >
          Help Centre
        </Text>{" "}
        or chat us.
      </Text>
    </View>
  );
};



const AutoReport = ({ open, onClose }) => {
  const sheetRef = useRef(null);

  useEffect(() => {
    if (open) {
      sheetRef.current?.open();
    }
  }, [open]);

  return (
    <BottomSheet
      onClose={onClose}
      animationType="spring"
      ref={sheetRef}
      containerHeight={1000}
      style={{ backgroundColor: "#fff" }}
    >
      <View className="w-full h-full p-6 flex gap-y-4 ">
        <View className="flex flex-row gap-x-4 items-center justify-center">
          <LottieView
            source={require("../assets/animation/eye-watch.json")}
            autoPlay
            loop
            width={60}
            height={60}
          />
          <Text className="text-2xl font-bold text-neutral-700">
            Auto-Report
          </Text>
        </View>

        <ParagraphText fontSize="base" align="center" padding="py-1.5">
          Tara AI monitors your chat to protect against rude messages and
          automatically reports the rider/driver, saving you time.
        </ParagraphText>

        <View className="w-full flex gap-y-4">
          <Button
            onPress={() => sheetRef.current?.close()}
            bgColor="bg-slate-200"
            textColor="text-neutral-700"
          >
            Close
          </Button>
          <Button
            onPress={() => Linking.openURL("https://taranapo.com/auto-report/")}
            bgColor="bg-slate-200"
            textColor="text-blue-500"
          >
            Learn More
          </Button>
        </View>
      </View>
    </BottomSheet>
  );
};

const AudioCall = ({ sendAudio, auth,close }) => {

const [msg,setMsg] = useState("Just like walkie talkie ..");
const [isRecording, setIsRecording] = useState(false);
const [recording, setRecording] = useState(null);
const [recordedAudioUri, setRecordedAudioUri] = useState(null);




const startRecoding = async () =>{
  console.log('recording')
  setMsg("Speak now..")
  try {
    console.log('Starting recording..');
    setIsRecording(true);
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });
    const newRecording = new Audio.Recording();
    await newRecording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
    await newRecording.startAsync();
    setRecording(newRecording);
  } catch (error) {
    console.error('Failed to start recording', error);
    setIsRecording(false);
  }
}




const stopRecording = async () =>{
  console.log('stop')
  setMsg("Just like walkie talkie ..")
  console.log('Stopping recording..');
    setIsRecording(false);
    if (recording) {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      console.log('Recording stopped and saved to', uri);
      setRecordedAudioUri(uri);
      setRecording(null);
      const audioURL = await uploadAudio(uri,auth); //upload na
      sendAudio(audioURL)
    }
}





const opsPo = () =>{
  setMsg("Long press the mic button")
  setTimeout(()=> setMsg("Just like walkie talkie .."),1000)
}


  return (
    <View className="w-full h-full bg-white absolute inset-0 z-50">
      <StatusBar style="dark" />
      <View className="relative h-full justify-center items-center px-6 py-10">
      <View className="absolute top-20 left-8 z-50">
            <TouchableOpacity
              onPress={()=>close(false)}
              className="bg-gray-100 h-16 w-16 rounded-full flex-row justify-center items-center"
            >
              <Svg
              xmlns="http://www.w3.org/2000/svg"
              width={30}
              height={30}
              viewBox="0 0 24 24"
              fill="#374957"
            >
              <Path d="M19 11H9l3.29-3.29a1 1 0 0 0 0-1.42 1 1 0 0 0-1.41 0l-4.29 4.3A2 2 0 0 0 6 12a2 2 0 0 0 .59 1.4l4.29 4.3a1 1 0 1 0 1.41-1.42L9 13h10a1 1 0 0 0 0-2Z" />
            </Svg>
            </TouchableOpacity>
           
          </View>
        <View className="rounded-2xl bg-blue-100 h-[600px] w-full relative overflow-hidden">
          <View className="flex-row items-center  justify-center absolute top-0 bottom-0 mx-auto left-0 right-0 w-full py-4 px-12">
          <Text className="text-center font-medium text-2xl">
                {msg}
              </Text>
          </View>

      
            <View className="absolute -bottom-[108px] rotate-180 transform">
              <LottieView
                source={require("../assets/animation/gradient.json")}
                autoPlay
                loop
                width={400}
                height={400}
              />
            </View>
        
        </View>

        <View className="mt-6 flex-row justify-center items-center gap-x-6">
          <View>
            <TouchableOpacity
              onLongPress={()=>startRecoding()}
              onPressOut={()=>stopRecording()}
              onPress={()=>opsPo()}
              className="bg-slate-800 h-20 w-20 rounded-full flex-row justify-center items-center"
            >
              <TaraMic size={30} color="#fff" />
            </TouchableOpacity>
            <Text className="text-center py-1.5">Long Press</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default InboxScreen;
