import { CameraView, useCameraPermissions } from "expo-camera";
import { StatusBar } from "expo-status-bar";
import React, { useRef, useState } from "react";
import { Text, View } from "react-native";

const QrCodeScannerScreen = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [imageUri, setImageUri] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
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
        className="w-full h-full relative"
      >
        <View className="w-full h-full flex gap-y-10 justify-center items-center">
          <Text className="text-center text-3xl font-semibold text-white">
            Scanning
          </Text>
          <View className="w-full h-[400px] rounded-xl relative z-30">
            <View className="absolute top-10 left-8 w-8 h-8 border-t-4 border-l-4 rounded-tl-xl border-white" />
            <View className="absolute top-10 right-8 w-8 h-8 border-t-4 border-r-4 rounded-tr-xl border-white" />
            <View className="absolute bottom-10 left-8 w-8 h-8 border-b-4 border-l-4 rounded-bl-xl border-white" />
            <View className="absolute bottom-10 right-8 w-8 h-8 border-b-4 border-r-4 rounded-br-xl border-white" />
          </View>
        </View>
      </CameraView>
    </View>
  );
};

export default QrCodeScannerScreen;
