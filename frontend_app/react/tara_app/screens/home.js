import * as Location from "expo-location";
import { StatusBar } from "expo-status-bar";
import LottieView from "lottie-react-native";
import React, { useContext, useEffect, useState } from "react";
import {
  Alert,
  Image,
  Linking,
  Pressable,
  Text,
  TouchableOpacity,
  View,
  Platform
} from "react-native";
import QRCodeStyled from "react-native-qrcode-styled";
import Svg, { Path } from "react-native-svg";
import TaraLogo from "../assets/tara_icon.png";
import BottomNavBar from "../components/BottomNavBar";
import Button from "../components/Button";
import ParagraphText from "../components/ParagraphText";
import { InviteGraphic, TaraPermission, TaraGate } from "../components/CustomGraphic";
import RateUsApp from "../components/RateUsApp";
import axios from 'axios';
import appJson from "../app.json";
const appVersion = appJson.expo.version;
import * as Notifications from "expo-notifications";
import {
  TaraCar,
  TaraGift,
  TaraMotor,
  TaraVan,
  TaraWalletIcon,
} from "../components/CustomIcon";
import { fetchUser,updateUser } from "../config/hooks";
import { AuthContext } from "../context/authContext";
import { DataContext } from "../context/dataContext";
import { GET_DATA_CONTROL_API,ADMIN_TOKEN } from "../config/constants";
import { useToast } from "../components/ToastNotify";
import { HelloVisitor } from "../components/Cards";

const HomeScreen = ({ navigation }) => {
  const [activeScanFriend, setActiveScanFriend] = useState(false);
  const [rewardsAvailable, SetRewards] = useState(true);
  const [activeRateUs, setActiveRateUs] = useState(false);
  const [locationPermission,setPermissionAsk] = useState(false);
  const [location, setLocation] = useState([]);
  const [controlData,setControlData] = useState([]);
  const [gate,setGate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { setUser,user } = useContext(AuthContext);
  const { data, setData } = useContext(DataContext);
  const [activaeBooking,setActiveBooking] = useState(false)
  const [pushToken,setPushToken] = useState(null)
const toast = useToast();

  
  const taraBook = (vehicle) => {
    navigation.navigate("booking", {
      track: user?.userId,
      wheels: vehicle,
      start: location,
    });
  };

  const OpenRewards = () => {
    navigation.navigate("webview", {
      track: user?.userId,
      url: `https://taranapo.com/rewards/?taraid=${user?.userId}`,
    });
  };

  const openQR = () => {
    navigation.navigate("qrcode", {
      mode: "STF",
    });
  };




const newUpdateAvailable = (v) =>{
  Alert.alert(
    'Update Available',
    `You're using old ${v} version. We have our latest ${appVersion} version. Explore new improved update.`,
    [
      {
        text: 'Later',
        type: 'cancel'
      },
      {
        text: 'Update',
        onPress: () => Linking.openURL("https://taranapo.com/download/"),
      }
      
    ],
  );
}


const goLogin = (page) =>{
  setUser((prevState) => ({
    ...prevState,
    userId: null,
    accessToken: null,
    history: page
  }));
}



 useEffect(() => {
  async function getCurrentLocation() {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setPermissionAsk(true);
      Alert.alert(
        'Permission Denied',
        'We cannot proceed performing our services without location access.',
        [
          {
            text: 'Close',
            type: 'cancel'
          }
        ],
      );
      return;
    }else{
      setPermissionAsk(false);
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });
    
    if(location.mocked){
      setPermissionAsk(false);
    }else{
      setLocation(location);
      getControl();
    }
    
  }

  async function getControl() {
    
    try {
      const response = await axios.get(
        GET_DATA_CONTROL_API,
        {
          params: {
            origin:location
          },
          headers: {
              'Auth': `Bearer ${user?.accessToken}`,
              'Content-Type': 'application/json',
            },
        }
      );
   
      if (response.data) {
          setControlData(response.data.data);
          const supportedLocations = response.data.data.supported_location;
          setGate(response.data.data.gate)
          if(location.coords){
          const { latitude, longitude } = location.coords;
          const isSupported = supportedLocations.some((location) => {
            return (
              latitude >= location.minLat &&
              latitude <= location.maxLat &&
              longitude >= location.minLng &&
              longitude <= location.maxLng
            );
          });

          if (!isSupported) {
            //not supported
            setGate(true)
          } 
          }

            if(Platform.OS == 'android'){
              if(response.data.data.version_app_android != appVersion){
                newUpdateAvailable(response.data.data.version_app_android);
              }
            }
           
            if(Platform.OS == 'ios'){
              if(response.data.data.version_app_ios != appVersion){
                newUpdateAvailable(response.data.data.version_app_ios);
              }
            }
           

      } else {
          
      }
    } catch (error) {
      console.error(error);
    }
  }


  //setup for push notifications
  setTimeout(async () => {
    registerForPushNotificationsAsync().then((token) => savePushToken(token));

    const notificationListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log("Notification received:", notification);
      }
    );

    const responseListener = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        console.log("Notification interacted with:", response);
      }
    );

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, 2000);

  const savePushToken = async (pt) =>{
    //toast("success", pt.data,user);
    const savingPush = await updateUser(user?.userId,"OSID",pt.data,user)
    const saveloc = `${location.coords.latitude},${coords.longitude}`;
    console.log("location:",saveloc)
    const savingLocation = await updateUser(user?.userId,"Location",saveloc)
    console.log("saving push:",savingPush)
  }

  getCurrentLocation();
}, [locationPermission,setGate,setLocation,user?.accessToken]);



  useEffect(() => {
    // fetching user data
    const getUser = async () => {
      
      try {
        setIsLoading(true);
        const res = await fetchUser(user?.userId,user);
        ///console.log(res)
        if (res.status === "success") {
          //console.log(res.data)
          setData((prevData) => ({
            ...prevData,
            user: res.data,
          }));

          setActiveBooking(res.data.ActiveBooking == 'N/A' ? false : true);
          setActiveRateUs(res.data.ReviewUs == 'N/A' ? false : true)
          //if active fetch rides details
          setGate(res.data.Status == 'Active' ? false : true)
          setIsLoading(false);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getUser();
  }, [user?.userId]);




  return (
    <View className="w-full h-full bg-white relative">
      <StatusBar style="dark" />
      <View className="w-full h-full p-6 ">
        <View className="w-full flex flex-row gap-x-3 items-center justify-between pt-10">
          <Image source={TaraLogo} className="w-36 h-full" />

          <View className="flex flex-row gap-x-3 items-center justify-between">
            <Pressable
              onPress={() => Linking.openURL("https://taranapo.com")}
              className="p-1 bg-slate-200 rounded-lg"
            >
              <Svg
                xmlns="http://www.w3.org/2000/svg"
                width={20}
                height={20}
                viewBox="0 0 24 24"
                fill="#374957"
              >
                <Path d="M12 0a12 12 0 1 0 12 12A12.013 12.013 0 0 0 12 0Zm10 12a9.938 9.938 0 0 1-1.662 5.508l-1.192-1.193a.5.5 0 0 1-.146-.353V15a3 3 0 0 0-3-3h-3a1 1 0 0 1-1-1v-.5a.5.5 0 0 1 .5-.5A2.5 2.5 0 0 0 15 7.5v-1a.5.5 0 0 1 .5-.5h1.379a2.516 2.516 0 0 0 1.767-.732l.377-.377A9.969 9.969 0 0 1 22 12Zm-19.951.963 3.158 3.158A2.978 2.978 0 0 0 7.329 17H10a1 1 0 0 1 1 1v3.949a10.016 10.016 0 0 1-8.951-8.986ZM13 21.949V18a3 3 0 0 0-3-3H7.329a1 1 0 0 1-.708-.293l-4.458-4.458A9.978 9.978 0 0 1 17.456 3.63l-.224.224a.507.507 0 0 1-.353.146H15.5A2.5 2.5 0 0 0 13 6.5v1a.5.5 0 0 1-.5.5 2.5 2.5 0 0 0-2.5 2.5v.5a3 3 0 0 0 3 3h3a1 1 0 0 1 1 1v.962a2.516 2.516 0 0 0 .732 1.767l1.337 1.337A9.971 9.971 0 0 1 13 21.949Z" />
              </Svg>
            </Pressable>
       
                {
                  rewardsAvailable || controlData.rewards ? (
                    <Pressable onPress={()=>OpenRewards()} className="pb-1.5 bg-white rounded-lg">
                <LottieView
                  source={require("../assets/animation/taragift.json")}
                  autoPlay
                  loop
                  width={40}
                  height={35}
                />
              </Pressable>
            ) : (
              <View className="pt-1.5 px-2 bg-white rounded-lg">
                <TaraGift size={24} />
              </View>
            )}
          </View>
        </View>

        {
          controlData.length == 0 && user.userId != 'visitor' ? (
            <View className="my-4 bg-gray-200 rounded-lg w-56 h-6"></View>
          ):(
            <ParagraphText
          padding="py-4 pr-16"
          fontSize="lg"
          align="left"
          textColor="text-neutral-700"
        >
          {controlData.greetings ?? 'Hello there visitors! Mostly you see our weather forecast here..'}
        </ParagraphText>
          )
        }

        <View>
          
        </View>

        <View
          className="w-full border-t border-x border-slate-100 p-3 shadow-md shadow-neutral-500 bg-white rounded-2xl 
        flex flex-row items-center justify-between"
        >
          <View className="flex flex-row gap-x-4 ">
            <View className="border border-slate-300 p-2 rounded-xl">
              <TaraWalletIcon color="#404040" size={35} />
            </View>

            <Pressable onPress={() => navigation.navigate("wallet")}>
              <Text className="text-lg font-semibold text-neutral-700">
                Wallet
              </Text>
              <View className="flex flex-row gap-x-1 items-center">
                {
                  isLoading && user.userId != 'visitor' ? (
                    <View className="bg-gray-200 rounded-lg w-10 h-6"></View>
                  ):(
                    <Text className="text-xl font-medium">
                  &#8369;{data?.user?.Wallet ?? 0}.00
                </Text>
                  )
                }
                <TouchableOpacity onPress={() => navigation.navigate("wallet")}>
                  <Svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={15}
                    height={15}
                    data-name="Layer 1"
                    viewBox="0 0 24 24"
                    fill="#3b82f6"
                  >
                    <Path d="M12 0a12 12 0 1 0 12 12A12.013 12.013 0 0 0 12 0zm4 13h-3v3a1 1 0 0 1-2 0v-3H8a1 1 0 0 1 0-2h3V8a1 1 0 0 1 2 0v3h3a1 1 0 0 1 0 2z" />
                  </Svg>
                </TouchableOpacity>
              </View>
            </Pressable>
          </View>

          <TouchableOpacity
            onPress={() => setActiveScanFriend(true)}
            className="p-2"
          >
            <Svg
              xmlns="http://www.w3.org/2000/svg"
              width={30}
              height={30}
              data-name="Layer 1"
              viewBox="0 0 24 24"
              fill="#3b82f6"
            >
              <Path d="M19 24h-1a1 1 0 0 1 0-2h1a3 3 0 0 0 3-3v-1a1 1 0 0 1 2 0v1a5.006 5.006 0 0 1-5 5zm5-18V5a5.006 5.006 0 0 0-5-5h-1a1 1 0 0 0 0 2h1a3 3 0 0 1 3 3v1a1 1 0 0 0 2 0zM7 23a1 1 0 0 0-1-1H5a3 3 0 0 1-3-3v-1a1 1 0 0 0-2 0v1a5.006 5.006 0 0 0 5 5h1a1 1 0 0 0 1-1zM2 6V5a3 3 0 0 1 3-3h1a1 1 0 0 0 0-2H5a5.006 5.006 0 0 0-5 5v1a1 1 0 0 0 2 0zm14 6a4 4 0 1 0-4 4 4 4 0 0 0 4-4z" />
            </Svg>
          </TouchableOpacity>
        </View>
        <View className="mt-4 w-full py-4">
          <Text className="text-lg font-medium text-neutral-800 py-2">
            Choose a ride
          </Text>

          <View className="w-full flex flex-row justify-between items-center py-2 px-4">
      

            {
              location.length == 0 || controlData.service_status1 == false ? (

            <Pressable onPress={()=>setPermissionAsk(true)} className="flex gap-y-1">
              <View className="opacity-50 flex justify-center items-center pt-2 w-20 h-20 bg-slate-200 rounded-full">
                <TaraMotor size="55" />
              </View>
              <Text className="text-base text-center text-gray-200">
                {controlData.service_name1 ?? 'TaraRide'}
              </Text>
            </Pressable>


              ):(


            <Pressable onPress={()=>taraBook(2)} className="flex gap-y-1">
              <View className="flex justify-center items-center pt-2 w-20 h-20 bg-slate-200 rounded-full">
                <TaraMotor size="55" />
              </View>
              <Text className="text-base text-center text-blue-500">
              {controlData.service_name1 ?? 'TaraRide'}
              </Text>
            </Pressable>

            )
            }



              {
                location.length == 0 || controlData.service_status2 == false ? (
                  <Pressable onPress={()=>setPermissionAsk(true)}>
                  <View className="opacity-50 flex justify-center items-center w-20 h-20 bg-slate-200 rounded-full">
                  <TaraCar size="65" />
                  </View>
                  <Text className="text-base text-center text-gray-200">
                  {controlData.service_name2 ?? 'TaraCar'}
                  </Text>
                </Pressable> 
                ):(
                      <Pressable onPress={()=>taraBook(4)} className="flex gap-y-1">
                            <View className="flex justify-center items-center w-20 h-20 bg-slate-200 rounded-full">
                            <TaraCar size="65" />
                            </View>
                            <Text className="text-base text-center text-blue-500">
                            {controlData.service_name2 ?? 'TaraCar'}
                            </Text>
                          </Pressable>

              )
              }
                

        {
          location.length == 0 || controlData.service_status3 == false ? (
            <Pressable onPress={()=>setPermissionAsk(true)}>
            <View className="opacity-50 flex justify-center items-center w-20 h-20 bg-slate-200 rounded-full">
            <TaraVan size="65" />
            </View>
            <Text className="text-base text-center text-gray-200">
            {controlData.service_name3 ?? 'TaraVan'}
            </Text>
          </Pressable>
          ):(

      <Pressable onPress={()=>taraBook(5)} className="flex gap-y-1">
              <View className="flex justify-center items-center w-20 h-20 bg-slate-200 rounded-full">
              <TaraVan size="65" />
              </View>
              <Text className="text-base text-center text-blue-500">
              {controlData.service_name3 ?? 'TaraVan'}
              </Text>
            </Pressable>

          )
          }
                


          </View>
        </View>

        <BottomNavBar access={user} />
      </View>
      {activaeBooking && <ExistingBooking />}

      {activeScanFriend && (
        <FriendsWithBenefits
          openQR={openQR}
          QR={data?.user?.UserID}
          close={() => setActiveScanFriend(false)}
        />
      )}
      {activeRateUs && <RateUsApp close={() => setActiveRateUs(false)} />}

      {locationPermission && ( <AllowLocationPrompt close={()=>setPermissionAsk(false)} />)}

      { gate && (<GatePrompt />)}
       
        {
          user?.userId == 'visitor' && (
            <View className="fixed bottom-[200px] p-4">
              <HelloVisitor uwu={goLogin} />
              </View>
          )
        }

    </View>
  );
};

const ExistingBooking = () => {
  return (
    <View
      className=" absolute bottom-36 left-6 right-6 p-4 shadow-md shadow-neutral-500 bg-blue-500 rounded-2xl 
        flex flex-row items-center justify-between"
    >
      <View className="flex flex-row gap-x-4 items-center ">
        <View className="bg-white rounded-xl p-2.5">
          <LottieView
            source={require("../assets/animation/tara.json")}
            autoPlay
            loop
            width={40}
            height={40}
          />
        </View>

        <View>
          <Text className="text-lg font-semibold text-white">
            Get ready to ride in!
          </Text>

          <View className="flex flex-row gap-x-1 items-center">
            <LottieView
              source={require("../assets/animation/clock.json")}
              autoPlay
              loop
              width={20}
              height={20}
            />
            <Text className="text-base text-slate-200">3mins</Text>
          </View>
        </View>
      </View>

      <View>
        <Svg
          xmlns="http://www.w3.org/2000/svg"
          width={30}
          height={30}
          viewBox="0 0 24 24"
          fill="#fff"
        >
          <Path d="m15.75 9.525-4.586-4.586a1.5 1.5 0 0 0-2.121 2.122l4.586 4.585a.5.5 0 0 1 0 .708l-4.586 4.585a1.5 1.5 0 0 0 2.121 2.122l4.586-4.586a3.505 3.505 0 0 0 0-4.95Z" />
        </Svg>
      </View>
    </View>
  );
};

const FriendsWithBenefits = ({ openQR, QR, close }) => {
  return (
    <View className="w-full h-full p-4 absolute bottom-0 bg-black/30 z-[100] ">
      <View
        className="w-full px-6 py-8 absolute bottom-10 left-4 rounded-3xl shadow-xl shadow-black  bg-white
      flex gap-y-4"
      >
        <Text className="text-center text-2xl font-bold">
          Friends with Benefits
        </Text>

        <View className="relative w-full flex justify-center items-center p-4">
          <InviteGraphic size={300} />
          <View className="absolute bottom-5">
            <QRCodeStyled
              data={QR}
              style={{ backgroundColor: "transparent" }}
              padding={10}
              pieceSize={4.5}
              pieceCornerType="rounded"
              color={"#020617"}
              pieceScale={1.02}
              pieceLiquidRadius={3}
              logo={{
                href: require("../assets/tara_app.png"),
                padding: 4,
                scale: 1,
                hidePieces: true,
              }}
              errorCorrectionLevel={"H"}
              innerEyesOptions={{
                borderRadius: 4,
                color: "#404040",
              }}
              outerEyesOptions={{
                borderRadius: 12,
                color: "#ffa114",
              }}
            />
          </View>
        </View>

        <ParagraphText
          align="center"
          fontSize="sm"
          textColor="text-neutral-700"
          padding="px-2"
        >
          Here’s your unique QR code! Anyone who scans it can get between
          &#8369;10 and &#8369;20, and you'll receive the same rewards too.
        </ParagraphText>

        <Text className="text-center text-base font-semibold text-neutral-700">
          OR
        </Text>

        <View className="w-full flex gap-y-4">
          <Button onPress={() => openQR()}>Scan a friend</Button>
          <Button
            onPress={close}
            bgColor="bg-slate-200"
            textColor="text-neutral-700"
          >
            Close
          </Button>
        </View>
      </View>
    </View>
  );
};

const AllowLocationPrompt = ({ close }) => {
  return (
    <View className="w-full h-full p-4 absolute bottom-0 bg-black/30 z-[100] ">
      <View
        className="w-full px-6 py-8 absolute bottom-10 left-4 rounded-3xl shadow-xl shadow-black  bg-white
      flex gap-y-4"
      >
        <View className="relative w-full flex justify-center items-center p-4">
          <TaraPermission size={200} />
        </View>

        <Text className="text-center text-2xl font-bold">
          Location Permission
        </Text>

        <ParagraphText
          align="center"
          fontSize="sm"
          textColor="text-neutral-700"
          padding="px-2"
        >
          We need your precise location for a better experience.
        </ParagraphText>

        <View className="w-full flex gap-y-4">
          <Button
            onPress={close}
            bgColor="bg-slate-200"
            textColor="text-neutral-700"
          >
            Close
          </Button>
        </View>
      </View>
    </View>
  );
};


const GatePrompt = () => {
  return (
    <View className="w-full h-full p-4 absolute bottom-0 bg-black/30 z-[100] ">
      <View
        className="w-full px-6 py-8 absolute bottom-10 left-4 rounded-3xl shadow-xl shadow-black  bg-white
      flex gap-y-4"
      >
       

        <View className="relative w-full flex justify-center items-center p-4">
          <TaraGate size={200} />
        </View>

        <Text className="text-center text-2xl font-bold">
          Not available right now
        </Text>

        <ParagraphText
          align="center"
          fontSize="sm"
          textColor="text-neutral-700"
          padding="px-2"
        >
          We are sorry but we are not currently available in your location..
        </ParagraphText>
      </View>
    </View>
  );
};





async function registerForPushNotificationsAsync() {
  let token;
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("petpew", {
      name: "petpew",
      sound: "petpew.mp3",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#beda31",
      audioAttributes: {
        usage: Notifications.AndroidAudioUsage.ALARM,
        contentType: Notifications.AndroidAudioContentType.SONIFICATION,
      },
    });
  }

  
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== "granted") {
    //failed
    return;
  }

  token = await Notifications.getExpoPushTokenAsync({
    projectId: "9666c06c-78e4-4768-baba-4035a03729fb",
  });
 
  return token;
}


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});


export default HomeScreen;
