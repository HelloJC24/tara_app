import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { createUserWithEmailAndPassword } from "firebase/auth";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  setDoc,
} from "firebase/firestore";
import {
  CREATE_USER_API,
  DELETE_IMG_API,
  GET_DATA_CONTROL_API,
  GET_HISTORY_API,
  GET_USER_API,
  SCAN_ID_API,
  UPDATE_USER_API,
  UPLOAD_IMG_API,
} from "./constants";
import { auth, db } from "./firebase-config";
import { formattedDate, OSID } from "./functions";

// header config for token authorization
const config = async () => {
  try {
    const token = await AsyncStorage.getItem("uid");
    console.log(token);
    return {
      headers: { Auth: "Bearer YJwfmxOL3Idl1YvjQtJ0GiUkNVd2" },
    };
  } catch (e) {}
};

// Upload image to firebase cloud storage
export const uploadImage = async (file) => {
  try {
    const res = await axios.post(`${UPLOAD_IMG_API}`, file, {
      headers: {
        Auth: "Bearer YJwfmxOL3Idl1YvjQtJ0GiUkNVd2",
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("Uploaded Image: ", res.data);
    return {
      status: res.data.status,
      message: res.data.message,
      url: res.data.file_url,
    };
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      message: error.message,
    };
  }
};

export const deleteInvalidImage = async (url) => {
  try {
    console.log("delete this image: ", url);

    const filename = url.split("/").pop();

    const data = {
      file_name: filename,
      action: "delete",
    };

    const res = await axios.post(`${DELETE_IMG_API}`, data, {
      headers: {
        Auth: "Bearer YJwfmxOL3Idl1YvjQtJ0GiUkNVd2",
      },
    });

    console.log("Delete image: ", res.data);
    if (res.data?.status === "success") {
      return {
        status: "success",
        message: "File deleted successfully",
      };
    }
  } catch (error) {
    console.error("This is the error: ", error);
    return {
      status: "error",
      message: error.message,
    };
  }
};

// Scan id to get the username
export const scanID = async (imgUrl) => {
  try {
    const res = await axios.get(`${SCAN_ID_API}?url=${imgUrl}`, {
      headers: {
        Auth: "Bearer YJwfmxOL3Idl1YvjQtJ0GiUkNVd2",
      },
    });

    console.log("ID Scanned: ", res.data);

    const name = res.data?.name;
    // First, safely check if name exists and is a string
    const isValidName = (name) => {
      return typeof name === "string";
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

export const createAccount = async (username) => {
  try {
    // Clean up username by converting to lowercase,  removing spaces and remove invalid characters
    const sanitizedUsername = username
      .toLowerCase()
      .replace(/\s+/g, "")
      .replace(/[^a-z0-9._-]/g, "");

    // Generate email and password
    const email = `${sanitizedUsername}@gmail.com`;
    const password = sanitizedUsername;

    // Create Firebase auth account
    const firebaseAuthRes = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const uid = await firebaseAuthRes.user.uid;

    const sessionToken = await firebaseAuthRes.user.getIdToken(true);

    const user = {
      Username: username,
      Phone: "",
      Wallet: "005.00",
      Cancel: false,
      Created: formattedDate(),
      OSID: OSID(),
      Status: "Active",
      Email: "",
      SRD: "",
      Location: "",
      Device: "Phone",
      ActiveBooking: 0,
      Assignee: "User",
      ReviewUs: false,
      Session: sessionToken,
    };

    // save uid to api headers for auth
    await AsyncStorage.setItem("uid", uid);

    // Send user data to external API
    const res = await axios.post(CREATE_USER_API, user, {
      headers: {
        Auth: "Bearer YJwfmxOL3Idl1YvjQtJ0GiUkNVd2",
      },
    });

    return {
      status: "success",
      data: res.data.data,
    };
  } catch (error) {
    console.log(error.code);
    return {
      status: "error",
      message: error.message,
    };
  }
};

export const fetchDataControl = async () => {
  try {
    const res = await axios.get(`${GET_DATA_CONTROL_API}`, await config());

    console.log("data control: ", res.data);
    return {
      status: "success",
      data: res.data.data,
    };
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      message: error.message,
    };
  }
};

export const fetchUser = async (userId) => {
  try {
    const res = await axios.get(
      `${GET_USER_API}?UserID=${userId}`,
      await config()
    );

    console.log("User: ", res.data);
    return {
      status: "success",
      data: res.data.data,
    };
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      message: error.message,
    };
  }
};

export const updateUser = async (userId, target_column, value) => {
  try {
    const newData = {
      UserID: userId,
      target_columns: {
        [target_column]: value,
      },
    };
    console.log(newData);
    const res = await axios.post(`${UPDATE_USER_API}`, newData, await config());
    console.log("updated user response: ", res.data);

    return {
      status: "success",
      message: res.data.message,
    };
  } catch (error) {
    console.error("Error updating username:", error);
    return {
      status: "error",
      message: error.message,
    };
  }
};

// Function to update email from firebase auth
// export const updateEmailAddress = async (newEmail) => {
//   try {
//     const verification = await sendEmailVerification(auth.currentUser);

//     console.log(verification);

//     const res = await updateEmail(auth.currentUser, newEmail);
//     console.log("update email: ", res);
//     console.log("Email updated successfully");
//   } catch (error) {
//     console.error("Error updating email:", error);
//   }
// };

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
      timestamp: serverTimestamp(),
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
    const q = query(chatRef, orderBy("timestamp", "asc"));

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
    const q = query(chatRef, orderBy("timestamp", "asc"));

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

export const fetchHistory = async (userId, starting_date, end_date) => {
  try {
    // const res = await axios.get(
    //   `${GET_HISTORY_API}?UserID=${userId}&starting_date=${starting_date}&end_date=${end_date}`,
    //   await config()
    // );

    const res = await axios.get(
      `${GET_HISTORY_API}?UserID=Uf9df5b&starting_date=2025-01-01&end_date=2025-01-31`,
      await config()
    );

    console.log("History: ", res.data);

    return {
      status: "success",
      data: res.data.data,
    };
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      message: error.message,
    };
  }
};
