import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Svg, { Circle, Path, Rect } from "react-native-svg";
import { useToast } from "../components/ToastNotify";
const BottomNavBar = ({location,city,access}) => {
  const navigation = useNavigation();
const toast = useToast();
const openQR = () =>{
  navigation.navigate('qrcode', {
    mode: 'STBR',
    mycity: city,
    start: location
    });
}

const openHistoryPage = () =>{
  navigation.navigate('history', {
    mycity: city,
    start: location
    });
}

const openPremium = () =>{
toast("try_again","Create or login your account to unlock it.")
}


  return (
    <View
      className="w-full absolute bottom-8 left-6 border-t border-x border-slate-100 bg-white p-5 shadow-xl shadow-neutral-500 rounded-3xl
    flex flex-row items-center justify-between"
    >
      <TouchableOpacity onPress={()=>openHistoryPage()} className="flex gap-y-1 justify-center items-center">
        <Svg
          xmlns="http://www.w3.org/2000/svg"
          width={25}
          height={25}
          viewBox="0 0 24 24"
          fill="#334155"
        >
          <Path d="M16 0H8a5.006 5.006 0 0 0-5 5v18a1 1 0 0 0 1.564.825l2.106-1.439 2.106 1.439a1 1 0 0 0 1.13 0l2.1-1.439 2.1 1.439a1 1 0 0 0 1.131 0l2.1-1.438 2.1 1.437A1 1 0 0 0 21 23V5a5.006 5.006 0 0 0-5-5Zm3 21.1-1.1-.752a1 1 0 0 0-1.132 0l-2.1 1.439-2.1-1.439a1 1 0 0 0-1.131 0l-2.1 1.439-2.1-1.439a1 1 0 0 0-1.129 0L5 21.1V5a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3Z" />
          <Rect width={10} height={2} x={7} y={8} rx={1} />
          <Rect width={8} height={2} x={7} y={12} rx={1} />
        </Svg>

        <Text className="text-sm text-slate-500">History</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => openQR()}
        className="flex gap-y-1 justify-center items-center"
      >
        <Svg
          xmlns="http://www.w3.org/2000/svg"
          width={25}
          height={25}
          viewBox="0 0 24 24"
          fill="#334155"
        >
          <Path d="M19 24h-2a1 1 0 0 1 0-2h2a3 3 0 0 0 3-3v-2a1 1 0 0 1 2 0v2a5.006 5.006 0 0 1-5 5ZM1 8a1 1 0 0 1-1-1V5a5.006 5.006 0 0 1 5-5h2a1 1 0 0 1 0 2H5a3 3 0 0 0-3 3v2a1 1 0 0 1-1 1ZM7 24H5a5.006 5.006 0 0 1-5-5v-2a1 1 0 0 1 2 0v2a3 3 0 0 0 3 3h2a1 1 0 0 1 0 2ZM23 8a1 1 0 0 1-1-1V5a3 3 0 0 0-3-3h-2a1 1 0 0 1 0-2h2a5.006 5.006 0 0 1 5 5v2a1 1 0 0 1-1 1Z" />
        </Svg>

        <Text className="text-sm text-slate-500">Scan</Text>
      </TouchableOpacity>

{
   access.userId == 'visitor' ? (
    <TouchableOpacity
    onPress={() => openPremium()}
    className="relative flex gap-y-1 justify-center items-center"
  >

<View className="absolute -top-2 -right-1">
      <Svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path d="M19 8.424V6.99998C19 3.13402 15.866 0 12 0C8.13397 0 5 3.13402 5 6.99998V8.424C3.18003 9.2183 2.00263 11.0143 2 13V19C2.00328 21.76 4.23992 23.9967 6.99997 24H17C19.76 23.9967 21.9966 21.76 22 19V13C21.9974 11.0143 20.8199 9.2183 19 8.424ZM13 17C13 17.5523 12.5523 18 12 18C11.4477 18 11 17.5523 11 17V15C11 14.4477 11.4477 14 12 14C12.5523 14 13 14.4477 13 15V17ZM17 8.00002H6.99997V7.00003C6.99997 4.23863 9.23853 2.00002 12 2.00002C14.7614 2.00002 17 4.23858 17 7.00003V8.00002Z" fill="#fbbf24"/>
      </Svg>
      </View>
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={25}
      height={25}
      data-name="Layer 1"
      viewBox="0 0 24 24"
      fill="#334155"
    >
      <Path d="M24 16v5a3 3 0 0 1-3 3h-5a8 8 0 0 1-6.92-4 10.968 10.968 0 0 0 2.242-.248A5.988 5.988 0 0 0 16 22h5a1 1 0 0 0 1-1v-5a5.988 5.988 0 0 0-2.252-4.678A10.968 10.968 0 0 0 20 9.08 8 8 0 0 1 24 16Zm-6.023-6.349A9 9 0 0 0 8.349.023 9.418 9.418 0 0 0 0 9.294v5.04C0 16.866 1.507 18 3 18h5.7a9.419 9.419 0 0 0 9.277-8.349Zm-4.027-5.6a7.018 7.018 0 0 1 2.032 5.46A7.364 7.364 0 0 1 8.7 16H3c-.928 0-1-1.275-1-1.666v-5.04a7.362 7.362 0 0 1 6.49-7.276Q8.739 2 8.988 2a7.012 7.012 0 0 1 4.962 2.051Z" />
    </Svg>

    <Text className="text-sm text-slate-500">Chat</Text>
  </TouchableOpacity>
   ):(
    <TouchableOpacity
    onPress={() => navigation.navigate("inbox")}
    className="flex gap-y-1 justify-center items-center"
  >
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={25}
      height={25}
      data-name="Layer 1"
      viewBox="0 0 24 24"
      fill="#334155"
    >
      <Path d="M24 16v5a3 3 0 0 1-3 3h-5a8 8 0 0 1-6.92-4 10.968 10.968 0 0 0 2.242-.248A5.988 5.988 0 0 0 16 22h5a1 1 0 0 0 1-1v-5a5.988 5.988 0 0 0-2.252-4.678A10.968 10.968 0 0 0 20 9.08 8 8 0 0 1 24 16Zm-6.023-6.349A9 9 0 0 0 8.349.023 9.418 9.418 0 0 0 0 9.294v5.04C0 16.866 1.507 18 3 18h5.7a9.419 9.419 0 0 0 9.277-8.349Zm-4.027-5.6a7.018 7.018 0 0 1 2.032 5.46A7.364 7.364 0 0 1 8.7 16H3c-.928 0-1-1.275-1-1.666v-5.04a7.362 7.362 0 0 1 6.49-7.276Q8.739 2 8.988 2a7.012 7.012 0 0 1 4.962 2.051Z" />
    </Svg>

    <Text className="text-sm text-slate-500">Chat</Text>
  </TouchableOpacity>
   )
}




   

  {
    access.userId == 'visitor' ? (
      <TouchableOpacity
      onPress={()=>openPremium()}
      className="relative flex gap-y-1 justify-center items-center"
    >
      <View className="absolute -top-2 right-0">
      <Svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path d="M19 8.424V6.99998C19 3.13402 15.866 0 12 0C8.13397 0 5 3.13402 5 6.99998V8.424C3.18003 9.2183 2.00263 11.0143 2 13V19C2.00328 21.76 4.23992 23.9967 6.99997 24H17C19.76 23.9967 21.9966 21.76 22 19V13C21.9974 11.0143 20.8199 9.2183 19 8.424ZM13 17C13 17.5523 12.5523 18 12 18C11.4477 18 11 17.5523 11 17V15C11 14.4477 11.4477 14 12 14C12.5523 14 13 14.4477 13 15V17ZM17 8.00002H6.99997V7.00003C6.99997 4.23863 9.23853 2.00002 12 2.00002C14.7614 2.00002 17 4.23858 17 7.00003V8.00002Z" fill="#fbbf24"/>
      </Svg>
      </View>


      <Svg
        xmlns="http://www.w3.org/2000/svg"
        width={25}
        height={25}
        viewBox="0 0 24 24"
        fill="#334155"
      >
        <Circle cx={2} cy={12} r={2} />
        <Circle cx={12} cy={12} r={2} />
        <Circle cx={22} cy={12} r={2} />
      </Svg>

      <Text className="text-sm text-slate-500">More</Text>
    </TouchableOpacity>
    ):(
      <TouchableOpacity
      onPress={() => navigation.navigate("account")}
      className="flex gap-y-1 justify-center items-center"
    >
      <Svg
        xmlns="http://www.w3.org/2000/svg"
        width={25}
        height={25}
        viewBox="0 0 24 24"
        fill="#334155"
      >
        <Circle cx={2} cy={12} r={2} />
        <Circle cx={12} cy={12} r={2} />
        <Circle cx={22} cy={12} r={2} />
      </Svg>

      <Text className="text-sm text-slate-500">More</Text>
    </TouchableOpacity>
    )
  }
    </View>
  );
};

export default BottomNavBar;
