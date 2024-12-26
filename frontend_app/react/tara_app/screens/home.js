import { StatusBar } from "expo-status-bar";
import React from "react";
import { Image, Text, View } from "react-native";
import Svg, { Path, Rect } from "react-native-svg";
import TaraLogo from "../assets/tara_icon.png";
import BottomNavBar from "../components/BottomNavBar";
import ParagraphText from "../components/ParagraphText";

const HomeScreen = () => {
  return (
    <View className="w-full h-full bg-white p-8">
      <StatusBar style="dark" />
      <View className="w-full h-full relative">
        <View className="w-full flex flex-row gap-x-3 items-center justify-end py-6">
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

        <View className="w-full ">
          <Image source={TaraLogo} className="w-32 h-7" />

          <ParagraphText
            padding="py-4 pb-6 pr-16"
            fontSize="lg"
            textColor="text-slate-500"
          >
            It's kind of sunny and cloudy today! Enjoy the trip..
          </ParagraphText>
        </View>

        <View
          className="w-full border-t border-x border-slate-100 p-3 shadow-xl shadow-neutral-500 bg-white rounded-2xl 
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
              <Text className="text-xl font-semibold">Wallet</Text>
              <Text className="text-base">₱128.00</Text>
            </View>
          </View>

          <View className="p-2">
            <Svg
              xmlns="http://www.w3.org/2000/svg"
              width={30}
              height={30}
              fill="#3b82f6"
              data-name="Layer 1"
              viewBox="0 0 24 24"
            >
              <Path d="M12 0a12 12 0 1 0 12 12A12.013 12.013 0 0 0 12 0zm4 13h-3v3a1 1 0 0 1-2 0v-3H8a1 1 0 0 1 0-2h3V8a1 1 0 0 1 2 0v3h3a1 1 0 0 1 0 2z" />
            </Svg>
          </View>
        </View>

        <BottomNavBar />
      </View>
    </View>
  );
};

export default HomeScreen;
