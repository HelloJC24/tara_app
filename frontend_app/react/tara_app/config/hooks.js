import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { signInWithCustomToken} from "firebase/auth";
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
  ADMIN_TOKEN,
  CORRECTOR,
  EMAILOTP,
  SMSOTP,
  DECRYPT_API,
  GET_SETTINGS_API,
  CREATE_SETTINGS_API,
  GENERATE_PUBLIC_TOKEN,
  UPDATE_SETTINGS,
  REFERRAL_API,
  PAYMENT_HISTORY,
  TRANSFER_AMOUNT
} from "./constants";
import { auth, db } from "./firebase-config";
import { validateInputType } from "./functions";

export const generatePublicToken = async()=>{
  //detect location storage
  try {
    const callcheck= await axios.get(GENERATE_PUBLIC_TOKEN,{
      headers:{
        Key:ADMIN_TOKEN
      }
    });
    if(callcheck.data.status == 'ok'){
      console.log('successfully generated public token',callcheck.data.bearer_id_token.length)
    }
    return callcheck.data.bearer_id_token;
  
  } catch (error) {
    console.log(error)
  }
}


// header config for token authorization
const config = async (user) => {
  return {
    headers: { Auth: user?.accessToken || await generatePublicToken() }, // Use token from user context
  };
};

export const hookConf = async (user) =>{
  const token = await config(user);
  return token.headers.Auth;
}

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
export const createAccount = async (username,deviceId) => {
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
      saveidToken(idToken)
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
      msg:error.code
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

export const fetchUser = async (userId,user) => {
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

export const updateUser = async (userId, target_column, value,user) => {
  try {
    const newData = {
      UserID: userId,
      target_columns: {
        [target_column]: value,
      },
    };
    //console.log(newData);
    const res = await axios.post(`${UPDATE_USER_API}`, newData,
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

export const fetchHistory = async (userId, starting_date, end_date,user) => {
  try {
    // const res = await axios.get(
    //   `${GET_HISTORY_API}?UserID=${userId}&starting_date=${starting_date}&end_date=${end_date}`,
    //   await config()
    // );

    const res = await axios.get(
      `${GET_HISTORY_API}?UserID=Uf9df5b&starting_date=2025-01-01&end_date=2025-01-31`,
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

export const userNameAgent = async (username,newusername,user) => {
  try {
    const response = await axios.get(CORRECTOR,{
      headers: {
        Auth: await generatePublicToken(),
      },
      params: {
        new:newusername,
        old:username
      },
    })
    
    return response.data;

  }catch(e){
    console.log(e)
  }
}

export const checkUserAccount = async (input) =>{
var paramtype = 'UserID'
const checktype = validateInputType(input)
if(checktype == 'phone'){
  paramtype = 'Phone'
}else if(checktype == 'email'){
  paramtype = 'Email'
}


try {
  const callcheck= await axios.get(`${GET_USER_API}?${paramtype}=${input}`,{
    headers: {
      Auth: await generatePublicToken(),
    }
  });

 // console.log(callcheck.data)
  return callcheck.data;

} catch (error) {
  console.log(error)
}
}

export const sendOTPAccount = async (input,otp) =>{
  var kindparams = `${EMAILOTP}?email=${input}&code=${otp}`
  const checktype = validateInputType(input)
  if(checktype == 'phone'){
    kindparams = `${SMSOTP}?phone=${input}&otp=${otp}`
  }
  
  try {
    const callcheck= await axios.get(kindparams,{
      headers: {
        Auth: await generatePublicToken(),
      }
    });
  
    return callcheck.data;
  
  } catch (error) {
    console.log(error)
  }
  }
  

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

export const confirmOTPProcess = async (taraid,otp) => {
  console.log("user",taraid,otp)
  const userInfo = await fetchUser(taraid);
  const eotp = userInfo.data.OTP;
  try {
    const resdec = await axios.get(`${DECRYPT_API}?decrypt=${eotp}`,{
      headers: {
        Auth: await generatePublicToken(),
      }
    })
    
    if(resdec.data.value == otp){
      //update
      const update_respnse = await updateUser(taraid,"OTP","");
      //sign in
      //console.log("response from update",update_respnse.message)
      signInWithCustomToken(auth, update_respnse.message)
      .then((userCredential) => {
          // User is signed in
          //console.log("User signed in:", userCredential.user);
          saveDevice("true");
          savedTaraUser(taraid)
      })
      .then((idToken) => {
        saveidToken(idToken)
      })
      .catch((error) => {
          console.error("Error signing in:", error.code, error.message);
      });




    }else{
      return {
        status: "error",
        msg: "One Time Password is incorrect."
      }
    }
   

  } catch (error) {
    console.log(error)
  }
  return userInfo;
}

export const getUserSettings = async(userID,user)=>{
  try {
    const callcheck= await axios.get(`${GET_SETTINGS_API}?UserID=${userID}`,
      await config(user)
    );
    return callcheck.data;
  
  } catch (error) {
    console.log(error)
  }
  }

export const createSettings = async(userID,user)=>{
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
        marketing:true
    };
  
    // Send user data to external API
    const res = await axios.post(CREATE_SETTINGS_API, user_settings,
      await config(user)
    );

    return res.data;
    
  }catch(e){

  }
}

export const updateSettings = async (userId,target_column,value,user)=>{

//check
const sets = await getUserSettings(userId,user);
if(sets.message == 'No settings found for the provided UserID or TaraID.'){
//create
console.log("creating a settings")
const weeh = await createSettings(userId,user);
if(weeh.message != 'Settings created successfully.'){
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
    const res = await axios.post(`${UPDATE_SETTINGS}`, newData,
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
}

export const referAFriend = async(userID,friend,user) =>{
  console.log(userID,friend)
  try {
    const callcheck= await axios.get(`${REFERRAL_API}?referrer=${userID}&friend=${friend}`,
      await config(user)
    );

    console.log(callcheck.data)
    return callcheck.data;
  
  } catch (error) {
    console.log(error)
  }
}


export const getPaymentHistory = async (userID,start,user) =>{
  try {
    const callcheck= await axios.get(`${PAYMENT_HISTORY}?user_id=${userID}&start_date=${start}`,
      await config(user)
    );
    return callcheck.data;
  
  } catch (error) {
    console.log(error)
  }
}


export const sendTransfer2Friend = async (userID,friend,amount,user) =>{
  try {
    const callcheck= await axios.get(`${TRANSFER_AMOUNT}?userid=${userID}&friend=${friend}&amount=${amount}`,
      await config(user)
    );
    return callcheck.data;
  
  } catch (error) {
    console.log(error)
  }
}
