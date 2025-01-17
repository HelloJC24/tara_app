import React,{useEffect,useState} from "react";
import { View } from "react-native";
import NetInfo from '@react-native-community/netinfo';
import { useToast } from "../components/ToastNotify";

const StartPage = () => {

const toast = useToast();
   
//detect internet connection
const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    // Subscribe to network state changes
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
      if(state.isConnected == false){
        showToast();
      }
    });

    // Clean up the subscription on unmount
    return () => unsubscribe();
  }, []);



  
  
const showToast = () => {
toast("error", "No internet connection.");
};  

//detect mock location on
//detect not install in playstore
//detect not correct package name

    return (
        <>
        <View className="flex-row justify-center items-center h-screen w-screen bg-white">
          <View className="h-12 border-t-transparent w-12 border-blue-500 border-4 border-t-transparent animate-round rounded-full bg-white"></View>
        </View>
        </>
    )
}

export default StartPage;