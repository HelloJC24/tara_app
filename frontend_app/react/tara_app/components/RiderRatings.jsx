import { StatusBar } from "expo-status-bar";
import React, {useState} from "react";
import { Image, Pressable, Text, TouchableOpacity, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import AppIcon from "../assets/splash-icon.png";
import Button from "./Button";
import { updateBooking } from "../config/hooks";


const RiderRatingModal = ({user,booking,navigation,page,close,riderdata}) => {


const [rating, setRating] = useState(0);
 const [help, setHelp] = useState(false);

  const exexba = () =>{
    if(page == 1){
      close(false)
    }

    if(page == 0){
      navigation.goBack()
    }

    //navigation
  }


const handleRating = async (value) => {
  setRating(value);
  const rateres = await updateBooking(booking,"Tip",value,user)
  if(rateres.status == 'success'){
    exexba();
  }
  //close
};







  return (
    <View className="w-full h-full bg-white absolute inset-0 z-50">
      <StatusBar style="dark" />

      <View className="bg-white h-full flex justify-between items-center px-8 py-10 z-[100]">
        <View className="w-full flex flex-row gap-x-3 items-center justify-end py-2">
          <Pressable onPress={()=>exexba()}>
            <Svg
              xmlns="http://www.w3.org/2000/svg"
              width={30}
              height={30}
              viewBox="0 0 24 24"
              fill="#374957"
            >
              <Path d="M18 6a1 1 0 0 0-1.414 0L12 10.586 7.414 6A1 1 0 0 0 6 6a1 1 0 0 0 0 1.414L10.586 12 6 16.586A1 1 0 0 0 6 18a1 1 0 0 0 1.414 0L12 13.414 16.586 18A1 1 0 0 0 18 18a1 1 0 0 0 0-1.414L13.414 12 18 7.414A1 1 0 0 0 18 6Z" />
            </Svg>
          </Pressable>
        </View>

        <View className="w-full p-6 flex justify-start items-center">
          <View className="h-28 w-28 rounded-2xl border border-gray-300">
          <Image source={{uri:riderdata?.Photo}} className="w-full h-full rounded-2xl" />
          </View>

        <View className="mt-4">
        <Text className="text-base font-medium text-slate-800 text-center px-2">
            {riderdata?.Legal_Name}
          </Text>
          <View className="flex-row justify-center items-center">
          <Text className="text-sm font-normal text-slate-500  text-center px-2">
            {riderdata?.Vehicle_Type} ({riderdata?.Color}) {riderdata?.Vehicle_Plate}
          </Text>
          </View>
        </View>


          <Text className="text-base font-normal text-slate-800 mt-4  text-center p-2">
            Rate your experience
          </Text>


        <View className="mt-4">
        <View style={{ flexDirection: 'row', gap:26 }}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity key={star} onPress={() => handleRating(star)} className="flex flex-col gap-y-2 items-center">
                    <Svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={30}
                      height={30}
                      viewBox="0 0 24 24"
                      fill={star <= rating ? "#eab308" : "#d1d5db"}
                    >
                      <Path d="m1.327 12.4 3.56 2.6-1.352 4.187A3.178 3.178 0 0 0 4.719 22.8a3.177 3.177 0 0 0 3.8-.019L12 20.219l3.482 2.559a3.227 3.227 0 0 0 4.983-3.591L19.113 15l3.56-2.6a3.227 3.227 0 0 0-1.9-5.832H16.4l-1.327-4.136a3.227 3.227 0 0 0-6.146 0L7.6 6.568H3.231a3.227 3.227 0 0 0-1.9 5.832Z" />
                    </Svg>
                    <Text className="text-center text-base text-slate-500">
                      {
                        star == 1 ? (
                          'Bad'
                        ): star == 2 ? (
                          'Poor'
                        ): star == 3 ? (
                          'Cool'
                        ): star == 4 ? (
                          'Good'
                        ):(
                          'Awesome'
                        )
                      }
                    </Text>
                  </TouchableOpacity>
                ))}
                </View>
        </View>

        </View>

        <View></View>
        <View></View>

        <View className="w-full flex gap-y-4 p-2">
          
          <Button onPress={()=>exexba()}>Close</Button>
          
        </View>
      </View>
      
    </View>
  );
};

export default RiderRatingModal;

// frown

// sad

// meh

// smile

// laugh
