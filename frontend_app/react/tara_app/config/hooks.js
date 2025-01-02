import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { setDoc } from "firebase/firestore";
import { db } from "./firebase-config";

// header config for token authorization
const config = async () => {
  const token = await AsyncStorage.getItem("accessToken");

  return {
    headers: {
      Authorization: `${token}`,
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

export const insertChat = async (chat) => {
  try {
    const msg = {
      id: new Date().getTime().toString(),
      senderId: chat.customerId,
      receiverId: chat.riderId,
      msg: chat.msg,
      datetime: chat.datetime,
      session: chat.session,
      seen: false,
      createdAt: serverTimestamp(),
    };

    const chatRef = await doc(
      db,
      `chats/${chat.senderId}/messages/${chat.receiverId}/conversations`,
      msg.id
    );
    const res = await setDoc(chatRef, msg);

    console.log(res);
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      message: error.message,
    };
  }
};

export const fetchConversations = async (senderId, receiverId) => {
  try {
    const chatRef = collection(
      db,
      `chats/${senderId}/messages/${receiverId}/conversations`
    );
    const q = query(chatRef, orderBy("createdAt", "asc"));

    return onSnapshot(q, (snapshots) => {
      const convo = snapshots.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      cb({
        status: "success",
        data: convo,
      });
    });
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      message: error.message,
    };
  }
};

export const fetchInboxMessages = async (senderId, cb) => {
  try {
    const chatRef = collection(db, `chats/${senderId}/messages`);
    const q = query(chatRef, orderBy("seen", false));

    return onSnapshot(q, (snapshots) => {
      const inboxMsg = snapshots.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      cb({
        status: "success",
        data: inboxMsg,
      });
    });
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      message: error.message,
    };
  }
};
