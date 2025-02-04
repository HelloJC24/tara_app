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

export const validateInputType = (input) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regex for email validation
  const phoneRegex = /^\+?(\d{1,3})?[-.\s]?\(?\d{1,4}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/; // Regex for phone number validation

  if (emailRegex.test(input)) {
    return "email";
  } else if (phoneRegex.test(input)) {
    return "phone";
  } else {
    return "invalid";
  }
};

export const generateOTP = () => {
  const otp = Math.floor(10000 + Math.random() * 90000); // Generate a random 6-digit number
  return otp.toString(); // Convert to string to preserve leading zeros, if any
};



