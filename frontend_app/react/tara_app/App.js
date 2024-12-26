import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useContext } from "react";
import { ToastProvider } from "./components/ToastNotify";
import AuthProvider, { AuthContext } from "./context/authContext";
import DataProvider from "./context/dataContext";
import "./global.css";
import AuthScreen from "./screens/auth";
import HomeScreen from "./screens/home";
import QrCodeScannerScreen from "./screens/qrcode_scanner";
import SplashScreen from "./screens/splash";

const Stack = createNativeStackNavigator();

const ProtectedRouting = () => {
  const { auth } = useContext(AuthContext);

  return (
    <Stack.Navigator
      screenOptions={({ navigation }) => ({
        headerShown: false,
      })}
    >
      {auth?.accessToken ? (
        <>
          <Stack.Screen name="home" component={HomeScreen} />
          <Stack.Screen name="qrcode" component={QrCodeScannerScreen} />
        </>
      ) : (
        <Stack.Screen name="auth" component={AuthScreen} />
      )}
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
