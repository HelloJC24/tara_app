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
import { TaraLogo } from "../components/CustomIcon";
import ParagraphText from "../components/ParagraphText";
import {
  fetchConversations,
  fetchInboxMessages,
  fetchRider,
  fetchSeenChatStatus,
  fetchTypingStatus,
  insertChat,
  translateText,
  updateSeenStatus,
  updateTypingStatus,
} from "../config/hooks";
import { AuthContext } from "../context/authContext";

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
      const { purpose, receiver, sender } = route.params;
      if (route.params) {
        if (purpose == "chat") {
          setReceiverID(receiver);
          setSenderID(sender);
          setRedirect(purpose);
          setSelectedChat({
            senderId: sender || user?.userId,
            receiverId: receiver,
            active: true,
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

                const res = await fetchRider(id, user);
                if (res.status === "success") {
                  newUsersInfo.push({
                    id,
                    name: res.data?.Legal_Name,
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
          <Text className="text-base text-center mt-24">loading...</Text>
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

const Chat = ({ navigation, redirect, senderId, receiverId, close }) => {
  const scrollViewRef = useRef(null);
  const [msg, setMsg] = useState("");
  const [activeAutoReport, setActiveAutoReport] = useState(false);
  const [useAudioCall, setAudioCall] = useState(false);
  const [chats, setChat] = useState([]);
  const [typing, setTyping] = useState({ id: null, active: false });

  const conversationId = [senderId, receiverId].sort().join("_");
  const [isLoading, setIsLoading] = useState(false);
  const [msgIds, setMsgIds] = useState(null);
  const [translatedMessage, setTranslatedMessage] = useState({});
  const [receiverData, setReceiverData] = useState(null);

  const { user } = useContext(AuthContext);
  const expiredSession = false;

  const handleOnChange = async (value) => {
    setMsg(value);
    await updateTypingStatus(conversationId, senderId, value !== "");
  };

  useEffect(() => {
    const loadReceiverData = async () => {
      setIsLoading(true);
      try {
        const res = await fetchRider(receiverId, user);
        if (res.status === "success") {
          setReceiverData(res.data);
          setIsLoading(false);
        }
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    };

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
            {/* {redirect == "chat" && ( */}
            <TouchableOpacity onPress={() => setAudioCall(true)}>
              <Svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <Path
                  d="M12.9998 1.00013C12.9998 0.734916 13.1052 0.480562 13.2927 0.293025C13.4803 0.105489 13.7346 0.000132124 13.9998 0.000132124C16.6511 0.00304372 19.193 1.05755 21.0677 2.93228C22.9424 4.80701 23.9969 7.34886 23.9998 10.0001C23.9998 10.2654 23.8945 10.5197 23.7069 10.7072C23.5194 10.8948 23.2651 11.0001 22.9998 11.0001C22.7346 11.0001 22.4803 10.8948 22.2927 10.7072C22.1052 10.5197 21.9998 10.2654 21.9998 10.0001C21.9975 7.87913 21.1538 5.84568 19.6541 4.34591C18.1543 2.84613 16.1208 2.00251 13.9998 2.00013C13.7346 2.00013 13.4803 1.89478 13.2927 1.70724C13.1052 1.5197 12.9998 1.26535 12.9998 1.00013ZM13.9998 6.00013C15.0607 6.00013 16.0781 6.42156 16.8283 7.17171C17.5784 7.92185 17.9998 8.93927 17.9998 10.0001C17.9998 10.2654 18.1052 10.5197 18.2927 10.7072C18.4803 10.8948 18.7346 11.0001 18.9998 11.0001C19.2651 11.0001 19.5194 10.8948 19.7069 10.7072C19.8945 10.5197 19.9998 10.2654 19.9998 10.0001C19.9983 8.40932 19.3656 6.88412 18.2407 5.75925C17.1159 4.63437 15.5907 4.00172 13.9998 4.00013C13.7346 4.00013 13.4803 4.10549 13.2927 4.29303C13.1052 4.48056 12.9998 4.73492 12.9998 5.00013C12.9998 5.26535 13.1052 5.5197 13.2927 5.70724C13.4803 5.89478 13.7346 6.00013 13.9998 6.00013ZM23.0928 16.7391C23.6723 17.3202 23.9978 18.1074 23.9978 18.9281C23.9978 19.7488 23.6723 20.536 23.0928 21.1171L22.1828 22.1661C13.9928 30.0071 -5.93713 10.0821 1.78286 1.86613L2.93286 0.866132C3.51463 0.302809 4.29479 -0.0088188 5.10456 -0.00133303C5.91433 0.00615273 6.6886 0.332151 7.25986 0.906132C7.29086 0.937132 9.14385 3.34413 9.14385 3.34413C9.69368 3.92176 9.99976 4.68906 9.99845 5.48654C9.99715 6.28401 9.68857 7.05031 9.13685 7.62613L7.97885 9.08213C8.6197 10.6392 9.56192 12.0544 10.7514 13.2462C11.9408 14.4381 13.354 15.3831 14.9098 16.0271L16.3748 14.8621C16.9507 14.3108 17.7169 14.0026 18.5141 14.0015C19.3114 14.0004 20.0784 14.3065 20.6558 14.8561C20.6558 14.8561 23.0618 16.7081 23.0928 16.7391ZM21.7168 18.1931C21.7168 18.1931 19.3238 16.3521 19.2928 16.3211C19.0868 16.1169 18.8085 16.0023 18.5183 16.0023C18.2282 16.0023 17.9499 16.1169 17.7438 16.3211C17.7168 16.3491 15.6998 17.9561 15.6998 17.9561C15.5639 18.0643 15.4022 18.1352 15.2305 18.1619C15.0588 18.1885 14.8832 18.17 14.7208 18.1081C12.7053 17.3577 10.8746 16.1829 9.35269 14.6632C7.83079 13.1436 6.65326 11.3146 5.89986 9.30013C5.83306 9.13559 5.81128 8.95622 5.83676 8.78047C5.86224 8.60472 5.93407 8.43893 6.04486 8.30013C6.04486 8.30013 7.65185 6.28213 7.67885 6.25613C7.88312 6.05012 7.99773 5.77175 7.99773 5.48163C7.99773 5.19152 7.88312 4.91315 7.67885 4.70713C7.64785 4.67713 5.80686 2.28213 5.80686 2.28213C5.59776 2.09464 5.32486 1.99423 5.04411 2.00148C4.76335 2.00873 4.496 2.1231 4.29686 2.32113L3.14686 3.32113C-2.49513 10.1051 14.7758 26.4181 20.7208 20.8001L21.6318 19.7501C21.8453 19.5524 21.9735 19.2794 21.9894 18.9888C22.0053 18.6983 21.9075 18.4129 21.7168 18.1931Z"
                  fill="#374957"
                />
              </Svg>
            </TouchableOpacity>
            {/* )} */}
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
                  source={Profile}
                  className="w-20 h-20 bg-neutral-500 rounded-xl object-cover"
                />

                <Text className="text-2xl text-center font-bold">
                  {receiverData?.Username}
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
                          <View className="max-w-['80%']  bg-slate-100 px-4 py-3 rounded-xl">
                            <Text className="text-black text-base">
                              {item.message}
                            </Text>
                          </View>
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
          )}
        </View>
      </View>

      <AutoReport
        open={activeAutoReport}
        onClose={() => setActiveAutoReport(false)}
      />

      {useAudioCall && <AudioCall close={setAudioCall} />}
    </View>
  );
};

const SuggestedChats = ({ setChat }) => {
  const chatList = [
    {
      id: 1,
      txt: "Are you available?",
    },
    {
      id: 2,
      txt: "Sige! Okay",
    },
    {
      id: 3,
      txt: "Pwedi pasundo?",
    },
    {
      id: 4,
      txt: "Wait",
    },
    {
      id: 5,
      txt: "San kana po?",
    },
    {
      id: 6,
      txt: "HAHAHAHA",
    },
    {
      id: 7,
      txt: "Exact po pin location ko.",
    },
    {
      id: 8,
      txt: "Papunta na kayo?",
    },
    {
      id: 9,
      txt: "Kuyaaaaa",
    },
    {
      id: 10,
      txt: "Thank you!",
    },
    {
      id: 11,
      txt: "Hello",
    },
    {
      id: 12,
      txt: "Palabas na po",
    },
    {
      id: 13,
      txt: "Pa-open tracker nyo",
    },
    {
      id: 14,
      txt: "Pa-accept po",
    },
  ];

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
          className="text-blue-500 font-normal underline"
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

const AudioCall = ({ close }) => {
  const [holdAudio, setHold] = useState(false);

  const CallHold = () => {
    if (holdAudio) {
      setHold(false);
    } else {
      setHold(true);
    }
  };

  return (
    <View className="w-full h-full bg-white absolute inset-0 z-50">
      <StatusBar style="dark" />
      <View className="h-full justify-center items-center px-6 py-10">
        <View className="rounded-2xl bg-blue-100 h-[600px] w-full relative overflow-hidden">
          <View className="flex-row items-center  justify-center absolute top-0 bottom-0 mx-auto left-0 right-0 w-full py-4 px-12">
            {holdAudio ? (
              <View>
                <View className="my-4 flex-row justify-center items-center">
                  <Svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <Path
                      d="M6.5 0C5.57174 0 4.6815 0.368749 4.02513 1.02513C3.36875 1.6815 3 2.57174 3 3.5V20.5C3 21.4283 3.36875 22.3185 4.02513 22.9749C4.6815 23.6313 5.57174 24 6.5 24C7.42826 24 8.3185 23.6313 8.97487 22.9749C9.63125 22.3185 10 21.4283 10 20.5V3.5C10 2.57174 9.63125 1.6815 8.97487 1.02513C8.3185 0.368749 7.42826 0 6.5 0ZM8 20.5C8 20.8978 7.84196 21.2794 7.56066 21.5607C7.27936 21.842 6.89782 22 6.5 22C6.10218 22 5.72064 21.842 5.43934 21.5607C5.15804 21.2794 5 20.8978 5 20.5V3.5C5 3.10218 5.15804 2.72064 5.43934 2.43934C5.72064 2.15804 6.10218 2 6.5 2C6.89782 2 7.27936 2.15804 7.56066 2.43934C7.84196 2.72064 8 3.10218 8 3.5V20.5Z"
                      fill="#374957"
                    />
                    <Path
                      d="M17.5002 0C16.5719 0 15.6817 0.368749 15.0253 1.02513C14.3689 1.6815 14.0002 2.57174 14.0002 3.5V20.5C14.0002 21.4283 14.3689 22.3185 15.0253 22.9749C15.6817 23.6313 16.5719 24 17.5002 24C18.4284 24 19.3186 23.6313 19.975 22.9749C20.6314 22.3185 21.0002 21.4283 21.0002 20.5V3.5C21.0002 2.57174 20.6314 1.6815 19.975 1.02513C19.3186 0.368749 18.4284 0 17.5002 0ZM19.0002 20.5C19.0002 20.8978 18.8421 21.2794 18.5608 21.5607C18.2795 21.842 17.898 22 17.5002 22C17.1023 22 16.7208 21.842 16.4395 21.5607C16.1582 21.2794 16.0002 20.8978 16.0002 20.5V3.5C16.0002 3.10218 16.1582 2.72064 16.4395 2.43934C16.7208 2.15804 17.1023 2 17.5002 2C17.898 2 18.2795 2.15804 18.5608 2.43934C18.8421 2.72064 19.0002 3.10218 19.0002 3.5V20.5Z"
                      fill="#374957"
                    />
                  </Svg>
                </View>
                <Text className="text-xl py-2 font-medium text-center">
                  Audio call is on hold
                </Text>
                <View className="flex-row justify-center items-center gap-x-2">
                  <Text className="text-sm text-gray-600">
                    Tap the "Resume" or click
                  </Text>
                  <TaraLogo size={20} />
                  <Text className="text-sm text-gray-600">to continue</Text>
                </View>
              </View>
            ) : (
              <Text className="text-center font-medium text-2xl">
                Calling ..
              </Text>
            )}
          </View>

          {!holdAudio && (
            <View className="absolute -bottom-[108px] rotate-180 transform">
              <LottieView
                source={require("../assets/animation/gradient.json")}
                autoPlay
                loop
                width={400}
                height={400}
              />
            </View>
          )}
        </View>

        <View className="mt-6 flex-row justify-center items-center gap-x-6">
          <View>
            <TouchableOpacity
              onPress={() => CallHold()}
              className="bg-slate-200 h-20 w-20 rounded-full flex-row justify-center items-center"
            >
              {holdAudio ? (
                <TaraLogo size={35} />
              ) : (
                <Svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <Path
                    d="M6.5 0C5.57174 0 4.6815 0.368749 4.02513 1.02513C3.36875 1.6815 3 2.57174 3 3.5V20.5C3 21.4283 3.36875 22.3185 4.02513 22.9749C4.6815 23.6313 5.57174 24 6.5 24C7.42826 24 8.3185 23.6313 8.97487 22.9749C9.63125 22.3185 10 21.4283 10 20.5V3.5C10 2.57174 9.63125 1.6815 8.97487 1.02513C8.3185 0.368749 7.42826 0 6.5 0ZM8 20.5C8 20.8978 7.84196 21.2794 7.56066 21.5607C7.27936 21.842 6.89782 22 6.5 22C6.10218 22 5.72064 21.842 5.43934 21.5607C5.15804 21.2794 5 20.8978 5 20.5V3.5C5 3.10218 5.15804 2.72064 5.43934 2.43934C5.72064 2.15804 6.10218 2 6.5 2C6.89782 2 7.27936 2.15804 7.56066 2.43934C7.84196 2.72064 8 3.10218 8 3.5V20.5Z"
                    fill="#374957"
                  />
                  <Path
                    d="M17.5002 0C16.5719 0 15.6817 0.368749 15.0253 1.02513C14.3689 1.6815 14.0002 2.57174 14.0002 3.5V20.5C14.0002 21.4283 14.3689 22.3185 15.0253 22.9749C15.6817 23.6313 16.5719 24 17.5002 24C18.4284 24 19.3186 23.6313 19.975 22.9749C20.6314 22.3185 21.0002 21.4283 21.0002 20.5V3.5C21.0002 2.57174 20.6314 1.6815 19.975 1.02513C19.3186 0.368749 18.4284 0 17.5002 0ZM19.0002 20.5C19.0002 20.8978 18.8421 21.2794 18.5608 21.5607C18.2795 21.842 17.898 22 17.5002 22C17.1023 22 16.7208 21.842 16.4395 21.5607C16.1582 21.2794 16.0002 20.8978 16.0002 20.5V3.5C16.0002 3.10218 16.1582 2.72064 16.4395 2.43934C16.7208 2.15804 17.1023 2 17.5002 2C17.898 2 18.2795 2.15804 18.5608 2.43934C18.8421 2.72064 19.0002 3.10218 19.0002 3.5V20.5Z"
                    fill="#374957"
                  />
                </Svg>
              )}
            </TouchableOpacity>
            {holdAudio ? (
              <Text className="text-center py-1.5">Resume</Text>
            ) : (
              <Text className="text-center py-1.5">Hold</Text>
            )}
          </View>

          <View>
            <TouchableOpacity
              onPress={() => close(false)}
              className="bg-red-500 h-20 w-20 rounded-full flex-row justify-center items-center"
            >
              <Svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <Path
                  d="M22.9999 16.6528L20.6599 14.8528C20.0824 14.3031 19.3154 13.9971 18.5182 13.9982C17.7209 13.9993 16.9548 14.3075 16.3789 14.8588L14.9099 16.0268C13.3541 15.3828 11.9408 14.4377 10.7514 13.2459C9.56195 12.054 8.61973 10.6389 7.97889 9.0818L9.13689 7.6258C9.6886 7.04997 9.99718 6.28368 9.99849 5.4862C9.99979 4.68873 9.69372 3.92143 9.14389 3.3438L7.34589 0.999801C7.31948 0.964591 7.29075 0.931183 7.25989 0.899801C6.68881 0.325986 5.91482 -1.57347e-06 5.10529 -0.00767395C4.29576 -0.0153463 3.51574 0.295913 2.93389 0.858801L1.78389 1.8588C-5.93511 10.0688 13.9839 30.0038 22.1839 22.1588L23.0939 21.1098C23.6734 20.5287 23.9988 19.7415 23.9988 18.9208C23.9988 18.1001 23.6734 17.3129 23.0939 16.7318C23.064 16.7038 23.0326 16.6774 22.9999 16.6528ZM21.6359 19.7528L20.7249 20.8028C14.7879 26.4178 -2.50011 10.1138 3.14689 3.3248L4.29689 2.3248C4.49603 2.12676 4.76338 2.0124 5.04413 2.00515C5.32489 1.9979 5.59779 2.09831 5.80689 2.2858L7.59289 4.6088C7.61907 4.64419 7.64781 4.67762 7.67889 4.7088C7.88315 4.91481 7.99777 5.19318 7.99777 5.4833C7.99777 5.77342 7.88315 6.05179 7.67889 6.2578C7.65075 6.28334 7.62435 6.31073 7.59989 6.3398L6.04389 8.2998C5.9331 8.4386 5.86127 8.60439 5.83579 8.78014C5.81031 8.95589 5.83208 9.13526 5.89889 9.2998C6.65203 11.3149 7.82956 13.1445 9.35166 14.6647C10.8738 16.1849 12.7049 17.3602 14.7209 18.1108C14.8832 18.1727 15.0589 18.1912 15.2305 18.1646C15.4022 18.1379 15.564 18.067 15.6999 17.9588L17.6599 16.3998C17.6893 16.3761 17.7174 16.3507 17.7439 16.3238C17.8552 16.2164 17.9874 16.133 18.1323 16.0788C18.2771 16.0247 18.4316 16.0009 18.5861 16.009C18.7405 16.017 18.8917 16.0568 19.0301 16.1257C19.1686 16.1947 19.2914 16.2914 19.3909 16.4098L21.7169 18.1968C21.9076 18.4166 22.0053 18.7019 21.9895 18.9925C21.9736 19.2831 21.8454 19.5561 21.6319 19.7538L21.6359 19.7528ZM23.7069 6.2928C23.889 6.4814 23.9898 6.734 23.9876 6.9962C23.9853 7.2584 23.8801 7.50921 23.6947 7.69462C23.5093 7.88003 23.2585 7.9852 22.9963 7.98747C22.7341 7.98975 22.4815 7.88896 22.2929 7.7068L19.9999 5.4138L17.7069 7.7068C17.5183 7.88896 17.2657 7.98975 17.0035 7.98747C16.7413 7.9852 16.4905 7.88003 16.3051 7.69462C16.1197 7.50921 16.0145 7.2584 16.0122 6.9962C16.0099 6.734 16.1107 6.4814 16.2929 6.2928L18.5859 3.9998L16.2929 1.7068C16.1107 1.5182 16.0099 1.2656 16.0122 1.0034C16.0145 0.741203 16.1197 0.49039 16.3051 0.304982C16.4905 0.119574 16.7413 0.0144052 17.0035 0.0121268C17.2657 0.00984839 17.5183 0.110643 17.7069 0.292801L19.9999 2.5858L22.2929 0.292801C22.4815 0.110643 22.7341 0.00984839 22.9963 0.0121268C23.2585 0.0144052 23.5093 0.119574 23.6947 0.304982C23.8801 0.49039 23.9853 0.741203 23.9876 1.0034C23.9898 1.2656 23.889 1.5182 23.7069 1.7068L21.4139 3.9998L23.7069 6.2928Z"
                  fill="#fff"
                />
              </Svg>
            </TouchableOpacity>
            <Text className="text-center py-1.5">End</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default InboxScreen;
