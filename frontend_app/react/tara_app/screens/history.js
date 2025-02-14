import DateTimePicker from "@react-native-community/datetimepicker";
import { StatusBar } from "expo-status-bar";
import React, { useContext, useEffect, useState,useCallback } from "react";
import {
  Alert,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Linking,
  RefreshControl
} from "react-native";
import Svg, { Path } from "react-native-svg";
import Button from "../components/Button";
import {
  TaraCash,
  TaraInvoice,
  TaraKilometer,
  TaraLogo,
  TaraMarker,
  TaraNavigation,
  TaraSpeedClock,
  TaraCar,
  TaraMotor,
  TaraVan,
} from "../components/CustomIcon";
import { fetchHistory,getBookingInfo,getRiderInfo,updateBooking } from "../config/hooks";
import { DataContext } from "../context/dataContext";
import { TaraEmpty,TaraMock } from "../components/CustomGraphic";
import { AuthContext } from "../context/authContext";
import LottieView from "lottie-react-native";



const styles = StyleSheet.create({
  mapKO: {
    backgroundColor: "#f1f1f1",
    height: "80",
    width: "80",
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


//screen
const HistoryPage = ({route, navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
const [historyList, setHistoryList] = useState([])
const { user } = useContext(AuthContext);
const [date, setDate] = useState(new Date());
const [show, setShow] = useState(false);
const [isLoading, setIsLoading] = useState(false);
const { data } = useContext(DataContext);
const today = new Date().toISOString().split("T")[0]; // the need to use date once screen initialize
const [selectfilter,setFilter] = useState(false)
const [openPageBa,setPage] = useState(false)
const [dynmicData,setDynamic] = useState([])
const [rating, setRating] = useState(0);

const handleRating = async (value) => {
  setRating(value);
  const rateres = await updateBooking(dynmicData.BookingID,"Tip",value,user)
  console.log(rateres)
};


const seeInvoice = (bi) =>{
  navigation.navigate("webview", {
    track: "",
    url: `https://taranapo.com/receipt/?bookingid=${bi}`,
  });
}

  const OpenReceipt = (bi,status,dym) => {
    setDynamic(dym)
    if(status == 'Pending'){
      navigation.goBack();
      return;
    }


    setPage(true)
  
  };


 const rebookPlace = (bid) =>{
  const {mycity,start} = route.params;
  navigation.navigate("booking", {
    track: user?.userId,
    rule: 'rebook',
    wheels: dynmicData.Multiple,
    start: start,
    city: mycity,
    bookingID: bid,
  });
 }





  const ConfirmReBook = (bi) => {
    Alert.alert("Confirmation", "Would you like to rebook using the same pickup and drop-off locations?", [
      {
        text: "Close",
        type: "cancel",
      },
      {
        text: "Yes",
        onPress: async () => rebookPlace(bi),
      },
    ]);
  };


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
    data
  }) => {
    return (
      <TouchableOpacity
        onPress={() => OpenReceipt(bookingID,status,data)}
        className={`shadow-md bg-white border border-gray-200 rounded-xl p-2 my-2`}
      >
        <View className="w-full px-1.5 flex-row justify-start gap-x-1">
          <View className="mt-2">
            {
              status == 'Pending' ? (
                 <View className="relative bg-gray-500 rounded-xl overflow-hidden w-24 h-24">
                          <TaraMock size={100} />
                        <View className="absolute top-0 bottom-0 left-0 right-0 mx-auto inset-1">
                        <LottieView
                            source={require("../assets/animation/tara_search.json")}
                            autoPlay
                            loop
                            width={80}
                            height={80}
                          />
                        </View>
                        </View>
              ):(
                <StaticMapImage
              latitude={end_coordinates.split(",")[0].trim()}
              longitude={end_coordinates.split(",")[1].trim()}
            />
              )
            }
            
          </View>

          <View className="flex-1 relative h-26">
            <View className="p-2 flex-row gap-x-2 justify-start items-center w-[240px]">
              <TaraNavigation size={22} color="#22c55e" />
              <Text
                numberOfLines={2}
                ellipsizeMode="tail"
                className={`font-medium  text-md w-54`}
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

            <View className="mt-1.5 p-2 flex-row gap-x-2 justify-start items-center w-[240px]">
              <TaraMarker size={22} color="#ef4444" />
              <Text
                numberOfLines={2}
                ellipsizeMode="tail"
                className={`font-medium  text-md w-52`}

              >
                {drop}
              </Text>
            </View>
          </View>
        </View>
        <View className="my-1.5 bg-gray-200 h-px w-full"></View>
        {
          status == 'Cancelled' ? (
        <View className="py-1.5 px-2 flex-row justify-between items-center w-full">
          <View className="bg-red-500 px-2 py-1.5 rounded-xl">
            <Text className="text-white font-medium text-sm">Cancel Booking</Text>
          </View>
          <View>
            <Svg
                          xmlns="http://www.w3.org/2000/svg"
                          width={28}
                          height={28}
                          viewBox="0 0 24 24"
                          fill="#3b82f6"
                        >
            <Path d="M15.4,9.88,10.81,5.29a1,1,0,0,0-1.41,0,1,1,0,0,0,0,1.42L14,11.29a1,1,0,0,1,0,1.42L9.4,17.29a1,1,0,0,0,1.41,1.42l4.59-4.59A3,3,0,0,0,15.4,9.88Z"/>
            </Svg>
          </View>
        </View>
          ): status == 'Pending' ? (
            <View className="py-1.5 px-2 flex-row justify-between items-center w-full">
            <View className="bg-slate-100 px-2 py-1.5 rounded-xl">
              <Text className="text-slate-600 font-medium text-sm">Searching for drivers..</Text>
            </View>
            <View>
              <Svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={28}
                            height={28}
                            viewBox="0 0 24 24"
                            fill="#3b82f6"
                          >
              <Path d="M15.4,9.88,10.81,5.29a1,1,0,0,0-1.41,0,1,1,0,0,0,0,1.42L14,11.29a1,1,0,0,1,0,1.42L9.4,17.29a1,1,0,0,0,1.41,1.42l4.59-4.59A3,3,0,0,0,15.4,9.88Z"/>
              </Svg>
            </View>
          </View>
          ): status == 'Accepted' ? (
            <View className="py-1.5 px-2 flex-row justify-between items-center w-full">
            <View className="bg-green-100 px-2 py-1.5 rounded-xl">
              <Text className="text-green-600 font-medium text-sm">Heading to your location..</Text>
            </View>
            <View>
              <Svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={28}
                            height={28}
                            viewBox="0 0 24 24"
                            fill="#3b82f6"
                          >
              <Path d="M15.4,9.88,10.81,5.29a1,1,0,0,0-1.41,0,1,1,0,0,0,0,1.42L14,11.29a1,1,0,0,1,0,1.42L9.4,17.29a1,1,0,0,0,1.41,1.42l4.59-4.59A3,3,0,0,0,15.4,9.88Z"/>
              </Svg>
            </View>
          </View>
          ):(
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
            <Text className="font-medium text-md">{distance}km</Text>
          </View>

          <View className="flex-row justify-center items-center gap-x-1.5">
            {payment_type == "0" ? (
              <TaraCash size={22} />
            ) : (
              <TaraLogo size={22} />
            )}
            <Text className="font-medium text-md">{payment_type == 1 ? "Wallet" : "Cash"}</Text>
          </View>
        </View>
            
          )
        }
        
      </TouchableOpacity>
    );
  };



  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(false);
    setDate(currentDate);
    setFilter(true)
    setRefreshing(true)
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {  
      setRefreshing(false);
    }, 2000);
  }, []);


  const [bookingDetails, setBookingDetails] = useState([]);

  useEffect(() => {
    const getHistory = async () => {
      if(selectfilter){
        const dateString = date;
        var formattedDate = new Date(dateString).toISOString().split("T")[0]; //date selected in the calendar component
      }else{
        var formattedDate = today;
      }

      try {
        setIsLoading(true);
        const res = await fetchHistory(data?.user?.UserID,formattedDate,user );
        if (res.status === "success") {
          //console.log(res.data);
          setFilter(false);
          setHistoryList(res.data);
          setIsLoading(false);
         

          const bookings = res.data;
          if(!bookings){
            setBookingDetails([])
            return
          }

          // Fetch details for each booking using the BookingID
          const detailsPromises = bookings.map(async (booking) => {
            const details = await getBookingInfo(booking.BookingID,user);
            return { ...booking, ...details.data }; // Merge history with details
          });

          const allDetails = await Promise.all(detailsPromises);
          setBookingDetails(allDetails.reverse()); // Store detailed booking data
          setRefreshing(false)
        }


        
      } catch (error) {
        console.log(error);
      }
    };

    
    getHistory();
  }, [data?.user?.UserID,date]);

  return (
    <View className="w-full h-full bg-gray-50 relative ">
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
{
  bookingDetails.length == 0 ? (
    <View className="h-full flex-row justify-center items-start">
      <View className="mt-20">
      <TaraEmpty size={250} />
      <Text className="text-center mt-4 text-gray-400">aww nothing here..</Text>
      </View>
      </View>
  ):(
<FlatList
          data={bookingDetails}
          renderItem={({ item, index }) => (
            <HistoryCard
              start_coordinates={item.Pick_Coordinate}
              end_coordinates={item.Drop_Coordinate}
              amount={item.Amount}
              duration={item.Time}
              distance={item.Distance}
              payment_type={item.Payment_Type}
              rider={item.RiderID}
              when={item.Created}
              status={item.Status}
              rated={3}
              pickup={item.PickLocation}
              drop={item.Drop_Location}
              bookingID={item.BookingID}
              data={item}
            />
          )}
          keyExtractor={(item) => item.BookingID}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
  )
}
        
      </View>
      
      {openPageBa && <ExtraPage star={setRating} invoice={seeInvoice} rebook={ConfirmReBook} handleRating={handleRating} rating={rating} data={dynmicData} close={setPage} />}
      
    </View>
  );
};


const ExtraPage = ({star,invoice,data,close,rating,handleRating,rebook}) =>{

  const { user } = useContext(AuthContext);
  const vehicleitems = data ? data.Multiple.split(",") : [];
  const [riderData,setRideData] = useState([])

  useEffect(()=>{
    const getRider = async () =>{
      const riderInfo = await getRiderInfo(data.RiderID,user);
      setRideData(riderInfo.data)
    }

    if(data.Status == 'Completed' || data.Status == 'Accepted'){
      getRider()
      star(data.Tip)
    }
  },[data,user])

  return (
    <View className="w-full h-full bg-white absolute inset-0 z-50">
          <StatusBar style="dark" />
          <ScrollView>
          <View className="h-full  flex justify-between items-center px-6 py-10">
          <View className="w-full flex flex-row gap-x-3 items-center justify-between pt-2">
                      <Pressable onPress={()=>close(false)}>
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
                    </View>


        <View>
          <Text className="text-xl font-medium text-gray-800">Booking Details</Text>
        </View>


<View className="my-4 w-full border rounded-xl border-gray-300">
  <View className="p-4">
<View className="py-2 flex-row justify-start items-center w-full">
<TaraNavigation size={22} color="#22c55e" />
<View className="w-[295px]">
<Text className="ml-2.5 font-normal text-md w-full">
{data.PickLocation}
</Text>
</View>
</View>



<View className="pt-4 border-t border-gray-300 mt-1.5 flex-row justify-start items-center w-full">
<TaraMarker size={22} color="#ef4444" />
<View className="w-[295px]">
<Text className="ml-2.5 font-normal text-md w-full ">
{data.Drop_Location}
</Text>
</View>
</View>


</View>
</View>

{
  data.Status != 'Cancelled' && (
    <>
    <View className="w-full my-2 flex-row justify-between items-center">
<Text className="font-medium text-left text-lg">Driver Information</Text>
<TouchableOpacity  onPress={() => Linking.openURL("https://taranapo.com/report/")}>
  <Text className="text-blue-500 font-medium">File a report?</Text>
</TouchableOpacity>
</View>

<View className="border border-gray-300 rounded-xl py-4  w-full">
<View className="px-4 pb-2">
<View className="py-2 flex-row justify-start items-center gap-x-4">
  {
    riderData ? (
  <View className="h-20 w-20 bg-gray-300 rounded-full">
      <Image source={{ uri: riderData.Photo }} alt={riderData.Legal_Name} className="rounded-full w-full h-full object-cover" />
    </View>
    ):(
      <View className="h-20 w-20 bg-gray-300 rounded-full">
  </View>
    )
  }
  <View>

    {
      riderData.length != 0 ? (
        <Text className="font-medium text-lg">{riderData.Legal_Name}</Text>
      ):(
        <View className="bg-gray-200 rounded-lg w-56 h-7"></View>
      )
    }
    <Text>Driver Name</Text>
    
    {
      riderData.length != 0 ? (
        <Text className="text-sm text-gray-700">Plate: {riderData.Vehicle_Plate}</Text>
      ):(
        <View className="bg-gray-200 rounded-lg w-56 h-5"></View>
      )
    }
    
  </View>
</View>
</View>

<View className="px-4 border-t border-gray-300 pt-4 flex-row justify-between items-center items-center">
  <Text className="text-lg">How's my driving?</Text>
  <View style={{ flexDirection: 'row', gap:1 }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity key={star} onPress={() => handleRating(star)}>
          <Svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill={star <= rating ? "#eab308" : "#d1d5db"}
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <Path
                      d="M1.32677 12.4004L4.88677 15.0004L3.53477 19.1874C3.31628 19.8368 3.31351 20.5394 3.52688 21.1905C3.74024 21.8416 4.15831 22.4063 4.71877 22.8004C5.26962 23.2072 5.93716 23.4251 6.62192 23.4217C7.30668 23.4183 7.97201 23.1937 8.51877 22.7814L11.9998 20.2194L15.4818 22.7784C16.0316 23.1829 16.6956 23.4026 17.3781 23.4059C18.0607 23.4092 18.7268 23.196 19.2805 22.797C19.8343 22.3979 20.2473 21.8335 20.4601 21.1849C20.6728 20.5363 20.6745 19.837 20.4648 19.1874L19.1128 15.0004L22.6728 12.4004C23.2219 11.999 23.6301 11.4342 23.8391 10.7868C24.0481 10.1395 24.0472 9.44263 23.8364 8.79583C23.6257 8.14903 23.216 7.58537 22.6658 7.18535C22.1156 6.78533 21.453 6.56941 20.7728 6.56844H16.3998L15.0728 2.43244C14.8641 1.7814 14.454 1.21346 13.9017 0.810508C13.3494 0.407559 12.6834 0.19043 11.9998 0.19043C11.3161 0.19043 10.6501 0.407559 10.0978 0.810508C9.5455 1.21346 9.13544 1.7814 8.92677 2.43244L7.59977 6.56844H3.23077C2.55051 6.56941 1.88796 6.78533 1.33775 7.18535C0.787534 7.58537 0.377806 8.14903 0.167087 8.79583C-0.0436323 9.44263 -0.044565 10.1395 0.164422 10.7868C0.37341 11.4342 0.781627 11.999 1.33077 12.4004H1.32677Z"
                    />
                  </Svg>
        </TouchableOpacity>
      ))}
      </View>
</View>
</View>
    </>
  )
}


<View className="my-4 border border-gray-300 rounded-xl p-4 gap-y-4">
  <View className="flex-row justify-between items-center w-full">
  <Text className="font-medium">Amount</Text>
  <Text>&#8369;{data.Amount}.00</Text>
  </View>

  <View className="flex-row justify-between items-center w-full">
  <Text className="font-medium">Status</Text>
 {
  data.Status == 'Cancelled' ? (
    <View className="bg-red-500 rounded-xl px-2.5 py-0.5">
    <Text className="text-white text-sm">{data.Status}</Text>
    </View>
  ):(
    <View className="bg-green-500 rounded-xl px-2.5 py-0.5">
    <Text className="text-white text-sm">{data.Status}</Text>
    </View>
  )
 }
  </View>

  <View className="flex-row justify-between items-center w-full">
  <Text className="font-medium">Mode of Payment</Text>
  <View className="flex-row justify-center items-center gap-x-1.5">
            {data.Payment_Type == "0" ? (
              <TaraCash size={22} />
            ) : (
              <TaraLogo size={22} />
            )}
            <Text className="font-medium text-md">{data.Payment_Type == 1 ? "Wallet" : "Cash"}</Text>
          </View>
  </View>


  <View className="flex-row justify-between items-center w-full">
  <Text className="font-medium">Transact Date</Text>
  <Text className="text-gray-600">{data.Created}</Text>
  </View>

  <View className="flex-row justify-between items-center w-full">
  <Text className="font-medium">Last Wallet Balance</Text>
  <Text>&#8369;{data.LastWallet}.00</Text>
  </View>




  <View className="flex-row justify-between items-center w-full">
  <Text className="font-medium">Vehicle</Text>
  <View className="flex-row justify-center items-center">
  {vehicleitems.length > 0 ? (
       vehicleitems.map((item, index) => (
          <View key={index}>
            {item.trim() == '2' ? <TaraMotor size={25} /> :item.trim() == '5' ? <TaraVan size={25} /> : <TaraCar size={25} />}
          </View>
        ))
      ) : (
        <Text>N/A</Text>
      )}
      </View>
  </View>




</View>

<View className="w-full gap-y-2.5">
{
  data.Status == 'Completed' && (
    <Button
  onPress={()=>invoice(data.BookingID)}
bgColor="bg-slate-200"
textColor="text-neutral-700"
bwidth="w-full"
hasIcon={true}
>
<TaraInvoice size={19} />
<Text className="text-lg font-medium">See Invoice</Text>
</Button>
  )
}

{
  data.Status != 'Accepted' && (
<Button
onPress={()=>rebook(data.BookingID)}
bgColor="bg-blue-500"
textColor="text-white"
bwidth="w-full"
>
Rebook
</Button>
  )
}




</View>



            </View>
            </ScrollView>
            </View>
  )
}


export default HistoryPage;
