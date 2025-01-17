import { View, Text,TouchableOpacity, ScrollView, TextInput, Pressable, StyleSheet,Animated,Image,PanResponder,FlatList,Alert } from "react-native";
import { WebView } from 'react-native-webview';
import Svg, { Circle, Path,Rect,Defs, Filter, FeGaussianBlur } from "react-native-svg";
import LottieView from 'lottie-react-native';
import BottomSheet from "@devvie/bottom-sheet";
import { useRef,useEffect, useState, use } from "react";
import Button from "../components/Button";
import animationMarker from '../assets/animation/marker.json';
import { 
TaraInvoice, 
TaraCash, 
TaraNavigation, 
TaraMarker, 
TaraChange, 
TaraTarget, 
TaraPin, 
TaraNotice, 
TaraLogo, 
TaraQR,
TaraWalletIcon,
TaraCar,
TaraMotor,
TaraVan
} from "../components/CustomIcon";
import { LocationCard } from "../components/Cards";
import {Slider} from '@miblanchard/react-native-slider';
import axios from 'axios';
import * as Location from 'expo-location';
import { useToast } from "../components/ToastNotify";
import QRCodeStyled from 'react-native-qrcode-styled';

const BookingPage = ({route,navigation}) =>{
 const sheetRef = useRef(null);
 const sheetRef2 = useRef(null);
 const sheetRef3 = useRef(null);
 const lottieRef = useRef(null);
 const [suggest,setSuggest] = useState(false)
 const [viewRiderMap,setViewRiders] = useState(false)
 const [vehicleType,setVehicle] = useState(1)
 const [pickupName,setPickupName] = useState("")
 const [dropName,setDropName] = useState("")
 const [infoMode, setInfoMode] = useState(1) //using 2 is drop mode
 const [infoInput, setInfoInput] = useState("")
 const [MapPin,setMapPin] = useState(false)
 const [calculated,setCalculated] = useState(false) //already calculated the rate
 const [offerCom,setComOffer] = useState(false)
 const [minimizeView,setMinizeView] = useState(false)
 const [fareRate,setFareRate] = useState(0)
 const [cSlide,setCustomSlide] = useState(0)
 const [cSlideEffect,setCSlideEffect] = useState("blue")
 const [searching,setSearching] = useState(false) // true searching and false - try agian
 const [rider,setRider] = useState(false) //true rider found
 const [bookState,setBookState] = useState(1) //1 waiting, 2 ontheway, 3 pickup,
 const [taraSafe,setTaraSafe] = useState(true)
 const [bookingID,setBookingID] = useState(null)
 const [pickupCoordinates,setPickupCoordinates] = useState(null)
 const [dropCoordinates,setDropCoordinates] = useState(null)
 const [fareAPIResponse,setFareAPIResponse] = useState([])
 const [pickmotor,selectMotor] = useState(false)
 const [pickcar4,selectCard4] = useState(false)
 const [pickcard6,selectCar6] = useState(false)
 const [pickVan,selectVan] = useState(false)
 const [activemotor,selectActiveMotor] = useState(true)
 const [activecar4,selectActiveCard4] = useState(true)
 const [activecard6,selectActiveCar6] = useState(true)
 const [activeVan,selectActiveVan] = useState(true)
 const [myLocation,setMyLocation] = useState([])
 const webViewRef = useRef(null);
 const [webLoad,setWebLoad] = useState(false)
const [locationPermission,setPermissionAsk] = useState(false);
const [location, setLocation] = useState([])
const [showCurrentLocation,setCurrentLocation] = useState(false);
const toast = useToast();
const [slideGuide,setSlideGuide] = useState(true);
const [generateQR,setGenerateQR] = useState(false)

const showToast = (type,msg) => {
toast(type, msg);
};


useEffect(()=>{
const {wheels,start} = route.params;
if(route.params){
addVehicle(wheels)
setMyLocation(`${start.coords.latitude}>>>${start.coords.longitude}`)
//setVehicle(wheels)
//disabling vehicles
switch (wheels) {
    case 2:
        return selectActiveVan(false)
    case 5:
        return selectActiveMotor(false)
}

}
},[route])



useEffect(()=>{
const calculateMetric = async ()=>{
const fareAPI = await axios.get(
`https://onthewaypo.com/OTW/api/metrics/`,
{
    params: {
    from: pickupCoordinates,
    to:dropCoordinates
    },
}
);

//console.log(fareAPI.data)
if(fareAPI.data){
setFareAPIResponse(fareAPI.data.data)
setCalculated(true)
setFareRate(fareAPI.data.data.amount)
}
}

calculateMetric();

},[dropName,dropCoordinates])

const myPinLocation = async () =>{
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        if(location.mocked){
            //exit
        }else{
            setLocation(location);
            setCurrentLocation(true);
            //replace start
            setMyLocation(`${location.coords.latitude}>>>${location.coords.longitude}`)
            //provide name in the pickup
        }
        
        
}

const switchLocations = () =>{
    setPickupCoordinates(dropCoordinates)
    setPickupName(dropName)
    setDropCoordinates(pickupCoordinates)
    setDropName(pickupName)
    setCalculated(false)
}
  
const selectLocation = (selectMode) =>{
    setInfoMode(selectMode)
    sheetRef.current?.open();  
}

const addVehicle = (vh) =>{
    switch(vh) {
        case 4:
            return pickcar4 ? selectCard4(false) : selectCard4(true)
        case 4.5:
            return pickcard6 ? selectCar6(false) : selectCar6(true)
        case 5:
            return pickVan ? selectVan(false) : selectVan(true)
        default:
            return pickmotor ? selectMotor(false) : selectMotor(true)
    }

}

const RequestVehicle = () =>{
    showToast("try_again","This is vehicle is not available.");
}

const goSearchRider = async () =>{
//connect to API
setSearching(true);
}

const cancelSearch = () =>{
    setSearching(false);
}

const selectCurrentLocation = () =>{
    sheetRef.current?.close();
    setSuggest(false);
    myPinLocation();
    //run location permission
}

const selectPinMap = () =>{
    sheetRef.current?.close(); 
    setSuggest(false);
    setMapPin(true)
}

const viewRiders = () =>{
    setSuggest(false);
    setViewRiders(true)
    showToast("try_again","Viewing nearby drivers..");
    //run api
}

const backToBooking = () =>{
    setViewRiders(false)
    //clear markers
}

const InputLocation = async (e) =>{
    setInfoInput(e)
    await searchLocations(e);
}

const selectThisLocation = () =>{
    setMapPin(false)
}

const openBoxOffer = () =>{
    if(offerCom){
        setComOffer(false)
    }else{
        setComOffer(true)
    }
}

const closeMap = () =>{
    if(MapPin){
        setMapPin(false)
    }else if(viewRiderMap){
        setViewRiders(false)  
    }else{
        navigation.goBack()
    }
}


//SCREEN NAVIGATION

const openTaraSafe = () =>{
    navigation.navigate('account', {
        purpose: 'tarasafe',
        track: "user"
        });
}

const openChat = () =>{
    navigation.navigate('inbox', {
        purpose: 'chat',
        sender: "user",
        receiver: "riderID"
        });
}

const QRBooking = () =>{
    if(generateQR){
        setGenerateQR(false)
    }else{
        setGenerateQR(true)
    }
}

const handleWebViewMessage = (event) => {
const data = JSON.parse(event.nativeEvent.data);
//Alert.alert("Message from Web Page", data.message);
};



useEffect(()=>{
    const jsonData = JSON.stringify({ 
        message: "Tara APP",
        MyPin: myLocation, 
        search: searching,
        pollyline: calculated,
        start: pickupCoordinates,
        end: dropCoordinates,
        vehicle: 0,
        viewriders: viewRiderMap,
        stop: 0,
        meme: showCurrentLocation,
        timestamp: new Date().toISOString()
    });
    // console.log(jsonData)
    webViewRef.current?.injectJavaScript(`
        document.dispatchEvent(new MessageEvent('message', { data: '${jsonData}' }));
        true; // Suppress warnings
    `);
},[webViewRef,
    webLoad,
    searching,
    setSearching,
    calculated,
    setCalculated,
    viewRiderMap,
    setViewRiders,
    showCurrentLocation,
    setCurrentLocation])


  //ANIMATIOn

const defaultOptions = {
    animationData: animationMarker,
    autoplay: false, // Prevent autoplay
    loop:false,
    speed: 1,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
  };



  const translateX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Create a looping bounce animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(translateX, {
          toValue: 500, // Move to the right
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(translateX, {
          toValue: 800, // Move back to the left
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [translateX]);
 
  const pan = useRef(new Animated.ValueXY()).current;
 
  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (evt, gestureState) => {
      if (gestureState.dy > 0) {
        setMinizeView(true)
      } else {
        setMinizeView(false)
      }
    },
    onPanResponderRelease: () => {
      Animated.spring(pan, {
        toValue: { x: 0, y: 0 },
        useNativeDriver: true,
      }).start();
    },
  });


  const fadeAnim = useRef(new Animated.Value(0)).current; // Opacity for fade
  const scaleAnim = useRef(new Animated.Value(1)).current; // Scale for zoom
 

  const fadeIn = () => {
    fadeAnim.stopAnimation();
    scaleAnim.stopAnimation();

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const fadeOutAndZoom = () => {
    setCSlideEffect('blue')
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0.8, // Zoom out slightly
        duration: 300,
        delay: 2000, // Wait for 2 seconds before zooming out
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        delay: 2100, // Wait for 2 seconds before fading out
        useNativeDriver: true,
      }),
    ]).start();
  };



const styles = StyleSheet.create({
    marker: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        paddingBottom: 43,
        transform: 'translate(-50%, -50%)',
        zIndex: 999
    },
    bar: {
        height: 5,
        backgroundColor: '#cbd5e1',
        borderRadius: 10,
        width:100
      }
  });




  

  const handleValueChange = (value) => {
    fadeIn();
    setCustomSlide(value)
    scaleAnim.setValue(1); // Reset scale when sliding
    setCSlideEffect('green')
    switch (value[0]) {
        case 0:
          return setFareRate(fareAPIResponse.discount2);
        case 3:
          return setFareRate(fareAPIResponse.discount1);
        case 9:
          return  setFareRate(fareAPIResponse.tip1)
        case 12:
          return  setFareRate(fareAPIResponse.tip2)
        default:
          return setFareRate(fareAPIResponse.amount);
      }
    
  };

  const handleSlidingComplete = () => {
    fadeOutAndZoom();
  };

  const renderAboveThumbComponent = () => {
    return (
      <Animated.View
      className={`${cSlide > 5 ? 'right-[80px]' : 'left-4'} p-2  rounded-xl shadow-2xl bg-green-500`}
        style={[
          {
            opacity: fadeAnim, // Bind opacity to fadeAnim
            transform: [{ scale: scaleAnim }], // Bind scale to scaleAnim
          },
        ]}
      >
        <Text className="font-medium text-white text-3xl">&#8369;{fareRate}</Text>
      </Animated.View>
    );
  };



const CustomThumb = () => (
    <View className={`w-6 h-5 bg-${cSlideEffect}-500 rounded-lg`}>
    </View>
);



  const [locations, setLocations] = useState([]);
  const [errorAPI, setError] = useState('');

  const searchLocations = async (place) => {
    try {
      const response = await axios.get(
        `https://onthewaypo.com/OTW/api/locations/`,
        {
          params: {
            search: infoInput,
            track:myLocation
          },
        }
      );

      if (response.data && response.data.length > 0) {
        setLocations(response.data);
        setError('');
      } else {
        setLocations([]);
        setError('No locations found');
      }
    } catch (error) {
      setError('An error occurred while fetching data');
      console.error(error);
    }
  };



return (
    <>
    <ScrollView>
<View className="bg-slate-100 h-screen w-screen">
<View  className="relative h-full w-full">


<TouchableOpacity onPress={() => closeMap()} className="flex justify-center items-center bg-white inset-0 z-40 w-12 h-12 absolute top-12 left-4 rounded-full shadow-xl">
   <Svg
              xmlns="http://www.w3.org/2000/svg"
              width={30}
              height={30}
              viewBox="0 0 24 24"
              fill="#374957"
            >
              <Path d="M19 11H9l3.29-3.29a1 1 0 0 0 0-1.42 1 1 0 0 0-1.41 0l-4.29 4.3A2 2 0 0 0 6 12a2 2 0 0 0 .59 1.4l4.29 4.3a1 1 0 1 0 1.41-1.42L9 13h10a1 1 0 0 0 0-2Z" />
            </Svg>
</TouchableOpacity>


    {
        suggest && (    
<View className="inset-0 z-50 mx-auto absolute left-0 right-0 top-24 mt-2 px-4 h-48">
    <View className="border border-gray-200 bg-white rounded-xl shadow-lg p-2 overflow-hidden w-full">
        <View className="flex-row justify-start items-center gap-x-2.5 w-auto">
        <LottieView
                          source={require('../assets/animation/tara.json')}
                          autoPlay
                          loop
                          width={40}
                          height={40}
                      />
            <Text className="text-lg font-medium">AI Suggestions</Text>
        </View>
        <View className="px-2">
        <Text className="text-gray-600 text-base">Are you going to <Text className="text-blue-500 font-medium">SM Puerto?</Text> and drop your location to <Text className="text-blue-500 font-medium">New Buncag?</Text></Text>
        </View>
        <View className="p-2 gap-x-2 flex-row justify-between items-center">
        <Button
onPress={() => setSuggest(false)}
bgColor="bg-slate-200"
textColor="text-gray-500"
fontSize="md"
bwidth="w-48"
>
No
</Button>
<Button
onPress={() => sheetRef.current?.close()}
bgColor="bg-blue-500"
textColor="text-white"
fontSize="md"
bwidth="w-48"
>
Quick Book
</Button>
        </View>
    </View>
</View>  
        )
    }







<View className="h-screen w-screen relative">

{
    MapPin && (
        <View style={styles.marker}>
<LottieView
source={require('../assets/animation/marker.json')}
ref={lottieRef}
options={defaultOptions}
width={120}
height={120}
/>
</View>
    )
}



{
    searching && (
        <View style={styles.marker}>
<LottieView
source={require('../assets/animation/tara_search.json')}
autoPlay
loop
width={200}
height={200}
/>
</View>
    )
}

<WebView
ref={webViewRef}
source={{ uri: `https://onthewaypo.com/OTW/api/playground/map/` }}
javaScriptEnabled={true}
onMessage={handleWebViewMessage}
className="bg-white"
onLoad={()=>setWebLoad(true)}
onTouchStart={()=>setMinizeView(true)}
cacheEnabled={false}

/>




</View>







</View>





{
    !MapPin ? (

<View
  className={`fixed ${
    viewRiderMap
      ? 'bottom-[70px]'
      : minimizeView == true && rider == true && bookState == 3
      ? 'bottom-[310px]'
      : minimizeView == true && rider == true
      ? 'bottom-[270px]'
      : minimizeView == true
      ? 'bottom-[200px]'
      : rider == true
      ? 'bottom-[610px]'
      : searching == true
      ? 'bottom-[280px]'
      : offerCom == true
      ? 'bottom-[580px]'
      : calculated == true
      ? 'bottom-[520px]'
      : 'bottom-[350px]'
  } `}
>


<Animated.View
className="z-50"
        {...panResponder.panHandlers}
        style={[ { transform: pan.getTranslateTransform() }]}
      >
<View >

{
    !viewRiderMap && searching == false && (
<View className="flex-row justify-end items-center mx-2.5">
   {
     rider ? (
        <TouchableOpacity onPress={()=>openChat()} className="bg-white border border-gray-200 rounded-xl w-16 h-16 flex-row justify-center items-center mb-2 shadow-xl">   
      <View className="relative">
      <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<Path d="M24 15.9999V20.9999C24 21.7955 23.6839 22.5586 23.1213 23.1212C22.5587 23.6838 21.7956 23.9999 21 23.9999H16C14.5971 23.9985 13.2192 23.6281 12.0047 22.926C10.7901 22.224 9.78145 21.2148 9.08 19.9999C9.83387 19.9945 10.5852 19.9114 11.322 19.7519C11.8832 20.4535 12.595 21.0199 13.4048 21.4091C14.2146 21.7982 15.1016 22.0001 16 21.9999H21C21.2652 21.9999 21.5196 21.8945 21.7071 21.707C21.8946 21.5195 22 21.2651 22 20.9999V15.9999C21.9998 15.1011 21.7972 14.2139 21.4074 13.4041C21.0175 12.5943 20.4504 11.8826 19.748 11.3219C19.9088 10.5852 19.9933 9.8339 20 9.07989C21.215 9.78134 22.2241 10.79 22.9262 12.0045C23.6282 13.2191 23.9986 14.597 24 15.9999ZM17.977 9.65089C18.0705 8.36253 17.8856 7.06913 17.4348 5.85859C16.9841 4.64804 16.278 3.54871 15.3646 2.63531C14.4512 1.7219 13.3518 1.01582 12.1413 0.565046C10.9308 0.114271 9.63736 -0.0706368 8.349 0.0228889C6.06592 0.283621 3.95693 1.37006 2.41918 3.07763C0.881427 4.7852 0.0210272 6.99606 0 9.29389L0 14.3339C0 16.8659 1.507 17.9999 3 17.9999H8.7C10.9988 17.9801 13.211 17.1203 14.9198 15.5824C16.6286 14.0446 17.7159 11.9349 17.977 9.65089ZM13.95 4.05089C14.6599 4.76239 15.2088 5.61809 15.5593 6.56008C15.9099 7.50207 16.054 8.50837 15.982 9.51089C15.7686 11.2946 14.9105 12.9387 13.5693 14.1338C12.2282 15.3289 10.4964 15.9926 8.7 15.9999H3C2.072 15.9999 2 14.7249 2 14.3339V9.29389C2.00834 7.49826 2.67265 5.76759 3.86792 4.42757C5.06319 3.08754 6.70699 2.23056 8.49 2.01789C8.656 2.00589 8.822 1.99989 8.988 1.99989C9.90927 1.99903 10.8217 2.17973 11.6731 2.53165C12.5245 2.88357 13.2982 3.39982 13.95 4.05089Z" fill="#374957"/>
</Svg>
<View className="absolute h-4 w-4 bg-red-500 rounded-lg absolute -right-2 -top-2"></View>
</View>
        </TouchableOpacity>
    
     ): calculated ? (
        <Pressable onPress={()=>QRBooking()} className="bg-blue-500 rounded-xl w-16 h-16 flex-row justify-center items-center mb-2 shadow-xl">   
        <TaraQR size={25} />  
         </Pressable>
     ):(
        <Pressable onPress={()=>viewRiders()} className="bg-blue-500 rounded-xl w-16 h-16 flex-row justify-center items-center mb-2 shadow-xl">
        <LottieView
                              source={require('../assets/animation/magic-wand.json')}
                              autoPlay
                              loop
                              width={40}
                              height={40}
                          />
        </Pressable>
     )
   }
</View>
    )
}


{
    rider && (
        <View className="mx-2.5 mb-2.5">
        <View className="relative shadow-lg">
    <View className="shadow-xl bg-white rounded-xl border border-gray-300  w-full flex-row flex-wrap gap-x-6 gap-y-4
    ">
    

        {
            bookState == 2 ? (
                <View>
                <View className="rounded-t-xl bg-slate-100 w-full flex-row justify-between items-center p-2.5">
                <View className="px-2">
                <Text className="text-slate-800 text-xl font-medium">Driver is on the way.</Text>
                <Text className="text-slate-500 text-sm">Please go to your pickup location.</Text>
                    </View>
    
                    <View>
                    <Text className="font-medium text-xl">4 mins</Text>
                    </View>
            </View>
            <View className="overflow-hidden bg-neutral-800">
            <Animated.View
                style={[
                styles.bar,
                { transform: [{ translateX }] },
                ]}
            />
            </View>
                    </View>
            ) : bookState == 3 ? (
                <View>
                <View className="rounded-t-xl bg-slate-100 w-full flex-row justify-between items-center p-2.5">
                <View className="px-2">
                <Text className="text-slate-800 text-xl font-medium">Driver has picked you up..</Text>
                <Text className="text-slate-500 text-sm">Have a safe trip!</Text>
                    </View>
    
                    <View>
                    <Text className="font-medium text-xl">4 mins</Text>
                    </View>
            </View> 
                <View className="overflow-hidden bg-neutral-800">
                <Animated.View
                    style={[
                    styles.bar,
                    { transform: [{ translateX }] },
                    ]}
                />
                </View>
                </View>
            ):(
                <View className="rounded-t-xl bg-blue-500 w-full flex-row justify-between items-center p-2.5">
                <View className="px-2">
                <Text className="text-white text-xl font-medium">Waiting to accept</Text>
                <Text className="text-blue-100 text-sm">Please wait for the driver to accept your booking</Text>
                    </View>
    
                    <View>
                    <LottieView
                    source={require('../assets/animation/clock.json')}
                    autoPlay
                    loop
                    width={40}
                    height={40}
                    />
                    </View>
            </View>
            )
        }

        <View className="px-2.5 w-full">
            
            <View className="flex-row justify-between items-center w-full">


            <View className="flex-row">
           <View className="h-16 w-16 rounded-full rounded-full border-2 border-gray-300">
           <Image source={{uri: "https://fruitask.com/about-us/funny/team/CTO.jpg"}} alt="" className="rounded-full w-full h-full object-cover" />
           </View>

           <View className="h-20 w-20 rounded-full rounded-full -left-8">
           <Image source={{uri: "https://pixcap.com/cdn/library/template/1721240480050/thumbnail/Car_3D_Vehicle_Icon_Model_transparent_emp_800.webp"}} alt="" className="rounded-full w-full h-full object-center" />
           </View>
           </View>



            <View className="px-4">
            <Text className="text-left text-2xl font-semibold text-gray-800">NZA450601</Text>
            <Text className="text-left text-gray-600 text-xs">Copper Blue V3 2018</Text>
            </View>

            </View>

            <View className="pb-2 flex-row justify-between items-center">

            <View className="w-72 px-4 pb-2.5 flex-row justify-start items-center gap-x-2">
                <TaraLogo size={35} />
                <View>
                <Text className="text-left text-gray-600 text-xs">Tara Driver Name</Text>
                <Text numberOfLines={2} ellipsizeMode="tail" className="text-left text-gray-800 text-base">John Charlie U Saclet</Text>
                </View>
                </View>


                <View className="w-24 flex-row justify-center items-center gap-x-1.5">
                <Svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <Path d="M1.32677 12.4004L4.88677 15.0004L3.53477 19.1874C3.31628 19.8368 3.31351 20.5394 3.52688 21.1905C3.74024 21.8416 4.15831 22.4063 4.71877 22.8004C5.26962 23.2072 5.93716 23.4251 6.62192 23.4217C7.30668 23.4183 7.97201 23.1937 8.51877 22.7814L11.9998 20.2194L15.4818 22.7784C16.0316 23.1829 16.6956 23.4026 17.3781 23.4059C18.0607 23.4092 18.7268 23.196 19.2805 22.797C19.8343 22.3979 20.2473 21.8335 20.4601 21.1849C20.6728 20.5363 20.6745 19.837 20.4648 19.1874L19.1128 15.0004L22.6728 12.4004C23.2219 11.999 23.6301 11.4342 23.8391 10.7868C24.0481 10.1395 24.0472 9.44263 23.8364 8.79583C23.6257 8.14903 23.216 7.58537 22.6658 7.18535C22.1156 6.78533 21.453 6.56941 20.7728 6.56844H16.3998L15.0728 2.43244C14.8641 1.7814 14.454 1.21346 13.9017 0.810508C13.3494 0.407559 12.6834 0.19043 11.9998 0.19043C11.3161 0.19043 10.6501 0.407559 10.0978 0.810508C9.5455 1.21346 9.13544 1.7814 8.92677 2.43244L7.59977 6.56844H3.23077C2.55051 6.56941 1.88796 6.78533 1.33775 7.18535C0.787534 7.58537 0.377806 8.14903 0.167087 8.79583C-0.0436323 9.44263 -0.044565 10.1395 0.164422 10.7868C0.37341 11.4342 0.781627 11.999 1.33077 12.4004H1.32677Z" fill="#FBBF24"/>
                </Svg>
                <Text className="text-gray-600">4.5</Text>
                </View>
</View>
            </View>



        </View>
        </View>

{
    minimizeView == true && rider == true && (
        <Pressable onTouchStart={()=>setMinizeView(false)} className="w-full h-full absolute"></Pressable>
    )
}

        </View>
    )
}


{
    bookState == 3 && (
        <View className="mx-2.5 mb-2.5">
        <View className="relative">
        <View className="p-2.5 bg-white shadow-lg rounded-xl border border-gray-300  w-full">


<View className="px-1.5 w-full flex-row justify-between items-center">

        <View className="flex-row justify-items items-center gap-x-2">
        <LottieView
        source={require('../assets/animation/safety-tara.json')}
        autoPlay
        loop
        width={35}
        height={35}
    />
    <View>
    <Text className="font-medium text-xl">Tara Safe</Text>
    {
        taraSafe ? (
            <Text className="font-normal text-xs">We sent notification to your Tara Safe contacts.</Text>
        ):(
            <Text className="font-normal text-xs">Notify your favorite person for every booking.</Text>
        )
    }
        </View>

</View>

        {
            taraSafe ? (
            <View className="bg-green-500 px-2 py-1.5 rounded-lg">
            <Text className="font-medium text-white text-center text-sm">Activated</Text>
            </View>
            ):(
            <Pressable onPress={()=>openTaraSafe()} className="bg-blue-500 px-2 py-1.5 rounded-lg">
            <Text className="font-medium text-blue-100 text-center text-sm">Try now</Text>
            </Pressable>
            )
        }
   
                </View>
    
    </View>
    </View>
    </View>
    )
}


{
    !viewRiderMap && (
<View className="bg-white mb-2 mx-2.5 p-2.5 border border-gray-300 rounded-2xl shadow-lg w-auto relative">

{
    minimizeView && (
        <View className="flex-row justify-center items-center py-1.5">
<View className="w-32 bg-slate-300 p-1 flex-row justify-center items-center rounded-xl"></View >
</View>
    )
}


{
    minimizeView && (
<Pressable onTouchStart={()=>setMinizeView(false)} className="h-full w-full absolute inset-0 z-40">
</Pressable>
    )
}
<View className="bg-white overflow-hidden gap-y-4 py-2.5 px-2">
<View className="flex-row justify-start items-center gap-x-2 w-full">
<TaraNavigation size={28} color="#22c55e" />
{
    searching || rider ? (
<View className="w-full">
    <Text numberOfLines={1} ellipsizeMode="tail" className="font-semibold text-gray-800 text-lg">{pickupName}</Text>
</View>

    ): pickupName ? (
        <TouchableOpacity onPress={()=>selectLocation(1)} className="w-80">
        <Text numberOfLines={1} ellipsizeMode="tail" className="font-semibold text-gray-800 text-lg">{pickupName}</Text>
    </TouchableOpacity>
    
    ):(
        <TouchableOpacity onPress={()=>selectLocation(1)} className="w-full">
    <Text className="font-semibold text-gray-400 text-lg">Pickup Location?</Text>
</TouchableOpacity>
    )
}
</View>

{
    calculated && minimizeView == false && searching == false && rider == false ? (
<View className="flex-row justify-start items-center gap-x-2 w-full pr-4">
<TouchableOpacity onPress={()=>switchLocations()} className="pl-1.5 flex-row justify-center items-center gap-x-2">
<TaraChange size={20} color="#3b82f6" />
</TouchableOpacity>
<View className="h-px bg-gray-200 w-full"></View>
</View>
    ):(
<View className="h-px bg-gray-200 w-full"></View>
    )
}






<View className="flex-row justify-start items-center gap-x-2 w-full">
<TaraMarker size={28} color="#ef4444" />
{
    searching || rider ? (
<View className="w-full">
    <Text numberOfLines={1} ellipsizeMode="tail"  className="font-semibold text-gray-800 text-lg">{dropName}</Text>
</View>
    ): dropName ? (

        <TouchableOpacity onPress={()=>selectLocation(2)} className="w-80">
        <Text numberOfLines={1} ellipsizeMode="tail" className="font-semibold text-gray-800 text-lg">{dropName}</Text>
    </TouchableOpacity> 

    ):(
        <TouchableOpacity onPress={()=>selectLocation(2)} className="w-full">
    <Text className="font-semibold text-gray-400 text-lg">Drop-off Location?</Text>
</TouchableOpacity>
    )
}
</View>
</View>
</View>
    )
}


{
    calculated &&  minimizeView == false && searching == false && rider == false && (
        <View className="mx-2.5 mb-2.5">
    <View className="bg-white rounded-xl p-2 border border-gray-200 shadow-lg">
<View className="p-2.5 w-full flex-row flex-wrap gap-x-6 gap-y-4
">


{
    activemotor ? (
<TouchableOpacity onPress={()=>addVehicle(2)}  className="w-44 flex-row justify-start items-center gap-x-2">
    {
        pickmotor ? (
            <View className="border border-blue-500 rounded-lg h-6 w-6 flex-row justify-center items-center">
    <View className="bg-blue-500 rounded h-4 w-4"></View>
    </View>
        ):(
            <View className="border border-gray-300 rounded-lg h-6 w-6 flex-row justify-center items-center">
    </View>   
        )
    }
    <View className="ml-2 bg-slate-200 w-8 h-8 rounded-full">
    <TaraMotor size="28" />
    </View>
    <Text className="text-sm font-medium text-gray-800">MotorTaxi</Text>
</TouchableOpacity>
    ):(
<TouchableOpacity onPress={()=>RequestVehicle(2)}  className="opacity-50 w-44 flex-row justify-start items-center gap-x-2">
    <View className="border border-gray-300 rounded-lg h-6 w-6 flex-row justify-center items-center">
    </View>   
    <View className="ml-2 bg-slate-200 w-8 h-8 rounded-full">
    <TaraMotor size="28" />
    </View>
    <Text className="text-sm font-medium text-gray-800">MotorTaxi</Text>
</TouchableOpacity>
    )
}



{
    activecar4 ? (
        <TouchableOpacity onPress={()=>addVehicle(4)}  className="w-44 flex-row justify-start items-center gap-x-2">
{
        pickcar4 ? (
            <View className="border border-blue-500 rounded-lg h-6 w-6 flex-row justify-center items-center">
    <View className="bg-blue-500 rounded h-4 w-4"></View>
    </View>
        ):(
            <View className="border border-gray-300 rounded-lg h-6 w-6 flex-row justify-center items-center">
    </View>   
        )
    }
    <View className="ml-2 bg-slate-200 w-8 h-8 rounded-full">
    <TaraCar size="28" />
    </View>
    <Text className="text-sm font-medium text-gray-800">4 seater- Car</Text>
</TouchableOpacity>
    ):(
    <TouchableOpacity onPress={()=>RequestVehicle(4)}  className="opacity-50 w-44 flex-row justify-start items-center gap-x-2">
    <View className="border border-gray-300 rounded-lg h-6 w-6 flex-row justify-center items-center">
    </View>   
    <View className="ml-2 bg-slate-200 w-8 h-8 rounded-full">
    <TaraCar size="28" />
    </View>
    <Text className="text-sm font-medium text-gray-800">4 seater- Car</Text>
</TouchableOpacity>
    )
}


{
    activecard6 ? (
<TouchableOpacity onPress={()=>addVehicle(4.5)}  className="w-44 flex-row justify-start items-center gap-x-2">
{
        pickcard6 ? (
            <View className="border border-blue-500 rounded-lg h-6 w-6 flex-row justify-center items-center">
    <View className="bg-blue-500 rounded h-4 w-4"></View>
    </View>
        ):(
            <View className="border border-gray-300 rounded-lg h-6 w-6 flex-row justify-center items-center">
    </View>   
        )
    }
    <View className="ml-2 bg-slate-200 w-8 h-8 rounded-full">
    <TaraCar size="28" />
    </View>
    <Text className="text-sm font-medium text-gray-800">6 seater - Car</Text>
</TouchableOpacity>
    ):(
<TouchableOpacity onPress={()=>RequestVehicle(4.5)}  className="opacity-50 w-44 flex-row justify-start items-center gap-x-2">
            <View className="border border-gray-300 rounded-lg h-6 w-6 flex-row justify-center items-center">
    </View>   
    <View className="ml-2 bg-slate-200 w-8 h-8 rounded-full">
    <TaraCar size="28" />
    </View>
    <Text className="text-sm font-medium text-gray-800">6 seater - Car</Text>
</TouchableOpacity>
    )
}




{
    activeVan ? (
<TouchableOpacity onPress={()=>addVehicle(5)} className="w-44 flex-row justify-start items-center gap-x-2">
{
        pickVan ? (
            <View className="border border-blue-500 rounded-lg h-6 w-6 flex-row justify-center items-center">
    <View className="bg-blue-500 rounded h-4 w-4"></View>
    </View>
        ):(
            <View className="border border-gray-300 rounded-lg h-6 w-6 flex-row justify-center items-center">
    </View>   
        )
    }
    <View className="ml-2 bg-slate-200 w-8 h-8 rounded-full">
    <TaraVan size="28" />
    </View>
    <Text className="text-sm font-medium text-gray-800">Van Express</Text>
</TouchableOpacity>
    ):(
        <TouchableOpacity onPress={()=>RequestVehicle(5)} className="opacity-50 w-44 flex-row justify-start items-center gap-x-2">
            <View className="border border-gray-300 rounded-lg h-6 w-6 flex-row justify-center items-center">
    </View>   
    <View className="ml-2 bg-slate-200 w-8 h-8 rounded-full">
    <TaraVan size="28" />
    </View>
    <Text className="text-sm font-medium text-gray-800">Van Express</Text>
</TouchableOpacity>
    )
}





    </View>
        </View>
        </View>
    )
}

{
    calculated &&  minimizeView == false && searching == false && rider == false && (
        <View className="mx-2.5 mb-2.5 relative">

{
    slideGuide && offerCom && (
        <>
        <Pressable onPress={()=>setSlideGuide(false)} className="h-full w-full bg-gray-100 rounded-xl absolute z-30 opacity-50"></Pressable>
<Pressable onPress={()=>setSlideGuide(false)} className="inset-0 z-40 flex-row justify-center w-full h-full absolute top-16 -left-10">
    <LottieView
    source={require('../assets/animation/slide.json')}
    autoPlay
    loop
    width={100}
    height={80}
    />
</Pressable>
</>
    )
}


    <View className="bg-white rounded-xl p-2 border border-gray-200 shadow-lg">
<View className="p-2">

    <Pressable onPress={()=>openBoxOffer()} className="flex-row justify-between items-center">

<View className="flex-row justify-start items-center gap-x-2.5">
<TaraLogo size={25} />
<Text className="font-medium text-xl">Make an offer?</Text>
    </View>

<View>
{
    offerCom ? (
<Svg
xmlns="http://www.w3.org/2000/svg"
width={25}
height={25}
data-name="Layer 1"
viewBox="0 0 24 24"
fill="#3b82f6"
>
<Path d="M17.9998 15.5C17.8682 15.5008 17.7377 15.4756 17.6159 15.4258C17.494 15.3761 17.3832 15.3027 17.2898 15.21L12.7098 10.6201C12.6168 10.5263 12.5062 10.4519 12.3844 10.4012C12.2625 10.3504 12.1318 10.3243 11.9998 10.3243C11.8678 10.3243 11.7371 10.3504 11.6152 10.4012C11.4934 10.4519 11.3828 10.5263 11.2898 10.6201L6.70979 15.21C6.52149 15.3984 6.26609 15.5041 5.99979 15.5041C5.73349 15.5041 5.47809 15.3984 5.28979 15.21C5.10149 15.0217 4.9957 14.7664 4.9957 14.5001C4.9957 14.3682 5.02167 14.2376 5.07213 14.1158C5.12259 13.994 5.19655 13.8833 5.28979 13.7901L9.87979 9.21006C10.4497 8.6625 11.2094 8.35669 11.9998 8.35669C12.7901 8.35669 13.5498 8.6625 14.1198 9.21006L18.7098 13.7901C18.8035 13.883 18.8779 13.9936 18.9287 14.1155C18.9794 14.2373 19.0056 14.368 19.0056 14.5001C19.0056 14.6321 18.9794 14.7628 18.9287 14.8846C18.8779 15.0065 18.8035 15.1171 18.7098 15.21C18.6163 15.3027 18.5055 15.3761 18.3837 15.4258C18.2619 15.4756 18.1314 15.5008 17.9998 15.5Z" fill="#404040"/>
</Svg>
    ):(
        <Svg
xmlns="http://www.w3.org/2000/svg"
width={25}
height={25}
data-name="Layer 1"
viewBox="0 0 24 24"
fill="#3b82f6">
<Path d="M18.7099 8.2101C18.6169 8.11638 18.5063 8.04198 18.3845 7.99121C18.2626 7.94044 18.1319 7.91431 17.9999 7.91431C17.8679 7.91431 17.7372 7.94044 17.6153 7.99121C17.4934 8.04198 17.3828 8.11638 17.2899 8.2101L12.7099 12.7901C12.6169 12.8838 12.5063 12.9582 12.3845 13.009C12.2626 13.0598 12.1319 13.0859 11.9999 13.0859C11.8679 13.0859 11.7372 13.0598 11.6153 13.009C11.4934 12.9582 11.3828 12.8838 11.2899 12.7901L6.70988 8.2101C6.61691 8.11638 6.50631 8.04198 6.38445 7.99121C6.26259 7.94044 6.13189 7.91431 5.99988 7.91431C5.86787 7.91431 5.73716 7.94044 5.6153 7.99121C5.49344 8.04198 5.38284 8.11638 5.28988 8.2101C5.10363 8.39747 4.99908 8.65092 4.99908 8.9151C4.99908 9.17929 5.10363 9.43274 5.28988 9.6201L9.87988 14.2101C10.4424 14.7719 11.2049 15.0875 11.9999 15.0875C12.7949 15.0875 13.5574 14.7719 14.1199 14.2101L18.7099 9.6201C18.8961 9.43274 19.0007 9.17929 19.0007 8.9151C19.0007 8.65092 18.8961 8.39747 18.7099 8.2101Z" fill="#374957"/>
</Svg>
    )
}

    </View>

        </Pressable>

{
    offerCom && (
<View className="relative">
    <Slider
    animateTransitions
    renderAboveThumbComponent={renderAboveThumbComponent}
    renderThumbComponent={CustomThumb}
    maximumValue={12}
    minimumValue={0}
    value={6}
    onValueChange={handleValueChange}
    onSlidingComplete={handleSlidingComplete}
    step={3} />




<View className="flex-row justify-between items-center w-full">


<View className="relative">
<View className="absolute -top-5 right-0 left-0 mx-auto flex-row justify-start">
<Svg
xmlns="http://www.w3.org/2000/svg"
width={18}
height={18}
data-name="Layer 1"
viewBox="0 0 24 24"
fill="#22c55e"
>
<Path d="M17.9998 15.5C17.8682 15.5008 17.7377 15.4756 17.6159 15.4258C17.494 15.3761 17.3832 15.3027 17.2898 15.21L12.7098 10.6201C12.6168 10.5263 12.5062 10.4519 12.3844 10.4012C12.2625 10.3504 12.1318 10.3243 11.9998 10.3243C11.8678 10.3243 11.7371 10.3504 11.6152 10.4012C11.4934 10.4519 11.3828 10.5263 11.2898 10.6201L6.70979 15.21C6.52149 15.3984 6.26609 15.5041 5.99979 15.5041C5.73349 15.5041 5.47809 15.3984 5.28979 15.21C5.10149 15.0217 4.9957 14.7664 4.9957 14.5001C4.9957 14.3682 5.02167 14.2376 5.07213 14.1158C5.12259 13.994 5.19655 13.8833 5.28979 13.7901L9.87979 9.21006C10.4497 8.6625 11.2094 8.35669 11.9998 8.35669C12.7901 8.35669 13.5498 8.6625 14.1198 9.21006L18.7098 13.7901C18.8035 13.883 18.8779 13.9936 18.9287 14.1155C18.9794 14.2373 19.0056 14.368 19.0056 14.5001C19.0056 14.6321 18.9794 14.7628 18.9287 14.8846C18.8779 15.0065 18.8035 15.1171 18.7098 15.21C18.6163 15.3027 18.5055 15.3761 18.3837 15.4258C18.2619 15.4756 18.1314 15.5008 17.9998 15.5Z" fill="#22c55e"/>
</Svg>
</View>

<Text className="text-xs">Discounted</Text>
</View>




<View className="relative">
<View className="absolute -top-5 right-0 -left-4 mx-auto flex-row justify-center">
<Svg
xmlns="http://www.w3.org/2000/svg"
width={18}
height={18}
data-name="Layer 1"
viewBox="0 0 24 24"
fill="#22c55e"
>
<Path d="M17.9998 15.5C17.8682 15.5008 17.7377 15.4756 17.6159 15.4258C17.494 15.3761 17.3832 15.3027 17.2898 15.21L12.7098 10.6201C12.6168 10.5263 12.5062 10.4519 12.3844 10.4012C12.2625 10.3504 12.1318 10.3243 11.9998 10.3243C11.8678 10.3243 11.7371 10.3504 11.6152 10.4012C11.4934 10.4519 11.3828 10.5263 11.2898 10.6201L6.70979 15.21C6.52149 15.3984 6.26609 15.5041 5.99979 15.5041C5.73349 15.5041 5.47809 15.3984 5.28979 15.21C5.10149 15.0217 4.9957 14.7664 4.9957 14.5001C4.9957 14.3682 5.02167 14.2376 5.07213 14.1158C5.12259 13.994 5.19655 13.8833 5.28979 13.7901L9.87979 9.21006C10.4497 8.6625 11.2094 8.35669 11.9998 8.35669C12.7901 8.35669 13.5498 8.6625 14.1198 9.21006L18.7098 13.7901C18.8035 13.883 18.8779 13.9936 18.9287 14.1155C18.9794 14.2373 19.0056 14.368 19.0056 14.5001C19.0056 14.6321 18.9794 14.7628 18.9287 14.8846C18.8779 15.0065 18.8035 15.1171 18.7098 15.21C18.6163 15.3027 18.5055 15.3761 18.3837 15.4258C18.2619 15.4756 18.1314 15.5008 17.9998 15.5Z" fill="#22c55e"/>
</Svg>
</View>

<Text className="text-xs">App Rate</Text>
</View>





<View className="relative">
<View className="absolute -top-5 right-0 left-6 mx-auto flex-row justify-center">
<Svg
xmlns="http://www.w3.org/2000/svg"
width={18}
height={18}
data-name="Layer 1"
viewBox="0 0 24 24"
fill="#22c55e"
>
<Path d="M17.9998 15.5C17.8682 15.5008 17.7377 15.4756 17.6159 15.4258C17.494 15.3761 17.3832 15.3027 17.2898 15.21L12.7098 10.6201C12.6168 10.5263 12.5062 10.4519 12.3844 10.4012C12.2625 10.3504 12.1318 10.3243 11.9998 10.3243C11.8678 10.3243 11.7371 10.3504 11.6152 10.4012C11.4934 10.4519 11.3828 10.5263 11.2898 10.6201L6.70979 15.21C6.52149 15.3984 6.26609 15.5041 5.99979 15.5041C5.73349 15.5041 5.47809 15.3984 5.28979 15.21C5.10149 15.0217 4.9957 14.7664 4.9957 14.5001C4.9957 14.3682 5.02167 14.2376 5.07213 14.1158C5.12259 13.994 5.19655 13.8833 5.28979 13.7901L9.87979 9.21006C10.4497 8.6625 11.2094 8.35669 11.9998 8.35669C12.7901 8.35669 13.5498 8.6625 14.1198 9.21006L18.7098 13.7901C18.8035 13.883 18.8779 13.9936 18.9287 14.1155C18.9794 14.2373 19.0056 14.368 19.0056 14.5001C19.0056 14.6321 18.9794 14.7628 18.9287 14.8846C18.8779 15.0065 18.8035 15.1171 18.7098 15.21C18.6163 15.3027 18.5055 15.3761 18.3837 15.4258C18.2619 15.4756 18.1314 15.5008 17.9998 15.5Z" fill="#22c55e"/>
</Svg>
</View>

<Text className="text-xs">Give Tip</Text>
</View>

</View> 


    </View>

)
}   


    </View>
        </View>






        </View>
    )
}




{
    !viewRiderMap ? (
<Pressable onTouchStart={()=>setMinizeView(false)}  className=" rounded-t-3xl border-t border-x border-gray-200 h-full p-4 z-50 bg-white ">
<View   className="relative mt-2 flex-row justify-center items-center w-full">
    {
        searching ? (
            <View className="absolute">
<LottieView
source={require('../assets/animation/loading.json')}
autoPlay
loop
width={300}
height={300}
/>
</View>

        ):(
<View className="w-32 bg-slate-300 p-1 flex-row justify-center items-center rounded-xl"></View >
        )
    }

</View >

<View className="py-8 flex-row justify-between items-center">


<View className="flex-row justify-start items-center gap-x-2">
<TaraInvoice size={20} />
<Text className="text-slate-800 text-xl font-semibold">&#8369;{fareRate}.00</Text>
{
    calculated && (
        <TouchableOpacity onPress={()=>sheetRef2.current?.open() }>
            <TaraNotice size={20} color="#d1d5db" />
        </TouchableOpacity>
    )
}
</View>


<TouchableOpacity onPress={()=>sheetRef3.current?.open()}>
<View className="flex-row justify-start items-center gap-x-2">
<TaraCash size={28} />
<Text className="text-slate-800 text-xl font-semibold">Cash</Text>
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
</TouchableOpacity>



</View>



<View>
    {
        searching ? (
<Button
onPress={() => cancelSearch()}
bgColor="bg-neutral-700"
textColor="text-white"
fontSize="lg"
>
Cancel Booking
</Button>
): rider ? (

<Button
onPress={() => sheetRef.current?.close()}
bgColor="bg-slate-200"
textColor="text-gray-400"
fontSize="lg"
>
Cancel Book
</Button>


) : calculated && pickmotor || pickcar4 || pickcard6 || pickVan ? (
<Button
onPress={() => goSearchRider()}
bgColor="bg-blue-500"
textColor="text-white"
fontSize="lg"
>
Book
</Button>

        ):(
<Button
onPress={() => sheetRef.current?.close()}
bgColor="bg-slate-200"
textColor="text-white"
fontSize="lg"
>
Book
</Button>
        )
    }

</View>

{
    rider && (
        <View className="mt-4">
        <Text className="text-xs text-slate-600 text-center">*You can cancel a booking up to 3 times; exceeding this limit will block your account for 10 hours.</Text>
    </View>
    )
}


</Pressable >
    ):(
<Pressable onPress={()=>backToBooking()}  className=" rounded-t-3xl border-t border-x border-gray-200 h-full p-4 z-50 bg-white ">
<View   className="relative mt-2 flex-row justify-center items-center w-full">
<View className="absolute">
<LottieView
source={require('../assets/animation/loading.json')}
autoPlay
loop
width={400}
height={400}
/>
</View>
</View >
</Pressable > 
    )
}




</View>
</Animated.View>


<View className="h-full w-full z-10  top-20 mx-auto left-0 right-0 bottom-0  absolute">
<Svg height="100%" width="100%">
        <Defs>
          <Filter id="blur">
            <FeGaussianBlur stdDeviation="30" />
          </Filter>
        </Defs>
        <Rect
          x="0"
          y="0"
          width="800"
          height="800"
          fill="rgba(226, 226, 226, 0.4)" 
          filter="url(#blur)"
        />
      </Svg>
</View>
</View>
):(
  
<View className="fixed bottom-[150px]">
<View  className=" rounded-t-3xl border-t border-x border-gray-200 h-full p-4 z-50 bg-white ">
<View   className="relative mt-2 flex-row justify-center items-center w-full">
<View className="w-32 bg-slate-300 p-1 flex-row justify-center items-center rounded-xl"></View >
</View >
<View className="my-2.5">

<LocationCard infoMode={infoMode} />


<Button
onPress={() => selectThisLocation()}
bgColor="bg-blue-500"
textColor="text-white"
fontSize="md"
bwidth="w-full mt-2"
>
Select this location
</Button>
    </View>
</View>
    </View>

)
}





</View>
</ScrollView>

<BottomSheet
      animationType="false"
      ref={sheetRef}
      height={650}
      containerHeight={900}
      hideDragHandle={true}
      style={{ backgroundColor: "#fff",zIndex:999 }}
      onClose={()=>setInfoMode(infoMode)}
    >

<View className="p-4">
    <View className="mt-4 flex-row justify-between items-center">

        <TouchableOpacity onPress={()=>sheetRef.current?.close()}>
        <Svg
              xmlns="http://www.w3.org/2000/svg"
              width={30}
              height={30}
              viewBox="0 0 24 24"
              fill="#374957"
            >
              <Path d="M19 11H9l3.29-3.29a1 1 0 0 0 0-1.42 1 1 0 0 0-1.41 0l-4.29 4.3A2 2 0 0 0 6 12a2 2 0 0 0 .59 1.4l4.29 4.3a1 1 0 1 0 1.41-1.42L9 13h10a1 1 0 0 0 0-2Z" />
            </Svg>
        </TouchableOpacity>

    <Text className="text-xl font-medium text-gray-800">{infoMode == 1 ? 'Pickup Location' : 'Drop-off Location'}</Text>

    <View className="bg-slate-200 rounded-lg p-1.5">
    <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    viewBox="0 0 24 24"
    fill="#404040"
>
    <Path d="M12 0a12 12 0 1 0 12 12A12.013 12.013 0 0 0 12 0Zm0 22a10 10 0 1 1 10-10 10.011 10.011 0 0 1-10 10Z" />
    <Path d="M12.717 5.063A4 4 0 0 0 8 9a1 1 0 0 0 2 0 2 2 0 0 1 2.371-1.967 2.024 2.024 0 0 1 1.6 1.595 2 2 0 0 1-1 2.125A3.954 3.954 0 0 0 11 14.257V15a1 1 0 0 0 2 0v-.743a1.982 1.982 0 0 1 .93-1.752 4 4 0 0 0-1.213-7.442Z" />
    <Rect width={2} height={2} x={11} y={17} rx={1} />
            </Svg>
    </View>
    </View>

<View className="mt-6 border border-gray-300 rounded-xl p-2 flex-row justify-start items-center gap-x-2 overflow-hidden">
{
    infoMode == 1 ? (
        <TaraNavigation size={28} color="#22c55e" />
    ):(
        <TaraMarker size={28} color="#ef4444" />
    )
}
<TextInput onChangeText={(e)=>InputLocation(e)}  value={infoInput} className="font-medium text-lg text-blue-500 w-full" placeholder={infoMode == 1 ? 'Where is your pickup location?' : 'Where is your drop destination?'} />
</View>

<View className="mb-2.5 p-2 gap-x-2 flex-row justify-between items-center">
        <Button
onPress={() => selectCurrentLocation()}
bgColor={infoMode == 1 ? 'bg-slate-200' : 'bg-slate-100'}
textColor={infoMode == 1 ? 'text-gray-500' : 'text-gray-200'}
fontSize="md"
bwidth="w-48"
hasIcon={true}
>
<TaraTarget size={15} color={infoMode == 1 ? '#404040' : '#cbd5e1'} />
<Text className={infoMode == 1 ? 'text-gray-800' : 'text-slate-300'}>Current Location</Text>
</Button>
<Button
onPress={() => selectPinMap()}
bgColor="bg-slate-200"
textColor="text-gray-500"
fontSize="md"
bwidth="w-48"
hasIcon={true}
>
<TaraPin size={15} />
<Text>Pin in map</Text>
</Button>
</View>


<TouchableOpacity className="flex-row justify-start items-center p-2 gap-x-4">
<View className="border border-gray-200 rounded-xl p-1.5">
<LottieView
source={require('../assets/animation/tara.json')}
autoPlay
loop
width={40}
height={40}
/>
</View> 
<View>
    <Text className="font-medium text-gray-800">Are you searching for New Buncag?</Text>
    <Text className="font-medium text-sm text-blue-500">AI suggestions</Text>
</View>
</TouchableOpacity>




<FlatList
        data={locations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
            <LocationCard
            sheet={sheetRef}
            infoMode={infoMode}
            data={item}
            pickupname={setPickupName}
            dropname={setDropName}
            setPickup={setPickupCoordinates}
            setDrop={setDropCoordinates}
            reset={setInfoInput}
             />
        )}
      />





</View>
</BottomSheet>


<BottomSheet
      animationType="false"
      ref={sheetRef2}
      containerHeight={900}
      hideDragHandle={true}
      style={{ backgroundColor: "#fff",zIndex:999 }}
    >
        <View className="p-4">
        <View   className="relative mt-2 flex-row justify-center items-center w-full">
<View className="w-32 bg-slate-300 p-1 flex-row justify-center items-center rounded-xl"></View >
</View >
            <View className="p-4">
            <View className="mt-4 flex-row justify-start items-center gap-x-2">
            <TaraLogo size={20} />
            <Text className="font-medium text-xl">Breakdown Rates</Text>
           </View>
        
           <View className="mt-4 gap-y-2.5">

           <View className="flex-row justify-between items-center">
           <Text className="text-slate-500 font-normal text-lg">Base Fare</Text>
           <Text className="text-slate-600 font-medium text-lg">&#8369;{fareAPIResponse.base_fare}.00</Text>
           </View>

           <View className="flex-row justify-between items-center">
           <Text className="text-slate-500 font-normal text-lg">Per KM</Text>
           <Text className="text-slate-600 font-medium text-lg">&#8369;{fareAPIResponse.per_km}.00</Text>
           </View>

           <View className="flex-row justify-between items-center">
           <Text className="text-slate-500 font-normal text-lg">Night Diff.</Text>
           <Text className="text-slate-600 font-medium text-lg">&#8369;{fareAPIResponse.night}.00</Text>
           </View>

           <View className="flex-row justify-between items-center">
           <Text className="text-slate-500 font-normal text-lg">Total KM.</Text>
           <Text className="text-slate-600 font-medium text-lg">{fareAPIResponse.distance}</Text>
           </View>


<View className="mt-8">
    <Text className="text-sm text-slate-600 text-center">*Fares may vary depending on traffic, weather, demand conditions.</Text>
</View>

<Button
onPress={() => sheetRef2.current?.close()}
bgColor="bg-slate-100"
textColor="text-slate-800"
fontSize="md"
bwidth="w-full mt-2"
>
Close
</Button>

           </View>
            </View>
        </View>
</BottomSheet>


<BottomSheet
animationType="false"
ref={sheetRef3}
containerHeight={900}
hideDragHandle={true}
height={280}
style={{ backgroundColor: "#fff",zIndex:999 }}
    >
<View className="p-4">
        <View   className="relative mt-2 flex-row justify-center items-center w-full">
<View className="w-32 bg-slate-300 p-1 flex-row justify-center items-center rounded-xl"></View >
</View >
            <View className="p-4">
            <Text className="font-medium text-xl">Select Payment Method</Text>



<View className="mb-4">
<TouchableOpacity>
<View className="flex-row justify-between items-center gap-x-2 py-4">

<View className="flex-row justify-start items-center gap-x-4"> 
<TaraCash size={28} />
<Text className="text-blue-500 text-xl font-semibold">Cash</Text>
</View>  

<View className="h-6 w-6 border border-blue-500 rounded-full flex justify-center items-center">
    <View className="h-4 w-4 bg-blue-500 rounded-full"></View>
</View>

</View>
</TouchableOpacity>


<TouchableOpacity>
<View className="flex-row justify-between items-center gap-x-2 py-4">

<View className="flex-row justify-start items-center gap-x-4"> 
 <TaraWalletIcon color="#404040" size={25} />
 <View>
<Text className="text-blue-500 text-xl font-semibold">Tara Wallet <Text className="text-gray-800">(&#8369;0.00)</Text></Text>
<Text className="text-xs">Will deduct only once you're dropped.</Text>
</View>
</View>  

<View className="h-6 w-6 border border-gray-300 rounded-full flex justify-center items-center">
    <View className="h-4 w-4 bg-gray-100 rounded-full"></View>
</View>

</View>
</TouchableOpacity>


</View>


            <Button
onPress={() => sheetRef3.current?.close()  }
bgColor="bg-blue-500"
textColor="text-white"
fontSize="md"
bwidth="w-full mt-2"
>
Confirm
</Button>
</View>
</View>
</BottomSheet>


{generateQR && <GenerateQRBooking QR={"sdds"} close={setGenerateQR} />}

</>



)


};


const GenerateQRBooking = ({QR, close }) => {
    return (
      <View className="w-full h-full p-4 absolute bottom-0 bg-black/30 z-[100] ">
        <View
          className="w-full px-6 py-8 absolute bottom-10 left-4 rounded-3xl shadow-xl shadow-black  bg-white
        flex gap-y-4"
        >
          <Text className="text-center text-2xl font-bold">
            QR - Quick Rider
          </Text>
  {/* before generating check the vehicle type */}
          <View className="relative w-full flex justify-center items-center p-4">
  <View className="relative">
  <QRCodeStyled
    data={QR}
    style={{backgroundColor: 'transparent'}}
    padding={10}
    pieceSize={5}
    pieceCornerType='rounded'
    color={'#020617'}
    pieceScale={1.02}
    pieceLiquidRadius={3}
    logo={{
      href: require('../assets/tara_app.png'),
      padding: 4,
      scale: 1,
      hidePieces: true
    }}
    errorCorrectionLevel={'H'}
    innerEyesOptions={{
      borderRadius: 4,
      color: '#404040',
    }}
    outerEyesOptions={{
      borderRadius: 12,
      color: '#ffa114',
    }}
  />
  </View>
          </View>
  
          <Text className="text-center">If a nearby rider is in front of you, let them scan this QR to become your assigned driver. It saves time!</Text>
  
          
          <View className="w-full flex gap-y-4">
            <Button
            onPress={()=>close(false)}
              bgColor="bg-slate-200"
              textColor="text-neutral-700"
            >
              Close
            </Button>
          </View>
        </View>
      </View>
    );
  };


export default BookingPage;