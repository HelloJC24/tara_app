import { StatusBar } from "expo-status-bar";
import React from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import Profile from "../assets/icon.png";
const ChatScreen = ({ navigation }) => {
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

        <ScrollView>
          <View className="py-4">
            <ChatList status="active" />
            <ChatList status="expired" />
          </View>
        </ScrollView>

        {/* <FlatList
          renderItem={({ item, index }) => <ChatList key={index} />}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 15 }}
        /> */}
      </View>
    </View>
  );
};

const ChatList = ({ status }) => {
  return (
    <View className="w-full flex flex-row gap-x-4 justify-between ">
      <View className="flex flex-row gap-x-3 justify-start ">
        <Image
          source={Profile}
          className="w-16 h-16 bg-neutral-500 rounded-xl object-cover"
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
        {status === "active" ? (
          <View className="bg-green-500 px-4 rounded-md">
            <Text className="text-white text-sm">Active</Text>
          </View>
        ) : (
          <View className="bg-slate-300 px-4 rounded-md">
            <Text className="text-white text-sm">Expired</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default ChatScreen;
