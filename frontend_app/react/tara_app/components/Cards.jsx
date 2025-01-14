import { TouchableOpacity,Text,View,Keyboard } from "react-native"
import { TaraMarker,TaraNavigation } from "./CustomIcon"



export const LocationCard = ({sheet,pickupname,dropname,data,setPickup,setDrop,reset, ...props}) =>{
    
const thisLocation = () =>{
    if(props.infoMode == 1){
        pickupname(data.Location)
        setPickup(data.NRF)
    }else{
        dropname(data.Location)
        setDrop(data.NRF)
    }
    reset(null)
    sheet.current?.close()
    Keyboard.dismiss()
}


    return (
        <TouchableOpacity onPress={()=>thisLocation()} className="flex-row justify-start items-center p-2 gap-x-4">
<View className="border border-gray-200 rounded-xl p-4">
{
    props.infoMode == 1 ? (
<TaraNavigation size={28} color="#22c55e" />
    ):(
<TaraMarker size={28} color="#ef4444" />
    )
}

</View> 
<View className="w-72">
    <Text numberOfLines={2} ellipsizeMode="tail" className="font-medium text-gray-800">{data.Location}</Text>
    <Text numberOfLines={1} ellipsizeMode="tail" className="font-normal text-sm text-gray-500">{data.Main}</Text>
</View>
</TouchableOpacity>
    )
}