import { Stack } from "expo-router";
import { TokenProvider } from "../context/TokenContext";

export default function RootLayout() {
  return (
    <TokenProvider>
      <Stack initialRouteName="index" screenOptions={{ headerShown: false }} />
    </TokenProvider>
  );
}
