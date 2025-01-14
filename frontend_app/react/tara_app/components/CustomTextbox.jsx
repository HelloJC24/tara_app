import { View,Text,TextInput } from "react-native";
import { useEffect,useState,useRef } from "react";

export const Bigbox3 = ({setInputValue,haba, ...props}) => {
    const [inputDes, setInputDes] = useState(null);
    const [desLength, setDesLength] = useState(0);
    let maxIn2 = 500;
  const [height, setHeight] = useState(40); // Initial height
  const textInputRef = useRef(null);
  const onContentSizeChange = (event) => {
    setHeight(event.nativeEvent.contentSize.height);
  };
  
  useEffect(()=>{
    if (props.value) {
      setDesLength(props.value.length);
    }
  },[props.value]);
  
  
  useEffect(() => {
    // Force a re-render to trigger onContentSizeChange
    const timeout = setTimeout(() => {
      forceUpdate();
    
    }, 100); // Adjust the delay value as needed
  
    return () => clearTimeout(timeout); // Cleanup the timeout on component unmount
  }, [forceUpdate]); // Empty dependency array ensures this effect runs only once, like componentDidMount
  
  const forceUpdate = () => {
    //Update the state with a dummy value to force a re-render
    setHeight((prevHeight) => prevHeight + 1);
  };
  
  
  
  
  
  const checkDesInput = (text) => {
   if (text.length <= maxIn2) {
      setInputDes(text);
      setInputValue(text);
      setDesLength(text.length);
    }    
  };
  
  
  
  
  return (
      <View className="relative my-1.5 font-normal text-base py-4 px-4 rounded-xl border border-slate-400 bg-white w-full text-zinc-800">
    <TextInput
    ref={textInputRef}
      style={{ height: Math.max(60, height)}}
      multiline={true}
      value={props.value}
      maxLength={maxIn2}
      onChangeText={checkDesInput}
      placeholder={props.placeholder}
      onContentSizeChange={onContentSizeChange}
  
    />
  
  <Text className="px-1.5 absolute -top-2 left-4 text-xs bg-white text-gray-500">{props.title}</Text>
  <Text className="px-1.5 absolute -bottom-2 right-4 text-xs bg-white text-gray-500">{desLength}/{maxIn2}</Text>
  
    </View>
  );
  };