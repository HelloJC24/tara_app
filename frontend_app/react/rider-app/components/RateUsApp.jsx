import { StatusBar } from "expo-status-bar";
import React from "react";
import { Pressable, Text, TouchableOpacity, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import LottieView from 'lottie-react-native';

const RateUsApp = (props) => {
  return (
    <View className="w-full h-full bg-white absolute inset-0 z-50">
      <StatusBar style="dark" />

      <View className="h-full flex justify-between items-center px-6 py-10 ">
        <View className="w-full flex flex-row gap-x-3 items-center justify-end py-2">
          <Pressable onPress={props.close}>
            <Svg
              xmlns="http://www.w3.org/2000/svg"
              width={30}
              height={30}
              viewBox="0 0 24 24"
              fill="#374957"
            >
              <Path d="M18 6a1 1 0 0 0-1.414 0L12 10.586 7.414 6A1 1 0 0 0 6 6a1 1 0 0 0 0 1.414L10.586 12 6 16.586A1 1 0 0 0 6 18a1 1 0 0 0 1.414 0L12 13.414 16.586 18A1 1 0 0 0 18 18a1 1 0 0 0 0-1.414L13.414 12 18 7.414A1 1 0 0 0 18 6Z" />
            </Svg>
          </Pressable>
        </View>

        <View className="w-full p-6">
          <Text className="text-2xl font-semibold text-center">
            How do you rate our app?
          </Text>
          <Text className="text-base text-slate-500 text-center p-2">
            Rate your experience
          </Text>

          <View className="w-full flex flex-row gap-x-6 justify-between items-center py-10 ">
            <TouchableOpacity className="flex flex-col gap-y-2 items-center">
             <View >
             <LottieView
              source={require('../assets/animation/sad.json')}
              autoPlay
              loop
              width={40}
              height={40}
              />
             </View>
              <Text className="text-center text-base text-slate-500">
                Awful
              </Text>
            </TouchableOpacity>

            <TouchableOpacity className="flex flex-col gap-y-2 items-center">
            <View>
             <LottieView
              source={require('../assets/animation/naah.json')}
              autoPlay
              loop
              width={40}
              height={40}
              />
             </View>
              <Text className="text-center text-base text-slate-500">Naah</Text>
            </TouchableOpacity>

            <TouchableOpacity className="flex flex-col gap-y-2 items-center">
            <View>
             <LottieView
              source={require('../assets/animation/neutral.json')}
              autoPlay
              loop
              width={40}
              height={40}
              />
          </View>
              <Text className="text-center text-base text-slate-500">OK</Text>
            </TouchableOpacity>

            <TouchableOpacity className="flex flex-col gap-y-2 items-center">
            <View>
             <LottieView
              source={require('../assets/animation/happy.json')}
              autoPlay
              loop
              width={40}
              height={40}
              />
          </View>

              <Text className="text-center text-base text-slate-500">Good</Text>
            </TouchableOpacity>

            <TouchableOpacity className="flex flex-col gap-y-2 items-center">
            <View>
             <LottieView
              source={require('../assets/animation/awesome.json')}
              autoPlay
              loop
              width={40}
              height={40}
              />
          </View>
              <Text className="text-center text-base text-slate-500">
                Awesome
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View></View>
        <View></View>

        <View>
          <Text onPress={props.close} className="text-blue-500 text-center text-2xl font-semibold p-2">
            Ask me later
          </Text>
          <Text className="text-blue-500 text-center text-lg p-2">
            Don't show again
          </Text>
        </View>
      </View>
    </View>
  );
};

export default RateUsApp;

// frown

// sad

// meh

// smile

// laugh
