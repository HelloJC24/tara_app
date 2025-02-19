import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { Pressable, Text, TextInput, View,Keyboard } from "react-native";
import Svg, { Path } from "react-native-svg";
import { TaraLogo } from "../components/CustomIcon";
import ParagraphText from "../components/ParagraphText";
import Button from "./Button";
import { Bigbox3 } from "./CustomTextbox";
import { sendReport } from "../config/hooks";
import { useToast } from "../components/ToastNotify";
import AsyncStorage from "@react-native-async-storage/async-storage";
import appJson from "../app.json";


const ReportProblemScreen = ({ navigation, ...props }) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [agent, setAgent] = useState(false);
  const [sending,setSending] = useState(false)
  const toast = useToast();
  const appVersion = appJson.expo.version;

useEffect(()=>{
 const checkAgentAllow = async () =>{
    // Get cached data first
    const cachedData = await AsyncStorage.getItem(`v_${appVersion}`);
    if (cachedData) {
    if(JSON.parse(cachedData).agent == true){
      setAgent(true)
    }
    }
 }

 checkAgentAllow();
},[appVersion])


  
  const agentButton = () => {
    navigation.navigate("webview", {
      track: "user",
      url: "https://taranapo.com/report/",
    });
  };

  const [countDes, setCount] = useState();
  const checkDescrip = (text) => {
    setMessage(text);
  };

  const sendMessage = async () =>{
    Keyboard.dismiss()
    if(!email || !message){
      return
    }
    toast("try_again","Sending..")
    setSending(true)
    console.log(email,message)
    const sendba = await sendReport(email,message)
    console.log(sendba)
    if(sendba.status == 'ok'){
      //setSending(false)
      toast("success","Report sent! Will response to your provided email.")
    }
  }



  return (
    <View className="w-full h-full bg-white absolute inset-0 z-50">
      <StatusBar style="dark" />
      <View className="h-full flex justify-between items-center px-6 py-10">
        <View className="w-full">
          <View className="w-full flex flex-row gap-x-3 items-center justify-between py-2">
            <Pressable onPress={props.close}>
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

            <Text className="text-center text-xl font-semibold">
              Report a Problem
            </Text>
            <Text className="text-xl font-semibold opacity-0">hello</Text>
          </View>

          <View className="w-full z-50 py-10">
            <View className="w-full border border-slate-400 p-2 rounded-2xl flex flex-row gap-x-2 items-center">
              <View className="p-2">
                <TaraLogo size={40} />
              </View>

              <TextInput
                className="flex-1 w-full text-lg"
                value={email}
                onChangeText={setEmail}
                placeholder="your@gmail.com"
              />
            </View>

            <ParagraphText
              align="center"
              fontSize="sm"
              padding="py-4 px-6"
              textColor="text-neutral-700"
            >
              We need your email so we can provide a response there.
            </ParagraphText>

            <View className="w-full">
              <Bigbox3
                title="Message"
                haba={true}
                value={message}
                chest={countDes}
                setInputValue={setMessage}
                kind="default"
                type={checkDescrip}
                placeholder="Describe your concern and our team will provide an assistance once we received your report"
              />
            </View>
          </View>
        </View>

        <View className="w-full flex gap-y-4 p-2">
          {agent && (
            <Button
              onPress={() => agentButton()}
              bgColor="bg-slate-200"
              textColor="text-neutral-700"
            >
              Talk to agent
            </Button>
          )}

          {
            !sending && <Button onPress={()=>sendMessage()}>Send</Button>
          }
          
        </View>
      </View>
    </View>
  );
};

export default ReportProblemScreen;
