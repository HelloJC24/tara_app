import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

// header config for token authorization
const config = async () => {
  const token = await AsyncStorage.getItem("accessToken");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
};

// Scan id to get the username
export const scanID = async (imgUrl) => {
  try {
    // Create axios request with timeout
    const res = await axios.post(
      `https://onthewaypo.com/OTW/xcanner/id/?url=https://images.summitmedia-digital.com/topgear/images/2023/07/25/lto-license-cards-1-1690279045.jpeg`
    );

    console.log("ID Scanned: ", res.data);

    const name = res.data?.name;
    // First, safely check if name exists and is a string
    const isValidName = (name) => {
      return typeof name === "string" && name.trim().length > 6;
    };

    if (!name || !isValidName(name)) {
      const data = {
        ...res.data,
        status: "error",
        name: null,
      };
      return {
        data,
      };
    }

    return {
      status: "success",
      data: res.data,
    };
  } catch (error) {
    console.error(error);

    return {
      status: "error",
      message: error.message,
    };
  }
};
