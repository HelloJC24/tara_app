import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Alert, useContext, useEffect, useState } from "react";
import { ToastProvider } from "./components/ToastNotify";
import AuthProvider, { AuthContext } from "./context/authContext";
import DataProvider from "./context/dataContext";
import "./global.css";
import AccountScreen from "./screens/account";
import AuthScreen from "./screens/auth";
import HistoryPage from "./screens/history";
import HomeScreen from "./screens/home";
import InboxScreen from "./screens/inbox";
import BookingPage from "./screens/map";
import QrCodeScannerScreen from "./screens/qrcode_scanner";
import SplashScreen from "./screens/splash";
import StartPage from "./screens/start";
import WalletScreen from "./screens/wallet";
import WebViewerScreen from "./screens/web_viewer";
const Stack = createNativeStackNavigator();

const ProtectedRouting = () => {
  const { user } = useContext(AuthContext);
  const [device, setDevice] = useState(false);

  useEffect(() => {
    const rememberDevice = async () => {
      try {
        const value = await AsyncStorage.getItem("register");
        if (value == "true") {
          setDevice(true);
        }
      } catch (e) {
        Alert.alert(
          "Oops! Something happened",
          "This error occurred upon creating or installing the app. To resolve, kindly re-install the app."
        );
      }
    };

    rememberDevice();
  }, [user]);

  return (
    <Stack.Navigator
      screenOptions={({ navigation }) => ({
        headerShown: false,
      })}
    >
      {user?.accessToken || device ? (
        <>
          <Stack.Screen name="home" component={HomeScreen} />
          <Stack.Screen name="wallet" component={WalletScreen} />
          <Stack.Screen name="qrcode" component={QrCodeScannerScreen} />
          <Stack.Screen name="inbox" component={InboxScreen} />
          <Stack.Screen name="account" component={AccountScreen} />
          <Stack.Screen name="webview" component={WebViewerScreen} />
          <Stack.Screen name="booking" component={BookingPage} />
          <Stack.Screen name="history" component={HistoryPage} />
        </>
      ) : (
        <>
          {device ? ( //temporary solution to solve auth glitch
            <Stack.Screen name="start" component={StartPage} />
          ) : (
            <Stack.Screen name="auth" component={AuthScreen} />
          )}

          <Stack.Screen name="webview" component={WebViewerScreen} />
        </>
      )}
      {/* <Stack.Screen name="auth" component={AuthScreen} /> */}
    </Stack.Navigator>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <ToastProvider>
          <NavigationContainer>
            <Stack.Navigator
              initialRouteName="splash"
              screenOptions={({ navigation }) => ({
                headerShown: false,
              })}
            >
              <Stack.Screen name="splash" component={SplashScreen} />
              <Stack.Screen name="Main" component={ProtectedRouting} />
            </Stack.Navigator>
          </NavigationContainer>
        </ToastProvider>
      </DataProvider>
    </AuthProvider>
  );
}
