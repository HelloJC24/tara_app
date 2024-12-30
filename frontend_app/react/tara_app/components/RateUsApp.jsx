import { StatusBar } from "expo-status-bar";
import React from "react";
import { Pressable, Text, TouchableOpacity, View } from "react-native";
import Svg, { Path } from "react-native-svg";

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
              <Svg
                xmlns="http://www.w3.org/2000/svg"
                width={30}
                height={30}
                data-name="Layer 1"
                viewBox="0 0 24 24"
                fill="#cbd5e1"
              >
                <Path d="M12 0a12 12 0 1 0 12 12A12.013 12.013 0 0 0 12 0ZM6 10a2 2 0 0 1 4 0c0 1-.895 1-2 1s-2 0-2-1Zm10.01 8H8a1 1 0 0 1-.963-1.285A5.5 5.5 0 0 1 12.007 13a5.469 5.469 0 0 1 4.966 3.715A1.02 1.02 0 0 1 16.01 18ZM16 11c-1.105 0-2 0-2-1a2 2 0 0 1 4 0c0 1-.895 1-2 1Z" />
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
                data-name="Layer 1"
                viewBox="0 0 24 24"
                fill="#cbd5e1"
              >
                <Path d="M12 0a12 12 0 1 0 12 12A12.013 12.013 0 0 0 12 0ZM8 8a2 2 0 0 1 2 2c0 1-.895 1-2 1s-2 0-2-1a2 2 0 0 1 2-2Zm9.746 9.667a1 1 0 0 1-1.41.081A7.51 7.51 0 0 0 12 16a7.508 7.508 0 0 0-4.336 1.748 1 1 0 0 1-1.33-1.494A9.454 9.454 0 0 1 12 14a9.454 9.454 0 0 1 5.666 2.254 1 1 0 0 1 .08 1.413ZM16 11c-1.105 0-2 0-2-1a2 2 0 0 1 4 0c0 1-.895 1-2 1Z" />
              </Svg>
              <Text className="text-center text-base text-slate-500">Naah</Text>
            </TouchableOpacity>

            <TouchableOpacity className="flex flex-col gap-y-2 items-center">
              <Svg
                xmlns="http://www.w3.org/2000/svg"
                width={30}
                height={30}
                data-name="Layer 1"
                viewBox="0 0 24 24"
                fill="#cbd5e1"
              >
                <Path d="M12 0a12 12 0 1 0 12 12A12.013 12.013 0 0 0 12 0ZM6 10a2 2 0 0 1 4 0c0 1-.895 1-2 1s-2 0-2-1Zm10 7H8a1 1 0 0 1 0-2h8a1 1 0 0 1 0 2Zm0-6c-1.105 0-2 0-2-1a2 2 0 0 1 4 0c0 1-.895 1-2 1Z" />
              </Svg>

              <Text className="text-center text-base text-slate-500">OK</Text>
            </TouchableOpacity>

            <TouchableOpacity className="flex flex-col gap-y-2 items-center">
              <Svg
                xmlns="http://www.w3.org/2000/svg"
                width={30}
                height={30}
                data-name="Layer 1"
                viewBox="0 0 24 24"
                fill="#cbd5e1"
              >
                <Path d="M12 0a12 12 0 1 0 12 12A12.013 12.013 0 0 0 12 0ZM8 8a2 2 0 0 1 2 2c0 1-.895 1-2 1s-2 0-2-1a2 2 0 0 1 2-2Zm9.666 7.746A9.454 9.454 0 0 1 12 18a9.454 9.454 0 0 1-5.666-2.254 1 1 0 0 1 1.332-1.492A7.509 7.509 0 0 0 12 16a7.508 7.508 0 0 0 4.336-1.748 1 1 0 0 1 1.33 1.494ZM16 11c-1.105 0-2 0-2-1a2 2 0 0 1 4 0c0 1-.895 1-2 1Z" />
              </Svg>

              <Text className="text-center text-base text-slate-500">Good</Text>
            </TouchableOpacity>

            <TouchableOpacity className="flex flex-col gap-y-2 items-center">
              <Svg
                xmlns="http://www.w3.org/2000/svg"
                width={30}
                height={30}
                data-name="Layer 1"
                viewBox="0 0 24 24"
                fill="#cbd5e1"
              >
                <Path d="M12 0a12 12 0 1 0 12 12A12.013 12.013 0 0 0 12 0ZM6 10a2 2 0 0 1 4 0c0 1-.895 1-2 1s-2 0-2-1Zm10.973 5.285A5.469 5.469 0 0 1 12.007 19a5.5 5.5 0 0 1-4.966-3.715A1 1 0 0 1 8 14h8.01a1.02 1.02 0 0 1 .963 1.285ZM16 11c-1.105 0-2 0-2-1a2 2 0 0 1 4 0c0 1-.895 1-2 1Z" />
              </Svg>
              <Text className="text-center text-base text-slate-500">
                Awesome
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View></View>
        <View></View>

        <View>
          <Text className="text-blue-500 text-center text-2xl font-semibold p-2">
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
