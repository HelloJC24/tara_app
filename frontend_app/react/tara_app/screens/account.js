import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  BackHandler,
  Image,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Circle, Path, Rect } from "react-native-svg";
import AppLogo from "../assets/splash-icon.png";
import Button from "../components/Button";
import ParagraphText from "../components/ParagraphText";

const AccountScreen = ({ navigation }) => {
  const [activeEditUsername, setActiveEditUsername] = useState(false);
  const [activeAddMobileNum, setActiveMobileNum] = useState(false);
  const [activeAddEmailAddress, setActiveAddEmailAddress] = useState(false);
  const [activeAccountDeletionModal, setActiveAccountDeletionModal] =
    useState(false);

  return (
    <View className="w-full h-full bg-white relative">
      <StatusBar style="dark" />
      <View className="h-full px-6 py-10">
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
          <View className="">
            <Svg
              xmlns="http://www.w3.org/2000/svg"
              width={20}
              height={20}
              viewBox="0 0 24 24"
              fill="#374957"
            >
              <Path d="M15 3.849a1.02 1.02 0 0 0 .629.926A9 9 0 0 1 21 13.292 9 9 0 0 1 3 13a9 9 0 0 1 5.371-8.224A1.023 1.023 0 0 0 9 3.848a1 1 0 0 0-1.374-.929 11 11 0 1 0 8.751 0 1 1 0 0 0-1.377.93Z" />
              <Rect width={2} height={8} x={11} rx={1} />
            </Svg>
          </View>
        </View>

        <View className="w-full h-full  z-50">
          <View className="w-full flex items-center p-4">
            <Image source={AppLogo} className="w-16 h-16" />
          </View>

          <View>
            <Text className="text-xl font-semibold py-2">
              Personal Information
            </Text>

            <View className="w-full  border-b border-slate-200 pb-4">
              <View className="flex flex-row justify-between items-center">
                <View className="flex-1">
                  <Text className="text-sm text-neutral-700">Legal Name</Text>
                  <Text className="text-lg py-1">John Doe</Text>
                </View>
                <TouchableOpacity onPress={() => setActiveEditUsername(true)}>
                  <Svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={20}
                    height={20}
                    viewBox="0 0 24 24"
                    fill="#3b82f6"
                  >
                    <Path d="M1.172 19.119A4 4 0 0 0 0 21.947V24h2.053a4 4 0 0 0 2.828-1.172L18.224 9.485l-3.709-3.709ZM23.145.855a2.622 2.622 0 0 0-3.71 0l-3.506 3.507 3.709 3.709 3.507-3.506a2.622 2.622 0 0 0 0-3.71Z" />
                  </Svg>
                </TouchableOpacity>
              </View>
            </View>

            <View className="py-1">
              <Text className="text-xl font-semibold py-2">
                Contact Details
              </Text>
              <ParagraphText fontSize="sm" textColor="text-neutral-700">
                Providing contact information will help you recover your account
                in the future logins and straight receipt to your mail.
              </ParagraphText>
            </View>

            <View className="w-full  border-b border-slate-200 pb-4">
              <View className="flex flex-row justify-between items-center">
                <View className="flex-1">
                  <Text className="text-sm text-neutral-700">
                    Mobile Number
                  </Text>
                  <Text className="text-lg py-1">+639275042174</Text>
                </View>
                <TouchableOpacity onPress={() => setActiveMobileNum(true)}>
                  <Svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={20}
                    height={20}
                    viewBox="0 0 24 24"
                    fill="#3b82f6"
                  >
                    <Path d="M1.172 19.119A4 4 0 0 0 0 21.947V24h2.053a4 4 0 0 0 2.828-1.172L18.224 9.485l-3.709-3.709ZM23.145.855a2.622 2.622 0 0 0-3.71 0l-3.506 3.507 3.709 3.709 3.507-3.506a2.622 2.622 0 0 0 0-3.71Z" />
                  </Svg>
                </TouchableOpacity>
              </View>

              <View className="flex flex-row justify-between items-center">
                <View className="flex-1">
                  <Text className="text-sm text-neutral-700">
                    Email Address
                  </Text>
                  {/* <Text className="text-lg py-1">example@gmail.com</Text> */}

                  <Text className="text-lg py-1 text-blue-500 font-semibold">
                    Add an e-mail address
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => setActiveAddEmailAddress(true)}
                >
                  <Svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={20}
                    height={20}
                    viewBox="0 0 24 24"
                    fill="#3b82f6"
                  >
                    <Path d="M1.172 19.119A4 4 0 0 0 0 21.947V24h2.053a4 4 0 0 0 2.828-1.172L18.224 9.485l-3.709-3.709ZM23.145.855a2.622 2.622 0 0 0-3.71 0l-3.506 3.507 3.709 3.709 3.507-3.506a2.622 2.622 0 0 0 0-3.71Z" />
                  </Svg>
                </TouchableOpacity>
              </View>
            </View>

            <View>
              <View className="flex flex-row gap-x-2 items-center">
                <Svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={20}
                  height={20}
                  viewBox="0 0 24 24"
                  fill="#334155"
                >
                  <Circle cx={2} cy={12} r={2} />
                  <Circle cx={12} cy={12} r={2} />
                  <Circle cx={22} cy={12} r={2} />
                </Svg>
                <Text className="text-xl font-semibold py-2">
                  More Settings
                </Text>
              </View>

              <View className="w-full border-b border-slate-200 py-2">
                <Text
                  onPress={() => setActiveAccountDeletionModal(true)}
                  className="text-lg py-1 text-blue-500 font-semibold"
                >
                  Request for Account Deletion
                </Text>
              </View>
              <View className="w-full border-b border-slate-200 py-2">
                <Text className="text-lg py-1 text-blue-500 font-semibold">
                  Check Update
                </Text>
              </View>
              <View className="w-full flex flex-row justify-between items-center border-b border-slate-200 py-2">
                <Text className="flex-1 text-lg py-1 text-blue-500 font-semibold">
                  Tara Safe
                </Text>

                <Svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={20}
                  height={20}
                  viewBox="0 0 24 24"
                  fill="#22c55e"
                >
                  <Path d="M18.581 2.14 12.316.051a1 1 0 0 0-.632 0L5.419 2.14A4.993 4.993 0 0 0 2 6.883V12c0 7.563 9.2 11.74 9.594 11.914a1 1 0 0 0 .812 0C12.8 23.74 22 19.563 22 12V6.883a4.993 4.993 0 0 0-3.419-4.743Zm-1.863 7.577-4.272 4.272a1.873 1.873 0 0 1-1.335.553h-.033a1.872 1.872 0 0 1-1.345-.6l-2.306-2.4a1 1 0 1 1 1.441-1.382l2.244 2.34L15.3 8.3a1 1 0 0 1 1.414 1.414Z" />
                </Svg>
              </View>
            </View>
          </View>
        </View>
      </View>
      <View className="w-full absolute left-0 bottom-0 p-8">
        <ParagraphText
          fontSize="base"
          align="center"
          textColor="text-neutral-500"
        >
          <Text className="text-blue-500 font-semibold">Privay Policy</Text> &{" "}
          <Text className="text-blue-500 font-semibold">Terms of Use</Text>
        </ParagraphText>
        <Text className="text-center text-sm text-neutral-500">
          v.1.0.1 Beta
        </Text>
      </View>

      {activeEditUsername && (
        <EditUsernameScreen close={() => setActiveEditUsername(false)} />
      )}
      {activeAddMobileNum && (
        <AddMobileNumber close={() => setActiveMobileNum(false)} />
      )}
      {activeAddEmailAddress && (
        <AddEmailAddress close={() => setActiveAddEmailAddress(false)} />
      )}

      {activeAccountDeletionModal && (
        <AccountDeletionModal
          close={() => setActiveAccountDeletionModal(false)}
        />
      )}
    </View>
  );
};

const AccountDeletionModal = ({ close }) => {
  return (
    <View className="w-full h-full p-4 absolute bottom-0 bg-black/30 z-[100] ">
      <View
        className="w-full px-6 py-8 absolute bottom-10 left-4 rounded-3xl shadow-xl shadow-black  bg-white
      flex gap-y-6"
      >
        <Text className="text-center text-2xl font-bold">How it works?</Text>

        <View className="w-full flex justify-center items-center p-4">
          <Image
            source={{
              uri: "https://pnghq.com/wp-content/uploads/2023/02/minecraft-steve-skin-render-png-3129.png",
            }}
            className="w-48 h-60"
          />
        </View>

        <ParagraphText
          align="center"
          fontSize="sm"
          textColor="text-neutral-700"
          padding="px-2"
        >
          If you would like to request the deletion of all your personal data
          from our system, please fill out the form, and we will inform you of
          the status via email.
        </ParagraphText>

        <View className="w-full flex gap-y-4">
          <Button>Fill out the form</Button>
          <Button
            onPress={close}
            bgColor="bg-slate-200"
            textColor="text-neutral-700"
          >
            Close
          </Button>
        </View>
      </View>
    </View>
  );
};

const EditUsernameScreen = ({ close }) => {
  const [username, setUsername] = useState("John Doe");

  const handleBackPress = () => {
    close();
    return true;
  };
  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", handleBackPress);
    return () => {
      BackHandler.removeEventListener("hardwareBackPress", handleBackPress);
    };
  }, [close]);

  return (
    <View className="w-full h-full bg-white absolute inset-0 z-50">
      <StatusBar style="dark" />
      <View className="h-full  flex justify-between items-center px-6 py-10">
        <View className="w-full flex flex-row gap-x-3 items-center justify-between py-2">
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

const AddMobileNumber = ({ close }) => {
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleBackPress = () => {
    close();
    return true;
  };
  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", handleBackPress);
    return () => {
      BackHandler.removeEventListener("hardwareBackPress", handleBackPress);
    };
  }, [close]);
  return (
    <View className="w-full h-full bg-white absolute inset-0 z-50">
      <StatusBar style="dark" />
      <View className="h-full  flex justify-between items-center px-6 py-10">
        <View className="w-full flex flex-row gap-x-3 items-center justify-between py-2">
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
              type="number"
              keyboardType="number-pad"
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

const AddEmailAddress = ({ close }) => {
  const [email, setEmail] = useState("example@gmail.com");
  const handleBackPress = () => {
    close();
    return true;
  };
  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", handleBackPress);
    return () => {
      BackHandler.removeEventListener("hardwareBackPress", handleBackPress);
    };
  }, [close]);
  return (
    <View className="w-full h-full bg-white absolute inset-0 z-50">
      <StatusBar style="dark" />
      <View className="h-full  flex justify-between items-center px-6 py-10">
        <View className="w-full flex flex-row gap-x-3 items-center justify-between py-2">
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

export default AccountScreen;
