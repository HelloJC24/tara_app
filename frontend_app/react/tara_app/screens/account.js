import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { Image, Pressable, Text, TextInput, View } from "react-native";
import Svg, { Path, Rect } from "react-native-svg";
import AppLogo from "../assets/splash-icon.png";
import Button from "../components/Button";
import ParagraphText from "../components/ParagraphText";

const AccountScreen = ({ navigation }) => {
  return (
    <View className="w-full h-full bg-white relative">
      <StatusBar style="dark" />
      <View className="h-full flex justify-between items-center px-6 py-10">
        <View className="w-full flex flex-row gap-x-3 items-center justify-between py-2">
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
          <View className="p-1 bg-slate-200 rounded-lg">
            <Svg
              xmlns="http://www.w3.org/2000/svg"
              width={20}
              height={20}
              viewBox="0 0 24 24"
              fill="#374957"
            >
              <Path d="M12 0a12 12 0 1 0 12 12A12.013 12.013 0 0 0 12 0Zm0 22a10 10 0 1 1 10-10 10.011 10.011 0 0 1-10 10Z" />
              <Path d="M12.717 5.063A4 4 0 0 0 8 9a1 1 0 0 0 2 0 2 2 0 0 1 2.371-1.967 2.024 2.024 0 0 1 1.6 1.595 2 2 0 0 1-1 2.125A3.954 3.954 0 0 0 11 14.257V15a1 1 0 0 0 2 0v-.743a1.982 1.982 0 0 1 .93-1.752 4 4 0 0 0-1.213-7.442Z" />
              <Rect width={2} height={2} x={11} y={17} rx={1} />
            </Svg>
          </View>
        </View>

        <View></View>
      </View>
    </View>
  );
};

const EditUsernameScreen = (props) => {
  const [username, setUsername] = useState("John Doe");

  return (
    <View className="w-full h-screen bg-white relative">
      <StatusBar style="dark" />
      <View className="h-full  flex justify-between items-center px-6 py-10">
        <View className="w-full flex flex-row gap-x-3 items-center justify-between py-2">
          <Pressable onPress={() => props.setStage(2)}>
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
          <View className="p-1 bg-slate-200 rounded-lg">
            <Svg
              xmlns="http://www.w3.org/2000/svg"
              width={20}
              height={20}
              viewBox="0 0 24 24"
              fill="#374957"
            >
              <Path d="M12 0a12 12 0 1 0 12 12A12.013 12.013 0 0 0 12 0Zm0 22a10 10 0 1 1 10-10 10.011 10.011 0 0 1-10 10Z" />
              <Path d="M12.717 5.063A4 4 0 0 0 8 9a1 1 0 0 0 2 0 2 2 0 0 1 2.371-1.967 2.024 2.024 0 0 1 1.6 1.595 2 2 0 0 1-1 2.125A3.954 3.954 0 0 0 11 14.257V15a1 1 0 0 0 2 0v-.743a1.982 1.982 0 0 1 .93-1.752 4 4 0 0 0-1.213-7.442Z" />
              <Rect width={2} height={2} x={11} y={17} rx={1} />
            </Svg>
          </View>
        </View>

        <View className="w-full z-50">
          <Text className="text-center text-2xl text-black p-4 font-semibold">
            Your legal name
          </Text>

          <View className="w-full border border-slate-400 p-2 rounded-2xl flex flex-row gap-x-2 items-center">
            <Image source={AppLogo} className="w-14 h-14" />

            <TextInput
              className="w-full text-lg text-blue-500"
              value={username}
              onChangeText={setUsername}
              placeholder=""
            />
          </View>

          <ParagraphText
            align="center"
            fontSize="sm"
            padding="py-2 px-6"
            textColor="text-neutral-700"
          >
            Seems familiar with the old one
          </ParagraphText>
        </View>
        <View></View>
        <View></View>
        <View></View>

        <View className="w-full flex gap-y-4 p-2">
          <Button>Update Account</Button>

          <ParagraphText align="center" fontSize="sm">
            Learn how we protect your personal{" "}
            <Text className="text-blue-500 font-semibold">
              information here.
            </Text>
          </ParagraphText>
        </View>
      </View>
    </View>
  );
};

const EditEmailScreen = (props) => {
  const [email, setEmail] = useState("example@gmail.com");

  return (
    <View className="w-full h-full bg-white absolute inset-0">
      <StatusBar style="dark" />
      <View className="h-full  flex justify-between items-center px-6 py-10">
        <View className="w-full flex flex-row gap-x-3 items-center justify-between py-2">
          <Pressable onPress={() => props.setStage(2)}>
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
          <View className="p-1 bg-slate-200 rounded-lg">
            <Svg
              xmlns="http://www.w3.org/2000/svg"
              width={20}
              height={20}
              viewBox="0 0 24 24"
              fill="#374957"
            >
              <Path d="M12 0a12 12 0 1 0 12 12A12.013 12.013 0 0 0 12 0Zm0 22a10 10 0 1 1 10-10 10.011 10.011 0 0 1-10 10Z" />
              <Path d="M12.717 5.063A4 4 0 0 0 8 9a1 1 0 0 0 2 0 2 2 0 0 1 2.371-1.967 2.024 2.024 0 0 1 1.6 1.595 2 2 0 0 1-1 2.125A3.954 3.954 0 0 0 11 14.257V15a1 1 0 0 0 2 0v-.743a1.982 1.982 0 0 1 .93-1.752 4 4 0 0 0-1.213-7.442Z" />
              <Rect width={2} height={2} x={11} y={17} rx={1} />
            </Svg>
          </View>
        </View>

        <View className="w-full z-50">
          <Text className="text-center text-2xl text-black p-4 font-semibold">
            Link Email Address
          </Text>

          <View className="w-full border border-slate-400 p-2 rounded-2xl flex flex-row gap-x-2 items-center">
            <Image source={AppLogo} className="w-14 h-14" />

            <TextInput
              className="w-full text-lg text-blue-500"
              value={email}
              onChangeText={setEmail}
              placeholder=""
            />
          </View>

          <ParagraphText
            align="center"
            fontSize="sm"
            padding="py-2 px-6"
            textColor="text-neutral-700"
          >
            Incorrect email format
          </ParagraphText>
        </View>
        <View></View>
        <View></View>
        <View></View>

        <View className="w-full flex gap-y-4 p-2">
          <Button>Update Account</Button>

          <ParagraphText align="center" fontSize="sm">
            Learn how we protect your personal{" "}
            <Text className="text-blue-500 font-semibold">
              information here.
            </Text>
          </ParagraphText>
        </View>
      </View>
    </View>
  );
};

const EditPhoneNumberScreen = (props) => {
  const [phoneNumber, setPhoneNumber] = useState("");

  return (
    <View className="w-full h-full bg-white absolute inset-0">
      <StatusBar style="dark" />
      <View className="h-full  flex justify-between items-center px-6 py-10">
        <View className="w-full flex flex-row gap-x-3 items-center justify-between py-2">
          <Pressable onPress={() => props.setStage(2)}>
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
          <View className="p-1 bg-slate-200 rounded-lg">
            <Svg
              xmlns="http://www.w3.org/2000/svg"
              width={20}
              height={20}
              viewBox="0 0 24 24"
              fill="#374957"
            >
              <Path d="M12 0a12 12 0 1 0 12 12A12.013 12.013 0 0 0 12 0Zm0 22a10 10 0 1 1 10-10 10.011 10.011 0 0 1-10 10Z" />
              <Path d="M12.717 5.063A4 4 0 0 0 8 9a1 1 0 0 0 2 0 2 2 0 0 1 2.371-1.967 2.024 2.024 0 0 1 1.6 1.595 2 2 0 0 1-1 2.125A3.954 3.954 0 0 0 11 14.257V15a1 1 0 0 0 2 0v-.743a1.982 1.982 0 0 1 .93-1.752 4 4 0 0 0-1.213-7.442Z" />
              <Rect width={2} height={2} x={11} y={17} rx={1} />
            </Svg>
          </View>
        </View>

        <View className="w-full z-50">
          <Text className="text-center text-2xl text-black p-4 font-semibold">
            Link Phone Number
          </Text>

          <View className="w-full border border-slate-400 p-2 rounded-2xl flex flex-row gap-x-2 items-center">
            <Image source={AppLogo} className="w-14 h-14" />

            <TextInput
              className="w-full text-lg text-blue-500"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              placeholder=""
            />
          </View>

          <ParagraphText
            align="center"
            fontSize="sm"
            padding="py-2 px-6"
            textColor="text-neutral-700"
          >
            Number must be 11 digits
          </ParagraphText>
        </View>
        <View></View>
        <View></View>
        <View></View>

        <View className="w-full flex gap-y-4 p-2">
          <Button>Update Account</Button>

          <ParagraphText align="center" fontSize="sm">
            Learn how we protect your personal{" "}
            <Text className="text-blue-500 font-semibold">
              information here.
            </Text>
          </ParagraphText>
        </View>
      </View>
    </View>
  );
};

export default AccountScreen;
