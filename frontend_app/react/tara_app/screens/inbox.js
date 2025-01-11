import BottomSheet from "@devvie/bottom-sheet";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef, useState } from "react";
import LottieView from 'lottie-react-native';
import {
  FlatList,
  Image,
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
import ParagraphText from "../components/ParagraphText";

const InboxScreen = ({ navigation }) => {
  const [selectedChat, selectChat] = useState({ chatId: null, active: false });

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

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ gap: 10 }}
          className=""
        >
          <ChatList
            status="active"
            onPress={() => selectChat({ chatId: 1, active: true })}
          />
          <ChatList status="expired" />
        </ScrollView>

        {/* <FlatList
          renderItem={({ item, index }) => <ChatList key={index} />}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 15 }}
        /> */}
      </View>

      {selectedChat.active && (
        <Chat
          chatId={selectedChat.chatId}
          close={() => selectChat({ active: false })}
        />
      )}
    </View>
  );
};

const ChatList = ({ status, onPress }) => {
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
          <Text className="text-base font-bold">Lebron James</Text>
          <Text className="text-sm text-neutral-500">
            Lorem Ipsum is simply...
          </Text>
        </View>
      </View>

      <View className="flex gap-y-1 items-end">
        <Text className="text-sm text-neutral-500">Thu</Text>
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

const Chat = ({ chatId, close }) => {
  const scrollViewRef = useRef(null);
  const [msg, setMsg] = useState("");
  const [activeAutoReport, setActiveAutoReport] = useState(false);
  const [chats, setChat] = useState([
    {
      id: 1,
      msg: "hello world",
      senderId: "4143234",
      receiverId: "241413",
      datetime: 6519649314931,
    },
    {
      id: 2,
      msg: "Hello sir",
      senderId: "241413",
      receiverId: "4143234",
      datetime: 6519649314931,
    },
  ]);

  const expiredSession = false;
  const userId = "4143234";
  const receiverID = "???" ; // para itong dalawa lng ipapasa completo ang sender and receiver, mostly ang receiver ay kung sino ang rider na nakalagay sa inbox

  return (
    <View className="w-full h-full bg-white absolute inset-0 z-50">
      <StatusBar style="dark" />
      <View className="h-full  relative">
        <View className="w-full flex flex-row items-center justify-between  px-6 pt-12 pb-4">
          <Pressable onPress={close}>
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
          <Pressable onPress={() => setActiveAutoReport(true)}>
            <LottieView
              source={require('../assets/animation/eye-watch.json')}
              autoPlay
              loop
              width={40}
              height={40}
          />
          </Pressable>
        </View>

        <View className="flex-1">
          <ScrollView
            ref={scrollViewRef}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() => {
              scrollViewRef.current.scrollToEnd({ animated: true });
            }}
            className="px-8"
          >
            <View className="w-full">
              <View className="w-full flex items-center gap-y-2">
                <Image
                  source={Profile}
                  className="w-20 h-20 bg-neutral-500 rounded-xl object-cover"
                />

                <Text className="text-2xl text-center font-bold">
                  Lebron James
                </Text>

                <ParagraphText
                  fontSize="sm"
                  align="center"
                  textColor="text-neutral-700"
                >
                  This chat session is active for 24 hours with the driver in
                  case you left some items, you can still chat them. After that
                  it will close the session.
                </ParagraphText>
              </View>

              <View className="w-full py-8  flex justify-end">
                {/* messages */}
                {chats?.map(({ id, msg, senderId, receiverId, datetime }) => {
                  return (
                    <View key={id}>
                      {userId === senderId ? (
                        <View className="w-full flex items-end">
                          <View className="max-w-['60%']  bg-slate-100 px-4 py-3 rounded-xl">
                            <Text className="text-black text-sm">{msg}</Text>
                          </View>
                          <View className="flex flex-row">
                            <Text className="p-1 text-slate-400 text-xs">
                              2:34pm
                            </Text>
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
                                <Circle cx={256.095} cy={256.095} r={85.333} />
                                <Path d="M496.543 201.034C463.455 147.146 388.191 56.735 256.095 56.735S48.735 147.146 15.647 201.034c-20.862 33.743-20.862 76.379 0 110.123 33.088 53.888 108.352 144.299 240.448 144.299s207.36-90.411 240.448-144.299c20.862-33.744 20.862-76.38 0-110.123zM256.095 384.095c-70.692 0-128-57.308-128-128s57.308-128 128-128 128 57.308 128 128c-.071 70.663-57.337 127.929-128 128z" />
                              </Svg>

                              <Text className="p-1 text-slate-400 text-xs">
                                Seen
                              </Text>
                            </View>
                          </View>
                        </View>
                      ) : (
                        <View className="w-full flex items-start">
                          <View className="max-w-['60%'] border border-slate-300 px-4 py-3 rounded-xl">
                            <Text className="text-black text-sm">{msg}</Text>
                            <Text className="text-blue-600 underline text-xs">
                              See translation
                            </Text>
                          </View>
                          <Text className="p-1 text-neutral-500 text-xs">
                            2:34pm
                          </Text>
                        </View>
                      )}
                    </View>
                  );
                })}
              </View>
            </View>
            <View>
            <LottieView
              source={require('../assets/animation/typing.json')}
              autoPlay
              loop
              width={60}
              height={60}
          />
            </View>
          </ScrollView>

          {expiredSession ? (
            <ChatSessionExpired />
          ) : (
            <View className="w-full px-6 pb-8 bg-white">
              <SuggestedChats />
              <View className="w-full border border-slate-400 p-2 rounded-2xl flex flex-row gap-x-2 items-center justify-between">
                <TextInput
                  className="flex-1 "
                  multiline={true}
                  value={msg}
                  onChangeText={setMsg}
                  placeholder="Type your message"
                />
                <Pressable className="p-2 bg-blue-50 rounded-xl">
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
        To learn more check out our <Text className="text-blue-500 font-normal underline">Help Centre</Text> or chat us.
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
              source={require('../assets/animation/eye-watch.json')}
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
          Tara AI is monitoring your chat conversation to protect you from any
          rude messages and will automatically report the rider/driver, so it will save time for you to reach us.
        </ParagraphText>

        <View className="w-full flex gap-y-4">
          <Button
            onPress={() => sheetRef.current?.close()}
            bgColor="bg-slate-200"
            textColor="text-neutral-700"
          >
            Close
          </Button>
          <Button bgColor="bg-slate-200" textColor="text-blue-500">
            Learn More
          </Button>
        </View>
      </View>
    </BottomSheet>
  );
};

export default InboxScreen;
