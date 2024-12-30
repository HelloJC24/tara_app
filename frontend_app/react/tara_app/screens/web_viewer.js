import { StatusBar } from "expo-status-bar";
import React from "react";
import { View } from "react-native";
import { WebView } from "react-native-webview";

const WebViewerScreen = ({ route }) => {
  const { url } = route.params;

  return (
    <View className="flex-1 bg-white relative">
      <StatusBar style="dark" />

      <WebView
        source={{ uri: url }}
        onLoadEnd={() => setIsLoading(false)}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.warn("WebView error: ", nativeEvent);
        }}
      />
    </View>
  );
};

export default WebViewerScreen;
