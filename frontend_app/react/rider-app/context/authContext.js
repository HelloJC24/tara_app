import AsyncStorage from "@react-native-async-storage/async-storage";
import { onAuthStateChanged } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { auth } from "../config/firebase-config";

export const AuthContext = createContext({});

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          // Retrieve the ID token (accessToken) securely
          const accessToken = await currentUser.getIdToken(true);
          const uid = currentUser.uid;
          console.log("Current User AccessToken: ", accessToken.length,uid);

          // Store accessToken in AsyncStorage
          await AsyncStorage.setItem("accessToken", accessToken);
          await AsyncStorage.setItem("uid", uid);

          // Update the user state with accessToken
        // Set the accessToken
        setUser((prevState) => ({
          ...prevState,
          accessToken: accessToken,
        }));
        } catch (error) {
          console.error(error);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
