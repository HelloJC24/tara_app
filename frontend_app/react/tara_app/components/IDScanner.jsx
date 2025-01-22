import { CameraView, useCameraPermissions } from "expo-camera";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef, useState } from "react";
import {
  BackHandler,
  Image,
  Platform,
  Pressable,
  Text,
  TouchableOpacity,
  View,
  Linking
} from "react-native";
import Svg, { Path, Rect } from "react-native-svg";
import AppLogo from "../assets/splash-icon.png";
import Button from "./Button";
import ParagraphText from "./ParagraphText";
import { useToast } from "./ToastNotify";
import { UptimeGraphic,TaraCamPermission } from "./CustomGraphic";


const IDScanner = (props) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [imageUri, setImageUri] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const toast = useToast();
  const [hasPermission, setHasPermission] = useState(false);
  const [showGuide,setGuide] = useState(false);
  const [model, setModel] = useState(null);

  const cameraRef = useRef(null);

  const handleBackPress = () => {
    props.close();
    return true;
  };
  useEffect(() => {

    if (!permission?.granted) {
      setHasPermission(true)
    }else{
      setHasPermission(false)
    }

    

    const frameInterval = setInterval(async () => {
      if (cameraRef.current) {
        try {
          const frame = await cameraRef.current.takePictureAsync({ base64: true, shutterSound: false });
          //console.log(frame.base64) send to object detection
          
        } catch (error) {
          //console.log("camera closed")
        } finally {
          //console.log("nothing..")
        }
      }
    }, 500); // Adjust the interval as needed (e.g., 500ms for 2 frames per second)

    



    BackHandler.addEventListener("hardwareBackPress", handleBackPress);
    return () => {
      BackHandler.removeEventListener("hardwareBackPress", handleBackPress);
      clearInterval(frameInterval); // Clean up on unmount
      
    };
    

    
   

  }, [props.close,permission]);

  if (!permission) {
    return null;
  }





  const handleImageCapture = async () => {
    try {
      if (!cameraRef?.current) return;
      // Capture image using camera
      const image = await cameraRef?.current.takePictureAsync({
        quality: 1.0,
        skipProcessing: Platform.OS === "android",
        exif: false,
        imageType: "image/jpeg",
      });
      // Set loading state to true
      setIsLoading(true);

      // Get file name from URI
      const fileName = image.uri.split("/").pop();

      // Insert Image uri in Form Data
      const formData = new FormData();
      formData.append("file", {
        uri:
          Platform.OS === "ios" ? image.uri.replace("file://", "") : image.uri,
        type: "image/jpeg",
        name: fileName,
      });

      // const scanIdResponse = await scanID();

      // // Check for scan errors
      // if (
      //   scanIdResponse.data.name === null ||
      //   scanIdResponse.data.name === "NO NAME FOUND"
      // ) {
      //   setIsError(true);
      //   toast("error", "Your photo is blurry");
      //   return;
      // }
      setTimeout(() => {
        toast("success", "Image scanned successfully");
        setIsLoading(false);
        props.nextPage();
      }, 3000);
    } catch (error) {
      console.log("This is Error: ", error);
    }
  };

  return (
    <View className="w-full h-full bg-white absolute inset-0 z-[200]">
      <StatusBar style="dark" />

      <View className="py-6">
        <View className="w-full  flex flex-row gap-x-3 items-center justify-between px-6 py-6 z-50">
          <Pressable onPress={props.close}>
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
          <Pressable onPress={()=>setGuide(true)} className="">
        <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <Path d="M12 0C9.62663 0 7.30655 0.703788 5.33316 2.02236C3.35977 3.34094 1.8217 5.21509 0.913451 7.4078C0.00519943 9.60051 -0.232441 12.0133 0.230582 14.3411C0.693605 16.6689 1.83649 18.8071 3.51472 20.4853C5.19295 22.1635 7.33115 23.3064 9.65892 23.7694C11.9867 24.2324 14.3995 23.9948 16.5922 23.0866C18.7849 22.1783 20.6591 20.6402 21.9776 18.6668C23.2962 16.6935 24 14.3734 24 12C23.9966 8.81846 22.7312 5.76821 20.4815 3.51852C18.2318 1.26883 15.1815 0.00344108 12 0V0ZM12 20C11.8022 20 11.6089 19.9414 11.4444 19.8315C11.28 19.7216 11.1518 19.5654 11.0761 19.3827C11.0004 19.2 10.9806 18.9989 11.0192 18.8049C11.0578 18.6109 11.153 18.4327 11.2929 18.2929C11.4328 18.153 11.6109 18.0578 11.8049 18.0192C11.9989 17.9806 12.2 18.0004 12.3827 18.0761C12.5654 18.1518 12.7216 18.28 12.8315 18.4444C12.9414 18.6089 13 18.8022 13 19C13 19.2652 12.8946 19.5196 12.7071 19.7071C12.5196 19.8946 12.2652 20 12 20ZM13.93 12.506C13.6349 12.6905 13.3936 12.9495 13.2303 13.2569C13.0671 13.5642 12.9876 13.9092 13 14.257V15C13 15.2652 12.8946 15.5196 12.7071 15.7071C12.5196 15.8946 12.2652 16 12 16C11.7348 16 11.4804 15.8946 11.2929 15.7071C11.1054 15.5196 11 15.2652 11 15V14.257C10.9852 13.5514 11.1596 12.8548 11.5049 12.2393C11.8503 11.6238 12.3541 11.112 12.964 10.757C13.3335 10.5535 13.6292 10.2384 13.8088 9.85674C13.9884 9.47508 14.0427 9.0464 13.964 8.632C13.8861 8.2372 13.6922 7.87459 13.4073 7.59049C13.1223 7.30639 12.759 7.11369 12.364 7.037C12.0757 6.98364 11.7792 6.99431 11.4955 7.06826C11.2118 7.14221 10.9479 7.27762 10.7223 7.46492C10.4968 7.65221 10.3152 7.8868 10.1903 8.15207C10.0655 8.41735 10.0005 8.70683 10 9C10 9.26522 9.89465 9.51957 9.70711 9.70711C9.51958 9.89464 9.26522 10 9.00001 10C8.73479 10 8.48044 9.89464 8.2929 9.70711C8.10536 9.51957 8.00001 9.26522 8.00001 9C8.00026 8.29451 8.18709 7.60163 8.54156 6.99165C8.89603 6.38167 9.40552 5.8763 10.0184 5.52679C10.6312 5.17728 11.3256 4.99607 12.031 5.00154C12.7365 5.00701 13.428 5.19897 14.0353 5.55794C14.6427 5.91692 15.1442 6.43013 15.4892 7.04554C15.8342 7.66094 16.0102 8.35663 15.9995 9.06205C15.9889 9.76746 15.7918 10.4575 15.4283 11.0622C15.0649 11.6668 14.5479 12.1646 13.93 12.505V12.506Z" fill="#3b82f6"/>
        </Svg>
          </Pressable>
        </View>

        <CameraView
          ref={cameraRef}
          facing="back"
          // ratio="16:9"
          // pictureSize="1080x1920"
          autofocus={true}
          focusable={true}
          mute={true}
          animateShutter={false}
          onCameraReady={() => {}}
        >
          <View className="w-full min-h-[550px] p-10 rounded-xl relative">
            <View className="absolute top-10 left-8 w-8 h-8 border-t-4 border-l-4 rounded-tl-xl border-white" />
            <View className="absolute top-10 right-8 w-8 h-8 border-t-4 border-r-4 rounded-tr-xl border-white" />
            <View className="absolute bottom-10 left-8 w-8 h-8 border-b-4 border-l-4 rounded-bl-xl border-white" />
            <View className="absolute bottom-10 right-8 w-8 h-8 border-b-4 border-r-4 rounded-br-xl border-white" />
          </View>
        </CameraView>

        <View className="w-full max-h-60 flex gap-y-2 items-center p-4 bg-white">
          <Text className="text-center text-base">Just a sec..</Text>

          <TouchableOpacity
            onPress={handleImageCapture}
            className="bg-blue-500 p-4 rounded-full"
          >
            <Svg
              xmlns="http://www.w3.org/2000/svg"
              width={40}
              height={40}
              viewBox="0 0 24 24"
              fill="#fff"
            >
              <Path d="M19 4h-.508l-2.184-2.832A3.023 3.023 0 0 0 13.932 0h-3.864a3.023 3.023 0 0 0-2.376 1.168L5.508 4H5a5.006 5.006 0 0 0-5 5v10a5.006 5.006 0 0 0 5 5h14a5.006 5.006 0 0 0 5-5V9a5.006 5.006 0 0 0-5-5ZM9.276 2.39a1.006 1.006 0 0 1 .792-.39h3.864a1.008 1.008 0 0 1 .792.39L15.966 4H8.034ZM22 19a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V9a3 3 0 0 1 3-3h14a3 3 0 0 1 3 3Z" />
              <Path d="M12 8a6 6 0 1 0 6 6 6.006 6.006 0 0 0-6-6Zm0 10a4 4 0 1 1 4-4 4 4 0 0 1-4 4Z" />
            </Svg>
          </TouchableOpacity>
        </View>
      </View>

      {isLoading && <ProcessingPhoto close={props.close} />}
      { hasPermission && <AskCameraPermission onRequestPermission={requestPermission} />}
      {showGuide && <GuideNotice close={setGuide} />}
    </View>
  );
};

const ProcessingPhoto = (props) => {
  return (
    <View className="w-full h-screen bg-white absolute inset-0 z-[200]">
      <StatusBar style="dark" />
      <View className="h-full bg-white flex justify-between items-center px-6 py-10 z-50">
        <View className="w-full flex flex-row gap-x-3 items-center justify-between py-2">
          <Pressable onPress={props.close}>
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
        
        </View>

        <View className="w-full flex items-center gap-y-4">
        <UptimeGraphic size={200}/>
          <Text className="text-center text-base z-50">
            Processing your photo..
          </Text>
        </View>

        <View></View>

        <View className="w-full flex gap-y-4 p-2">
          <Button bgColor="bg-slate-200" textColor="text-neutral-700">
            Cancel
          </Button>

          <ParagraphText align="center" fontSize="sm" padding="px-4">
            Learn how we protect your personal{" "}
            <Text onPress={()=>Linking.openURL("https://taranapo.com/data-protection/")} className="text-blue-500 font-semibold">
              information here.
            </Text>
          </ParagraphText>
        </View>
      </View>
    </View>
  );
};

const ErrorProcessingPhoto = (props) => {
  return (
    <View className="w-full h-screen bg-white absolute inset-0 z-[200]">
      <StatusBar style="dark" />
      <View className="h-full flex justify-between items-center px-6 py-10">
        <View className="w-full flex flex-row gap-x-3 items-center justify-between py-2">
          <Pressable onPress={props.close}>
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
          <View className="p-1 bg-slate-200 rounded-lg">
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
          </View>
        </View>

        <View className="w-full flex items-center gap-y-4">
          <Image source={AppLogo} className="w-56 h-56" />
          <Text className="text-center text-base">Your photo is blurry</Text>
        </View>

        <View></View>

        <View className="w-full flex gap-y-4 p-2">
          <Button bgColor="bg-slate-300" textColor="text-neutral-700">
            Try again
          </Button>

          {/* <Button>Try again</Button> */}

          <ParagraphText align="center" fontSize="sm" padding="px-6">
            Learn how we protect your personal{" "}
            <Text className="text-blue-500 font-semibold">
              information here.
            </Text>
          </ParagraphText>
        </View>
      </View>
    </View>
  );
};

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

const GuideNotice = ({close}) =>{
  return (
    
            <View className="w-full h-full p-4 absolute bottom-0 bg-black/30 z-[100] ">
              <View
                className="w-full px-6 py-8 absolute bottom-10 left-4 rounded-3xl shadow-xl shadow-black  bg-white
              flex gap-y-4"
              >
                <Text className="text-center text-2xl font-bold">
                Having hardtime?
                </Text>
                <Text>You can use any form of ID, such as government, employee, or student identification, <Text className="font-medium text-blue-600">as long as the name and photo are clearly visible</Text>. This requirement is essential for potential insurance claims or other identification purposes..</Text>
                <View className="w-full flex gap-y-4">
          <Button
          onPress={()=>close(false)}
            bgColor="bg-slate-200"
            textColor="text-neutral-700"
          >
            OK! Got it
          </Button>
        </View>
                </View>
                </View>
  )
}


export default IDScanner;
