import { Keyboard, Text, TouchableOpacity, View } from "react-native";
import Button from "./Button";
import { TaraLogo, TaraMarker, TaraNavigation } from "./CustomIcon";

export const LocationCard = ({
  autoDrop,
  sheet,
  pickupname,
  dropname,
  data,
  setPickup,
  setDrop,
  reset,
  ...props
}) => {
  const thisLocation = () => {
    if (props.infoMode == 1) {
      pickupname(data.Location);
      setPickup(data.NRF);
      sheet.current?.open();
      Keyboard.dismiss();
      autoDrop(2);
    } else {
      //drop
      dropname(data.Location);
      setDrop(data.NRF);
      sheet.current?.close();
      Keyboard.dismiss();
    }
    reset(null);
  };

  return (
    <TouchableOpacity
      onPress={() => thisLocation()}
      className="flex-row justify-start items-center p-2 gap-x-4"
    >
      <View className="border border-gray-200 rounded-xl p-4">
        {props.infoMode == 1 ? (
          <TaraNavigation size={28} color="#22c55e" />
        ) : (
          <TaraMarker size={28} color="#ef4444" />
        )}
      </View>
      <View className="w-72">
        <Text
          numberOfLines={2}
          ellipsizeMode="tail"
          className="font-medium text-gray-800"
        >
          {data.Location}
        </Text>
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          className="font-normal text-sm text-gray-500"
        >
          {data.Main}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export const LocationCardDrag = (props) => {
  return (
    <View className="flex-row justify-start items-center p-2 gap-x-4">
      <View className="border border-gray-200 rounded-xl p-4">
        {props.infoMode == 1 ? (
          <TaraNavigation size={28} color="#22c55e" />
        ) : (
          <TaraMarker size={28} color="#ef4444" />
        )}
      </View>
      <View className="w-72">
        <Text
          numberOfLines={2}
          ellipsizeMode="tail"
          className="font-medium text-gray-800"
        >
          {props.DragLocationName == "Error: INVALID_REQUEST"
            ? "Hmm.. Drag again"
            : props.DragLocationName}
        </Text>
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          className="font-normal text-sm text-gray-500"
        >
          {props.data.lat ?? "Drag"},
          {props.data.lng ?? " scroll, or move to pin location"}
        </Text>
      </View>
    </View>
  );
};

export const HelloVisitor = ({ uwu }) => {
  return (
    <View>
      <View className="bg-blue-500 p-4 rounded-2xl shadow-lg flex-row justify-between items-center">
        <View>
          <Text className="font-medium text-xl text-white">
            Done exploring?
          </Text>
          <Text className="font-normal text-sm text-blue-200">
            Unlock all awesome features!
          </Text>
        </View>

        <View className="flex-row justify-center items-center gap-x-2.5">
          <TouchableOpacity
            onPress={() => uwu("create")}
            className="bg-gray-800 px-2.5 py-1.5 rounded-lg shadow-lg"
          >
            <Text className="text-white font-medium text-lg">Create</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => uwu("login")}
            className="bg-gray-800 px-2.5 py-1.5 rounded-lg shadow-lg"
          >
            <Text className="text-white font-medium text-lg">Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export const BookingCard = ({ bookingID }) => {
  return (
    <View className="w-full p-4 rounded-2xl shadow-md border border-slate-100 bg-white">
      <View className="w-full flex flex-row gap-x-4 items-center">
        <TaraLogo size={40} />

        <View className="">
          <Text className="font-bold text-lg">You Received a booking</Text>
          <Text className="text-base">Booking ID: {bookingID}</Text>
        </View>

        <Text className="text-sm text-neutral-500 self-end">Just now</Text>
      </View>

      <View className="py-2 flex-row justify-between items-center gap-x-2">
        <View className="flex-1">
          <Button>View Ride</Button>
        </View>
        <View className="flex-1">
          <Button bgColor="bg-slate-200" textColor="text-neutral-700">
            Forward
          </Button>
        </View>
      </View>
    </View>
  );
};
