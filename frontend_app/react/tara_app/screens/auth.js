import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import React, { useContext, useEffect, useState } from "react";
import {
  BackHandler,
  Image,
  Linking,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import Svg, { Path, Rect } from "react-native-svg";
import { WebView } from "react-native-webview";
import TaraLogoImage from "../assets/tara_icon.png";
import Button from "../components/Button";
import { IDGraphic, WelcomeGraphic } from "../components/CustomGraphic";
import { TaraLogo } from "../components/CustomIcon";
import IDScanner from "../components/IDScanner";
import ParagraphText from "../components/ParagraphText";
import QuickTipsBottomSheet from "../components/QuickTipsBottomSheet";
import ReportProblemScreen from "../components/ReportContainer";
import { useToast } from "../components/ToastNotify";
import { createAccount } from "../config/hooks";
import { AuthContext } from "../context/authContext";

const AuthScreen = () => {
  const [stage, setStage] = useState(0);
  const navigation = useNavigation();

  const seeHelp = () => {
    setStage(3);
    return true;
  };

  const handleBackPress = () => {
    if (stage === 2) {
      setStage(0);
      return true;
    }

    if (stage > 0) {
      setStage(stage - 1);
      return true;
    }
  };
  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", handleBackPress);
    return () => {
      BackHandler.removeEventListener("hardwareBackPress", handleBackPress);
    };
  }, [stage]);

  const renderScreen = () => {
    switch (stage) {
      case 1:
        return <SignUpScreen help={seeHelp} back={() => setStage(0)} />;
      case 2:
        return <CreateAccountScreen help={seeHelp} back={() => setStage(0)} />;
      case 3:
        return (
          <ReportProblemScreen
            navigation={navigation}
            close={(n) => setStage(n)}
          />
        );
      default:
        return <MainAuthScreen help={seeHelp} setStage={(n) => setStage(n)} />;
    }
  };

  return renderScreen();
};

const MainAuthScreen = ({ help, setStage }) => {
  const toast = useToast();

  const showToast = () => {
    toast("success", "This is a success toast message.");
  };

  return (
    <View className="w-full h-full bg-white relative">
      <StatusBar style="dark" />

      <View className="h-full flex justify-between items-center px-6 py-10">
        <View className="w-full flex flex-row gap-x-3 items-center justify-end py-4">
          <Pressable
            onPress={() => Linking.openURL("https://taranapo.com")}
            className="p-1 bg-slate-200 rounded-lg"
          >
            <Svg
              xmlns="http://www.w3.org/2000/svg"
              width={20}
              height={20}
              viewBox="0 0 24 24"
              fill="#374957"
            >
              <Path d="M12 0a12 12 0 1 0 12 12A12.013 12.013 0 0 0 12 0Zm10 12a9.938 9.938 0 0 1-1.662 5.508l-1.192-1.193a.5.5 0 0 1-.146-.353V15a3 3 0 0 0-3-3h-3a1 1 0 0 1-1-1v-.5a.5.5 0 0 1 .5-.5A2.5 2.5 0 0 0 15 7.5v-1a.5.5 0 0 1 .5-.5h1.379a2.516 2.516 0 0 0 1.767-.732l.377-.377A9.969 9.969 0 0 1 22 12Zm-19.951.963 3.158 3.158A2.978 2.978 0 0 0 7.329 17H10a1 1 0 0 1 1 1v3.949a10.016 10.016 0 0 1-8.951-8.986ZM13 21.949V18a3 3 0 0 0-3-3H7.329a1 1 0 0 1-.708-.293l-4.458-4.458A9.978 9.978 0 0 1 17.456 3.63l-.224.224a.507.507 0 0 1-.353.146H15.5A2.5 2.5 0 0 0 13 6.5v1a.5.5 0 0 1-.5.5 2.5 2.5 0 0 0-2.5 2.5v.5a3 3 0 0 0 3 3h3a1 1 0 0 1 1 1v.962a2.516 2.516 0 0 0 .732 1.767l1.337 1.337A9.971 9.971 0 0 1 13 21.949Z" />
            </Svg>
          </Pressable>
          <Pressable
            onPress={() => help()}
            className="p-1 bg-slate-200 rounded-lg"
          >
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
          </Pressable>
        </View>

        <View className="mt-10 flex items-center">
          <Image source={TaraLogoImage} className="w-36 h-8" />
          <ParagraphText fontSize="lg" padding="p-4" align="center">
            How would you like to continue?
          </ParagraphText>
        </View>
        <View>
          <WelcomeGraphic size={320} />
        </View>

        <View className="w-full flex gap-y-4 p-2 pb-4">
          <Button onPress={() => setStage(1)}>Login</Button>
          <Button
            onPress={() => setStage(2)}
            bgColor="bg-blue-100"
            textColor="text-blue-600"
          >
            Create new account
          </Button>
          <Button
            onPress={showToast}
            bgColor="bg-yellow-100"
            textColor="text-amber-600"
          >
            Continue as Guest
          </Button>
        </View>
      </View>
    </View>
  );
};

const CreateAccountScreen = ({ help, ...props }) => {
  const [activeBottomSheet, setActiveBottomSheet] = useState(false);
  const [activeScanner, setActiveScanner] = useState(false);
  const [stage, setStage] = useState(0);
  const [scannedUsername, setScannedUsername] = useState("");

  const handleBackPress = () => {
    if (stage > 0) {
      setStage(stage - 1);
      return true;
    }
  };
  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", handleBackPress);
    return () => {
      BackHandler.removeEventListener("hardwareBackPress", handleBackPress);
    };
  }, [stage]);

  switch (stage) {
    case 1:
      return (
        <SetUsernameScreen
          sethelp={help}
          scannedUsername={scannedUsername}
          setScannedUsername={(value) => setScannedUsername(value)}
          back={() => setStage(0)}
          nextPage={() => setStage(2)}
        />
      );
    case 2:
      return (
        <TermsAndConditionScreen
          scannedUsername={scannedUsername}
          back={() => setStage(1)}
        />
      );
    default:
      return (
        <View className="w-full h-full bg-white relative">
          <StatusBar style="dark" />
          <View className="h-full flex justify-between items-center px-6 py-10">
            <View className="w-full flex flex-row gap-x-3 items-center justify-between py-2">
              <Pressable onPress={props.back}>
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
              <Pressable
                onPress={() => help()}
                className="p-1 bg-slate-200 rounded-lg"
              >
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
              </Pressable>
            </View>

            <View className="mt-10 flex items-center">
              <Image source={TaraLogoImage} className="w-32 h-8" />
              <ParagraphText fontSize="lg" padding="p-2" align="center">
                Secure your Tara experience! Register with a{" "}
                <Text className="text-blue-600 font-semibold">valid ID</Text> to
                unlock safe and reliable rides tailored just for you.
              </ParagraphText>
            </View>
            <View>
              <IDGraphic size={280} />
            </View>

            <View className="w-full flex gap-y-4 p-2">
              <Button hasIcon={true} onPress={() => setActiveBottomSheet(true)}>
                <Svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={20}
                  height={20}
                  viewBox="0 0 24 24"
                  fill="#fff"
                >
                  <Path d="M18.581 2.14 12.316.051a1 1 0 0 0-.632 0L5.419 2.14A4.993 4.993 0 0 0 2 6.883V12c0 7.563 9.2 11.74 9.594 11.914a1 1 0 0 0 .812 0C12.8 23.74 22 19.563 22 12V6.883a4.993 4.993 0 0 0-3.419-4.743Zm-1.863 7.577-4.272 4.272a1.873 1.873 0 0 1-1.335.553h-.033a1.872 1.872 0 0 1-1.345-.6l-2.306-2.4a1 1 0 1 1 1.441-1.382l2.244 2.34L15.3 8.3a1 1 0 0 1 1.414 1.414Z" />
                </Svg>

                <Text className="text-base text-white font-bold">Start</Text>
              </Button>

              <ParagraphText align="center" fontSize="sm" padding="px-4">
                Learn how we protect your personal{" "}
                <Text
                  onPress={() =>
                    Linking.openURL("https://taranapo.com/data-protection/")
                  }
                  className="text-sm text-blue-500 font-semibold"
                >
                  information here.
                </Text>
              </ParagraphText>
            </View>
          </View>
          <QuickTipsBottomSheet
            open={activeBottomSheet}
            onClose={() => setActiveBottomSheet(false)}
            activeScanner={() => setActiveScanner(true)}
          />

          {activeScanner && (
            <IDScanner
              setScannedUsername={(value) => setScannedUsername(value)}
              close={() => setActiveScanner(false)}
              nextPage={() => setStage(1)}
            />
          )}
        </View>
      );
  }
};

const SetUsernameScreen = ({ sethelp, ...props }) => {
  const [username, setUsername] = useState(props.scannedUsername);
  const [isLoading, setIsLoading] = useState(false);

  const toast = useToast();

  const onSubmit = () => {
    setIsLoading(true);
    setTimeout(() => {
      console.log("fake submmiting...");
      toast("success", "User created successfully");

      // set the new custom username
      props.setScannedUsername(username);
      setIsLoading(false);
      props.nextPage();
    }, 3000);
  };

  return (
    <View className="w-full h-full bg-white relative">
      <StatusBar style="dark" />
      <View className="h-full  flex justify-between items-center px-6 py-10">
        <View className="w-full flex flex-row gap-x-3 items-center justify-between py-2">
          <Pressable onPress={props.back}>
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
        </View>

        <View className="w-full z-50">
          <Text className="text-center text-2xl text-black p-4 font-semibold">
            Your legal name
          </Text>

          <View className="w-full border border-slate-400 p-2 rounded-2xl flex flex-row gap-x-2 items-center">
            <View className="p-2">
              <TaraLogo size={40} />
            </View>

            <TextInput
              className="flex-1 w-full text-lg text-blue-500"
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
            Name looks good! Try to correct if needed.
          </ParagraphText>
        </View>
        <View></View>
        <View></View>
        <View></View>

        <View className="w-full flex gap-y-4 p-2">
          <Button onPress={onSubmit}>
            {isLoading ? "Creating account..." : "Create Account"}
          </Button>

          <ParagraphText align="center" fontSize="sm" padding="px-4">
            Learn how we protect your personal{" "}
            <Text
              onPress={() =>
                Linking.openURL("https://taranapo.com/data-protection/")
              }
              className="text-blue-500 font-semibold"
            >
              information here.
            </Text>
          </ParagraphText>
        </View>
      </View>
    </View>
  );
};

const TermsAndConditionScreen = ({ scannedUsername, ...props }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const { setUser } = useContext(AuthContext);

  const saveDevice = async (value) => {
    try {
      await AsyncStorage.setItem("register", value);
    } catch (e) {
      // saving error
    }
  };

  const initFirstApp = async () => {
    await saveDevice("true");
  };

  const registerAccount = async () => {
    try {
      setIsSubmitting(true);
      console.log(scannedUsername);
      const res = await createAccount(scannedUsername);
      console.log("Create user res: ", res.data);
      if (res.status === "success") {
        setUser({ userId: res.data?.UserID });
        initFirstApp();

        setIsSubmitting(false);
      }
    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
      toast("error", "Something went wrong, try again!");
    }
  };

  return (
    <View className="w-full h-full bg-white relative">
      <StatusBar style="dark" />
      <View className="h-full  flex justify-between items-center py-10">
        <View className="px-6 w-full flex flex-row gap-x-3 items-center justify-between py-2">
          <Pressable onPress={props.back}>
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
        </View>

        {/* <View className="w-full px-6">
          <Text className=" text-2xl text-black p-4 font-semibold">
            Terms and Conditions
          </Text>
        </View> */}

        <View className="bg-white h-full w-screen pb-10">
          <WebView
            style={{ flex: 1, backgroundColor: "white" }}
            source={{
              uri: "https://taranapo.com/terms-and-conditions/",
            }}
            onLoadEnd={() => setIsLoading(true)}
            onLoadStart={() => setIsLoading(false)}
            javaScriptEnabled={true}
            cacheEnabled={false} // Disable cache
            domStorageEnabled={true}
          />
        </View>

        <View className="p-6 bg-white absolute bottom-0 w-full flex gap-y-4">
          <Button onPress={registerAccount}>
            {isSubmitting ? "Submitting..." : "I Accept and wish to proceed"}
          </Button>

          <ParagraphText align="center" fontSize="sm" padding="px-4">
            By clickng the proceed you are also agreeing to our{" "}
            <Text
              onPress={() =>
                Linking.openURL("https://taranapo.com/data-and-privacy/")
              }
              className="text-blue-500 font-semibold"
            >
              Data and Privacy Policy
            </Text>{" "}
            as well.
          </ParagraphText>
        </View>
      </View>
    </View>
  );
};

// SignUp Page

const SignUpScreen = ({ help, ...props }) => {
  const [activeOTPScreen, setActiveOTPScreen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const handleBackPress = () => {
    if (props.back && !activeOTPScreen) {
      props.back();
      return true;
    }

    if (activeOTPScreen) {
      setActiveOTPScreen(false);
      return true;
    }
  };
  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", handleBackPress);
    return () => {
      BackHandler.removeEventListener("hardwareBackPress", handleBackPress);
    };
  }, [activeOTPScreen]);

  return (
    <View className="w-full h-full bg-white absolute inset-0">
      <StatusBar style="dark" />
      <View className="h-full flex justify-between items-center px-6 py-10">
        <View className="w-full flex flex-row gap-x-3 items-center justify-between py-2">
          <Pressable onPress={props.back}>
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
          <Pressable
            onPress={() => help()}
            className="p-1 bg-slate-200 rounded-lg"
          >
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
          </Pressable>
        </View>

        <View className="w-full">
          <Text className="text-center text-2xl text-black p-4 font-semibold">
            Welcome Back!
          </Text>

          <View className="w-full border border-slate-400 p-2 rounded-2xl flex flex-row gap-x-2 items-center">
            <View className="p-2">
              <TaraLogo size={40} />
            </View>

            <TextInput
              className="flex-1 w-full text-lg"
              value={inputValue}
              onChangeText={setInputValue}
              placeholder="Email or phone number"
            />
          </View>

          <ParagraphText
            align="center"
            fontSize="sm"
            padding="py-2 px-6"
            textColor="text-neutral-700"
          >
            Make sure you linked an email or phone number to your account.
          </ParagraphText>
        </View>
        <View></View>
        <View></View>
        <View></View>

        <View className="w-full flex gap-y-4 p-2">
          <Button onPress={() => setActiveOTPScreen(true)}>Sign in</Button>

          <ParagraphText align="center" fontSize="sm" padding="px-4">
            Learn how to recover your account{" "}
            <Text
              onPress={() =>
                Linking.openURL("https://taranapo.com/account-recovery/")
              }
              className="text-blue-500 font-semibold"
            >
              effectively here.
            </Text>
          </ParagraphText>
        </View>
      </View>

      {activeOTPScreen && (
        <OTPScreen sethelp={help} back={() => setActiveOTPScreen(false)} />
      )}
    </View>
  );
};

const OTPScreen = ({ sethelp, ...props }) => {
  const [inputValue, setInputValue] = useState("");
  const { setUser } = useContext(AuthContext);

  const saveDevice = async (value) => {
    try {
      await AsyncStorage.setItem("register", value);
    } catch (e) {
      // saving error
    }
  };

  const validateOTPCode = async () => {
    await saveDevice("true");
    setUser({ accessToken: true });
  };

  return (
    <View className="w-full h-full bg-white absolute inset-0 z-50">
      <StatusBar style="dark" />
      <View className="h-full flex justify-between items-center px-6 py-10">
        <View className="w-full flex flex-row gap-x-3 items-center justify-between py-2">
          <Pressable onPress={props.back}>
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
          <Pressable
            onPress={() => sethelp()}
            className="p-1 bg-slate-200 rounded-lg"
          >
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
          </Pressable>
        </View>

        <View className="w-full z-50">
          <Text className="text-center text-2xl text-black p-4 font-semibold">
            One Time Password
          </Text>

          <View className="w-full border border-slate-400 p-2 rounded-2xl flex flex-row gap-x-2 items-center">
            <View className="p-2">
              <TaraLogo size={40} />
            </View>

            <TextInput
              className={`w-full text-2xl ${inputValue ? "font-bold" : ""}`}
              type="number"
              keyboardType="number-pad"
              maxLength={6}
              value={inputValue}
              onChangeText={setInputValue}
              placeholder="e.g 08269"
            />
          </View>

          <ParagraphText
            align="center"
            fontSize="sm"
            padding="py-2 px-6"
            textColor="text-neutral-700"
          >
            We sent a 6-digits code in both email and phone number. Please check
            and enter here.
          </ParagraphText>
        </View>
        <View></View>
        <View></View>
        <View></View>
        <View className="w-full flex gap-y-4 p-2">
          <Button bgColor="bg-slate-200" textColor="text-neutral-700">
            Request another in 2mins
          </Button>
          <Button onPress={() => validateOTPCode()}>Verify Code</Button>

          <ParagraphText align="center" fontSize="sm" padding="px-4">
            Learn how to recover your account{" "}
            <Text
              onPress={() =>
                Linking.openURL("https://taranapo.com/account-recovery/")
              }
              className="text-blue-500 font-semibold"
            >
              effectively here.
            </Text>
          </ParagraphText>
        </View>
      </View>
    </View>
  );
};

export default AuthScreen;
