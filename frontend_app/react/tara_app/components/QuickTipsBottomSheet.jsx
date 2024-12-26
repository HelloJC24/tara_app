import BottomSheet from "@devvie/bottom-sheet";
import React, { useEffect, useRef } from "react";
import { Text, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import Button from "./Button";

const QuickTipsBottomSheet = ({ open, onClose, activeScanner }) => {
  const sheetRef = useRef(null);

  useEffect(() => {
    if (open) {
      sheetRef.current?.open();
    }
  }, [open]);

  return (
    <BottomSheet
      onClose={onClose}
      animationType="spring"
      ref={sheetRef}
      height={480}
      containerHeight={1000}
      hideDragHandle={true}
      style={{ backgroundColor: "#fff" }}
    >
      <View className="w-full h-full p-8">
        <Text className="text-2xl font-bold">Quick Tips!</Text>

        <View className="py-4">
          <View className="flex flex-row gap-x-4 items-center py-2">
            <View className="bg-green-500 p-2 rounded-full">
              <Svg
                xmlns="http://www.w3.org/2000/svg"
                width={15}
                height={15}
                fill="white"
                viewBox="0 0 24 24"
              >
                <Path d="M22.319 4.431 8.5 18.249a1 1 0 0 1-1.417 0L1.739 12.9a1 1 0 0 0-1.417 0 1 1 0 0 0 0 1.417l5.346 5.345a3.008 3.008 0 0 0 4.25 0L23.736 5.847a1 1 0 0 0 0-1.416 1 1 0 0 0-1.417 0Z" />
              </Svg>
            </View>
            <Text className="text-lg pr-10">
              Make sure the 4 corners of the cards is visible.
            </Text>
          </View>

          <View className="flex flex-row gap-x-4 items-center py-2">
            <View className="bg-green-500 p-2 rounded-full">
              <Svg
                xmlns="http://www.w3.org/2000/svg"
                width={15}
                height={15}
                fill="white"
                viewBox="0 0 24 24"
              >
                <Path d="M22.319 4.431 8.5 18.249a1 1 0 0 1-1.417 0L1.739 12.9a1 1 0 0 0-1.417 0 1 1 0 0 0 0 1.417l5.346 5.345a3.008 3.008 0 0 0 4.25 0L23.736 5.847a1 1 0 0 0 0-1.416 1 1 0 0 0-1.417 0Z" />
              </Svg>
            </View>
            <Text className="text-lg pr-10">
              Avoid flashy contrast while taking photos.
            </Text>
          </View>

          <View className="flex flex-row gap-x-4 items-center py-2">
            <View className="bg-green-500 p-2 rounded-full">
              <Svg
                xmlns="http://www.w3.org/2000/svg"
                width={15}
                height={15}
                fill="white"
                viewBox="0 0 24 24"
              >
                <Path d="M22.319 4.431 8.5 18.249a1 1 0 0 1-1.417 0L1.739 12.9a1 1 0 0 0-1.417 0 1 1 0 0 0 0 1.417l5.346 5.345a3.008 3.008 0 0 0 4.25 0L23.736 5.847a1 1 0 0 0 0-1.416 1 1 0 0 0-1.417 0Z" />
              </Svg>
            </View>
            <Text className="text-lg pr-10">Do not use expired ID’s.</Text>
          </View>

          <View className="flex flex-row gap-x-4 items-center py-2">
            <View className="bg-green-500 p-2 rounded-full">
              <Svg
                xmlns="http://www.w3.org/2000/svg"
                width={15}
                height={15}
                fill="white"
                viewBox="0 0 24 24"
              >
                <Path d="M22.319 4.431 8.5 18.249a1 1 0 0 1-1.417 0L1.739 12.9a1 1 0 0 0-1.417 0 1 1 0 0 0 0 1.417l5.346 5.345a3.008 3.008 0 0 0 4.25 0L23.736 5.847a1 1 0 0 0 0-1.416 1 1 0 0 0-1.417 0Z" />
              </Svg>
            </View>
            <Text className="text-lg pr-10">
              Only use valid IDs like students or government issued.
            </Text>
          </View>
        </View>

        <View className="w-full py-4">
          <Button hasIcon={true} onPress={activeScanner}>
            <View className="w-full flex flex-row gap-x-4 items-center justify-center">
              <Svg
                xmlns="http://www.w3.org/2000/svg"
                width={15}
                height={15}
                viewBox="0 0 24 24"
                fill="#fff"
              >
                <Path d="M19 4h-.508l-2.184-2.832A3.023 3.023 0 0 0 13.932 0h-3.864a3.023 3.023 0 0 0-2.376 1.168L5.508 4H5a5.006 5.006 0 0 0-5 5v10a5.006 5.006 0 0 0 5 5h14a5.006 5.006 0 0 0 5-5V9a5.006 5.006 0 0 0-5-5ZM9.276 2.39a1.006 1.006 0 0 1 .792-.39h3.864a1.008 1.008 0 0 1 .792.39L15.966 4H8.034ZM22 19a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V9a3 3 0 0 1 3-3h14a3 3 0 0 1 3 3Z" />
                <Path d="M12 8a6 6 0 1 0 6 6 6.006 6.006 0 0 0-6-6Zm0 10a4 4 0 1 1 4-4 4 4 0 0 1-4 4Z" />
              </Svg>
              <Text className="text-base text-white font-semibold">
                Take Photo
              </Text>
            </View>
          </Button>
          <View className="my-3"></View>
          <Button
            onPress={() => sheetRef.current?.close()}
            bgColor="bg-slate-200"
            textColor="text-black"
          >
            Close
          </Button>
        </View>
      </View>
    </BottomSheet>
  );
};

export default QuickTipsBottomSheet;
