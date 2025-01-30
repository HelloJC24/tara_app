import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { signInWithCustomToken } from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import moment from "moment";
import {
  ADMIN_TOKEN,
  CORRECTOR,
  CREATE_SETTINGS_API,
  CREATE_USER_API,
  DECRYPT_API,
  DELETE_IMG_API,
  EMAILOTP,
  GENERATE_PUBLIC_TOKEN,
  GET_DATA_CONTROL_API,
  GET_HISTORY_API,
  GET_SETTINGS_API,
  GET_USER_API,
  REFERRAL_API,
  SCAN_ID_API,
  SMSOTP,
  TRANSLATE_TEXT_API,
  UPDATE_SETTINGS,
  UPDATE_USER_API,
  UPLOAD_IMG_API,
} from "./constants";
import { auth, db } from "./firebase-config";
import { validateInputType } from "./functions";

export const generatePublicToken = async () => {
  //detect location storage
  try {
    const callcheck = await axios.get(GENERATE_PUBLIC_TOKEN, {
      headers: {
        Key: ADMIN_TOKEN,
      },
    });
    if (callcheck.data.status == "ok") {
      console.log(
        "successfully generated public token",
        callcheck.data.bearer_id_token.length
      );
    }
    return callcheck.data.bearer_id_token;
  } catch (error) {
    console.log(error);
  }
};

// header config for token authorization
const config = async (user) => {
  return {
    headers: { Auth: user?.accessToken || (await generatePublicToken()) }, // Use token from user context
  };
};

export const hookConf = async (user) => {
  const token = await config(user);
  return token.headers.Auth;
};

// Upload image to firebase cloud storage
export const uploadImage = async (file) => {
  try {
    const res = await axios.post(`${UPLOAD_IMG_API}`, file, {
      headers: {
        Auth: await generatePublicToken(),
        "Content-Type": "multipart/form-data",
      },
    });

    //console.log("Uploaded Image: ", res.data);
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
    //console.log("delete this image: ", url);

    const filename = url.split("/").pop();

    const data = {
      file_name: filename,
      action: "delete",
    };

    const res = await axios.post(`${DELETE_IMG_API}`, data, {
      headers: {
        Auth: await generatePublicToken(),
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
        Auth: await generatePublicToken(),
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

//saving to Firebase
export const createAccount = async (username, deviceId) => {
  try {
    const user = {
      Username: username,
      Phone: "N/A",
      Email: "N/A",
      Device: deviceId,
    };

    // Send user data to external API
    const res = await axios.post(CREATE_USER_API, user, {
      headers: {
        Auth: await generatePublicToken(),
      },
    });

    //logged
    //console.log(res.data)

    signInWithCustomToken(auth, res.data.Token)
      .then((userCredential) => {
        // User is signed in
        //console.log("User signed in:", userCredential.user);
      })
      .then((idToken) => {
        saveidToken(idToken);
      })
      .catch((error) => {
        //console.error("Error signing in:", error.code, error.message);
      });

    return {
      status: "success",
      data: res.data,
    };
  } catch (error) {
    console.log(error.code);
    return {
      status: "error",
      msg: error.code,
    };
  }
};

export const fetchDataControl = async () => {
  try {
    const res = await axios.get(`${GET_DATA_CONTROL_API}`, await config());

    //console.log("data control: ", res.data);
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

export const fetchUser = async (userId, user) => {
  try {
    const res = await axios.get(
      `${GET_USER_API}?UserID=${userId}`,
      await config(user)
    );

    //console.log("User: ", res.data);
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

export const updateUser = async (userId, target_column, value, user) => {
  try {
    const newData = {
      UserID: userId,
      target_columns: {
        [target_column]: value,
      },
    };
    //console.log(newData);
    const res = await axios.post(
      `${UPDATE_USER_API}`,
      newData,
      await config(user ?? null)
    );

    return {
      status: "success",
      message: res.data.message,
    };
  } catch (error) {
    console.error("Error updating data:", error);
    return {
      status: "error",
      message: error.message,
    };
  }
};

export const insertChat = async (senderId, receiverId, message) => {
  try {
    const conversationId = [senderId, receiverId].sort().join("_");

    const messageData = {
      senderId,
      receiverId,
      message: message,
      datetime: moment().format("YYYY-MM-DD HH:mm:ss"),
      seen: false,
      timestamp: serverTimestamp(),
    };

    const messagesRef = collection(db, `chats/${conversationId}/messages`);
    const messageDoc = await addDoc(messagesRef, messageData);
    const lastMessageId = messageDoc.id; // Extract the message ID

    const conversationRef = doc(db, "chats", conversationId);
    const inboxData = {
      participants: [senderId, receiverId],
      lastMessage: message,
      lastMessageId: lastMessageId,
      lastSenderId: senderId,
      status: "active",
      session: 86400,
      datetime: moment().format("YYYY-MM-DD HH:mm:ss"),
      timestamp: serverTimestamp(),
    };

    await setDoc(conversationRef, inboxData, { merge: true });
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      message: error.message,
    };
  }
};

export const fetchTypingStatus = async (conversationId, cb) => {
  try {
    const typingRef = collection(db, `chats/${conversationId}/typing`);

    return onSnapshot(typingRef, (snapshots) => {
      const typingStatus = {};
      snapshots.docs.forEach((doc) => {
        typingStatus[doc.id] = doc.data().isTyping;
      });

      cb({
        status: "success",
        data: typingStatus,
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

export const fetchSeenChatStatus = async (
  senderId,
  receiverId,
  lastMsgId,
  cb
) => {
  try {
    const conversationId = [senderId, receiverId].sort().join("_");
    const seenRef = doc(db, `chats/${conversationId}/messages`, lastMsgId);
    const q = query(seenRef, where("senderId", "==", senderId));
    return onSnapshot(q, async (snapshot) => {
      if (snapshot.exists()) {
        const docData = snapshot.data();

        cb({
          data: true,
        });
      }
    });
  } catch (err) {
    console.log(err);
  }
};

export const updateSeenStatus = async (conversationId, receiverId, msgId) => {
  try {
    const seenRef = doc(db, `chats/${conversationId}/messages`, msgId);
    onSnapshot(seenRef, async (snapshot) => {
      if (snapshot.exists() && snapshot.data().receiverId !== receiverId) {
        await updateDoc(seenRef, { seen: true });
      }
    });
  } catch (err) {
    console.log(err);
  }
};

export const updateTypingStatus = async (conversationId, senderId, status) => {
  try {
    const typingRef = doc(db, `chats/${conversationId}/typing`, senderId);
    await setDoc(typingRef, { isTyping: status });
  } catch (err) {
    console.log(err);
  }
};

export const fetchConversations = async (conversationId, cb) => {
  try {
    console.log("conversationId:", conversationId);
    const messagesRef = collection(db, `chats/${conversationId}/messages`);
    const q = query(messagesRef, orderBy("timestamp", "asc"));

    return onSnapshot(q, (snapshots) => {
      const convo = snapshots.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      console.log("chats: ", convo);

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
    const chatRef = collection(db, "chats");
    const q = query(
      chatRef,
      where("participants", "array-contains", senderId),
      orderBy("timestamp", "desc")
    );

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

export const translateText = async (text, user) => {
  try {
    const res = await axios.get(
      `${TRANSLATE_TEXT_API}?word=${text}`,
      await config(user)
    );

    console.log("translated text: ", res.data?.to);

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

export const fetchHistory = async (userId, starting_date, end_date, user) => {
  try {
    const res = await axios.get(
      `${GET_HISTORY_API}?UserID=${userId}&starting_date=${starting_date}&end_date=${end_date}`,
      await config(user)
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

export const userNameAgent = async (username, newusername, user) => {
  try {
    const response = await axios.get(CORRECTOR, {
      headers: {
        Auth: await generatePublicToken(),
      },
      params: {
        new: newusername,
        old: username,
      },
    });

    return response.data;
  } catch (e) {
    console.log(e);
  }
};

export const checkUserAccount = async (input) => {
  var paramtype = "UserID";
  const checktype = validateInputType(input);
  if (checktype == "phone") {
    paramtype = "Phone";
  } else if (checktype == "email") {
    paramtype = "Email";
  }

  try {
    const callcheck = await axios.get(`${GET_USER_API}?${paramtype}=${input}`, {
      headers: {
        Auth: await generatePublicToken(),
      },
    });

    // console.log(callcheck.data)
    return callcheck.data;
  } catch (error) {
    console.log(error);
  }
};

export const sendOTPAccount = async (input, otp) => {
  var kindparams = `${EMAILOTP}?email=${input}&code=${otp}`;
  const checktype = validateInputType(input);
  if (checktype == "phone") {
    kindparams = `${SMSOTP}?phone=${input}&otp=${otp}`;
  }

  try {
    const callcheck = await axios.get(kindparams, {
      headers: {
        Auth: await generatePublicToken(),
      },
    });

    return callcheck.data;
  } catch (error) {
    console.log(error);
  }
};

const saveidToken = async (value) => {
  try {
    await AsyncStorage.setItem("idToken", value);
  } catch (e) {
    // saving error
  }
};

const savedTaraUser = async (value) => {
  try {
    await AsyncStorage.setItem("taraid", value);
  } catch (e) {
    // saving error
  }
};

const saveDevice = async (value) => {
  try {
    await AsyncStorage.setItem("register", value);
  } catch (e) {
    // saving error
  }
};

export const confirmOTPProcess = async (taraid, otp) => {
  console.log("user", taraid, otp);
  const userInfo = await fetchUser(taraid);
  const eotp = userInfo.data.OTP;
  try {
    const resdec = await axios.get(`${DECRYPT_API}?decrypt=${eotp}`, {
      headers: {
        Auth: await generatePublicToken(),
      },
    });

    if (resdec.data.value == otp) {
      //update
      const update_respnse = await updateUser(taraid, "OTP", "");
      //sign in
      //console.log("response from update",update_respnse.message)
      signInWithCustomToken(auth, update_respnse.message)
        .then((userCredential) => {
          // User is signed in
          //console.log("User signed in:", userCredential.user);
          saveDevice("true");
          savedTaraUser(taraid);
        })
        .then((idToken) => {
          saveidToken(idToken);
        })
        .catch((error) => {
          console.error("Error signing in:", error.code, error.message);
        });
    } else {
      return {
        status: "error",
        msg: "One Time Password is incorrect.",
      };
    }
  } catch (error) {
    console.log(error);
  }
  return userInfo;
};

export const getUserSettings = async (userID, user) => {
  try {
    const callcheck = await axios.get(
      `${GET_SETTINGS_API}?UserID=${userID}`,
      await config(user)
    );
    return callcheck.data;
  } catch (error) {
    console.log(error);
  }
};

export const createSettings = async (userID, user) => {
  try {
    const user_settings = {
      UserID: userID,
      PaymentType: "wallet",
      AISuggestions: true,
      RateAfterDrop: true,
      Plan_auto_renew: "N/A",
      set_renew_date: "N/A",
      renew_payment_mode: "monthly",
      ui_mode: "light",
      autopickup: false,
      marketing: true,
    };

    // Send user data to external API
    const res = await axios.post(
      CREATE_SETTINGS_API,
      user_settings,
      await config(user)
    );

    return res.data;
  } catch (e) {}
};

export const updateSettings = async (userId, target_column, value, user) => {
  //check
  const sets = await getUserSettings(userId, user);
  if (sets.message == "No settings found for the provided UserID or TaraID.") {
    //create
    console.log("creating a settings");
    const weeh = await createSettings(userId, user);
    if (weeh.message != "Settings created successfully.") {
      return;
    }
  }
  try {
    const newData = {
      UserID: userId,
      target_columns: {
        [target_column]: value,
      },
    };
    //console.log(newData);
    const res = await axios.post(
      `${UPDATE_SETTINGS}`,
      newData,
      await config(user ?? null)
    );

    return {
      status: "success",
      message: res.data.message,
    };
  } catch (error) {
    console.error("Error updating settings:", error);
    return {
      status: "error",
      message: error.message,
    };
  }
};

export const referAFriend = async (userID, friend, user) => {
  console.log(userID, friend);
  try {
    const callcheck = await axios.get(
      `${REFERRAL_API}?referrer=${userID}&friend=${friend}`,
      await config(user)
    );

    console.log(callcheck.data);
    return callcheck.data;
  } catch (error) {
    console.log(error);
  }
};
