import * as Location from "expo-location";
import { StatusBar } from "expo-status-bar";
import LottieView from "lottie-react-native";
import React, { useContext, useEffect, useState } from "react";
import {
  Alert,
  Image,
  Linking,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import QRCodeStyled from "react-native-qrcode-styled";
import Svg, { Path } from "react-native-svg";
import TaraLogo from "../assets/tara_icon.png";
import BottomNavBar from "../components/BottomNavBar";
import Button from "../components/Button";
import { InviteGraphic, TaraPermission } from "../components/CustomGraphic";
import {
  TaraCar,
  TaraGift,
  TaraMotor,
  TaraVan,
  TaraWalletIcon,
} from "../components/CustomIcon";
import ParagraphText from "../components/ParagraphText";
import RateUsApp from "../components/RateUsApp";
import { fetchDataControl, fetchUser } from "../config/hooks";
import { AuthContext } from "../context/authContext";
import { DataContext } from "../context/dataContext";

const HomeScreen = ({ navigation }) => {
  const [activeScanFriend, setActiveScanFriend] = useState(false);
  const [rewardsAvailable, SetRewards] = useState(true);

  const [activeRateUs, setActiveRateUs] = useState(true);
  const [locationPermission, setPermissionAsk] = useState(false);
  const [location, setLocation] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const { user } = useContext(AuthContext);
  const { data, setData } = useContext(DataContext);

  const taraBook = (vehicle) => {
    navigation.navigate("booking", {
      track: user?.userId,
      wheels: vehicle,
      start: location,
    });
  };

  const OpenRewards = () => {
    navigation.navigate("webview", {
      track: user?.userId,
      url: `https://taranapo.com/rewards/?taraid=${user?.userId}`,
    });
  };

  const openQR = () => {
    navigation.navigate("qrcode", {
      mode: "STF",
    });
  };

  useEffect(() => {
    async function getCurrentLocation() {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setPermissionAsk(true);
        Alert.alert(
          "Permission Denied",
          "We cannot proceed performing our services without location access.",
          [
            {
              text: "Close",
              type: "cancel",
            },
          ]
        );
        return;
      } else {
        setPermissionAsk(false);
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      if (location.mocked) {
        setPermissionAsk(false);
      } else {
        setLocation(location);
      }
    }

    getCurrentLocation();
  }, [locationPermission]);

  useEffect(() => {
    //fetching data control
    const getDataControl = async () => {
      try {
        const res = await fetchDataControl();

        if (res.status === "success") {
          setData((prevData) => ({
            ...prevData,
            control: res.data,
          }));
          console.log("data control: ", data?.control);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getDataControl();
  }, []);

  useEffect(() => {
    // fetching user data
    const getUser = async () => {
      try {
        setIsLoading(true);
        const res = await fetchUser(user?.userId);

        if (res.status === "success") {
          setData((prevData) => ({
            ...prevData,
            user: res.data,
          }));

          setIsLoading(false);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getUser();
  }, [user?.userId]);

  return (
    <View className="w-full h-full bg-white relative">
      <StatusBar style="dark" />
      <View className="w-full h-full p-6 ">
        <View className="w-full flex flex-row gap-x-3 items-center justify-between pt-10">
          <Image source={TaraLogo} className="w-36 h-full" />

          <View className="flex flex-row gap-x-3 items-center justify-between">
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

            {rewardsAvailable ? (
              <Pressable
                onPress={() => OpenRewards()}
                className="pb-1.5 bg-white rounded-lg"
              >
                <LottieView
                  source={require("../assets/animation/taragift.json")}
                  autoPlay
                  loop
                  width={40}
                  height={35}
                />
              </Pressable>
            ) : (
              <View className="pt-1.5 px-2 bg-white rounded-lg">
                <TaraGift size={24} />
              </View>
            )}
          </View>
        </View>

        <ParagraphText
          padding="py-4 pr-16"
          fontSize="lg"
          align="left"
          textColor="text-neutral-700"
        >
          It's kind of sunny and cloudy today! Enjoy the trip..
        </ParagraphText>

        <View
          className="w-full border-t border-x border-slate-100 p-3 shadow-md shadow-neutral-500 bg-white rounded-2xl 
        flex flex-row items-center justify-between"
        >
          <View className="flex flex-row gap-x-4 ">
            <View className="border border-slate-300 p-2 rounded-xl">
              <TaraWalletIcon color="#404040" size={35} />
            </View>

            <Pressable onPress={() => navigation.navigate("wallet")}>
              <Text className="text-lg font-semibold text-neutral-700">
                Wallet
              </Text>
              <View className="flex flex-row gap-x-1 items-center">
                <Text className="text-xl font-medium">
                  &#8369; {isLoading ? "..." : data?.user?.Wallet}
                </Text>
                <TouchableOpacity onPress={() => navigation.navigate("wallet")}>
                  <Svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={15}
                    height={15}
                    data-name="Layer 1"
                    viewBox="0 0 24 24"
                    fill="#3b82f6"
                  >
                    <Path d="M12 0a12 12 0 1 0 12 12A12.013 12.013 0 0 0 12 0zm4 13h-3v3a1 1 0 0 1-2 0v-3H8a1 1 0 0 1 0-2h3V8a1 1 0 0 1 2 0v3h3a1 1 0 0 1 0 2z" />
                  </Svg>
                </TouchableOpacity>
              </View>
            </Pressable>
          </View>

          <TouchableOpacity
            onPress={() => setActiveScanFriend(true)}
            className="p-2"
          >
            <Svg
              xmlns="http://www.w3.org/2000/svg"
              width={30}
              height={30}
              data-name="Layer 1"
              viewBox="0 0 24 24"
              fill="#3b82f6"
            >
              <Path d="M19 24h-1a1 1 0 0 1 0-2h1a3 3 0 0 0 3-3v-1a1 1 0 0 1 2 0v1a5.006 5.006 0 0 1-5 5zm5-18V5a5.006 5.006 0 0 0-5-5h-1a1 1 0 0 0 0 2h1a3 3 0 0 1 3 3v1a1 1 0 0 0 2 0zM7 23a1 1 0 0 0-1-1H5a3 3 0 0 1-3-3v-1a1 1 0 0 0-2 0v1a5.006 5.006 0 0 0 5 5h1a1 1 0 0 0 1-1zM2 6V5a3 3 0 0 1 3-3h1a1 1 0 0 0 0-2H5a5.006 5.006 0 0 0-5 5v1a1 1 0 0 0 2 0zm14 6a4 4 0 1 0-4 4 4 4 0 0 0 4-4z" />
            </Svg>
          </TouchableOpacity>
        </View>
        <View className="mt-4 w-full py-4">
          <Text className="text-lg font-medium text-neutral-800 py-2">
            Choose a ride
          </Text>

          <View className="w-full flex flex-row justify-between items-center py-2 px-4">
            {location.length == 0 ? (
              <Pressable
                onPress={() => setPermissionAsk(true)}
                className="flex gap-y-1"
              >
                <View className="opacity-50 flex justify-center items-center pt-2 w-20 h-20 bg-slate-200 rounded-full">
                  <TaraMotor size="55" />
                </View>
                <Text className="text-base text-center text-gray-200">
                  {data?.control?.service_name1 || "TaraRide"}
                </Text>
              </Pressable>
            ) : (
              <Pressable onPress={() => taraBook(2)} className="flex gap-y-1">
                <View className="flex justify-center items-center pt-2 w-20 h-20 bg-slate-200 rounded-full">
                  <TaraMotor size="55" />
                </View>
                <Text className="text-base text-center text-blue-500">
                  {data?.control?.service_name1 || "TaraRide"}
                </Text>
              </Pressable>
            )}

            {location.length == 0 ? (
              <Pressable onPress={() => setPermissionAsk(true)}>
                <View className="opacity-50 flex justify-center items-center w-20 h-20 bg-slate-200 rounded-full">
                  <TaraCar size="65" />
                </View>
                <Text className="text-base text-center text-gray-200">
                  {data?.control?.service_name2 || "TaraCar"}
                </Text>
              </Pressable>
            ) : (
              <Pressable onPress={() => taraBook(4)} className="flex gap-y-1">
                <View className="flex justify-center items-center w-20 h-20 bg-slate-200 rounded-full">
                  <TaraCar size="65" />
                </View>
                <Text className="text-base text-center text-blue-500">
                  {data?.control?.service_name2 || "TaraCar"}
                </Text>
              </Pressable>
            )}

            {location.length == 0 ? (
              <Pressable onPress={() => setPermissionAsk(true)}>
                <View className="opacity-50 flex justify-center items-center w-20 h-20 bg-slate-200 rounded-full">
                  <TaraVan size="65" />
                </View>
                <Text className="text-base text-center text-gray-200">
                  {data?.control?.service_name3 || "TaraVan"}
                </Text>
              </Pressable>
            ) : (
              <Pressable onPress={() => taraBook(5)} className="flex gap-y-1">
                <View className="flex justify-center items-center w-20 h-20 bg-slate-200 rounded-full">
                  <TaraVan size="65" />
                </View>
                <Text className="text-base text-center text-blue-500">
                  {data?.control?.service_name3 || "TaraVan"}
                </Text>
              </Pressable>
            )}
          </View>
        </View>

        <BottomNavBar />
      </View>
      {/* <ExistingBooking /> */}

      {activeScanFriend && (
        <FriendsWithBenefits
          openQR={openQR}
          QR={data?.user?.UserID}
          close={() => setActiveScanFriend(false)}
        />
      )}
      {activeRateUs && <RateUsApp close={() => setActiveRateUs(false)} />}

      {locationPermission && (
        <AllowLocationPrompt close={() => setPermissionAsk(false)} />
      )}
    </View>
  );
};

const ExistingBooking = () => {
  return (
    <View
      className=" absolute bottom-36 left-6 right-6 p-4 shadow-md shadow-neutral-500 bg-blue-500 rounded-2xl 
        flex flex-row items-center justify-between"
    >
      <View className="flex flex-row gap-x-4 items-center ">
        <View className="bg-white rounded-xl p-2.5">
          <LottieView
            source={require("../assets/animation/tara.json")}
            autoPlay
            loop
            width={40}
            height={40}
          />
        </View>

        <View>
          <Text className="text-lg font-semibold text-white">
            Get ready to ride in!
          </Text>

          <View className="flex flex-row gap-x-1 items-center">
            <LottieView
              source={require("../assets/animation/clock.json")}
              autoPlay
              loop
              width={20}
              height={20}
            />
            <Text className="text-base text-slate-200">3mins</Text>
          </View>
        </View>
      </View>

      <View>
        <Svg
          xmlns="http://www.w3.org/2000/svg"
          width={30}
          height={30}
          viewBox="0 0 24 24"
          fill="#fff"
        >
          <Path d="m15.75 9.525-4.586-4.586a1.5 1.5 0 0 0-2.121 2.122l4.586 4.585a.5.5 0 0 1 0 .708l-4.586 4.585a1.5 1.5 0 0 0 2.121 2.122l4.586-4.586a3.505 3.505 0 0 0 0-4.95Z" />
        </Svg>
      </View>
    </View>
  );
};

const FriendsWithBenefits = ({ openQR, QR, close }) => {
  return (
    <View className="w-full h-full p-4 absolute bottom-0 bg-black/30 z-[100] ">
      <View
        className="w-full px-6 py-8 absolute bottom-10 left-4 rounded-3xl shadow-xl shadow-black  bg-white
      flex gap-y-4"
      >
        <Text className="text-center text-2xl font-bold">
          Friends with Benefits
        </Text>

        <View className="relative w-full flex justify-center items-center p-4">
          <InviteGraphic size={300} />
          <View className="absolute bottom-7">
            <QRCodeStyled
              data={QR}
              style={{ backgroundColor: "transparent" }}
              padding={10}
              pieceSize={5}
              pieceCornerType="rounded"
              color={"#020617"}
              pieceScale={1.02}
              pieceLiquidRadius={3}
              logo={{
                href: require("../assets/tara_app.png"),
                padding: 4,
                scale: 1,
                hidePieces: true,
              }}
              errorCorrectionLevel={"H"}
              innerEyesOptions={{
                borderRadius: 4,
                color: "#404040",
              }}
              outerEyesOptions={{
                borderRadius: 12,
                color: "#ffa114",
              }}
            />
          </View>
        </View>

        <ParagraphText
          align="center"
          fontSize="sm"
          textColor="text-neutral-700"
          padding="px-2"
        >
          Here’s your unique QR code! Anyone who scans it can get between
          &#8369;10 and &#8369;20, and you'll receive the same rewards too.
        </ParagraphText>

        <Text className="text-center text-base font-semibold text-neutral-700">
          OR
        </Text>

        <View className="w-full flex gap-y-4">
          <Button onPress={() => openQR()}>Scan a friend</Button>
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

const AllowLocationPrompt = ({ close }) => {
  return (
    <View className="w-full h-full p-4 absolute bottom-0 bg-black/30 z-[100] ">
      <View
        className="w-full px-6 py-8 absolute bottom-10 left-4 rounded-3xl shadow-xl shadow-black  bg-white
      flex gap-y-4"
      >
        <View className="relative w-full flex justify-center items-center p-4">
          <TaraPermission size={200} />
        </View>

        <Text className="text-center text-2xl font-bold">
          Location Permission
        </Text>

        <ParagraphText
          align="center"
          fontSize="sm"
          textColor="text-neutral-700"
          padding="px-2"
        >
          We need your precise location for a better experience.
        </ParagraphText>

        <View className="w-full flex gap-y-4">
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

export default HomeScreen;
