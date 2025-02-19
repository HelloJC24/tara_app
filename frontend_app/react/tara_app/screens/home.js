import axios from "axios";
import * as Location from "expo-location";
import * as Notifications from "expo-notifications";
import { StatusBar } from "expo-status-bar";
import LottieView from "lottie-react-native";
import React, { useContext, useEffect, useState } from "react";
import {
  Alert,
  Image,
  Linking,
  Platform,
  Pressable,
  Text,
  TouchableOpacity,
  View,
  FlatList
} from "react-native";
import QRCodeStyled from "react-native-qrcode-styled";
import Svg, { Path } from "react-native-svg";
import TaraLogo from "../assets/tara_icon.png";
import BottomNavBar from "../components/BottomNavBar";
import Button from "../components/Button";
import { HelloVisitor } from "../components/Cards";
import {
  InviteGraphic,
  TaraGate,
  TaraPermission,
  TaraMock
} from "../components/CustomGraphic";
import {
  TaraCar,
  TaraGift,
  TaraMotor,
  TaraVan,
  TaraWalletIcon,
} from "../components/CustomIcon";
import ParagraphText from "../components/ParagraphText";
import RateUsApp from "../components/RateUsApp";
import { useToast } from "../components/ToastNotify";
import { GET_DATA_CONTROL_API } from "../config/constants";
import { fetchUser, updateUser,getBookingInfo } from "../config/hooks";
import { AuthContext } from "../context/authContext";
import { DataContext } from "../context/dataContext";
import appJson from "../app.json";
import { formatMoney } from "../config/functions";
import { BookingContext } from "../context/bookContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebase-config";
import * as Device from "expo-device";
import * as Application from "expo-application";




const HomeScreen = ({ navigation }) => {
  const [activeScanFriend, setActiveScanFriend] = useState(false);
  const [rewardsAvailable, setRewards] = useState(true);
  const [activeRateUs, setActiveRateUs] = useState(false);
  const [locationPermission, setPermissionAsk] = useState(false);
  const [location, setLocation] = useState([]);
  const [controlData, setControlData] = useState([]);
  const [gate, setGate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pushToken, setPushToken] = useState(null);
  const [cityba, setCityba] = useState(null);
  const [registeredDevice, setDevice] = useState(true);
  const [deviceId, setDeviceId] = useState(null);
  const [activeBooking, setActiveBooking] = useState([]);
  const { setUser, user } = useContext(AuthContext);
  const { data, setData } = useContext(DataContext);
  const { booking } = useContext(BookingContext);
  const toast = useToast();
  const appVersion = appJson.expo.version;
  
  
  //**Helper Functions**
  const taraBook = (vehicle) => {
    navigation.navigate("booking", {
      track: user?.userId,
      wheels: vehicle,
      start: location,
      city: cityba,
    });
  };
  
  const OpenRewards = () => {
    navigation.navigate("webview", {
      track: user?.userId,
      url: `https://taranapo.com/rewards/?taraid=${user?.userId}`,
    });
  };
  
  const openQR = () => {
    navigation.navigate("qrcode", { mode: "STF" });
  };
  
  const newUpdateAvailable = (version) => {
    Alert.alert(
      "Update Available",
      `You're using old ${version} version. We have our latest ${appVersion} version. Explore new improved update.`,
      [
        { text: "Later", type: "cancel" },
        { text: "Update", onPress: () => Linking.openURL("https://taranapo.com/download/") },
      ]
    );
  };
  
  const goLogin = (page) => {
    setUser((prev) => ({ ...prev, userId: null, accessToken: null, history: page }));
  };
  
  const LogoutMe = async () => {
    Alert.alert(
      "Friendly Reminder",
      "Logging out from all devices will also log you out of this one. Ensure your email or phone number are linked first.",
      [
        { text: "Cancel", type: "cancel" },
        {
          text: "Logout",
          onPress: async () => {
            try {
              await signOut(auth);
              await AsyncStorage.multiRemove(["register", "data", "uid", "accessToken", "idToken"]);
              showToast("success", "You have been logged out of this device.");
              setUser((prev) => ({ ...prev, accessToken: "" }));
            } catch (error) {
              console.error("Error logging out:", error);
            }
          },
        },
      ]
    );
  };
  
  const registerMe = async () => {
    setDevice(true);
    const response = await updateUser(user?.userId, "Device", deviceId ?? "expogo");
    response.status == 'success' && toast("success","Device registered")
  };
  
  //**Effect for Fetching Current Location & Control Data**
  useEffect(() => {
    const fetchLocationAndControl = async () => {

      // Get cached data first
      const cachedData = await AsyncStorage.getItem(`v_${appVersion}`);
      if (cachedData) {
      setControlData(JSON.parse(cachedData)); // Show cached data immediately
      }else{
       toast('success','Optimizing app speed to 20x perfomance for the next open.')
      }

  

      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setPermissionAsk(true);
        Alert.alert(
          "Permission Denied",
          "We cannot proceed performing our services without location access.",
          [{ text: "Close", type: "cancel" }]
        );
        return;
      }
  
      setPermissionAsk(false);
      const currentLocation = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      setLocation(currentLocation);

       
  
      try {
        const response = await axios.get(GET_DATA_CONTROL_API, {
          params: { origin: JSON.stringify(currentLocation) },
          headers: { Auth: `Bearer ${user?.accessToken}`, "Content-Type": "application/json" },
        });
  
        if (response.data) {
          setControlData(response.data.data);
          await AsyncStorage.setItem(`v_${appVersion}`, JSON.stringify(response.data.data)); // Cache it
          setGate(response.data.data.gate);
          setCityba(response.data.data.city);
  
          const supportedLocations = response.data.data.supported_location;
          const { latitude, longitude } = currentLocation.coords;
          const isSupported = supportedLocations.some(
            (loc) => latitude >= loc.minLat && latitude <= loc.maxLat && longitude >= loc.minLng && longitude <= loc.maxLng
          );
  
          if (!isSupported) setGate(true);
  
          const platformVersion = Platform.OS === "android" ? response.data.data.version_app_android : response.data.data.version_app_ios;
          if (platformVersion !== appVersion) newUpdateAvailable(platformVersion);
        }
      } catch (error) {
        console.error(error);
      }
    };
  
    fetchLocationAndControl();
  }, [locationPermission, user?.accessToken]);
  
  //**Effect for Push Notifications**
  useEffect(() => {
    const setupPushNotifications = async () => {
      const token = await registerForPushNotificationsAsync();
      if (token) {
        const pushba = await updateUser(user?.userId, "OSID", token.data);
        //setPushToken(pushba.status == 'success');
      }
  
      const notificationListener = Notifications.addNotificationReceivedListener((notification) =>
        console.log("Notification received:", notification)
      );
  
      const responseListener = Notifications.addNotificationResponseReceivedListener((response) =>
        console.log("Notification interacted with:", response)
      );
  
      return () => {
        Notifications.removeNotificationSubscription(notificationListener);
        Notifications.removeNotificationSubscription(responseListener);
      };
    };
  
    setTimeout(setupPushNotifications, 2000);
  }, []);
  
  //**Effect for Fetching User Data**
  useEffect(() => {

    const fetchUserData = async () => {

        // Get cached userdata first
        const cachedUser = await AsyncStorage.getItem(`user_${appVersion}`);
        if (cachedUser) {
        //setControlData(JSON.parse(cachedUser)); // Show cached data immediately
        setData((prev) => ({ ...prev, user: JSON.parse(cachedUser) }));
        }else{
        toast('success','Optimizing app speed to 20x perfomance for the next open.')
        }

      try {
        setIsLoading(true);
        const res = await fetchUser(user?.userId, user);
        if (res.status === "success") {
          setData((prev) => ({ ...prev, user: res.data }));
          


          //device check
          let id = null;
          if (Platform.OS === "android") {
            id = Application.getAndroidId();
          } else if (Platform.OS === "ios" && Application.getIosIdForVendorAsync) {
            id = await Application.getIosIdForVendorAsync();
          }
          setDeviceId(id)
          //console.log(res.data.Device,id)
          if (res.data.Device != id) setDevice(false);
          setActiveRateUs(res.data.ReviewUs !== "N/A");
          setGate(res.data.Status !== "Active");
          await AsyncStorage.setItem(`user_${appVersion}`, JSON.stringify(res.data)); // Cache it
        }
        setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
  
    fetchUserData();
  }, [user?.userId]);
  
  //**Effect for Fetching Active Bookings**
  useEffect(() => {
    const fetchActiveBookings = async () => {
      const res = await fetchUser(user?.userId, user);
      if (res.data?.ActiveBooking && res.data.ActiveBooking !== "N/A") {
        const bookingIds = res.data.ActiveBooking.split(",").filter((id) => id !== "N/A");
  
        if (bookingIds.length > 0) {
          const bookings = await Promise.all(bookingIds.map(async (id) => (id !== "N/A" ? getBookingInfo(id, user) : null)));
          setActiveBooking(bookings.map((res) => res?.data).filter(Boolean));
        }
      } else {
        setActiveBooking([]);
      }
    };
  
    fetchActiveBookings();
  }, [data]);
  


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

            {rewardsAvailable || controlData.rewards ? (
              <Pressable
                onPress={() => OpenRewards()}
                className="pb-1.5 bg-white rounded-lg"
              >
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

        {controlData.length == 0 && user.userId != "visitor" ? (
          <View className="my-4 bg-gray-200 rounded-lg w-56 h-6"></View>
        ) : (
          <Text className="my-5 px-2.5">
            {controlData.greetings ??
              "Hello there visitors! Mostly you see our weather forecast here.."}
          </Text>
        )}

        <View></View>

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
                {isLoading && user.userId != "visitor" ? (
                  <View className="bg-gray-200 rounded-lg w-10 h-6"></View>
                ) : (
                  <Text className="text-xl font-medium">
                    &#8369;{formatMoney(data?.user?.Wallet) ?? 0}.00
                  </Text>
                )}
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
            {location.length == 0 || controlData.service_status1 == false ? (
              <Pressable
                onPress={() => setPermissionAsk(true)}
                className="flex gap-y-1"
              >
                <View className="opacity-50 flex justify-center items-center pt-2 w-20 h-20 bg-slate-200 rounded-full">
                  <TaraMotor size="55" />
                </View>
                <Text className="text-base text-center text-gray-200">
                  {controlData.service_name1 ?? "TaraRide"}
                </Text>
              </Pressable>
            ) : (
              <Pressable onPress={() => taraBook(2)} className="flex gap-y-1">
                <View className="flex justify-center items-center pt-2 w-20 h-20 bg-slate-200 rounded-full">
                  <TaraMotor size="55" />
                </View>
                <Text className="text-base text-center text-blue-500">
                  {controlData.service_name1 ?? "TaraRide"}
                </Text>
              </Pressable>
            )}

            {location.length == 0 || controlData.service_status2 == false ? (
              <Pressable onPress={() => setPermissionAsk(true)}>
                <View className="opacity-50 flex justify-center items-center w-20 h-20 bg-slate-200 rounded-full">
                  <TaraCar size="65" />
                </View>
                <Text className="text-base text-center text-gray-200">
                  {controlData.service_name2 ?? "TaraCar"}
                </Text>
              </Pressable>
            ) : (
              <Pressable onPress={() => taraBook(4)} className="flex gap-y-1">
                <View className="flex justify-center items-center w-20 h-20 bg-slate-200 rounded-full">
                  <TaraCar size="65" />
                </View>
                <Text className="text-base text-center text-blue-500">
                  {controlData.service_name2 ?? "TaraCar"}
                </Text>
              </Pressable>
            )}

            {location.length == 0 || controlData.service_status3 == false ? (
              <Pressable onPress={() => setPermissionAsk(true)}>
                <View className="opacity-50 flex justify-center items-center w-20 h-20 bg-slate-200 rounded-full">
                  <TaraVan size="65" />
                </View>
                <Text className="text-base text-center text-gray-200">
                  {controlData.service_name3 ?? "TaraVan"}
                </Text>
              </Pressable>
            ) : (
              <Pressable onPress={() => taraBook(5)} className="flex gap-y-1">
                <View className="flex justify-center items-center w-20 h-20 bg-slate-200 rounded-full">
                  <TaraVan size="65" />
                </View>
                <Text className="text-base text-center text-blue-500">
                  {controlData.service_name3 ?? "TaraVan"}
                </Text>
              </Pressable>
            )}
          </View>
        </View>

        <BottomNavBar location={location} city={cityba} access={user} />
      </View>
      {activeBooking.length !=0 && <ExistingBooking origin={cityba} location={location} user={user} navigation={navigation}  bookingDetails={activeBooking} />}

      {activeScanFriend && (
        <FriendsWithBenefits
          openQR={openQR}
          QR={data?.user?.UserID}
          close={() => setActiveScanFriend(false)}
        />
      )}
      {activeRateUs && <RateUsApp close={() => setActiveRateUs(false)} />}

      {locationPermission && (
        <AllowLocationPrompt close={() => setPermissionAsk(false)} />
      )}

      {gate && <GatePrompt />}

      {user?.userId == "visitor" && (
        <View className="fixed bottom-[200px] p-4">
          <HelloVisitor uwu={goLogin} />
        </View>
      )}

      

      {!registeredDevice && <DevicePolicy thisdevice={registerMe} fuckoff={LogoutMe} />}

      {/* {booking?.status == 'searching' ||  activaeBooking && <SearchingBooking origin={cityba} location={location} user={user} navigation={navigation} />} */}
    </View>
  );
};

const ExistingBooking = ({bookingDetails,origin,location,user,navigation}) => {


  const taraBalik = (bid,mode) => {
    navigation.navigate("booking", {
      track: user?.userId,
      wheels: 2,
      start: location,
      city: origin,
      rule: mode,
      bookingID: bid
    });
  };


  return (
    <View
      className="absolute bottom-36 left-6 right-6"
    >

    <FlatList
              data={bookingDetails}
              renderItem={({ item, index }) => (
                <View>
          {
          item.Status == 'Pending' ? (
            <SearchingBooking id={item.BookingID} drop={item.Drop_Location} origin={origin} location={location} user={user} navigation={navigation} />
          ): item.Status == 'Assignee' || item.Status == 'Pickup' ? (
          <Pressable key={index} onPress={()=>taraBalik(item.BookingID,"Assignee")} className="mb-2 flex-row justify-between items-center  items-center bg-gray-100 border border-gray-200 p-2.5 rounded-2xl shadow-lg">
              <View className="items-center flex-row gap-x-4">
        <View className="border border-gray-200 bg-white rounded-xl p-2.5">
          <LottieView
            source={require("../assets/animation/tara.json")}
            autoPlay
            loop
            width={25}
            height={25}
          />
        </View>

        <View>
          <Text className="text-lg font-semibold text-gray-800">
            {item.Status == 'Pickup' ? 'Have a safe and enjoy the ride!' : 'Waiting for the driver..'}
          </Text>

          <View className="flex flex-row gap-x-1 items-center">
            <LottieView
              source={require("../assets/animation/tarawait.json")}
              autoPlay
              loop
              width={20}
              height={20}
            />
            <Text className="text-base font-mediym text-slate-500">{item.Drop_Location}</Text>
          </View>
        </View>

       
      </View>
      <View>
        <Svg
          xmlns="http://www.w3.org/2000/svg"
          width={22}
          height={22}
          viewBox="0 0 24 24"
          fill="#404040"
        >
          <Path d="m15.75 9.525-4.586-4.586a1.5 1.5 0 0 0-2.121 2.122l4.586 4.585a.5.5 0 0 1 0 .708l-4.586 4.585a1.5 1.5 0 0 0 2.121 2.122l4.586-4.586a3.505 3.505 0 0 0 0-4.95Z" />
        </Svg>
      </View>
            </Pressable> 
          
          ):(       
            <Pressable key={index} onPress={()=>taraBalik(item.BookingID,"checking")} className="mb-2 flex-row justify-between items-center  items-center bg-gray-100 border border-gray-200 p-2.5 rounded-2xl shadow-lg">
              <View className="items-center flex-row gap-x-4">
        <View className="border border-gray-200 bg-white rounded-xl p-2.5">
          <LottieView
            source={require("../assets/animation/tara.json")}
            autoPlay
            loop
            width={25}
            height={25}
          />
        </View>

        <View>
          <Text className="text-lg font-semibold text-gray-800">
            Driver is on the way..
          </Text>

          <View className="flex flex-row gap-x-1 items-center">
            <LottieView
              source={require("../assets/animation/tarawait.json")}
              autoPlay
              loop
              width={20}
              height={20}
            />
            <Text className="text-base  text-slate-700">Arrival in <Text className="font-bold text-base text-slate-700">{item.Time}</Text></Text>
          </View>
        </View>

       
      </View>
      <View>
        <Svg
          xmlns="http://www.w3.org/2000/svg"
          width={22}
          height={22}
          viewBox="0 0 24 24"
          fill="#404040"
        >
          <Path d="m15.75 9.525-4.586-4.586a1.5 1.5 0 0 0-2.121 2.122l4.586 4.585a.5.5 0 0 1 0 .708l-4.586 4.585a1.5 1.5 0 0 0 2.121 2.122l4.586-4.586a3.505 3.505 0 0 0 0-4.95Z" />
        </Svg>
      </View>
            </Pressable> 
          )
        }
     
      </View>
              )}
              keyExtractor={(item) => item.BookingID}
              showsVerticalScrollIndicator={false}
            />


   
    </View>
  );
};



const SearchingBooking = ({id,drop,origin,location,user,navigation}) => {

  const taraBalik = () => {
    navigation.navigate("booking", {
      track: user?.userId,
      wheels: 2,
      start: location,
      city: origin,
      rule: "checking",
      bookingID: id
    });
  };

  
  
  return (
    <Pressable
    key={id}
      onPress={()=>taraBalik()}
      className="mb-2 p-2.5 shadow-md shadow-neutral-500 bg-gray-100 border border-gray-200 rounded-2xl 
        flex flex-row items-center justify-between"
    >
      <View className="flex flex-row gap-x-4 items-center ">
        <View className="border border-gray-200 relative bg-gray-500 rounded-xl overflow-hidden w-12 h-12">
          <TaraMock size={100} />
        <View className="absolute top-0 bottom-0 left-0 right-0 mx-auto inset-1">
        <LottieView
            source={require("../assets/animation/tara_search.json")}
            autoPlay
            loop
            width={60}
            height={60}
          />
        </View>
        </View>

        <View>
          <Text className="text-gray-800 font-semibold">
            Searching for drivers..
          </Text>

          <View className="w-72 flex flex-row gap-x-1 items-center">
            <Text numberOfLines={1} ellipsizeMode="tail" className="text-sm text-slate-500">Going to {drop}</Text>
          </View>
        </View>
      </View>

      <View>
        <Svg
          xmlns="http://www.w3.org/2000/svg"
          width={22}
          height={22}
          viewBox="0 0 24 24"
          fill="#404040"
        >
          <Path d="m15.75 9.525-4.586-4.586a1.5 1.5 0 0 0-2.121 2.122l4.586 4.585a.5.5 0 0 1 0 .708l-4.586 4.585a1.5 1.5 0 0 0 2.121 2.122l4.586-4.586a3.505 3.505 0 0 0 0-4.95Z" />
        </Svg>
      </View>
    </Pressable>
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

const DevicePolicy = ({thisdevice,fuckoff}) => {
  return (
    <View className="w-full h-full p-4 absolute bottom-0 bg-black/30 z-[100] ">
      <View
        className="w-full px-6 py-8 absolute bottom-10 left-4 rounded-3xl shadow-xl shadow-black  bg-white
      flex gap-y-4"
      >


        <Text className="text-center text-md font-normal">
        Another device is currently logged in. Tara follows a one-device policy, allowing multiple bookings on a single device. There's no need to use another device. Would you like to continue on this device or log out from the other one?
        </Text>

        <Button
            onPress={thisdevice}
            bgColor="bg-blue-500"
            textColor="text-white"
          >
            Continue with this device
          </Button>

          <Button
            onPress={fuckoff}
            bgColor="bg-slate-200"
            textColor="text-neutral-700"
          >
            Log-out all devices
          </Button>

        
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
