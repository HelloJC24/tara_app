import { CameraView, useCameraPermissions } from "expo-camera";
import { StatusBar } from "expo-status-bar";
import React, { useRef, useState } from "react";
import { Image, Text, View } from "react-native";
import AppIcon from "../assets/splash-icon.png";
import Button from "../components/Button";
import { SearchingGraphic } from "../components/CustomGraphic";
import LottieView from 'lottie-react-native';


const QrCodeScannerScreen = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [imageUri, setImageUri] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRiderFound, setIsRiderFound] = useState(true);
  const cameraRef = useRef(null);

  return (
    <View className="w-full h-full absolute inset-0">
      <StatusBar style="light" />
      <CameraView
        ref={cameraRef}
        facing="back"
        // ratio="16:9"
        // pictureSize="1080x1920"
        autofocus={true}
        focusable={true}
        onCameraReady={() => {}}
        className="w-full relative p-4"
      >
        <View
          className={`w-full h-full flex gap-y-10 justify-center items-center p-4 ${
            isRiderFound ? "bg-black/30" : ""
          }`}
        >
          <Text className="text-center text-3xl font-semibold text-white">
            Scanning
          </Text>
          <View className="w-full h-[400px] rounded-xl relative z-30">
            <View className="absolute top-10 left-4 w-8 h-8 border-t-4 border-l-4 rounded-tl-xl border-white" />
            <View className="absolute top-10 right-4 w-8 h-8 border-t-4 border-r-4 rounded-tr-xl border-white" />
            <View className="absolute bottom-10 left-4 w-8 h-8 border-b-4 border-l-4 rounded-bl-xl border-white" />
            <View className="absolute bottom-10 right-4 w-8 h-8 border-b-4 border-r-4 rounded-br-xl border-white" />
          </View>

          {isRiderFound ? (
            <RiderFoundModal close={() => setIsRiderFound(false)} />
          ) : (
            <ScanRiderModal />
          )}
        </View>
      </CameraView>
    </View>
  );
};

const ScanRiderModal = () => {
  return (
    <View className="w-full absolute bottom-8 rounded-xl shadow-xl shadow-black flex flex-row gap-x-4 items-center p-3 bg-white z-[100]">
      <LottieView
                            source={require('../assets/animation/QR.json')}
                            autoPlay
                            loop
                            width={60}
                            height={60}
                        />
      <Text className="flex-1 text-sm">
        Scan a rider to book, so that you still have records for the
        transactions, safe tracking and cashback!
      </Text>
    </View>
  );
};

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
