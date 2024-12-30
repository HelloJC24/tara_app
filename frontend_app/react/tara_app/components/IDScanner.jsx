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
} from "react-native";
import Svg, { Path, Rect } from "react-native-svg";
import AppLogo from "../assets/splash-icon.png";
import Button from "./Button";
import ParagraphText from "./ParagraphText";
import { useToast } from "./ToastNotify";

const IDScanner = (props) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [imageUri, setImageUri] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const toast = useToast();

  const cameraRef = useRef(null);

  const handleBackPress = () => {
    props.close();
    return true;
  };
  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", handleBackPress);
    return () => {
      BackHandler.removeEventListener("hardwareBackPress", handleBackPress);
    };
  }, [props.close]);

  if (!permission) {
    return null;
  }

  // if (!permission?.granted) {
  //   return (
  //     <AccessPermission
  //       onClose={props.close}
  //       onRequestPermission={requestPermission}
  //     />
  //   );
  // }

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
          <View className=""></View>
        </View>

        <CameraView
          ref={cameraRef}
          facing="back"
          // ratio="16:9"
          // pictureSize="1080x1920"
          autofocus={true}
          focusable={true}
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
      {isError && <ErrorProcessingPhoto close={props.close} />}
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
          <Text className="text-center text-base z-50">
            Processing your photo..
          </Text>
        </View>

        <View></View>

        <View className="w-full flex gap-y-4 p-2">
          <Button bgColor="bg-slate-300" textColor="text-neutral-700">
            Cancel
          </Button>

          <ParagraphText align="center" fontSize="sm" padding="px-4">
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

export default IDScanner;
