import { StatusBar} from "expo-status-bar";
import React, { useState } from "react";
import { View,Pressable,Linking } from "react-native";
import { WebView } from "react-native-webview";
import Svg, { Path, Rect } from "react-native-svg";

const WebViewerScreen = ({ route,navigation }) => {
  const { url } = route.params;
  const [loading,setIsLoading] = useState(false)
  return (
    <View className="flex-1 bg-white relative">
      <StatusBar style="dark" />

<View className="px-6 pt-10">
  <View className="w-full flex flex-row gap-x-3 items-center justify-between py-2">
            <Pressable onPress={()=>navigation.goBack()}>
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
            <Pressable onPress={()=>Linking.openURL(url)}  className="p-1 bg-slate-200 rounded-lg">
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
          </View>
</View>

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
