import DateTimePicker from "@react-native-community/datetimepicker";
import { StatusBar } from "expo-status-bar";
import React, { useContext, useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { TaraEmpty } from "../components/CustomGraphic";
import {
  TaraCash,
  TaraInvoice,
  TaraKilometer,
  TaraLogo,
  TaraMarker,
  TaraNavigation,
  TaraSpeedClock,
} from "../components/CustomIcon";
import { fetchHistory } from "../config/hooks";
import { DataContext } from "../context/dataContext";

const styles = StyleSheet.create({
  mapKO: {
    backgroundColor: "#f1f1f1",
    height: "90",
    width: "90",
    borderRadius: 10,
  },
});

const StaticMapImage = ({ latitude, longitude }) => {
  const accessToken =
    "pk.eyJ1IjoibWFyaWExMDIwMjQiLCJhIjoiY20yd29uN3gxMDljNTJqcHdreHBuaXJrbyJ9.t2UfftJcFzJNjyhBZL3bnw";
  const mapUrl = `https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/pin-s+ff0000(${longitude},${latitude})/${longitude},${latitude},14.03,0/300x200?logo=false&access_token=${accessToken}`;
  //console.log(mapUrl)
  return (
    <View>
      <Image source={{ uri: mapUrl }} style={styles.mapKO} />
    </View>
  );
};

const HistoryPage = ({ navigation }) => {
  const OpenReceipt = (bi) => {
    navigation.navigate("webview", {
      track: "",
      url: `https://taranapo.com/receipt/?bookingid=${bi}`,
    });
  };

  const ConfirmReBook = (bi, pickup, drop) => {
    Alert.alert("Confirmation", `Do you want to rebook ${pickup} to ${drop}?`, [
      {
        text: "Close",
        type: "cancel",
      },
      {
        text: "Yes, Rebook",
        onPress: async () => {},
      },
    ]);
  };

  const [historyList, setHistoryList] = useState([]);
  //   {
  //     id: "1",
  //     bookingID: "TRA-521212021",
  //     start_coordinates: "14.593021375747188, 121.03227310082738",
  //     end_coordinates: "14.604909740365962, 121.07717689987197",
  //     pickup: "New Buncag, Bgy. Mandaragat",
  //     drop: "San Jose, Puerto Princesa City",
  //     amount: 99,
  //     distance: "5.2km",
  //     duration: "10mins",
  //     payment_type: "Cash",
  //     status: "Completed",
  //     rider: 5165554,
  //     when: "Yesterday",
  //     rated: true,
  //   },
  //   {
  //     id: "2",
  //     bookingID: "TRA-521212021",
  //     start_coordinates: "14.593021375747188, 121.03227310082738",
  //     end_coordinates: "14.604909740365962, 121.07717689987197",
  //     pickup: "New Buncag, Bgy. Mandaragat, Puerto Princesa City",
  //     drop: "San Jose, Puerto Princesa City, Palawan 5300",
  //     amount: 99,
  //     distance: "5.2km",
  //     duration: "10mins",
  //     payment_type: "Wallet",
  //     status: "Completed",
  //     rider: 5165554,
  //     when: "Yesterday",
  //     rated: true,
  //   },
  // ]);

  const HistoryCard = ({
    start_coordinates,
    end_coordinates,
    amount,
    distance,
    duration,
    payment_type,
    status,
    rider,
    when,
    rated,
    pickup,
    drop,
    bookingID,
  }) => {
    return (
      <TouchableOpacity
        onPress={() => OpenReceipt(bookingID)}
        className="shadow-md bg-white border border-gray-200 rounded-xl p-2 my-2"
      >
        <View className="w-full px-1.5 flex-row justify-start gap-x-1">
          <View className="mt-2">
            <StaticMapImage
              latitude={end_coordinates.split(",")[0].trim()}
              longitude={end_coordinates.split(",")[1].trim()}
            />
          </View>

          <View className="flex-1 relative h-26">
            <View className="p-2 flex-row gap-x-2 justify-start items-center w-72">
              <TaraNavigation size={22} color="#22c55e" />
              <Text
                numberOfLines={2}
                ellipsizeMode="tail"
                className="font-medium text-md"
              >
                {pickup}
              </Text>
            </View>

            <View
              className={`absolute w-4 gap-y-1.5 ${
                pickup.length > 28 ? "mt-5 top-8" : "top-8 mt-0.5"
              } left-4`}
            >
              <View className="h-1.5 w-1.5 bg-gray-300 rounded-full"></View>
              <View className="h-1.5 w-1.5 bg-gray-300 rounded-full"></View>
            </View>

            <View className="mt-1.5 p-2 flex-row gap-x-2 justify-start items-center w-72">
              <TaraMarker size={22} color="#ef4444" />
              <Text
                numberOfLines={2}
                ellipsizeMode="tail"
                className="font-medium text-md"
              >
                {drop}
              </Text>
            </View>
          </View>
        </View>
        <View className="my-1.5 bg-gray-200 h-px w-full"></View>
        <View className="py-2 px-2 flex-row justify-between items-center w-full">
          <View className="flex-row justify-center items-center gap-x-1.5">
            <TaraInvoice size={15} />
            <Text className="font-medium text-md">&#8369;{amount}</Text>
          </View>

          <View className="flex-row justify-center items-center gap-x-1.5">
            <TaraSpeedClock size={15} />
            <Text className="font-medium text-md">{duration}</Text>
          </View>

          <View className="flex-row justify-center items-center gap-x-1.5">
            <TaraKilometer size={15} />
            <Text className="font-medium text-md">{distance}</Text>
          </View>

          <View className="flex-row justify-center items-center gap-x-1.5">
            {payment_type == "Cash" ? (
              <TaraCash size={22} />
            ) : (
              <TaraLogo size={22} />
            )}
            <Text className="font-medium text-md">{payment_type}</Text>
          </View>
        </View>

        <View className="w-full flex flex-row gap-x-4 items-center">
          <TaraLogo size={40} />

          <View className="">
            <Text className="font-bold text-lg">Customer Name</Text>
            <Text className="text-base">John Doe</Text>
          </View>

          <Text className="text-sm text-neutral-500 self-start">Just now</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { data } = useContext(DataContext);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(false);
    setDate(currentDate);
    //run API
  };

  useEffect(() => {
    const getHistory = async () => {
      try {
        setIsLoading(true);
        const res = await fetchHistory(data?.user?.UserID, date);

        if (res.status === "success") {
          console.log(res.data);
          // setHistoryList(res.data);
          setIsLoading(false);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getHistory();
  }, [data?.user?.UserID, date]);

  return (
    <View className="w-full h-full bg-white relative ">
      <StatusBar style="dark" />
      <View className="h-full px-6 py-10">
        <View className="w-full flex flex-row items-center justify-between py-2">
          <Pressable onPress={() => navigation.goBack()}>
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
          <Text className="text-xl font-semibold">History</Text>

          <TouchableOpacity
            onPress={() => setShow(true)}
            className="bg-slate-200 p-2 rounded-xl"
          >
            <Svg
              width="20"
              height="20"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <Path
                d="M11.875 1.25H11.25V0.625C11.25 0.45924 11.1842 0.300269 11.0669 0.183058C10.9497 0.065848 10.7908 0 10.625 0C10.4592 0 10.3003 0.065848 10.1831 0.183058C10.0658 0.300269 10 0.45924 10 0.625V1.25H5V0.625C5 0.45924 4.93415 0.300269 4.81694 0.183058C4.69973 0.065848 4.54076 0 4.375 0C4.20924 0 4.05027 0.065848 3.93306 0.183058C3.81585 0.300269 3.75 0.45924 3.75 0.625V1.25H3.125C2.2965 1.25099 1.50222 1.58055 0.916387 2.16639C0.330551 2.75222 0.000992411 3.5465 0 4.375L0 11.875C0.000992411 12.7035 0.330551 13.4978 0.916387 14.0836C1.50222 14.6694 2.2965 14.999 3.125 15H11.875C12.7035 14.999 13.4978 14.6694 14.0836 14.0836C14.6694 13.4978 14.999 12.7035 15 11.875V4.375C14.999 3.5465 14.6694 2.75222 14.0836 2.16639C13.4978 1.58055 12.7035 1.25099 11.875 1.25ZM1.25 4.375C1.25 3.87772 1.44754 3.40081 1.79917 3.04917C2.15081 2.69754 2.62772 2.5 3.125 2.5H11.875C12.3723 2.5 12.8492 2.69754 13.2008 3.04917C13.5525 3.40081 13.75 3.87772 13.75 4.375V5H1.25V4.375ZM11.875 13.75H3.125C2.62772 13.75 2.15081 13.5525 1.79917 13.2008C1.44754 12.8492 1.25 12.3723 1.25 11.875V6.25H13.75V11.875C13.75 12.3723 13.5525 12.8492 13.2008 13.2008C12.8492 13.5525 12.3723 13.75 11.875 13.75Z"
                fill="#374957"
              />
              <Path
                d="M7.5 10.3125C8.01777 10.3125 8.4375 9.89277 8.4375 9.375C8.4375 8.85723 8.01777 8.4375 7.5 8.4375C6.98223 8.4375 6.5625 8.85723 6.5625 9.375C6.5625 9.89277 6.98223 10.3125 7.5 10.3125Z"
                fill="#374957"
              />
              <Path
                d="M4.375 10.3125C4.89277 10.3125 5.3125 9.89277 5.3125 9.375C5.3125 8.85723 4.89277 8.4375 4.375 8.4375C3.85723 8.4375 3.4375 8.85723 3.4375 9.375C3.4375 9.89277 3.85723 10.3125 4.375 10.3125Z"
                fill="#374957"
              />
              <Path
                d="M10.625 10.3125C11.1428 10.3125 11.5625 9.89277 11.5625 9.375C11.5625 8.85723 11.1428 8.4375 10.625 8.4375C10.1072 8.4375 9.6875 8.85723 9.6875 9.375C9.6875 9.89277 10.1072 10.3125 10.625 10.3125Z"
                fill="#374957"
              />
            </Svg>
            {show && (
              <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode="date"
                is24Hour={true}
                display="default"
                onChange={onChange}
              />
            )}
          </TouchableOpacity>
        </View>
        {historyList.length == 0 ? (
          <View className="h-full flex-row justify-center items-start">
            <View className="mt-20">
              <TaraEmpty size={250} />
              <Text className="text-center mt-4 text-gray-400">
                aww nothing here..
              </Text>
            </View>
          </View>
        ) : (
          <FlatList
            data={historyList}
            renderItem={({ item, index }) => (
              <HistoryCard
                start_coordinates={item.start_coordinates}
                end_coordinates={item.end_coordinates}
                amount={item.amount}
                duration={item.duration}
                distance={item.distance}
                payment_type={item.payment_type}
                rider={item.rider}
                when={item.when}
                rated={item.rated}
                pickup={item.pickup}
                drop={item.drop}
                bookingID={item.id}
              />
            )}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </View>
  );
};

export default HistoryPage;
