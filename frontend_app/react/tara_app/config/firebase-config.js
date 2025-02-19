import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyCh3m7hNOJbM280VNaXy6Zr8HT9hyOptKo",
  authDomain: "tara-app-fb985.firebaseapp.com",
  projectId: "tara-app-fb985",
  storageBucket: "tara-app-fb985.firebasestorage.app",
  messagingSenderId: "547357077789",
  appId: "1:547357077789:web:b30d698153c0b775c071f4",
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export const db = getFirestore(app);

export const database = getDatabase(app);


