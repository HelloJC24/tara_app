import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import Svg, { Path, Rect } from "react-native-svg";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback((status, msg) => {
    const id = Date.now();
    setToasts((prevToasts) => [...prevToasts, { id, status, msg }]);

    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <View className="absolute bottom-6 left-4 right-4 z-[100]">
        {toasts.map((toast) => (
          <ToastNotify key={toast.id} status={toast.status} msg={toast.msg} />
        ))}
      </View>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context.toast;
};

const ToastNotify = ({ status, msg }) => {
  const translateY = useSharedValue(100);
  const opacity = useSharedValue(1);

  useEffect(() => {
    translateY.value = withSpring(0, { damping: 10, stiffness: 200 });

    const timeoutId = setTimeout(() => {
      opacity.value = withTiming(0, { duration: 300 });
      translateY.value = withSpring(50, { damping: 10, stiffness: 200 });
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [translateY, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={animatedStyle}
      className="mt-2 rounded-2xl shadow-xl shadow-black flex flex-row gap-x-4 items-center p-4 bg-white z-[100]"
    >
      <ToastIcon status={status} />
      <Text numberOfLines={2} className="text-base">
        {msg}
      </Text>
    </Animated.View>
  );
};

const ToastIcon = ({ status }) => {
  if (status === "success") {
    return (
      <View className="bg-green-200 p-3 rounded-xl">
        <View className="bg-green-500 p-2 rounded-full">
          <Svg
            xmlns="http://www.w3.org/2000/svg"
            width={15}
            height={15}
            fill="white"
            viewBox="0 0 24 24"
          >
            <Path d="M22.319 4.431 8.5 18.249a1 1 0 0 1-1.417 0L1.739 12.9a1 1 0 0 0-1.417 0 1 1 0 0 0 0 1.417l5.346 5.345a3.008 3.008 0 0 0 4.25 0L23.736 5.847a1 1 0 0 0 0-1.416 1 1 0 0 0-1.417 0Z" />
          </Svg>
        </View>
      </View>
    );
  }

  if (status === "error") {
    return (
      <View className="bg-red-200 p-3 rounded-xl">
        <View className="bg-red-500 rounded-full">
          <Svg
            xmlns="http://www.w3.org/2000/svg"
            width={25}
            height={25}
            viewBox="0 0 24 24"
            fill="white"
          >
            <Path
              fill="#ef4444"
              d="M12 0a12 12 0 1 0 12 12A12.013 12.013 0 0 0 12 0Zm0 22a10 10 0 1 1 10-10 10.011 10.011 0 0 1-10 10Z"
            />
            <Path d="M12 5a1 1 0 0 0-1 1v8a1 1 0 0 0 2 0V6a1 1 0 0 0-1-1Z" />
            <Rect width={2} height={2} x={11} y={17} rx={1} />
          </Svg>
        </View>
      </View>
    );
  }

  if (status === "wrong_code") {
    return (
      <View className="bg-red-200 p-3 rounded-xl">
        <Svg
          xmlns="http://www.w3.org/2000/svg"
          width={20}
          height={20}
          data-name="Layer 1"
          viewBox="0 0 24 24"
          fill="#ef4444"
        >
          <Path d="M5.972 22.285a1 1 0 0 1-.515-1.857C9 18.3 9 13.73 9 11a3 3 0 0 1 6 0 1 1 0 0 1-2 0 1 1 0 0 0-2 0c0 2.947 0 8.434-4.514 11.143a1 1 0 0 1-.514.142Zm4.963 1.421c2.282-2.3 3.615-5.534 3.961-9.621A1 1 0 0 0 13.985 13a.983.983 0 0 0-1.081.911c-.311 3.657-1.419 6.4-3.388 8.381a1 1 0 0 0 1.419 1.41Zm5.2-.186a17.793 17.793 0 0 0 1.508-3.181 1 1 0 0 0-1.881-.678 15.854 15.854 0 0 1-1.338 2.821 1 1 0 0 0 1.711 1.038Zm2.365-6.329A31.459 31.459 0 0 0 19 11 7 7 0 0 0 6.787 6.333a1 1 0 1 0 1.489 1.334A5 5 0 0 1 17 11a29.686 29.686 0 0 1-.462 5.809 1 1 0 0 0 .79 1.172.979.979 0 0 0 .193.019 1 1 0 0 0 .979-.809ZM7 11a5 5 0 0 1 .069-.833A1 1 0 1 0 5.1 9.833 6.971 6.971 0 0 0 5 11c0 4.645-1.346 7-4 7a1 1 0 0 0 0 2c3.869 0 6-3.2 6-9Zm13.7 12.414A29.76 29.76 0 0 0 23 11a10.865 10.865 0 0 0-1.1-4.794 1 1 0 1 0-1.8.875A8.9 8.9 0 0 1 21 11a27.91 27.91 0 0 1-2.119 11.586 1 1 0 0 0 .5 1.324.984.984 0 0 0 .413.09 1 1 0 0 0 .906-.586ZM3 14v-3a9.01 9.01 0 0 1 9-9 8.911 8.911 0 0 1 5.4 1.8 1 1 0 0 0 1.2-1.6A10.9 10.9 0 0 0 12 0 11.013 11.013 0 0 0 1 11v3a1 1 0 0 0 2 0Z" />
        </Svg>
      </View>
    );
  }

  if (status === "try_again") {
    return (
      <View className="bg-slate-200 p-3 rounded-xl">
        <Svg
          xmlns="http://www.w3.org/2000/svg"
          width={20}
          height={20}
          data-name="Layer 1"
          viewBox="0 0 24 24"
          fill="#6b7280"
        >
          <Path d="M23 11a1 1 0 0 0-1 1 10.034 10.034 0 1 1-2.9-7.021A.862.862 0 0 1 19 5h-3a1 1 0 0 0 0 2h3a3 3 0 0 0 3-3V1a1 1 0 0 0-2 0v2.065A11.994 11.994 0 1 0 24 12a1 1 0 0 0-1-1z" />
          <Path d="M12 6a1 1 0 0 0-1 1v5a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V7a1 1 0 0 0-1-1z" />
        </Svg>
      </View>
    );
  }

  if (status === "book_limit") {
    return (
      <View className="bg-amber-200 p-3 rounded-xl">
        <Svg
          xmlns="http://www.w3.org/2000/svg"
          width={25}
          height={25}
          data-name="Layer 1"
          viewBox="0 0 24 24"
          fill="#D97706"
        >
          <Path d="M21 15a3 3 0 0 0-3 3v3a3 3 0 0 0 6 0v-3a3 3 0 0 0-3-3zm1 6a1 1 0 0 1-2 0v-3a1 1 0 0 1 2 0zM13 12V7a1 1 0 0 0-2 0v4H8a1 1 0 0 0 0 2h4a1 1 0 0 0 1-1z" />
          <Path d="M23 2a1 1 0 0 0-1 1v2.374A12 12 0 1 0 7.636 23.182 1.015 1.015 0 0 0 8 23.25a1 1 0 0 0 .364-1.932A10 10 0 1 1 20.636 7H18a1 1 0 0 0 0 2h3a3 3 0 0 0 3-3V3a1 1 0 0 0-1-1z" />
          <Path d="M15.383 15.076a1 1 0 0 0-1.09.217l-3 3a1 1 0 0 0 1.414 1.414L14 18.414V23a1 1 0 0 0 2 0v-7a1 1 0 0 0-.617-.924z" />
        </Svg>
      </View>
    );
  }

  return null;
};

export default ToastNotify;
