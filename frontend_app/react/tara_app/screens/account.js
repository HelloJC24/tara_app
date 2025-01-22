import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import { signOut } from "firebase/auth";
import LottieView from "lottie-react-native";
import React, { useContext, useEffect, useState } from "react";
import {
  Alert,
  BackHandler,
  Linking,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Circle, Path, Rect } from "react-native-svg";
import appJson from "../app.json";
import Button from "../components/Button";
import { DeletionGraphic, TaraSafeGraphic } from "../components/CustomGraphic";
import { TaraLogo } from "../components/CustomIcon";
import ParagraphText from "../components/ParagraphText";
import ReportProblemScreen from "../components/ReportContainer";
import { useToast } from "../components/ToastNotify";
import * as Updates from 'expo-updates';
import { auth } from "../config/firebase-config";
import { updateUser } from "../config/hooks";
import { AuthContext } from "../context/authContext";
import { DataContext } from "../context/dataContext";
const appVersion = appJson.expo.version;

const AccountScreen = ({ route, navigation }) => {
  const { setUser } = useContext(AuthContext);
  const { data } = useContext(DataContext);

  const [activeEditUsername, setActiveEditUsername] = useState(false);
  const [activeAddMobileNum, setActiveMobileNum] = useState(false);
  const [activeAddEmailAddress, setActiveAddEmailAddress] = useState(false);
  const [activeTaraSafe, setActiveTaraSafe] = useState(false);
  const [activeAccountDeletionModal, setActiveAccountDeletionModal] =
    useState(false);
  const [viewreport, setViewReport] = useState(false);
  const [phoneNumber, setPhone] = useState(data?.user?.Phone);
  const [email, setEmail] = useState(data?.user?.Email);
  const [username, setUsername] = useState(data?.user?.Username || "");

  const toast = useToast();

  const showToast = (type,msg) => {
    toast(type, msg);
  };

  useEffect(() => {
    if (route.params) {
      const { purpose } = route.params;
      if (route.params) {
        if (purpose == "tarasafe") {
          setActiveTaraSafe(true);
        } else if (purpose == "phone") {
          setActiveMobileNum(true);
        }
      }
    }
  }, [route]);



const logOut = () =>{
  Alert.alert(
    'Logging Out?',
    'Do you want to sign out? Ensure your email or phone is linked to recover your account.',
    [
      {
        text: 'Close',
        type: 'cancel'
      },
        {
          text: "Logout",
          onPress: async () => {
            //connect to logout
            setUser({ accessToken: "" });
               // update user status
            const res = await updateUser(
              data?.user?.UserID,
              "Status",
              "Inactive"
            );
            await AsyncStorage.removeItem("register");
            await AsyncStorage.removeItem("data"); 
          },
        },
      ]
    );
  };


  const fetchUpdates = async () =>{
    try {
      const update = await Updates.checkForUpdateAsync();
      if (update.isAvailable) {
        Alert.alert(
          'Update Available',
          'An update is available and will be applied.',
          [
            {
              text: 'OK',
              onPress: async () => {
                await Updates.fetchUpdateAsync();
                await Updates.reloadAsync();
              },
            },
          ],
        );
      } else {
        showToast('success',"Your app is up-to-date.")
      }
    } catch (error) {
      showToast('error',"Can't fetch updates right now.")
    } 
  }



  const LiveReport = () => {
    navigation.navigate("webview", {
      track: data?.user?.UserID,
      url: "https://taranapo.com/report/",
    });
  };

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
          <Pressable onPress={() => logOut()} className="">
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
          </Pressable>
        </View>

        <View className="w-full h-full  z-50">
          <View className="w-full flex items-center p-4">
            <TaraLogo size={50} />
          </View>

          <View>
            <Text className="text-xl font-semibold py-2">
              Personal Information
            </Text>

            <View className="w-full  border-b border-slate-200 pb-4">
              <View className="flex flex-row justify-between items-center">
                <View className="flex-1">
                  <Text className="text-sm text-neutral-700">Legal Name</Text>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    className="text-lg py-1"
                  >
                    {username}
                  </Text>
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
                Providing your contact info helps recover your account and
                ensures receipts are sent to your email.
              </ParagraphText>
            </View>

            <View className="mt-4 w-full  border-b border-slate-200 pb-4">
              <View className="flex flex-row justify-between items-center">
                <View className="flex-1">
                  <Text className="text-sm text-neutral-700">
                    Mobile Number
                  </Text>
                  {phoneNumber ? (
                    <Text className="text-lg py-1">{phoneNumber}</Text>
                  ) : (
                    <Text
                      onPress={() => setActiveMobileNum(true)}
                      className="text-lg py-1 text-blue-500 font-semibold"
                    >
                      Add Mobile Number
                    </Text>
                  )}
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

              <View className="mt-4 flex flex-row justify-between items-center">
                <View className="flex-1">
                  <Text className="text-sm text-neutral-700">
                    Email Address
                  </Text>
                  {/* <Text className="text-lg py-1">example@gmail.com</Text> */}

                  {email ? (
                    <Text className="text-lg py-1">{email}</Text>
                  ) : (
                    <Text
                      onPress={() => setActiveAddEmailAddress(true)}
                      className="text-lg py-1 text-blue-500 font-semibold"
                    >
                      Add an email address
                    </Text>
                  )}
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
              <Pressable onPress={()=>fetchUpdates()} className="w-full border-b border-slate-200 py-2">
                <Text className="text-lg py-1 text-blue-500 font-semibold">
                  Check Update
                </Text>
              </Pressable>
              <TouchableOpacity
                onPress={() => setActiveTaraSafe(true)}
                className="w-full flex flex-row justify-between items-center border-b border-slate-200 py-2"
              >
                <Text className="flex-1 text-lg py-1 text-blue-500 font-semibold">
                  Tara Safe
                </Text>

                <LottieView
                  source={require("../assets/animation/safety-tara.json")}
                  autoPlay
                  loop
                  width={35}
                  height={35}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View className="w-full p-8">
            <ParagraphText
              fontSize="base"
              align="center"
              textColor="text-neutral-500"
            >
              <Text
                onPress={() =>
                  Linking.openURL("https://taranapo.com/data-and-privacy/")
                }
                className="text-blue-500 font-semibold"
              >
                Privacy Policy
              </Text>{" "}
              &{" "}
              <Text
                onPress={() =>
                  Linking.openURL("https://taranapo.com/terms-and-conditions/")
                }
                className="text-blue-500 font-semibold"
              >
                Terms of Use
              </Text>
            </ParagraphText>
            <Text className="text-center text-sm text-neutral-500">
              {appVersion} Beta
            </Text>
          </View>
        </View>
      </View>

      {activeEditUsername && (
        <EditUsernameScreen
          report={setViewReport}
          close={() => setActiveEditUsername(false)}
        />
      )}
      {activeAddMobileNum && (
        <AddMobileNumber
          report={setViewReport}
          close={() => setActiveMobileNum(false)}
        />
      )}
      {activeAddEmailAddress && (
        <AddEmailAddress
          report={setViewReport}
          close={() => setActiveAddEmailAddress(false)}
        />
      )}

      {viewreport && (
        <ReportProblemScreen
          navigation={navigation}
          close={() => setViewReport(false)}
        />
      )}

      {activeAccountDeletionModal && (
        <AccountDeletionModal
          navigation={navigation}
          close={() => setActiveAccountDeletionModal(false)}
        />
      )}

      {activeTaraSafe && <TaraSafe close={() => setActiveTaraSafe(false)} />}
    </View>
  );
};

const AccountDeletionModal = ({ navigation, close }) => {
  const SeeForm = () => {
    close();
    navigation.navigate("webview", {
      track: "user",
      url: "https://taranapo.com/deletion-request/",
    });
  };

  return (
    <View className="w-full h-full p-4 absolute bottom-0 bg-black/30 z-[100] ">
      <View
        className="w-full px-6 py-8 absolute bottom-10 left-4 rounded-3xl shadow-xl shadow-black  bg-white
      flex gap-y-6"
      >
        <Text className="text-center text-2xl font-bold">How it works?</Text>

        <View className="w-full flex justify-center items-center p-4">
          <DeletionGraphic size={170} />
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
          <Button onPress={() => SeeForm()}>Fill out the form</Button>
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

const EditUsernameScreen = ({ report, close }) => {
  const { data, setData } = useContext(DataContext);

  const [username, setUsername] = useState(data?.user?.Username);
  const [statusMsg, setStatusMsg] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const updateAccount = async () => {
    try {
      if (!username) return;

      setIsLoading(true);
      const res = await updateUser(data?.user?.UserID, "Username", username);

      if (res.status === "success") {
        setData({ user: { ...data.user, Username: username } });
        toast("success", "Username updated successfully");
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

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
          <Pressable
            onPress={() => report(true)}
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
              type="text"
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
          <Button onPress={updateAccount}>
            {isLoading ? "Processing..." : "Update Account"}
          </Button>

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

const AddMobileNumber = ({ report, close }) => {
  const { data, setData } = useContext(DataContext);

  const [phoneNumber, setPhoneNumber] = useState(data?.user?.Phone);
  const [statusMsg, setStatusMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const updateAccount = async () => {
    try {
      if (!phoneNumber) {
        setStatusMsg("Please enter phone number!");
        return;
      }

      if (phoneNumber.length < 11 || phoneNumber.length > 11) {
        setStatusMsg("Number must be 11 digits!");
        return;
      }

      setIsLoading(true);
      const res = await updateUser(data?.user?.UserID, "Phone", phoneNumber);
      if (res.status === "success") {
        setData({ user: { ...data.user, Phone: phoneNumber } });
        toast("success", "Phone Number added");
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

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
          <Pressable
            onPress={() => report(true)}
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
            Link Phone Number
          </Text>

          <View className="w-full border border-slate-400 p-2 rounded-2xl flex flex-row gap-x-2 items-center">
            <View className="p-2">
              <TaraLogo size={40} />
            </View>
            <TextInput
              className="flex-1 w-full text-lg text-blue-500"
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
            {statusMsg}
          </ParagraphText>
        </View>
        <View></View>
        <View></View>
        <View></View>

        <View className="w-full flex gap-y-4 p-2">
          <Button onPress={updateAccount}>
            {isLoading ? "Processing..." : "Update Account"}
          </Button>

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

const AddEmailAddress = ({ report, close }) => {
  const { data, setData } = useContext(DataContext);

  const [email, setEmail] = useState("example@gmail.com");
  const [statusMsg, setStatusMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const updateAccount = async () => {
    try {
      if (!email) return;

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        setStatusMsg("Invalid email format");
        return;
      }

      setIsLoading(true);
      const res = await updateUser(data?.user?.UserID, "Email", email);

      if (res.status === "success") {
        setData({ user: { ...data.user, Email: email } });

        // change firebase auth email used
        // await updateEmailAddress(email);

        toast("success", "Email address added");
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

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
          <Pressable
            onPress={() => report(true)}
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
            Link Email Address
          </Text>

          <View className="w-full border border-slate-400 p-2 rounded-2xl flex flex-row gap-x-2 items-center">
            <View className="p-2">
              <TaraLogo size={40} />
            </View>

            <TextInput
              className="flex-1 w-full text-lg text-blue-500"
              value={email}
              onChangeText={setEmail}
              placeholder=""
              type="email"
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
          <Button onPress={updateAccount}>
            {isLoading ? "Processing..." : "Update Account"}
          </Button>

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

const TaraSafe = ({ close }) => {
  const [input, setInput] = useState("example@gmail.com");
  const [input2, setInput2] = useState("");

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
        <View>
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
          </View>

          <View className="w-full">
            <View className="w-full flex flex-row gap-x-4 items-center p-4">
              <TaraLogo size={50} />

              <Text className="font-bold text-2xl">How it works?</Text>
            </View>

            <View className="py-4">
              <View className="flex-row justify-center items-center">
                <TaraSafeGraphic size={250} />
              </View>

              <ParagraphText
                fontSize="sm"
                textColor="text-neutral-500 text-center"
              >
                We’ll notify these people via SMS or email for every booking.
                Sounds safe? Let’s do it!
              </ParagraphText>
            </View>

            <ParagraphText
              fontSize="base"
              textColor="text-neutral-700 text-center"
            >
              Provide two email addresses or phone numbers—they don’t need a
              Tara account!
            </ParagraphText>

            <View className="w-full flex gap-y-4 py-4">
              <View className="w-full border border-slate-400 p-2 rounded-2xl flex flex-row gap-x-2 items-center">
                <View className="p-2">
                  {!input ? (
                    <Svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={25}
                      height={25}
                      viewBox="0 0 24 24"
                      fill="#ccc"
                    >
                      <Path d="M18.581 2.14 12.316.051a1 1 0 0 0-.632 0L5.419 2.14A4.993 4.993 0 0 0 2 6.883V12c0 7.563 9.2 11.74 9.594 11.914a1 1 0 0 0 .812 0C12.8 23.74 22 19.563 22 12V6.883a4.993 4.993 0 0 0-3.419-4.743ZM20 12c0 5.455-6.319 9.033-8 9.889-1.683-.853-8-4.42-8-9.889V6.883a3 3 0 0 1 2.052-2.846L12 2.054l5.948 1.983A3 3 0 0 1 20 6.883Z" />
                      <Path d="m15.3 8.3-4.188 4.2-2.244-2.34a1 1 0 1 0-1.441 1.386l2.306 2.4a1.872 1.872 0 0 0 1.345.6h.033a1.873 1.873 0 0 0 1.335-.553l4.272-4.272A1 1 0 0 0 15.3 8.3Z" />
                    </Svg>
                  ) : (
                    <Svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={25}
                      height={25}
                      viewBox="0 0 24 24"
                      fill="#22c55e"
                    >
                      <Path d="M18.581 2.14 12.316.051a1 1 0 0 0-.632 0L5.419 2.14A4.993 4.993 0 0 0 2 6.883V12c0 7.563 9.2 11.74 9.594 11.914a1 1 0 0 0 .812 0C12.8 23.74 22 19.563 22 12V6.883a4.993 4.993 0 0 0-3.419-4.743Zm-1.863 7.577-4.272 4.272a1.873 1.873 0 0 1-1.335.553h-.033a1.872 1.872 0 0 1-1.345-.6l-2.306-2.4a1 1 0 1 1 1.441-1.382l2.244 2.34L15.3 8.3a1 1 0 0 1 1.414 1.414Z" />
                    </Svg>
                  )}
                </View>

                <TextInput
                  className="flex-1 text-lg text-blue-500"
                  value={input}
                  onChangeText={setInput}
                  placeholder="Enter your email or phone number"
                />
              </View>

              <View className="w-full border border-slate-400 p-2 rounded-2xl flex flex-row gap-x-2 items-center">
                <View className="px-2">
                  {!input2 ? (
                    <Svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={25}
                      height={25}
                      viewBox="0 0 24 24"
                      fill="#ccc"
                    >
                      <Path d="M18.581 2.14 12.316.051a1 1 0 0 0-.632 0L5.419 2.14A4.993 4.993 0 0 0 2 6.883V12c0 7.563 9.2 11.74 9.594 11.914a1 1 0 0 0 .812 0C12.8 23.74 22 19.563 22 12V6.883a4.993 4.993 0 0 0-3.419-4.743ZM20 12c0 5.455-6.319 9.033-8 9.889-1.683-.853-8-4.42-8-9.889V6.883a3 3 0 0 1 2.052-2.846L12 2.054l5.948 1.983A3 3 0 0 1 20 6.883Z" />
                      <Path d="m15.3 8.3-4.188 4.2-2.244-2.34a1 1 0 1 0-1.441 1.386l2.306 2.4a1.872 1.872 0 0 0 1.345.6h.033a1.873 1.873 0 0 0 1.335-.553l4.272-4.272A1 1 0 0 0 15.3 8.3Z" />
                    </Svg>
                  ) : (
                    <Svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={25}
                      height={25}
                      viewBox="0 0 24 24"
                      fill="#22c55e"
                    >
                      <Path d="M18.581 2.14 12.316.051a1 1 0 0 0-.632 0L5.419 2.14A4.993 4.993 0 0 0 2 6.883V12c0 7.563 9.2 11.74 9.594 11.914a1 1 0 0 0 .812 0C12.8 23.74 22 19.563 22 12V6.883a4.993 4.993 0 0 0-3.419-4.743Zm-1.863 7.577-4.272 4.272a1.873 1.873 0 0 1-1.335.553h-.033a1.872 1.872 0 0 1-1.345-.6l-2.306-2.4a1 1 0 1 1 1.441-1.382l2.244 2.34L15.3 8.3a1 1 0 0 1 1.414 1.414Z" />
                    </Svg>
                  )}
                </View>

                <TextInput
                  className="flex-1 text-lg text-blue-500"
                  value={input2}
                  onChangeText={setInput2}
                  placeholder="Enter your email or phone number"
                />
              </View>
            </View>
          </View>
        </View>

        <View className="w-full flex gap-y-4 p-2">
          <Button>Enable</Button>

          <ParagraphText align="center" fontSize="sm">
            Learn how Tara keep you safe or visit our{" "}
            <Text
              onPress={() => Linking.openURL("https://taranapo.com/faqs/")}
              className="text-blue-500 font-semibold"
            >
              FAQs here.
            </Text>
          </ParagraphText>
        </View>
      </View>
    </View>
  );
};
export default AccountScreen;
