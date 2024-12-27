import { StatusBar } from "expo-status-bar";
import React from "react";
import { Image, Pressable, Text, TouchableOpacity, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import AppIcon from "../assets/splash-icon.png";
import Button from "./Button";
const RiderRatings = (props) => {
  return (
    <View className="w-full h-full bg-white absolute inset-0 z-50">
      <StatusBar style="dark" />

      <View className="h-full flex justify-between items-center px-8 py-10 z-[100]">
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

        <View className="w-full p-6 flex justify-center items-center">
          <Image source={AppIcon} className="w-48 h-48" />
          <Text className="text-base text-slate-500 text-center p-2">
            Rate your experience
          </Text>

          <View className="w-full flex flex-row gap-x-4 justify-between items-center py-10 ">
            <TouchableOpacity className="flex flex-col gap-y-2 items-center">
              <Svg
                xmlns="http://www.w3.org/2000/svg"
                width={30}
                height={30}
                viewBox="0 0 24 24"
                fill="#cbd5e1"
              >
                <Path d="m1.327 12.4 3.56 2.6-1.352 4.187A3.178 3.178 0 0 0 4.719 22.8a3.177 3.177 0 0 0 3.8-.019L12 20.219l3.482 2.559a3.227 3.227 0 0 0 4.983-3.591L19.113 15l3.56-2.6a3.227 3.227 0 0 0-1.9-5.832H16.4l-1.327-4.136a3.227 3.227 0 0 0-6.146 0L7.6 6.568H3.231a3.227 3.227 0 0 0-1.9 5.832Z" />
              </Svg>
              <Text className="text-center text-base text-slate-500">
                Awful
              </Text>
            </TouchableOpacity>

            <TouchableOpacity className="flex flex-col gap-y-2 items-center">
              <Svg
                xmlns="http://www.w3.org/2000/svg"
                width={30}
                height={30}
                viewBox="0 0 24 24"
                fill="#cbd5e1"
              >
                <Path d="m1.327 12.4 3.56 2.6-1.352 4.187A3.178 3.178 0 0 0 4.719 22.8a3.177 3.177 0 0 0 3.8-.019L12 20.219l3.482 2.559a3.227 3.227 0 0 0 4.983-3.591L19.113 15l3.56-2.6a3.227 3.227 0 0 0-1.9-5.832H16.4l-1.327-4.136a3.227 3.227 0 0 0-6.146 0L7.6 6.568H3.231a3.227 3.227 0 0 0-1.9 5.832Z" />
              </Svg>
              <Text className="text-center text-base text-slate-500">Naah</Text>
            </TouchableOpacity>

            <TouchableOpacity className="flex flex-col gap-y-2 items-center">
              <Svg
                xmlns="http://www.w3.org/2000/svg"
                width={30}
                height={30}
                viewBox="0 0 24 24"
                fill="#cbd5e1"
              >
                <Path d="m1.327 12.4 3.56 2.6-1.352 4.187A3.178 3.178 0 0 0 4.719 22.8a3.177 3.177 0 0 0 3.8-.019L12 20.219l3.482 2.559a3.227 3.227 0 0 0 4.983-3.591L19.113 15l3.56-2.6a3.227 3.227 0 0 0-1.9-5.832H16.4l-1.327-4.136a3.227 3.227 0 0 0-6.146 0L7.6 6.568H3.231a3.227 3.227 0 0 0-1.9 5.832Z" />
              </Svg>

              <Text className="text-center text-base text-slate-500">OK</Text>
            </TouchableOpacity>

            <TouchableOpacity className="flex flex-col gap-y-2 items-center">
              <Svg
                xmlns="http://www.w3.org/2000/svg"
                width={30}
                height={30}
                viewBox="0 0 24 24"
                fill="#cbd5e1"
              >
                <Path d="m1.327 12.4 3.56 2.6-1.352 4.187A3.178 3.178 0 0 0 4.719 22.8a3.177 3.177 0 0 0 3.8-.019L12 20.219l3.482 2.559a3.227 3.227 0 0 0 4.983-3.591L19.113 15l3.56-2.6a3.227 3.227 0 0 0-1.9-5.832H16.4l-1.327-4.136a3.227 3.227 0 0 0-6.146 0L7.6 6.568H3.231a3.227 3.227 0 0 0-1.9 5.832Z" />
              </Svg>

              <Text className="text-center text-base text-slate-500">Good</Text>
            </TouchableOpacity>

            <TouchableOpacity className="flex flex-col gap-y-2 items-center">
              <Svg
                xmlns="http://www.w3.org/2000/svg"
                width={30}
                height={30}
                viewBox="0 0 24 24"
                fill="#cbd5e1"
              >
                <Path d="m1.327 12.4 3.56 2.6-1.352 4.187A3.178 3.178 0 0 0 4.719 22.8a3.177 3.177 0 0 0 3.8-.019L12 20.219l3.482 2.559a3.227 3.227 0 0 0 4.983-3.591L19.113 15l3.56-2.6a3.227 3.227 0 0 0-1.9-5.832H16.4l-1.327-4.136a3.227 3.227 0 0 0-6.146 0L7.6 6.568H3.231a3.227 3.227 0 0 0-1.9 5.832Z" />
              </Svg>
              <Text className="text-center text-base text-slate-500">
                Awesome
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View></View>
        <View></View>

        <View className="w-full flex gap-y-4 p-2">
          <Button bgColor="bg-slate-300" textColor="text-neutral-700">
            Report an issue
          </Button>
          <Button>Submit Ratings</Button>
        </View>
      </View>
    </View>
  );
};

export default RiderRatings;

// frown

// sad

// meh

// smile

// laugh
