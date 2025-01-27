import NetInfo from "@react-native-community/netinfo";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState, useContext } from "react";
import { Alert, Image, View, Text } from "react-native";
import TaraLogo from "../assets/tara_icon.png";
import LottieView from "lottie-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../context/authContext";

const SplashScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [lablab,setlablab]  = useState("The community version")
   const { setUser } = useContext(AuthContext);

  useEffect(() => {

    let navigationTimer;

    const checkNetworkAndNavigate = async () => {
      try {
        // Check network status
        const networkState = await NetInfo.fetch();
        setIsConnected(networkState.isConnected);

        if (networkState.isConnected) {
          // If connected, set timer to navigate
          navigationTimer = setTimeout(() => {
            setIsLoading(false);
            navigation.replace("Main"); // Using replace instead of navigate
          }, 2000);
        } else {
          // If not connected, show alert and keep on splash screen
          setIsLoading(false);
          Alert.alert(
            "No Internet Connection",
            "Please check your internet connection and try again.",
            [
              {
                text: "Retry",
                onPress: () => checkNetworkAndNavigate(),
              },
            ]
          );
        }
      } catch (error) {
        console.error("Network check failed:", error);
        setIsLoading(false);
      }
    };

    //line greet
   const fetchLabel = async () =>{
    const userMe = await AsyncStorage.getItem("taraid");
    setUser((prevState) => ({
      ...prevState,
      userId: userMe,
    }));
    try {
      const value = await AsyncStorage.getItem("label");
      if (value !== null) {
        setlablab(value)
      }
    } catch (e) {
     //console.log("")
   }
  }




    // Start network subscription
    const unsubscribe = NetInfo.addEventListener((state) => {
      //console.log("Connection status:", state.isConnected);
      setIsConnected(state.isConnected);
    });

    // Initial check
    checkNetworkAndNavigate();
    fetchLabel();

    // Cleanup
    return () => {
      unsubscribe();
      if (navigationTimer) {
        clearTimeout(navigationTimer);
      }
    };
  }, [navigation]);

  return (
    <View className="w-full h-full relative bg-white">
      <StatusBar style="light" />
      <View className="w-full h-full py-16 flex justify-end items-center">
        {/* <Image source={TaraLogo} className="w-36 h-8" /> */}
          <LottieView
            source={require('../assets/animation/tara-speed.json')}
            autoPlay
            loop
            width={150}
            height={80}
          />
          <Text className="text-sm text-gray-700">{lablab}</Text>
      </View>
    </View>
  );
};




export default SplashScreen;
