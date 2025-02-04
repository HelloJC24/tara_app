import React from "react";
import { Text } from "react-native";

const ParagraphText = ({ padding, fontSize, align, textColor, children }) => {
  return (
    <Text
      className={` ${
        fontSize ? `text-${fontSize}` : "text-xs"
      } ${padding} ${textColor} text-${align}`}
    >
      {children}
    </Text>
  );
};

export default ParagraphText;
