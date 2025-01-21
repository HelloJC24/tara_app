import { Platform } from "react-native";

// formatting date
export const formattedDate = (date = new Date()) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

// check Operating Systen used
export const OSID = () => {
  if (Platform.OS === "android") {
    return "Android";
  } else if (Platform.OS === "ios") {
    return "iOS";
  } else {
    return "Unknown";
  }
};
