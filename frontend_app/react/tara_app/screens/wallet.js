import BottomSheet from "@devvie/bottom-sheet";
import { StatusBar } from "expo-status-bar";
import React, { useContext, useRef, useState,useEffect } from "react";
import {
  FlatList,
  I18nManager,
  Linking,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  TouchableWithoutFeedback,
  Keyboard
} from "react-native";
import QRCodeStyled from "react-native-qrcode-styled";
import Svg, { Path, Rect } from "react-native-svg";
import Button from "../components/Button";
import {
  GCashIcon,
  MayaIcon,
  TaraBank,
  TaraBlackQR,
  TaraCard,
  TaraCoupon,
  TaraLogo,
  TaraWalletIcon,
} from "../components/CustomIcon";
import ParagraphText from "../components/ParagraphText";
import ReportProblemScreen from "../components/ReportContainer";
import { DataContext } from "../context/dataContext";
import { getUserSettings,createSettings,updateSettings,checkUserAccount } from "../config/hooks";
import { AuthContext } from "../context/authContext";
import { TaraEmpty } from "../components/CustomGraphic";
import { useToast } from "../components/ToastNotify";


const WalletScreen = ({  navigation}) => {
  const [activeTopup, setActiveTopup] = useState(false);
  const [activeSendOrTransfer, setActiveSendOrTransfer] = useState(false);
  const [help, setHelp] = useState(false);
  const { data, setData } = useContext(DataContext);
  const { user } = useContext(AuthContext);
  const [defaulPay,setDefaultPay] = useState(false);
  const [repfriend,setRep] = useState(null)
  const toast = useToast();
  

  // useEffect(()=>{
  //   setRep(data.friend ?? null);
  //   setActiveSendOrTransfer(true)
  // },[data,setData])
 

  const LiveReport = () => {
    navigation.navigate("webview", {
      track: "user",
      url: "https://taranapo.com/report/",
    });
  };

  const openQR = () => {
    navigation.navigate("qrcode", {
      mode: "STR"
    });
  };


  useEffect(()=>{
    const pullSettings = async () =>{
      console.log("pulling settings")
      const sets = await getUserSettings(data?.user?.UserID,user);
      if(sets.message == 'No settings found for the provided UserID or TaraID.'){
        //create
        //console.log("creating a settings")
        //const weeh = await createSettings(data?.user?.UserID,user);
      }else{
        //load settings
        console.log("default:",sets.data[0].PaymentType)
        if(sets.data[0].PaymentType == 'wallet'){
          setDefaultPay(true)
        }
      }
    }
    pullSettings();
  },[data,user])


  const setdefualtPaymentMethod = async (mode) =>{
    await updateSettings(data?.user?.UserID,"PaymentType",mode,user)
    toast("success", "Payment method updated.");
  }

  const [walletTransactions, setWalletTransaction] = useState([])
  //   {
  //     id: "1",
  //     type: "ride",
  //     bookingId: "T-AR65ASD54",
  //     amount: "28.00",
  //   },
  //   {
  //     id: "2",
  //     type: "ride",
  //     bookingId: "T-AR65ASD54",
  //     amount: "28.00",
  //   },
  //   {
  //     id: "3",
  //     type: "ride",
  //     bookingId: "T-AR65ASD54",
  //     amount: "28.00",
  //   },
  //   {
  //     id: "4",
  //     type: "credit",
  //     bookingId: "T-AR65ASD54",
  //     amount: "8.00",
  //   },
  //   {
  //     id: "5",
  //     type: "ride",
  //     bookingId: "T-AR65ASD54",
  //     amount: "28.00",
  //   },
  //   {
  //     id: "6",
  //     type: "ride",
  //     bookingId: "T-AR65ASD54",
  //     amount: "28.00",
  //   },
  //   {
  //     id: "7",
  //     type: "ride",
  //     bookingId: "T-AR65ASD54",
  //     amount: "28.00",
  //   },
  //   {
  //     id: "8",
  //     type: "credit",
  //     bookingId: "T-AR65ASD54",
  //     amount: "28.00",
  //   },
  //   {
  //     id: "9",
  //     type: "ride",
  //     bookingId: "T-AR65ASD54",
  //     amount: "28.00",
  //   },
  //   {
  //     id: "10",
  //     type: "ride",
  //     bookingId: "T-AR65ASD54",
  //     amount: "28.00",
  //   },
  //   {
  //     id: "11",
  //     type: "ride",
  //     bookingId: "T-AR65ASD54",
  //     amount: "28.00",
  //   },
  //   {
  //     id: "12",
  //     type: "ride",
  //     bookingId: "T-AR65ASD54",
  //     amount: "28.00",
  //   },
  //   {
  //     id: "13",
  //     type: "credit",
  //     bookingId: "T-AR65ASD54",
  //     amount: "19.00",
  //   },
  // ]);

  return (
    <View className="w-full h-full bg-white relative">
      <StatusBar style="dark" />
      <View className=" px-6 pt-10  border-b-[10px] border-slate-200">
        <View className="w-full flex flex-row gap-x-3 items-center justify-between py-2">
          <Pressable onPress={() => navigation.goBack()}>
            <Svg
              xmlns="http://www.w3.org/2000/svg"
              width={30}
              height={30}
              viewBox="0 0 24 24"
              fill="#374957"
            >
              <Path d="M19 11H9l3.29-3.29a1 1 0 0 0 0-1.42 1 1 0 0 0-1.41 0l-4.29 4.3A2 2 0 0 0 6 12a2 2 0 0 0 .59 1.4l4.29 4.3a1 1 0 1 0 1.41-1.42L9 13h10a1 1 0 0 0 0-2Z" />
            </Svg>
          </Pressable>
          <Pressable
            onPress={() => setHelp(true)}
            className="p-1 bg-slate-200 rounded-lg"
          >
            <Svg
              xmlns="http://www.w3.org/2000/svg"
              width={20}
              height={20}
              viewBox="0 0 24 24"
              fill="#374957"
            >
              <Path d="M12 0a12 12 0 1 0 12 12A12.013 12.013 0 0 0 12 0Zm0 22a10 10 0 1 1 10-10 10.011 10.011 0 0 1-10 10Z" />
              <Path d="M12.717 5.063A4 4 0 0 0 8 9a1 1 0 0 0 2 0 2 2 0 0 1 2.371-1.967 2.024 2.024 0 0 1 1.6 1.595 2 2 0 0 1-1 2.125A3.954 3.954 0 0 0 11 14.257V15a1 1 0 0 0 2 0v-.743a1.982 1.982 0 0 1 .93-1.752 4 4 0 0 0-1.213-7.442Z" />
              <Rect width={2} height={2} x={11} y={17} rx={1} />
            </Svg>
          </Pressable>
        </View>

        <View className="">
          <View
            className="w-full border border-slate-300 p-6 bg-white rounded-2xl 
        flex flex-row items-center justify-between"
          >
            <View className="">
              <TaraLogo size={50} />
            </View>

            <View>
              <Text className="text-2xl font-bold text-center">
                &#8369; {data?.user?.Wallet}.00
              </Text>
              <Text className="text-base font-normal text-center">
                Available balance
              </Text>
            </View>

            <View></View>
          </View>

          <View className="w-full px-2">
            <View className="w-full py-4 flex flex-row gap-x-4 items-center justify-between">
              <TouchableOpacity
                onPress={() => setActiveTopup(true)}
                className="flex-1 bg-slate-100 p-3 rounded-xl flex gap-x-4 flex-row items-center justify-center"
              >
                <Svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={20}
                  height={20}
                  data-name="Layer 1"
                  viewBox="0 0 24 24"
                  fill="#3b82f6"
                >
                  <Path d="M12 0a12 12 0 1 0 12 12A12.013 12.013 0 0 0 12 0zm0 22a10 10 0 1 1 10-10 10.011 10.011 0 0 1-10 10zm5-10a1 1 0 0 1-1 1h-3v3a1 1 0 0 1-2 0v-3H8a1 1 0 0 1 0-2h3V8a1 1 0 0 1 2 0v3h3a1 1 0 0 1 1 1z" />
                </Svg>

                <Text className="text-base text-blue-500">Top Up</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setActiveSendOrTransfer(true)}
                className="flex-1 bg-slate-100 p-3 rounded-xl flex gap-x-4 flex-row items-center justify-center"
              >
                <Svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={20}
                  height={20}
                  viewBox="0 0 24 24"
                  fill="#3b82f6"
                >
                  <Path d="M23.119.882a2.966 2.966 0 0 0-2.8-.8l-16 3.37a4.995 4.995 0 0 0-2.853 8.481l1.718 1.717a1 1 0 0 1 .293.708v3.168a2.965 2.965 0 0 0 .3 1.285l-.008.007.026.026A3 3 0 0 0 5.157 20.2l.026.026.007-.008a2.965 2.965 0 0 0 1.285.3h3.168a1 1 0 0 1 .707.292l1.717 1.717A4.963 4.963 0 0 0 15.587 24a5.049 5.049 0 0 0 1.605-.264 4.933 4.933 0 0 0 3.344-3.986l3.375-16.035a2.975 2.975 0 0 0-.792-2.833ZM4.6 12.238l-1.719-1.717a2.94 2.94 0 0 1-.722-3.074 2.978 2.978 0 0 1 2.5-2.026L20.5 2.086 5.475 17.113v-2.755a2.978 2.978 0 0 0-.875-2.12Zm13.971 7.17a3 3 0 0 1-5.089 1.712l-1.72-1.72a2.978 2.978 0 0 0-2.119-.878H6.888L21.915 3.5Z" />
                </Svg>

                <Text className="text-base text-blue-500">Send/Transfer</Text>
              </TouchableOpacity>
            </View>

            <View className="w-full flex flex-row gap-x-4 items-center justify-between py-4">
              <Text className="text-base">Set as default payment method</Text>

              <ToggleButton upd={setDefaultPay} state={defaulPay} change={setdefualtPaymentMethod} />
            </View>
          </View>
        </View>
      </View>

      <View className="w-full p-6">
        <Text className="font-bold text-2xl text-neutral-700">
          Wallet transactions
        </Text>

      {
        walletTransactions.length == 0 ? (
          <View className="h-full flex-row justify-center items-start">
                <View className="mt-20">
                <TaraEmpty size={150} />
                <Text className="text-center mt-4 text-gray-400">aww nothing here..</Text>
                </View>
                </View>
        ):(
          <FlatList
          className="mb-[350px]"
          data={walletTransactions}
          renderItem={({ item, index }) => (
            <TransactionItem
              key={item.id}
              bookingId={item.bookingId}
              amount={item.amount}
              type={item.type}
              navigation={navigation}
            />
          )}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
        />
        )
      }

     

        {/* <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 5 }}
        >
          <View className="">
            {walletTransactions.map(({ id, bookingId, amount }) => {
              return (
                <TransactionItem
                  key={id}
                  bookingId={bookingId}
                  amount={amount}
                />
              );
            })}
          </View>
        </ScrollView> */}
      </View>

      {activeTopup && (
        <TopupScreen
          navigation={navigation}
          close={() => setActiveTopup(false)}
        />
      )}
      {activeSendOrTransfer && (
        <SendOrTransferScreen
        realtiming={data}
          rep={repfriend}
          balance={data}
          openQR={openQR}
          close={() => setActiveSendOrTransfer(false)}
        />
      )}
      {help && (
        <ReportProblemScreen
          navigation={navigation}
          close={() => setHelp(false)}
        />
      )}
    </View>
  );
};

const TransactionItem = ({ navigation, bookingId, amount, type }) => {
  const OpenReceipt = (bi) => {
    navigation.navigate("webview", {
      track: "user",
      url: `https://taranapo.com/invoice/?id=${bi}`,
    });
  };

  return (
    <Pressable
      onPress={() => OpenReceipt(bookingId)}
      className="w-full border-b border-slate-200 flex flex-row gap-x-4 items-end justify-between py-4"
    >
      <View className="">
        <Text className="text-sm font-medium">Ride</Text>
        <Text className="text-base text-gray-500">Booking ID: {bookingId}</Text>
      </View>

      {type == "ride" ? (
        <Text className="font-bold text-base">-&#8369;{amount}</Text>
      ) : type == "credit" ? (
        <Text className="font-bold text-base text-green-500">
          +&#8369;{amount}
        </Text>
      ) : (
        <Text className="font-bold text-base">&#8369;{amount}</Text>
      )}
    </Pressable>
  );
};

const ToggleButton = ({upd,change, ...props}) => {
  const [isChecked, setIsChecked] = useState(false);

  useEffect(()=>{
  setIsChecked(props.state)
  },[props])


  const changeToggle = () =>{
    setIsChecked(!isChecked)
    if(isChecked){
      change("cash")
      upd(false)
    }else{
      change("wallet")
      upd(true)
    }
    
  }

  return (
    <View className="flex-row items-center">
      <Pressable
        onPress={() => changeToggle()}
        className={`relative w-14 h-8 rounded-full ${
          isChecked ? "bg-blue-500" : "bg-gray-200"
        }`}
      >
        <View
          className={`absolute top-[3px] ${
            isChecked
              ? I18nManager.isRTL
                ? "right-[2px]"
                : "left-[25px]"
              : "left-[4px]"
          } w-6 h-6 bg-white rounded-full transition-transform`}
        />
      </Pressable>
    </View>
  );
};

const PaymentMethods = ({ navigation, provider, status, endpoint, much }) => {
  const { data } = useContext(DataContext);
  const toast = useToast();

  const openPayment = (mop) => {

    if(!much){
       toast("error", "Please provide top up amount.");
       return
    }

    navigation.navigate("webview", {
      track: "payment",
      url: `https://taranapo.com/gateway/payments/${mop}/?taraid=${data?.user?.UserID}&amount=${much}`,
    });
  };

  return (
    <Pressable
      onPress={() => openPayment(endpoint)}
      className={`flex flex-row justify-between items-center gap-x-4 items-center border-b border-slate-200 py-4`}
    >
      <View className="flex-row justify-start items-center gap-x-2">
        <View>
          {provider == "gcash" ? (
            <GCashIcon size={30} />
          ) : provider == "maya" ? (
            <MayaIcon size={30} />
          ) : provider == "card" ? (
            <TaraCard size={28} />
          ) : provider == "bank" ? (
            <TaraBank size={28} />
          ) : provider == "coupon" ? (
            <TaraCoupon size={28} />
          ) : (
            <TaraLogo size={30} />
          )}
        </View>
        <View>
          <Text className="text-xl text-blue-500">{endpoint}</Text>
        </View>
      </View>
      {status ? (
        <View>
          <Svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <Path
              d="M15.3998 9.88006L10.8098 5.29006C10.6225 5.10381 10.369 4.99927 10.1048 4.99927C9.84065 4.99927 9.5872 5.10381 9.39983 5.29006C9.3061 5.38302 9.23171 5.49362 9.18094 5.61548C9.13017 5.73734 9.10403 5.86805 9.10403 6.00006C9.10403 6.13207 9.13017 6.26278 9.18094 6.38464C9.23171 6.5065 9.3061 6.6171 9.39983 6.71006L13.9998 11.2901C14.0936 11.383 14.168 11.4936 14.2187 11.6155C14.2695 11.7373 14.2956 11.868 14.2956 12.0001C14.2956 12.1321 14.2695 12.2628 14.2187 12.3846C14.168 12.5065 14.0936 12.6171 13.9998 12.7101L9.39983 17.2901C9.21153 17.477 9.10521 17.7312 9.10428 17.9965C9.10334 18.2619 9.20786 18.5168 9.39483 18.7051C9.58181 18.8934 9.83593 18.9997 10.1013 19.0006C10.3667 19.0016 10.6215 18.897 10.8098 18.7101L15.3998 14.1201C15.9616 13.5576 16.2772 12.7951 16.2772 12.0001C16.2772 11.2051 15.9616 10.4426 15.3998 9.88006Z"
              fill="#374957"
            />
          </Svg>
        </View>
      ) : (
        <View className="bg-slate-200 px-2 py-1.5 rounded-lg">
          <Text className="text-sm text-gray-700">Inactive</Text>
        </View>
      )}
    </Pressable>
  );
};

const TopupScreen = ({ navigation, close }) => {
  const [modeofPayments, selectModeofPayment] = useState([
    {
      id: "1",
      provider: "gcash",
      endpoint: "Gcash",
      status: true,
    },
    {
      id: "2",
      provider: "tarapay",
      endpoint: "Tara Pay",
      status: false,
    },
    {
      id: "3",
      provider: "card",
      endpoint: "Credit/Debit Card",
      status: true,
    },
    {
      id: "4",
      provider: "coupon",
      endpoint: "Coupon",
      status: true,
    },
    {
      id: "5",
      provider: "maya",
      endpoint: "Maya",
      status: true,
    },
    {
      id: "6",
      provider: "bank",
      endpoint: "Bank Transfer",
      status: true,
    },
  ]);

  const [amount, setAmount] = useState("");
  return (
    <View className="w-full h-screen bg-white absolute inset-0 z-50">
      <StatusBar style="dark" />
      <View className="h-full flex justify-between items-center px-6 py-10">
        <View>
          <View className="w-full flex flex-row gap-x-3 items-center justify-end py-2">
            <Pressable onPress={close}>
              <Svg
                xmlns="http://www.w3.org/2000/svg"
                width={30}
                height={30}
                viewBox="0 0 24 24"
                fill="#374957"
              >
                <Path d="M18 6a1 1 0 0 0-1.414 0L12 10.586 7.414 6A1 1 0 0 0 6 6a1 1 0 0 0 0 1.414L10.586 12 6 16.586A1 1 0 0 0 6 18a1 1 0 0 0 1.414 0L12 13.414 16.586 18A1 1 0 0 0 18 18a1 1 0 0 0 0-1.414L13.414 12 18 7.414A1 1 0 0 0 18 6Z" />
              </Svg>
            </Pressable>
          </View>

          <View className="py-4">
            <View className="w-full border border-slate-400 p-2 rounded-2xl flex flex-row gap-x-2 items-center">
              <View className="p-2">
                <TaraWalletIcon color="#404040" size={30} />
              </View>

              <TextInput
                className="font-medium flex-1 text-lg text-blue-500"
                value={amount}
                maxLength={4}
                onChangeText={setAmount}
                placeholder="Enter top-up amount"
                keyboardType="numeric"
              />
            </View>

            <View className="w-full py-4">
              <Text className="text-2xl font-semibold">Payment Methods</Text>
              <Text className="text-base">
                Top up with this available payments
              </Text>
            </View>

            <View>
              <FlatList
                data={modeofPayments}
                renderItem={({ item, index }) => (
                  <PaymentMethods
                    key={item.id}
                    provider={item.provider}
                    endpoint={item.endpoint}
                    status={item.status}
                    navigation={navigation}
                    much={amount}
                  />
                )}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
              />
            </View>
          </View>
        </View>

        <ParagraphText
          align="center"
          fontSize="sm"
          textColor="text-neutral-500"
        >
          By proceeding, you are confirming that all details are correct and
          understand our{" "}
          <Text className="text-blue-500 font-semibold">Refund Policy.</Text>
        </ParagraphText>
      </View>
    </View>
  );
};

const SendOrTransferScreen = ({realtiming,rep,balance, openQR, close }) => {
  const [amount, setAmount] = useState("");
  const [input, setInput] = useState(rep);
  const sheetRef = useRef(null);
  const [userMe, setUSERME] = useState(balance?.user?.UserID);
  const [allowed,setAllow] = useState(false)
  const toast = useToast();
  

  useEffect(()=>{
    setInput(realtiming.friend);
    sheetRef.current.close();
    if(balance?.user?.UserID == realtiming.friend){
      toast("try_again", "Sending to yourself? Why?");
      setAllow(false)
    }
  },[realtiming])

 
  const openCute = () =>{
    sheetRef.current.open()
    Keyboard.dismiss()
  }


  const checkBalance=(text)=>{
    setAmount(text)
    if(text == '0'){
      setAllow(false)
      return;
    }

    if(amount != '' && input != ''){
      setAllow(true)
    }

    if(parseInt(balance?.user?.Wallet) == parseInt(text)){
      toast("error", "Ops! You need to keep some balance.");
      setAllow(false)
    }

    if(parseInt(balance?.user?.Wallet) < parseInt(text)){
      toast("error", "Not enough wallet balance.");
      setAllow(false)
    }

   
  }


  const checkRep = async () =>{
    const cehckas = await checkUserAccount(input);
    if(cehckas.message == 'User found.'){
      setAllow(true)
      toast("success", "Account found. Ready for sending ..");
    }else{
      setAllow(false)
      toast("error", "No Tara account associated with this information was found.");
    }
  }



  return (
    <View className="w-full h-screen bg-white absolute inset-0 z-50">
      <StatusBar style="dark" />
      <TouchableWithoutFeedback onPress={()=>Keyboard.dismiss()}>
      <View>
      <View className=" border-b-[10px] border-slate-200">
        <View className="px-6 pt-10 ">
          <View className="w-full flex flex-row gap-x-3 items-center justify-end py-2">
            <Pressable onPress={close}>
              <Svg
                xmlns="http://www.w3.org/2000/svg"
                width={30}
                height={30}
                viewBox="0 0 24 24"
                fill="#374957"
              >
                <Path d="M18 6a1 1 0 0 0-1.414 0L12 10.586 7.414 6A1 1 0 0 0 6 6a1 1 0 0 0 0 1.414L10.586 12 6 16.586A1 1 0 0 0 6 18a1 1 0 0 0 1.414 0L12 13.414 16.586 18A1 1 0 0 0 18 18a1 1 0 0 0 0-1.414L13.414 12 18 7.414A1 1 0 0 0 18 6Z" />
              </Svg>
            </Pressable>
          </View>

          <View className="">
            <Text className="text-2xl font-semibold py-4">Send/Transfer</Text>

            <View className="w-full border border-slate-400 p-2 rounded-2xl flex flex-row gap-x-2 items-center">
              <View className="p-2">
                <TaraWalletIcon color="#404040" size={30} />
              </View>

              <TextInput
                className="font-medium flex-1 text-xl text-blue-500"
                value={amount}
                keyboardType="numeric"
                placeholder="Enter amount"
                maxLength={4}
                onChangeText={checkBalance}
              />
            </View>

            <Text className="text-sm py-4">
              Available Balance: (
              <Text className="font-bold">&#8369;{balance?.user?.Wallet}.00</Text>)
            </Text>
          </View>
        </View>
      </View>

      
      <View className="w-full px-6 py-4">
        <View className="flex-row justify-between items-center pb-4">
          <Text className="text-lg font-semibold w-48 ">Recipient: </Text>
          <TouchableOpacity onPress={() => openCute()}>
            <View className="flex-row justify-center items-center">
              <TaraBlackQR size={25} color="#404040" />
              <Svg
                xmlns="http://www.w3.org/2000/svg"
                width={28}
                height={28}
                viewBox="0 0 24 24"
                fill="#3b82f6"
              >
                <Path d="M15.4,9.88,10.81,5.29a1,1,0,0,0-1.41,0,1,1,0,0,0,0,1.42L14,11.29a1,1,0,0,1,0,1.42L9.4,17.29a1,1,0,0,0,1.41,1.42l4.59-4.59A3,3,0,0,0,15.4,9.88Z" />
              </Svg>
            </View>
          </TouchableOpacity>
        </View>

        <View className="w-full border border-slate-400 p-2 rounded-2xl flex flex-row gap-x-2 items-center">
          <View className="p-2">
            <TaraLogo size={40} />
          </View>
          <TextInput
            className="w-full text-lg text-blue-500"
            type="text"
            value={input}
            maxLength={30}
            onChangeText={setInput}
            onBlur={()=>checkRep()}
            placeholder="TaraID, Email or phone number"
          />
        </View>
        <ParagraphText
          fontSize="sm"
          textColor="text-neutral-700"
          padding="py-1"
        >
          Make sure they linked their phone number or email address.
        </ParagraphText>
      </View>
     

      <View className="w-full flex gap-y-4 px-6 py-10">
        <ParagraphText
          align="center"
          fontSize="sm"
          textColor="text-neutral-500"
          padding="px-4"
        >
          By clicking “Send”, you confirm that all details are correct and that
          you understand our{" "}
          <Text
            onPress={() =>
              Linking.openURL("https://taranapo.com/refund-policy/")
            }
            className="text-blue-500 font-semibold"
          >
            Refund Policy.
          </Text>
        </ParagraphText>
        {
          allowed ? (
          <Button>Send</Button>
          ):(
          <Button
           bgColor="bg-slate-200"
           textColor="text-white"
          >Send</Button>
          )
        }
        
      </View>
        </View>
        </TouchableWithoutFeedback>
      <BottomSheet
        animationType="false"
        ref={sheetRef}
        containerHeight={900}
        height={350}
        hideDragHandle={true}
        style={{ backgroundColor: "#fff", zIndex: 999 }}
      >
        <View className="p-4">
          <View className="py-2.5 flex-row justify-center items-center">
            <QRCodeStyled
              data={userMe}
              padding={10}
              pieceSize={5}
              pieceCornerType="rounded"
              color={"#020617"}
              pieceScale={1.02}
              pieceLiquidRadius={3}
              errorCorrectionLevel={"H"}
              innerEyesOptions={{
                borderRadius: 4,
                color: "#404040",
              }}
              outerEyesOptions={{
                borderRadius: 12,
                color: "#ffa114",
              }}
              logo={{
                href: require("../assets/tara_app.png"),
                padding: 4,
                scale: 0.8,
                hidePieces: true,
              }}
            />
          </View>
          <Text className="text-center text-sm px-6">
            This is your QR code. Share it with anyone who wants to send you a
            transfer.
          </Text>
          <Text className="text-center py-4 font-medium">OR</Text>
          <View>
            <Button onPress={() => openQR()}>Scan someone QR</Button>
            <Text className="text-center text-sm px-6 py-2 text-gray-500">
              Scan someone's QR code to make a transfer.
            </Text>
          </View>
        </View>
      </BottomSheet>
    </View>
  );
};

export default WalletScreen;
