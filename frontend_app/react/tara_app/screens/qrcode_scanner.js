import { CameraView, useCameraPermissions } from "expo-camera";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef, useState,useContext } from "react";
import { Image, Text, View, Animated, ActivityIndicator,Modal } from "react-native";
import AppIcon from "../assets/splash-icon.png";
import Button from "../components/Button";
import { SearchingGraphic,TaraCamPermission } from "../components/CustomGraphic";
import LottieView from 'lottie-react-native';
import ParagraphText from "../components/ParagraphText";
import { referAFriend } from "../config/hooks"
import { AuthContext } from "../context/authContext";
import { DataContext } from "../context/dataContext";
import { useToast } from "../components/ToastNotify";

const QrCodeScannerScreen = ({navigation,route}) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [imageUri, setImageUri] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRiderFound, setIsRiderFound] = useState(false);
  const cameraRef = useRef(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [qrData, setQrData] = useState(null);
  const [ScanStatus,setScanStatus] = useState("Looking for a QR..")
  const [cameraAnimate,setCamAnimate] = useState(false)
  const [scanMode,setScanMode] = useState('');
  const scaleValue = useRef(new Animated.Value(1)).current; 
  const toast = useToast();
   const { user,setUser } = useContext(AuthContext);
   const { data,setData } = useContext(DataContext);
  

  //STF - referral scan
  //STBR - scan rider
  //STR - scan to read payment
  //STB - scan booking

  useEffect(()=>{
    if(route.params){
    const {mode,bookingID} = route.params;
      setScanMode(mode)
    }

    if (!permission?.granted) {
      setHasPermission(true)
    }else{
      setHasPermission(false)
    }





  },[route.params,permission])





  // Zoom In Animation
  const zoomIn = () => {
    Animated.timing(scaleValue, {
      toValue: 1.5, // Zoom in to 1.5x size
      duration: 300, // Duration in milliseconds
      useNativeDriver: true, // Use native driver for better performance
    }).start();
  };

  // Zoom Out Animation
  const zoomOut = () => {
    Animated.timing(scaleValue, {
      toValue: 1, // Back to original size
      duration: 300,
      useNativeDriver: true,
    }).start();
  };


  const [hasScanned, setHasScanned] = useState(false);

  const handleBarCodeScanned = async (e) => {
    if (hasScanned) return;

    setHasScanned(true); // Prevent further scans
    const meme = user.userId;
    const { type, data } = e;
  

 
    if (type == 'qr') {
      setScanStatus("QR code found!");
      zoomIn();
      setCamAnimate(true);
      
  
      if (scanMode == 'STF') {
        if (!data.startsWith("U")) {
          setScanStatus("Not Tara QR");
          setTimeout(() => setScanStatus("Looking for Tara QR"), 2000);
          setHasScanned(false); 
          return;
        }
        setIsLoading(true);
        const refer_res = await referAFriend(meme, data, user);
        setIsLoading(false);
  
        if (refer_res.status === 0) {
          toast("try_again", refer_res.message);
        } else if (refer_res.status === 1) {
          toast("try_again", refer_res.message);
        } else {
          toast("error", "Something is wrong. Try again later.");
        }
  
        setScanStatus("Looking for QR");
        
      }else if(scanMode == 'STR'){
        if (!data.startsWith("U")) {
          setScanStatus("Not Tara QR");
          setTimeout(() => setScanStatus("Looking for your friend QR"), 2000);
          setHasScanned(false); 
          return;
        }
        setData((prevState) => ({
          ...prevState,
          friend: data,
        }));
        navigation.goBack();
      }else if(scanMode == 'STBR'){
        if (!data.startsWith("TARA")) {
          setScanStatus("Not rider QR");
          setTimeout(() => setScanStatus("Looking for Rider QR"), 2000);
          setHasScanned(false); 
          return;
        }

        setScanStatus("Found a rider!");
      
      }else{

      }
    } else {
      setScanStatus("Where is it? QR?");
      setCamAnimate(false);
      zoomOut();
      setIsLoading(false);
    }
  
    // Allow scanning again after some time
    setTimeout(() => setHasScanned(false), 2000); // Adjust delay as needed
  };
  



  return (
    <View className="w-full h-full absolute inset-0">
      <StatusBar style="light" />
      <CameraView
        ref={cameraRef}
        facing="back"
        autofocus={true}
        focusable={true}
        onCameraReady={() => {setScanStatus("Looking for a QR..")}}
        onBarcodeScanned={(e)=>handleBarCodeScanned(e)}
        className="w-full relative p-4"
      >
        <View
          className={`w-full h-full flex gap-y-10 justify-center items-center p-4 ${
            isRiderFound ? "bg-black/30" : ""
          }`}
        >
          <Text className="my-4 text-center text-3xl font-semibold text-white">
            {ScanStatus}
          </Text>
          <Animated.View
        style={[
          {
            transform: [{ scale: scaleValue }], // Apply scale transformation
          },
        ]}
      >

        {
          ScanStatus == 'Not Tara QR' || ScanStatus == 'Not rider QR' ? (
            <LottieView
            source={require("../assets/animation/notok.json")}
            autoPlay
            loop
            width={400}
            height={250}
          />
          ):(
          //   <View className={`${cameraAnimate ? 'w-[250px] h-[250px]' : 'w-[320px] h-[320px]'} rounded-xl relative z-30`}>
          //   <View className="absolute top-10 left-4 w-8 h-8 border-t-4 border-l-4 rounded-tl-xl border-white" />
          //   <View className="absolute top-10 right-4 w-8 h-8 border-t-4 border-r-4 rounded-tr-xl border-white" />
          //   <View className="absolute bottom-10 left-4 w-8 h-8 border-b-4 border-l-4 rounded-bl-xl border-white" />
          //   <View className="absolute bottom-10 right-4 w-8 h-8 border-b-4 border-r-4 rounded-br-xl border-white" />
          // </View>
          <LottieView
          source={require("../assets/animation/fucos.json")}
          autoPlay
          loop
          width={400}
          height={250}
        />
          )
        }
      
         
          </Animated.View>

          {hasPermission && <AskCameraPermission onRequestPermission={requestPermission} />}

          {isRiderFound && (
            <RiderFoundModal close={() => setIsRiderFound(false)} />
          )}

          {
            !hasPermission && (
            scanMode == 'STBR' ? (
              <ScanRiderModal />
            ): scanMode == 'STR' ? (
            <ScanPayModal />
            ):(
              <ScanFriendModal />
            )
          )
          }

         
     
        </View>
      </CameraView>
      {isLoading && <LoadingView />}
    </View>
  );
};

const ScanRiderModal = () => {
  return (
    <View className="w-full absolute bottom-8 rounded-xl shadow-xl shadow-black flex flex-row gap-x-4 items-center p-3 bg-white z-[100]">
      <LottieView
                            source={require('../assets/animation/tara.json')}
                            autoPlay
                            loop
                            width={60}
                            height={60}
                        />
      <Text className="flex-1 text-sm">
      Scan a rider's QR code to book, and they will be your assigned rider.
      </Text>
    </View>
  );
};

const ScanFriendModal = () => {
  return (
    <View className="w-full absolute bottom-8 rounded-xl shadow-xl shadow-black flex flex-row gap-x-4 items-center p-3 bg-white z-[100]">
      <LottieView
                            source={require('../assets/animation/tara.json')}
                            autoPlay
                            loop
                            width={60}
                            height={60}
                        />
      <Text className="flex-1 text-sm">
      Scan your friend's QR code to top up your wallet. The more scan the more earnings.
      </Text>
    </View>
  );
};


const ScanPayModal = () => {
  return (
    <View className="w-full absolute bottom-8 rounded-xl shadow-xl shadow-black flex flex-row gap-x-4 items-center p-3 bg-white z-[100]">
      <LottieView
                            source={require('../assets/animation/tara.json')}
                            autoPlay
                            loop
                            width={60}
                            height={60}
                        />
      <Text className="flex-1 text-sm">
      Scan your friend's QR code to transfer. This will make it more easy than typing your friend ID.
      </Text>
    </View>
  );
};

const LoadingView = () =>{
  return (
    <View className="absolute z-50 inset-0 h-full w-screen bg-white">
      <View className="flex-row justify-center items-center h-full">
        <LottieView
          source={require("../assets/animation/loading.json")}
          autoPlay
          loop
          width={400}
          height={250}
        />
      </View>
    </View>
  )
}

const AskCameraPermission = ({onRequestPermission}) =>{
  return (
    <View className="w-full h-full p-4 absolute bottom-0 bg-black/30 z-[100] ">
      <View
        className="w-full px-6 py-8 absolute bottom-10 left-4 rounded-3xl shadow-xl shadow-black  bg-white
      flex gap-y-4"
      >
       

        <View className="relative w-full flex justify-center items-center p-4">
          <TaraCamPermission size={200} />
        </View>

        <Text className="text-center text-2xl font-bold">
          Camera Permission
        </Text>

        <ParagraphText
          align="center"
          fontSize="sm"
          textColor="text-neutral-700"
          padding="px-2"
        >
          We need your camera permission for identification card.
        </ParagraphText>


        <View className="w-full flex gap-y-4">
          
          <Button
          onPress={()=>onRequestPermission()}
            bgColor="bg-blue-500"
            textColor="text-white"
          >
            Enable Camera
          </Button>
        </View>
      </View>
    </View>
  )
}


const RiderFoundModal = ({ close }) => {
  return (
    <View className="w-full absolute bottom-8 rounded-xl shadow-xl shadow-black  bg-white z-[100] overflow-hidden">
      <View className="w-full h-36 bg-blue-100 overflow-hidden">
        <SearchingGraphic size={190} />
      </View>

      <View className="p-4">
        <Text className="text-lg text-center px-10">
          <Text className="text-blue-500 font-semibold">Rider found</Text>! Do you want to
          book this rider?
        </Text>

        <View className="w-full flex gap-y-4 p-2">
          <Button>Book</Button>
          <Button
            onPress={close}
            bgColor="bg-slate-300"
            textColor="text-neutral-700"
          >
            Close
          </Button>
        </View>
      </View>
    </View>
  );
};

export default QrCodeScannerScreen;
