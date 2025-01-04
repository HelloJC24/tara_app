import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import AppIcon from "../assets/splash-icon.png";
import TaraLogo from "../assets/tara_icon.png";
import BottomNavBar from "../components/BottomNavBar";
import Button from "../components/Button";
import ParagraphText from "../components/ParagraphText";

const HomeScreen = () => {
  const [activeScanFriend, setActiveScanFriend] = useState(false);

  return (
    <View className="w-full h-full bg-white relative">
      <StatusBar style="dark" />
      <View className="w-full h-full p-6 ">
        <View className="w-full flex flex-row gap-x-3 items-center justify-between pt-10">
          <Image source={TaraLogo} className="w-32 h-full" />

          <View className="flex flex-row gap-x-3 items-center justify-between">
            <View className="p-1 bg-slate-200 rounded-lg">
              <Svg
                xmlns="http://www.w3.org/2000/svg"
                width={20}
                height={20}
                viewBox="0 0 24 24"
                fill="#374957"
              >
                <Path d="M12 0a12 12 0 1 0 12 12A12.013 12.013 0 0 0 12 0Zm10 12a9.938 9.938 0 0 1-1.662 5.508l-1.192-1.193a.5.5 0 0 1-.146-.353V15a3 3 0 0 0-3-3h-3a1 1 0 0 1-1-1v-.5a.5.5 0 0 1 .5-.5A2.5 2.5 0 0 0 15 7.5v-1a.5.5 0 0 1 .5-.5h1.379a2.516 2.516 0 0 0 1.767-.732l.377-.377A9.969 9.969 0 0 1 22 12Zm-19.951.963 3.158 3.158A2.978 2.978 0 0 0 7.329 17H10a1 1 0 0 1 1 1v3.949a10.016 10.016 0 0 1-8.951-8.986ZM13 21.949V18a3 3 0 0 0-3-3H7.329a1 1 0 0 1-.708-.293l-4.458-4.458A9.978 9.978 0 0 1 17.456 3.63l-.224.224a.507.507 0 0 1-.353.146H15.5A2.5 2.5 0 0 0 13 6.5v1a.5.5 0 0 1-.5.5 2.5 2.5 0 0 0-2.5 2.5v.5a3 3 0 0 0 3 3h3a1 1 0 0 1 1 1v.962a2.516 2.516 0 0 0 .732 1.767l1.337 1.337A9.971 9.971 0 0 1 13 21.949Z" />
              </Svg>
            </View>
            <View className="p-1 bg-amber-200 rounded-lg">
              <Svg
                xmlns="http://www.w3.org/2000/svg"
                width={20}
                height={20}
                data-name="Layer 1"
                viewBox="0 0 24 24"
                fill="#fbbf24"
              >
                <Path d="M2 15h9v9H7a5 5 0 0 1-5-5Zm22-4a2 2 0 0 1-2 2h-9V8.957c-.336.026-.671.043-1 .043s-.664-.017-1-.043V13H2a2 2 0 0 1-2-2 4 4 0 0 1 4-4h1.738A5.137 5.137 0 0 1 4 3a1 1 0 0 1 2 0c0 2.622 2.371 3.53 4.174 3.841A9.332 9.332 0 0 1 9 3a3 3 0 0 1 6 0 9.332 9.332 0 0 1-1.174 3.841C15.629 6.53 18 5.622 18 3a1 1 0 0 1 2 0 5.137 5.137 0 0 1-1.738 4H20a4 4 0 0 1 4 4ZM11 3a7.71 7.71 0 0 0 1 3.013A7.71 7.71 0 0 0 13 3a1 1 0 0 0-2 0Zm2 21h4a5 5 0 0 0 5-5v-4h-9Z" />
              </Svg>
            </View>
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
              <Svg
                xmlns="http://www.w3.org/2000/svg"
                width={30}
                height={30}
                data-name="Layer 1"
                viewBox="0 0 24 24"
                fill="#64748b"
              >
                <Path d="M20.723 7H22a2 2 0 0 0 2-2 4 4 0 0 0-4-4H5a5.006 5.006 0 0 0-5 5v6.515a6.954 6.954 0 0 0 2.05 4.949l.95.95V19.5a3.5 3.5 0 0 0 7 0V19h5v.5a3.5 3.5 0 0 0 7 0V19h1a1 1 0 0 0 1-1v-3.407a7.009 7.009 0 0 0-.922-3.472ZM2 7h6v2H2Zm6 12.5a1.5 1.5 0 0 1-3 0V19h3Zm5-2.5H4.414l-.95-.95A4.967 4.967 0 0 1 2 12.515V11h6a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H2.172A3 3 0 0 1 5 3h15a2 2 0 0 1 2 2h-5a4 4 0 0 0-4 4Zm7.7-6H15V9a2 2 0 0 1 2-2h1.419Zm-.7 8.5a1.5 1.5 0 0 1-3 0V19h3Zm2-2.5h-7v-4h6.739A5 5 0 0 1 22 14.593Z" />
              </Svg>
            </View>

            <View>
              <Text className="text-xl font-semibold text-neutral-700">
                Wallet
              </Text>
              <View className="flex flex-row gap-x-1 items-center">
                <Text className="text-base">₱128.00</Text>
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
              </View>
            </View>
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
        <View className="w-full py-4">
          <Text className="text-lg text-neutral-700 py-2">Choose a ride</Text>

          <View className="w-full flex flex-row justify-between items-center py-2 px-4">
            <View className="flex gap-y-1">
              <View className="w-20 h-20 bg-slate-200 rounded-full"></View>
              <Text className="text-base text-center text-slate-500">
                TaraRide
              </Text>
            </View>

            <View className="flex gap-y-1">
              <View className="w-20 h-20 bg-slate-200 rounded-full"></View>
              <Text className="text-base text-center text-slate-500">
                TaraCar
              </Text>
            </View>

            <View className="flex gap-y-1">
              <View className="w-20 h-20 bg-slate-200 rounded-full"></View>
              <Text className="text-base text-center text-slate-500">
                TaraVan
              </Text>
            </View>
          </View>
        </View>

        <BottomNavBar />
      </View>
      <ExistingBooking />

      {activeScanFriend && (
        <FriendsWithBenefits close={() => setActiveScanFriend(false)} />
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
        <Image
          source={AppIcon}
          className="w-12 h-12 border border-slate-300 p-2 rounded-xl"
        />

        <View>
          <Text className="text-lg font-semibold text-white">
            Get ready to ride in!
          </Text>

          <View className="flex flex-row gap-x-1 items-center">
            <Svg
              xmlns="http://www.w3.org/2000/svg"
              width={15}
              height={15}
              data-name="Layer 1"
              viewBox="0 0 24 24"
              fill="#e2e8f0"
            >
              <Path d="M24 12a12 12 0 0 1-24 0 1 1 0 0 1 2 0A10 10 0 1 0 12 2a1 1 0 0 1 0-2 12.013 12.013 0 0 1 12 12zm-13.723-1H8a1 1 0 0 0 0 2h2.277A1.994 1.994 0 1 0 13 10.277V7a1 1 0 0 0-2 0v3.277a2 2 0 0 0-.723.723zm-8.45-2.216a1 1 0 1 0-1-1 1 1 0 0 0 1 1zm2.394-3.577a1 1 0 1 0-1-1 1 1 0 0 0 1 1zm3.558-2.366a1 1 0 1 0-1-1 1 1 0 0 0 1 1z" />
            </Svg>
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

const FriendsWithBenefits = ({ close }) => {
  return (
    <View className="w-full h-full p-4 absolute bottom-0 bg-black/30 z-[100] ">
      <View
        className="w-full px-6 py-8 absolute bottom-10 left-4 rounded-3xl shadow-xl shadow-black  bg-white
      flex gap-y-4"
      >
        <Text className="text-center text-2xl font-bold">
          Friends with Benefits
        </Text>

        <View className="w-full flex justify-center items-center p-4">
          <Image
            source={{
              uri: "https://pnghq.com/wp-content/uploads/2023/02/minecraft-steve-skin-render-png-3129.png",
            }}
            className="w-60 h-72"
          />
        </View>

        <ParagraphText
          align="center"
          fontSize="sm"
          textColor="text-neutral-700"
          padding="px-2"
        >
          Here’s your unique QR code! Anyone who scans it can get between 10 and
          20 points, and you'll receive the same rewards too.
        </ParagraphText>

        <Text className="text-center text-base font-semibold text-neutral-700">
          OR
        </Text>

        <View className="w-full flex gap-y-4">
          <Button>Scan a friend</Button>
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
