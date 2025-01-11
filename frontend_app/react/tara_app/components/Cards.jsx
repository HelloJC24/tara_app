import { TouchableOpacity,Text,View } from "react-native"
import { TaraMarker,TaraNavigation } from "./CustomIcon"



export const LocationCard = (props) =>{
    return (
        <TouchableOpacity className="flex-row justify-start items-center p-2 gap-x-4">
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
    <Text numberOfLines={2} ellipsizeMode="tail" className="font-medium text-gray-800">San Pedro, Puerto Princesa City, Mandaragat New Buncag Tulingan Street</Text>
    <Text numberOfLines={1} ellipsizeMode="tail" className="font-normal text-sm text-gray-500">Palawan Philippines 5300 Earth 456 Milky Way Galaxy Ominiverse</Text>
</View>
</TouchableOpacity>
    )
}