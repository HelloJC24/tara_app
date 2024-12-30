import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

const Button = ({
  disabled,
  hasIcon,
  onPress,
  bgColor,
  textColor,
  fontSize,
  padding,
  radius,
  children,
}) => {
  
  if (hasIcon) {
    return (
      <TouchableOpacity
        disabled={disabled}
        onPress={onPress}
        activeOpacity={0.9}
        className={`w-full ${bgColor ? `${bgColor}` : "bg-blue-500"}  ${
          padding ? `${padding}` : "p-3"
        } ${radius ? `rounded-${radius}` : "rounded-2xl"} `}
      >
        <View className="flex flex-row gap-x-3 items-center justify-center">
          {children}
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      activeOpacity={0.9}
      className={`w-full ${bgColor ? `${bgColor}` : "bg-blue-500"}  ${
        padding ? `${padding}` : "p-3"
      } ${radius ? `rounded-${radius}` : "rounded-2xl"}`}
    >
      <Text
        className={`${textColor ?? "text-white"} ${
          fontSize ? `text-${fontSize}` : "text-base"
        } text-center font-semibold`}
      >
        {children}
      </Text>
    </TouchableOpacity>
  );
};

export default Button;
