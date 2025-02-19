import { View, Text,TouchableOpacity, ScrollView, TextInput, Pressable, StyleSheet,Animated,Image,PanResponder,FlatList,Alert,I18nManager,Easing, TouchableWithoutFeedback } from "react-native";
import { WebView } from 'react-native-webview';
import Svg, { Circle, Path,Rect,Defs, Filter, FeGaussianBlur } from "react-native-svg";
import LottieView from 'lottie-react-native';
import BottomSheet from "@devvie/bottom-sheet";
import { useRef,useEffect, useState, useContext, useSyncExternalStore } from "react";
import Button from "../components/Button";
import animationMarker from '../assets/animation/marker.json';
import * as Speech from 'expo-speech';
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
TaraVan,
TaraMic,
TaraShield,
TaraMultiple,
TaraMagic,
TaraCube,
TaraCloud,
TaraUser,
TaraBoldMic
} from "../components/CustomIcon";
import { LocationCard, LocationCardDrag } from "../components/Cards";
import {Slider} from '@miblanchard/react-native-slider';
import axios from 'axios';
import * as Location from 'expo-location';
import { useToast } from "../components/ToastNotify";
import QRCodeStyled from 'react-native-qrcode-styled';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserSettings,
    updateSettings,
    SecureData,
    createBooking,
    updateBooking,
    getWeather,
    getAISuggestions,
    getBookingInfo,
    getRiderInfo,
    updateUser
 } from "../config/hooks";
import { AuthContext } from "../context/authContext";
import { DataContext } from "../context/dataContext";
import { BookingContext } from "../context/bookContext";
import { hookConf } from "../config/hooks";
import { HelloVisitor } from "../components/Cards";
import { formatMoney } from "../config/functions";
import { TaraLoud, TaraSearch } from "../components/CustomGraphic";
import { BlurView } from 'expo-blur';
import { Audio } from 'expo-av';
import { AUDIO_TEXT } from "../config/constants";
import RiderRatingModal from '../components/RiderRatings'
import { ref, onValue } from 'firebase/database';
import {database} from "../config/firebase-config"

const BookingPage = ({route,navigation}) =>{
 const sheetRef = useRef(null);
 const sheetRef2 = useRef(null);
 const sheetRef3 = useRef(null);
 const sheetRef4 = useRef(null);
 const sheetRef5 = useRef(null);
 const lottieRef = useRef(null);
 const [suggest,setSuggest] = useState(true) //AI Suggestions
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
 const [taraSafe,setTaraSafe] = useState(false)
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
const [generateQR,setGenerateQR] = useState(false);
const [modeofpayment,setModeofPayment] = useState(1) //0 cash 1 is wallet and GET WHAT DEFAULT PAYMENT SET
const [cardCoor,setcardCoord] = useState([])
const [draglocaname,setdragLocName] = useState("Unknown location")
const [vehiclePrompt,readVehicleProm] = useState(false)
const [slideTut,setSlideTutor] = useState(false) //guide prompt
const [slidedontshow,setSlideDontShow] = useState(false)
const { user,setUser } = useContext(AuthContext);
const { data,setData } = useContext(DataContext);
const { booking,setBooking } = useContext(BookingContext);
const [authToken,setAuthToken] = useState(null)
const [walletBalance,setWalletBalance] = useState("0");
const [showSettings,setSettings] = useState(false);
const [multipleBook,setMultipleBook] = useState(false)
const [theredview,set3dCamera] = useState(false)
const [weatherba,setWeather] = useState(false)
const [audioBook,setAudioBook] = useState(false)
const [carFare4,setCar4Fare] = useState(0); //rate of 4 seater
const [carFare5,setCar5Fare] = useState(0); //rate of 6 seater
const [carFare6,setCar6Fare] = useState(0); //rate of van
const [perKM,setperKM] = useState("0")
const [baseRate,setBaseRate] = useState("0")
const [QrBook,setQRBook] = useState("");
const [draggBlur,setdragBlur] = useState(true)
const [QRloading,setQRLoading] = useState(false)
const [startlocation,secureStartLocation] = useState("")
const [maxwallet,setMaxWallet] = useState(0)
const [readyLoad,setReadyness] = useState("")
const [paymentwarning,setPaymentWarnig] = useState("Select Payment Method")
const [useMic,setUseMic] = useState(false)
const [speaking,setSpeaking] = useState(false)
const [recording, setRecording] = useState(false);
const [audioUri, setAudioUri] = useState('');
const [locations, setLocations] = useState([]);
const [errorAPI, setError] = useState('');
const [audioAPILoading,setaudioAPILoading] = useState(false)
const [myCity,setMyCity] = useState(null)
const [loader,setLoader] = useState(false)
const [weatherforecarst,setWeatherForecast] = useState([])
const [weatherAnimation,setWeatherAnimation] = useState('sunny')
const [isitRaining,setRaining] = useState(false)
const [dropSuggest,setSuggestDropName] = useState(null)
const [data_science,setDataScience] = useState([])
const [rebook,setRebook] = useState(false)
const [scanRiderBooking,setSRB]= useState(false)
const [AssignRider,setRiderID] = useState(null)
const [riderInformation,setRiderInfo] = useState([])
const [ready2Cancel,setReady2Cancel] = useState(false)
const [acceptSuggestions,setAIaccept] = useState(false)
const [lockMultiple,setLockMultiple] = useState(false)
const [done,setCompleted] = useState(false)
//realtime
const [arrivalTime,setArrivalTime] = useState("10mins")


const showToast = (type,msg) => {
toast(type, msg);
};

useEffect(() => {
    const fetchData = async () => {
      // Fetch tutorial settings
      try {
        const value = await AsyncStorage.getItem('slide-guide');
        if (value === 'true') setSlideGuide(false);
      } catch (e) {
        console.error("Error fetching tutorial data:", e);
      }
  
      const { wheels, start, city, rule, bookingID } = route.params ?? {};
  
      if (route.params) {
        addVehicle(wheels);
        setMyCity(city === 'Unknown' ? 'Puerto Princesa City' : city);
        setMyLocation(`${start.coords.latitude}>>>${start.coords.longitude}`);
        secureStartLocation(`${start.coords.latitude}>>>${start.coords.longitude}`);
  
        console.log("rule:", rule);

        await checkWeather(city === 'Unknown' ? 'Puerto Princesa City' : city);
  
        if (rule === 'rebook') {
          setRebook(true);
          getBookingData(bookingID, rule);
          setSuggest(false);
        }
  
        if (rule === 'assignee') {
          setSRB(true);
          setRiderID(bookingID);
          getRiderData(bookingID);
          toast('try_again', 'Fill up your pickup and drop destination');
        }

        if (rule === 'Assignee') {
            getBookingData(bookingID, rule);
            setSuggest(false);
          }
  
        if (rule === 'checking') {
          getBookingData(bookingID, rule);
          setSuggest(false);
        }

        //settings
        pullSettings(rule);
  
        switch (wheels) {
          case 2:
            selectActiveVan(false);
            break;
          case 5:
            selectActiveMotor(false);
            break;
        }
      }
    };
  
    const readyToken = async () =>{
        setAuthToken(await hookConf(user))
        fetchData();
    
    }
    setWalletBalance(data?.user?.Wallet)
    readyToken();
  }, [route]);
  

// Optimize Booking Fetch
const getBookingData = async (bi, mode) => {

try {
// console.log(mode)
    const reold = await getBookingInfo(bi, user);
    if (!reold?.data) return;

    setPickupCoordinates(reold.data.Pick_Coordinate);
    setPickupName(reold.data.PickLocation);
    setDropCoordinates(reold.data.Drop_Coordinate);
    setDropName(reold.data.Drop_Location);
    setSuggest(false);
    setBookingID(bi);
    console.log(reold.data.Status)

    if (mode == 'checking' && reold.data.Status == 'Pending') {
    setCalculated(true);
    setSearching(true);
    }

    if(mode == 'Assignee' && reold.data.Status == 'Assignee'){
    setCalculated(true);
    if(reold.data.RiderID != 'N/A'){
        setRider(true)
        //fetch rider info
        await getRiderData(reold.data.RiderID)
        setRiderID(reold.data.RiderID)
        console.log("HERREEEE")
    }
    }


    if (reold.data.Status == 'Accepted' || reold.data.Status == 'Pickup') {
    setSearching(false);
    setCalculated(true);
    if(reold.data.RiderID != 'N/A'){
        setRider(true)
        //fetch rider info
        setRiderID(reold.data.RiderID)
        await getRiderData(reold.data.RiderID)
    }

    //Trigger TARA SAFE
    if(reold.data.Status == 'Pickup' && data?.user?.TaraSafe != 'N/A' && reold.data.Coupon == 'true'){
        setTaraSafe(true)
    }
    }




    setFareRate(reold.data.Amount);
    setModeofPayment(reold.data.Payment_Type);

    // Optimize Multiple Vehicle Selection
    const multipleVehicles = {
    "2,4,4.5": () => { selectMotor(true); selectCard4(true); selectCar6(true); },
    "4,4.5,5": () => { selectCard4(true); selectVan(true); },
    "4.5,5": () => { selectCar6(true); selectVan(true); },
    "5": () => { selectVan(true); },
    "4.5": () => { selectCar6(true); },
    "4": () => { selectCard4(true); },
    "default": () => { selectMotor(true); }
    };

    (multipleVehicles[reold.data.Multiple] || multipleVehicles["default"])();
    setCalculated(true);

    if(reold.data.Status == 'Assignee'){
    setBookState(1) //1 waiting, 2 ontheway, 3 pickup,
    }

    if(reold.data.Status == 'Accepted'){
    setBookState(2) //1 waiting, 2 ontheway, 3 pickup,
    }

    if(reold.data.Status == 'Pickup'){
    setBookState(3) //1 waiting, 2 ontheway, 3 pickup,
    }

    if(reold.data.Status == 'Completed'){
    setBookState(4) //1 waiting, 2 ontheway, 3 pickup,
    //remove in booking if not
    const allclear = removeBooking(bi);
    //update user state
    console.log('formated',allclear)
    const remrem = await updateUser(user?.userId, "ActiveBooking", allclear, user);
    console.log(remrem)

    setData((prevData) => ({
        ...prevData,
        user: {
            ...prevData.user, 
            ActiveBooking: allclear, 
        },
        }));
    //set ratings
    await getRiderData(reold.data.RiderID)
    setCompleted(true)
    }

    setMinizeView(true)
} catch (error) {
    console.error("Error fetching booking data:", error);
}
};
// Optimize Rider Fetch
const getRiderData = async (ri) => {
try {
const rideba = await getRiderInfo(ri, user);
if (!rideba?.data) return;

setRiderInfo(rideba.data);

// Optimize Vehicle Selection
const vehicleSelection = {
"TARAVAN": () => { selectVan(true); selectActiveMotor(false); selectActiveCar6(false); selectActiveCard4(false); },
"TARACAR6": () => { selectCar6(true); selectActiveMotor(false); selectActiveCard4(false); selectActiveVan(false); },
"TARACAR": () => { selectCard4(true); selectActiveMotor(false); selectActiveCar6(false); selectActiveVan(false); },
"default": () => { selectMotor(true); selectActiveVan(false); selectActiveCar6(false); selectActiveCard4(false); }
};

(vehicleSelection[rideba.data.Server] || vehicleSelection["default"])();
} catch (error) {
console.error("Error fetching rider data:", error);
}
};

// Optimize Pull Settings
const pullSettings = async (mode) => {
try {
const sets = await getUserSettings(data?.user?.UserID, user);
if (!sets?.data?.length) return;

const userSettings = sets.data[0];

setModeofPayment(userSettings.PaymentType === 'wallet' ? 1 : 0);

if (userSettings.AISuggestions == 1) {
    const data_ai = await getAISuggestions(data?.user?.UserID, myLocation, user);
    if (data_ai?.status === 'ok') {
    setDataScience(data_ai);
    setSuggestDropName(data_ai.drop_name);
    }
}

if (booking?.status == 'searching') {
    setSuggest(false);
}


if (userSettings.multiplebook == 1) {
    setMultipleBook(true);
    const myBookings = data?.user?.ActiveBooking?.split(",").filter(id => id !== "N/A") || [];
    if (myBookings.length >= 4) {
    notNow("Multiple Booking", "We will only allow your account up to four (4) for now.");
    }
} else {
    const myBookings = data?.user?.ActiveBooking?.split(",").filter(id => id !== "N/A") || [];
    if (myBookings.length >= 1 && !mode) {
    setLockMultiple(true);
    notNowBa("Another Booking?", "We offer a multiple booking feature. To book for another person, please enable it first.");
    }
}

set3dCamera(userSettings.dview == 1);
setWeather(userSettings.weather == 1);
//if (userSettings.weather == 1) checkWeather(myCity);
setAudioBook(userSettings.audio == 1);
} catch (error) {
console.error("Error fetching settings:", error);
}
};

const checkWeather = async (myCity) => {
try {
const weatherweather = await getWeather(myCity, user);
if (!weatherweather?.[0]?.weather?.[0]) return;
setWeatherForecast(weatherweather[0].weather[0]);
setWeatherAnimation(getWeatherAnimation(weatherweather[0].weather[0].weather_title));
} catch (error) {
console.error("Error fetching weather:", error);
}
};


//realtime
useEffect(() => {
    const onlineRef = ref(database, `/booking/${bookingID}`);
    const unsubscribe = onValue(onlineRef, (snapshot) => {
        const data = snapshot.val();
        //console.log("PASSED: " + data + onlineStatus); 
        if(data.status == 'Accepted'){
            setBookState(2)
            setMinizeView(true)
            getBookingData(bookingID)
            setArrivalTime(data.time)
        }else if(data.status == 'Pickup'){
            setBookState(3)
            setMinizeView(true)
            getBookingData(bookingID)
            setArrivalTime(data.time)
        }else if(data.status == 'Completed'){
            setBookState(4)
            setMinizeView(true)
            getBookingData(bookingID)
            setArrivalTime(data.time)
        }
    });
    return () => {
        unsubscribe();
    };
  }, [bookingID]);
  



const goLogin = (page) => {
    setUser((prevState) => ({
      ...prevState,
      userId: null,
      accessToken: null,
      history: page,
    }));
};

const acceptAI = () =>{
    setAIaccept(true);
    setSuggest(false)
    setDropCoordinates(data_science.coordinates)
    setDropName(data_science.drop_name)
    setInfoMode(1);
    selectPinMap();
}

useEffect(()=>{
const calculateMetric = async ()=>{
const fareAPI = await axios.get(
`https://dwayon.tech/api/metrics/`,
{
    params: {
    from: pickupCoordinates,
    to:dropCoordinates
    },
    headers:{
        Auth: user?.accessToken
    }
}
);

//console.log(fareAPI.data)
if(fareAPI.data){
    //console.log(fareAPI.data.data)
setFareAPIResponse(fareAPI.data.data)
setCalculated(true)
if(booking?.status != 'draft'){
//setFareRate(fareAPI.data.data.amount)
setMaxWallet(fareAPI.data.data.amount)
}else{
setFareRate(booking?.fare_value ?? 0)
if (booking && typeof booking.fare_value === 'string' && booking.fare_value.includes("-")) {
    setMaxWallet(booking.fare_value.split("-")[1]);
}
  
}
setCar4Fare(fareAPI.data.data.car4)
setCar5Fare(fareAPI.data.data.car6)
setCar6Fare(fareAPI.data.data.car7)
setReadyness('ready')


//set the default
// if(booking?.motor_selection){
// selectActiveMotor(true)
// }


// if(booking?.van_selection){
// selectActiveVan(true)
// }

// if(booking?.car6_selection){
// selectActiveCar6(true)
// }

// if(booking?.car4_selection){
// selectActiveCard4(true)
// }


    

}



}
setMinizeView(false)

if(user?.userId == 'visitor' ){
    toast("error","Your in visitor mode. Create or login your account first.")
}else{
    if(dropCoordinates && pickupCoordinates){
        calculateMetric();
        console.log("PUMASA")
    }
}



},[dropCoordinates,pickupCoordinates])

const myPinLocation = async () =>{
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        if(location.mocked){
            //exit
            return;
        }else{
            setLocation(location);
            setCurrentLocation(true);
            //replace start
            setMyLocation(`${location.coords.latitude}>>>${location.coords.longitude}`)
            //provide name in the pickup
            return `${location.coords.latitude},${location.coords.longitude}`;
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

    if(scanRiderBooking){
        toast('try_again',"We've assigned a vehicle for your driver.")
        return;
    }
   
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

useEffect(()=>{
    
       if(readyLoad == 'ready'){
        faremetricUI();
       }
       
    
},[pickVan,pickcard6,pickcar4,pickmotor,readyLoad])


const convertVehicle2String = () =>{
    var myvehicle = '2';
    if(pickmotor && pickcar4 && pickcard6){
        myvehicle = '2,4,4.5';
    }else if(pickmotor && pickcar4){
        myvehicle = '2,4';
    }else if(pickmotor && pickcard6){
        myvehicle = '2,4.5';
    }else if(pickcar4 && pickcard6){
        myvehicle = '4,4.5';
    }else if(pickmotor){
        myvehicle = '2';
    }else if(pickcar4){
        myvehicle = '4';
    }else if(pickcard6){
        myvehicle = '4.5';
    }else if(pickVan){
        myvehicle = '5';
    }
    return myvehicle;
}


const faremetricUI = () =>{
     //compute
 var fareOG = fareAPIResponse.amount;
 var base = fareAPIResponse.base_fare;
 var rate = fareAPIResponse.per_km;

 if(pickmotor && pickcar4 && pickcard6){
     fareOG = `${fareAPIResponse.amount}-${fareAPIResponse.car6}`
     base = `${fareAPIResponse.base_fare}-${fareAPIResponse.base_fare_car6}`;
     rate = `${fareAPIResponse.per_km}-${fareAPIResponse.per_km_car6}`;
     setMaxWallet(fareAPIResponse.car6)
 }else if(pickmotor && pickcar4){
     fareOG = `${fareAPIResponse.amount}-${fareAPIResponse.car4}`
     base = `${fareAPIResponse.base_fare}-${fareAPIResponse.base_fare_car4}`;
     rate = `${fareAPIResponse.per_km}-${fareAPIResponse.per_km_car4}`;
     setMaxWallet(fareAPIResponse.car4)
 }else if(pickmotor && pickcard6){
     fareOG = `${fareAPIResponse.amount}-${fareAPIResponse.car6}`
     base = `${fareAPIResponse.base_fare}-${fareAPIResponse.base_fare_car6}`;
     rate = `${fareAPIResponse.per_km}-${fareAPIResponse.per_km_car6}`;
     setMaxWallet(fareAPIResponse.car6)
 }else if(pickcar4 && pickcard6){
     fareOG = `${fareAPIResponse.car4}-${fareAPIResponse.car6}`
     base = `${fareAPIResponse.base_fare_car4}-${fareAPIResponse.base_fare_car6}`;
     rate = `${fareAPIResponse.per_km_car4}-${fareAPIResponse.per_km_car6}`;
     setMaxWallet(fareAPIResponse.car6)
 }else if(pickmotor){
     fareOG = fareAPIResponse.amount
     base = fareAPIResponse.base_fare;
     rate = fareAPIResponse.per_km;
     setMaxWallet(fareAPIResponse.amount)
 }else if(pickcar4){
     fareOG = fareAPIResponse.car4
     base = fareAPIResponse.base_fare_car4;
     rate = fareAPIResponse.per_km_car4;
     setMaxWallet(fareAPIResponse.car4)
 }else if(pickcard6){
     fareOG = fareAPIResponse.car6
     base = fareAPIResponse.base_fare_car6;
     rate = fareAPIResponse.per_km_car6;
     setMaxWallet(fareAPIResponse.car6)
 }else if(pickVan){
     fareOG = fareAPIResponse.can
     base = fareAPIResponse.base_fare_van;
     rate = fareAPIResponse.per_km_van;
     setMaxWallet(fareAPIResponse.car7)
 }


 setFareRate(fareOG)
 setperKM(rate)
 setBaseRate(base)

}

const RequestVehicle = () =>{
    showToast("try_again","This is vehicle is not available in this selection.");
}

const myPaymentMethed = async (pt) =>{
setModeofPayment(pt);

//0 - cash
//1 - wallet
if(bookingID){
    const cancelres = await updateBooking(bookingID,"Payment_Type",pt,user)
    console.log(cancelres)
    sheetRef3.current.close();
    return;
}else{
sheetRef3.current.close();
}


}

const goSearchRider = async () =>{

    setSearching(true);
//know vehicle
const myunit = convertVehicle2String();



//if assignee mode redirect
if(scanRiderBooking){
setRider(true)
setBookState(1)
//create a record booking
const creatingabooking = await createBooking(
    myunit,
    AssignRider,
    "Assignee",
    user?.userId,
    fareRate,
    modeofpayment,
    pickupCoordinates,
    dropCoordinates,
    pickupName,
    dropName,
    fareAPIResponse.distance,
    "0",
    "N/A",
    walletBalance,
    "0",
    startlocation,
    user
    );
    
    if(creatingabooking){
        setReady2Cancel(true)
    }

//update to user local
setBookingID(creatingabooking.BookingID)
setBooking((prevState) => ({
    ...prevState,
    bookingid: creatingabooking.BookingID
    }));


//add in user database
const newmybooking  = addBooking(creatingabooking.BookingID)
await updateUser(user?.userId, "ActiveBooking", newmybooking, user);
//update local
setData((prevData) => ({
    ...prevData, // Spread existing state
    user: {
      ...prevData.user, // Spread existing user object
      ActiveBooking: newmybooking, // Update ActiveBooking
    },
  }));


//save
//assignee rider
return
}


//check coordinates
if(!pickupCoordinates && !dropCoordinates && !fareRate){
toast("error","Booking is invalid, please try again.")
return
}


saveSessionBooking('searching')


//connect to API BUT CHECK IF CREATED< DONT CREATE MORE BOOKING ATTEMPTS
if(bookingID){
    const cancelres = await updateBooking(bookingID,"Status","Pending",user)
    console.log(cancelres)
    const newmybooking  = addBooking(bookingID)
    await updateUser(user?.userId, "ActiveBooking", newmybooking, user);
    //update local
    setData((prevData) => ({
        ...prevData, // Spread existing state
        user: {
          ...prevData.user, // Spread existing user object
          ActiveBooking: newmybooking, // Update ActiveBooking
        },
      }));
    return;
}


const creatingabooking = await createBooking(
myunit,
"N/A",
"Pending",
user?.userId,
fareRate,
modeofpayment,
pickupCoordinates,
dropCoordinates,
pickupName,
dropName,
fareAPIResponse.distance,
"0",
"N/A",
walletBalance,
"0",
startlocation,
user
);

//update to user local
setBookingID(creatingabooking.BookingID)
//add in user database
const newmybooking  = addBooking(creatingabooking.BookingID)
const upup = await updateUser(user?.userId, "ActiveBooking", newmybooking, user);
//update local
setData((prevData) => ({
    ...prevData, // Spread existing state
    user: {
      ...prevData.user, // Spread existing user object
      ActiveBooking: newmybooking, // Update ActiveBooking
    },
  }));
setBooking((prevState) => ({
...prevState,
bookingid: creatingabooking.BookingID
}));


  if(creatingabooking){
    setReady2Cancel(true)
}

}

const cancelSearch = () =>{
    sheetRef4.current.open();
    //setSearching(false);
}

const removeBooking = (bookingId) => {
    const updatedBookings = data?.user?.ActiveBooking
      .split(",") // Convert string to array
      .filter((id) => id !== bookingId) // Remove the specific booking ID
      .join(","); // Convert array back to string
    return updatedBookings ?? 'N/A';
};

const addBooking = (newBookingId) => {
const bookingArray = data?.user?.ActiveBooking ? data?.user?.ActiveBooking.split(",") : []; // Convert string to array
if (!bookingArray.includes(newBookingId)) { // Avoid duplicates
    const updatedBookings = [...bookingArray, newBookingId].join(","); // Add and convert back to string
    return updatedBookings;
}
};

const confirmCancel = async () =>{
    sheetRef4.current.close();
    setCalculated(true)
    setSearching(false);
    setRider(false)
    setBookState(1)
    
    //run api
    const cancelres = await updateBooking(bookingID,"Status","Cancelled",user)

    const allclear = removeBooking(bookingID);
    //update user state
    console.log('formated',allclear)
    const remrem = await updateUser(user?.userId, "ActiveBooking", allclear, user);
    console.log(remrem)

    setData((prevData) => ({
        ...prevData,
        user: {
          ...prevData.user, 
          ActiveBooking: allclear, 
        },
      }));

    //cancel search assignee
    if(scanRiderBooking){
    setRider(false)
    }
    setBooking(null);
  
}

const selectCurrentLocation = async () =>{
    setLoader(true)
    sheetRef.current?.close();
    setSuggest(false);
    const myCULocation = await myPinLocation();
    //run location permission
    setPickupCoordinates(myCULocation)
    setPickupName('Current Location')
    if(myCULocation){
        setLoader(false)
    }
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

// const InputLocation = async (e) =>{
//     setInfoInput(e)
//     await searchLocations(e);
// }

const checkSlidePrompt = () =>{
    setSlideGuide(false)
    setSlideTutor(true);

}

const okImfine = async () =>{
    setSlideDontShow(slidedontshow ? false: true)
    if(!slidedontshow){
        try {
            await AsyncStorage.setItem('slide-guide', 'true');
            console.log("Saved")
          } catch (e) {
            // saving error
            console.log("dont save")
          }
    }else{
        console.log("reset")
        await AsyncStorage.removeItem('slide-guide');
    }
}

const selectThisLocation = () =>{
    setMapPin(false)
    const theStopDrag = `${cardCoor.lat},${cardCoor.lng}`
    if(infoMode == 1){
        //pickup
        setPickupCoordinates(theStopDrag);
        setPickupName(draglocaname)
    }else{
        //drop
        setDropCoordinates(theStopDrag);
        setDropName(draglocaname)
    }
}

const openBoxOffer = () =>{
    if(offerCom){
        setComOffer(false)
    }else{
        setComOffer(true)
    }
}


const notNow = (title,msg) =>{
    Alert.alert(
                title,
                msg,
                [
                    {
                      text: "Close",
                      onPress: async () => {
                        navigation.goBack()
                      },
                    },
                  ]
                );
}


const notNowBa = (title,msg) =>{
    Alert.alert(
                title,
                msg,
                [
                    {
                      text: "Close",
                      onPress: async () => {
                        navigation.goBack()
                      },
                    },
                    {
                        text: "Allow Multiple",
                        onPress: async () => {
                          setSettings(true)
                        },
                      }
                  ]
                );
}

const closeMap = () =>{
    if(MapPin){
        setMapPin(false)
    }else if(viewRiderMap){
        setViewRiders(false)  
    }else{

       

        //save?
        if(calculated && !searching){
            saveSessionBooking('draft');
            if(rebook || scanRiderBooking){
                navigation.navigate("home")
            }else{
                navigation.goBack()
            }
           
            // Alert.alert(
            //     "Are you planning to come back?",
            //     "Would you like Tara to save your booking for future use?",
            //     [
            //         {
            //           text: 'Wait',
            //           type: 'cancel'
            //         },
            //         {
            //             text: "Don't save",
            //             onPress: async () => {
            //                 setBooking(null);
            //                 navigation.goBack()
            //             },
            //           },
            //         {
            //           text: "Save",
            //           onPress: async () => {
            //             saveSessionBooking('draft');
            //             toast("success","We saved your booking for a while.")
            //             navigation.goBack()
            //           },
            //         },
            //       ]
            //     );
           
        }else{
            if(rebook || scanRiderBooking){
                navigation.navigate("home")
            }else{
                navigation.goBack()
            }
            
        }
        
    }
}



const saveSessionBooking = async (msg) =>{
    // setBooking((prevState) => ({
    //     ...prevState,
    //     status: msg,
    //     pickcoord: pickupCoordinates,
    //     pickname: pickupName,
    //     dropcoord: dropCoordinates,
    //     dropname: dropName,
    //     payment: modeofpayment,
    //     fare_value: fareRate,
    //     motor_selection: pickmotor,
    //     car4_selection: pickcar4,
    //     car6_selection: pickcard6,
    //     van_selection: pickVan,
    //     riderid: '',
    //     bookingid: bookingID
    //   }));
      
}

const changePaymentMethod = () =>{
    setPaymentWarnig("You don't have enough balance.")
    sheetRef3.current.open()
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
        sender: user?.userId,
        receiver: AssignRider,
        channel: bookingID
        });
}

const QRBooking = async () =>{
    setQRLoading(true)
    const secretQR = `GENERATE>>>${fareRate}>>>${user?.userId}>>>${pickupCoordinates}>>>${dropCoordinates}>>>${modeofpayment}`;
    const qrwait = await SecureData(0,secretQR,user);
    if(qrwait.status == 'ok'){
        setQRBook(qrwait.value)
        setQRLoading(false)
        if(generateQR){
            setGenerateQR(false)
        }else{
            setGenerateQR(true)
        }
    }else{
        setQRLoading(false)
        toast("error","Failed to generate QR booking")
    }

    
   
}


  //ANIMATION MARK
const draggingMap = () =>{
    if (lottieRef.current) {
        lottieRef.current.play(25, undefined); 
      }
    if(!MapPin){
    setMinizeView(true);
    }
}

const draggingStop = async () =>{
    const mapboxCeb = `${cardCoor.lat},${cardCoor.lng}`
    if(MapPin){
   //run API
   try {
    const response = await axios.get(
      `https://dwayon.tech/api/locations/google/`,
      {
        params: {
          coordinates:mapboxCeb
        },
        headers:{
            Auth: authToken
        }
      }
    );
 
    if (response.data) {
        //console.log(response.data)
        setdragLocName(response.data.name);
    } else {
        setdragLocName('Unknown location');
    }
  } catch (error) {
    console.error(error);
  }
    }
}


const handleWebViewMessage = (event) => {
const data = JSON.parse(event.nativeEvent.data);
if(MapPin){
    //Alert.alert("Message from Web Page", data.message);
    setcardCoord(JSON.parse(data.message))
    //run API
}
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
        drag: MapPin,
        real:bookState,
        timestamp: new Date().toISOString()
    });

    //console.log(jsonData)
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
    setCurrentLocation,
    MapPin,
    setMapPin,
    bookState
])





// Smooth Bouncing Animation
const translateX = useRef(new Animated.Value(0)).current;

useEffect(() => {
Animated.loop(
Animated.sequence([
Animated.timing(translateX, {
toValue: 200, // Adjusted for better UX
duration: 1200,
easing: Easing.inOut(Easing.ease),
useNativeDriver: true,
}),
Animated.timing(translateX, {
toValue: 0, // Smooth return
duration: 1000,
easing: Easing.inOut(Easing.ease),
useNativeDriver: true,
}),
])
).start();
}, []);

// Draggable BottomSheet Animation
const pan = useRef(new Animated.ValueXY()).current;
const panResponder = PanResponder.create({
onMoveShouldSetPanResponder: () => true,
onPanResponderMove: (evt, gestureState) => {
if (gestureState.dy > 10) {
setMinizeView(true); // Slide down
setdragBlur(false)
} else if (gestureState.dy < -10) {
setMinizeView(false); // Slide up
setdragBlur(false)
}
Animated.event([{ dy: pan.y }], { useNativeDriver: false })(gestureState);
},
onPanResponderRelease: (evt, gestureState) => {
if (gestureState.dy < -50) {
// If swiped up enough, apply bounce effect
Animated.spring(pan, {
toValue: { x: 0, y: -1 }, // Moves up and bounces
speed: 0, // Faster spring effect
bounciness: 1, // More bounce
useNativeDriver: true,
}).start(() => {
// After bounce, settle at final position
Animated.spring(pan, {
toValue: { x: 0, y: 0 },
friction: 3, // Smooth stopping
useNativeDriver: true,
}).start();
setTimeout(() => setdragBlur(true), 500);
});

} else {
// Default smooth return when not sliding up
Animated.spring(pan, {
toValue: { x: 0, y: 0 },
friction: 5,
useNativeDriver: true,
}).start();

}
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



  const Tiara = (mode) => {
    let discount = 0;
    let tip = 0;
    let discount2 = 0;
    let tip2 = 0;
    let offer = 0;

    // Check combinations in a sequence, starting with motor and ending with van
    if (pickmotor && pickcar4 && pickcard6 && pickVan) {
        // All vehicles selected (Motor -> Car4 -> Car6 -> Van)
        discount = `${fareAPIResponse.discount1}-${fareAPIResponse.discount1_van}`;
        tip = `${fareAPIResponse.tip1}-${fareAPIResponse.tip1_van}`;
        discount2 = `${fareAPIResponse.discount2}-${fareAPIResponse.discount2_van}`;
        tip2 = `${fareAPIResponse.tip2}-${fareAPIResponse.tip2_van}`;
        offer = `${fareAPIResponse.amount}-${fareAPIResponse.van}`
    } else if (pickmotor && pickcar4 && pickcard6) {
        // Motor -> Car4 -> Car6 selected
        discount = `${fareAPIResponse.discount1}-${fareAPIResponse.discount1_car6}`;
        tip = `${fareAPIResponse.tip1}-${fareAPIResponse.tip1_car6}`;
        discount2 = `${fareAPIResponse.discount2}-${fareAPIResponse.discount2_car6}`;
        tip2 = `${fareAPIResponse.tip2}-${fareAPIResponse.tip2_car6}`;
        offer = `${fareAPIResponse.amount}-${fareAPIResponse.car6}`
    } else if (pickmotor && pickcar4 && pickVan) {
        // Motor -> Car4 -> Van selected
        discount = `${fareAPIResponse.discount1}-${fareAPIResponse.discount1_van}`;
        tip = `${fareAPIResponse.tip1}-${fareAPIResponse.tip1_van}`;
        discount2 = `${fareAPIResponse.discount2}-${fareAPIResponse.discount2_van}`;
        tip2 = `${fareAPIResponse.tip2}-${fareAPIResponse.tip2_van}`;
        offer = `${fareAPIResponse.amount}-${fareAPIResponse.van}`
    } else if (pickmotor && pickcar4) {
        // Motor -> Car4 selected
        discount = `${fareAPIResponse.discount1}-${fareAPIResponse.discount1_car4}`;
        tip = `${fareAPIResponse.tip1}-${fareAPIResponse.tip1_car4}`;
        discount2 = `${fareAPIResponse.discount2}-${fareAPIResponse.discount2_car4}`;
        tip2 = `${fareAPIResponse.tip2}-${fareAPIResponse.tip2_car4}`;
        offer = `${fareAPIResponse.amount}-${fareAPIResponse.car4}`
    } else if (pickmotor && pickcard6) {
        // Motor -> Car6 selected
        discount = `${fareAPIResponse.discount1}-${fareAPIResponse.discount1_car6}`;
        tip = `${fareAPIResponse.tip1}-${fareAPIResponse.tip1_car6}`;
        discount2 = `${fareAPIResponse.discount2}-${fareAPIResponse.discount2_car6}`;
        tip2 = `${fareAPIResponse.tip2}-${fareAPIResponse.tip2_car6}`;
        offer = `${fareAPIResponse.amount}-${fareAPIResponse.car6}`
    } else if (pickmotor && pickVan) {
        // Motor -> Van selected
        discount = `${fareAPIResponse.discount1}-${fareAPIResponse.discount1_van}`;
        tip = `${fareAPIResponse.tip1}-${fareAPIResponse.tip1_van}`;
        discount2 = `${fareAPIResponse.discount2}-${fareAPIResponse.discount2_van}`;
        tip2 = `${fareAPIResponse.tip2}-${fareAPIResponse.tip2_van}`;
        offer = `${fareAPIResponse.amount}-${fareAPIResponse.van}`
    } else if (pickcar4 && pickcard6) {
        // Car4 -> Car6 selected
        discount = `${fareAPIResponse.discount1_car4}-${fareAPIResponse.discount1_car6}`;
        tip = `${fareAPIResponse.tip1_car4}-${fareAPIResponse.tip1_car6}`;
        discount2 = `${fareAPIResponse.discount2_car4}-${fareAPIResponse.discount2_car6}`;
        tip2 = `${fareAPIResponse.tip2_car4}-${fareAPIResponse.tip2_car6}`;
        offer = `${fareAPIResponse.car4}-${fareAPIResponse.car6}`
    } else if (pickcar4 && pickVan) {
        // Car4 -> Van selected
        discount = `${fareAPIResponse.discount1_car4}-${fareAPIResponse.discount1_van}`;
        tip = `${fareAPIResponse.tip1_car4}-${fareAPIResponse.tip1_van}`;
        discount2 = `${fareAPIResponse.discount2_car4}-${fareAPIResponse.discount2_van}`;
        tip2 = `${fareAPIResponse.tip2_car4}-${fareAPIResponse.tip2_van}`;
        offer = `${fareAPIResponse.car4}-${fareAPIResponse.van}`
    } else if (pickcard6 && pickVan) {
        // Car6 -> Van selected
        discount = `${fareAPIResponse.discount1_car6}-${fareAPIResponse.discount1_van}`;
        tip = `${fareAPIResponse.tip1_car6}-${fareAPIResponse.tip1_van}`;
        discount2 = `${fareAPIResponse.discount2_car6}-${fareAPIResponse.discount2_van}`;
        tip2 = `${fareAPIResponse.tip2_car6}-${fareAPIResponse.tip2_van}`;
        offer = `${fareAPIResponse.car6}-${fareAPIResponse.van}`
    } else if (pickmotor) {
        // Only Motor selected
        discount = fareAPIResponse.discount1;
        tip = fareAPIResponse.tip1;
        discount2 = fareAPIResponse.discount2;
        tip2 = fareAPIResponse.tip2;
        offer = fareAPIResponse.amount
    } else if (pickcar4) {
        // Only Car4 selected
        discount = fareAPIResponse.discount1_car4;
        tip = fareAPIResponse.tip1_car4;
        discount2 = fareAPIResponse.discount2_car4;
        tip2 = fareAPIResponse.tip2_car4;
        offer = fareAPIResponse.car4
    } else if (pickcard6) {
        // Only Car6 selected
        discount = fareAPIResponse.discount1_car6;
        tip = fareAPIResponse.tip1_car6;
        discount2 = fareAPIResponse.discount2_car6;
        tip2 = fareAPIResponse.tip2_car6;
        offer = fareAPIResponse.car6
    } else if (pickVan) {
        // Only Van selected
        discount = fareAPIResponse.discount1_van;
        tip = fareAPIResponse.tip1_van;
        discount2 = fareAPIResponse.discount2_van;
        tip2 = fareAPIResponse.tip2_van;
        offer = fareAPIResponse.van
    }

    // Return the final discount and tip values based on mode
    if (mode === 'discount1') {
        return discount;
    } else if (mode === 'tip1') {
        return tip;
    } else if (mode === 'discount2') {
        return discount2;
    } else if (mode === 'tip2') {
        return tip2;
    } else if (mode === 'offer') {
        return offer;
    } else {
        return 22;
    }
};


const handleValueChange = (value) => {
    fadeIn();
    setCustomSlide(value);
    scaleAnim.setValue(1); // Reset scale when sliding
    setCSlideEffect('green');
    switch (value[0]) {
        case 0:
            return setFareRate(Tiara('discount2'));
        case 3:
            return setFareRate(Tiara('discount1'));
        case 9:
            return setFareRate(Tiara('tip1'));
        case 12:
            return setFareRate(Tiara('tip2'));
        default:
            return setFareRate(Tiara('offer'));
    }
};



  const handleSlidingComplete = () => {
    fadeOutAndZoom();
  };

  const renderAboveThumbComponent = () => {
    return (
      <Animated.View
      className={`${cSlide > 5 ? 'right-[100px]' : 'left-4'} p-2  rounded-xl shadow-2xl bg-green-500`}
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



const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};


const [cache, setCache] = useState({}); // Cache object to store previous searches

const debouncedSearch = useDebounce(infoInput, 500); // Delay API call by 500ms

const searchLocations = async (place) => {
    if (!place.trim()) return; // Prevent empty searches

    // Check if the search term is already cached
    if (cache[place]) {
        setLocations(cache[place]);
        return;
    }

    try {
        const response = await axios.get(
            `https://dwayon.tech/api/locations/google/search/`,
            {
                params: { search: place, start: myLocation },
                headers: { Auth: authToken }
            }
        );

        if (response.data && response.data.length > 0) {
            setLocations(response.data);
            setCache(prevCache => ({ ...prevCache, [place]: response.data })); // Store in cache
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

// Call API only when the debounced value changes
useEffect(() => {
    if (debouncedSearch) {
        searchLocations(debouncedSearch);
    }
}, [debouncedSearch]);

const InputLocation = (value) => {
    setInfoInput(value);
};



  //Audio
const startspeak = () => {
const thingToSay = 'Try to speak the location now';
Speech.speak(thingToSay);
setSpeaking(true)
};

const openVehiclePrompt = () =>{
readVehicleProm(true)
const thingToSay = 'You can select multiple vehicle types, and the system will prioritize whichever is available first. This allows you to search once while maximizing your chances of finding a ride quickly.';
Speech.speak(thingToSay);
}


const startRecording = async () => {
    setSpeaking(true);
    let silenceCounter = 0; // Move this inside the function
  
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (!permission.granted) {
        console.log("Permission to record audio denied");
        return;
      }
  
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
  
      const newRecording = new Audio.Recording();
      await newRecording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      await newRecording.startAsync();
  
      setRecording(newRecording);
      console.log("Recording started...");
  
      // Check for silence every 500ms
      const noiseInterval = setInterval(async () => {
        const status = await newRecording.getStatusAsync();
        if (status?.metering !== undefined) {
          console.log("Noise Level (dB):", status.metering);
  
          if (status.metering < -40) { // Silence threshold
            silenceCounter += 1;
          } else {
            silenceCounter = 0; // Reset if speech is detected
          }
  
          if (silenceCounter >= 6) { // 3 seconds of silence (6 * 500ms)
            console.log("No speech detected. Stopping recording...");
            clearInterval(noiseInterval);
            setSpeaking(false);
            setRecording(null);
            if(newRecording){
                await newRecording.stopAndUnloadAsync();
            }
            toast("error", "No speech detected.");
          }
        }
      }, 500);
  
      // Stop recording after 5 seconds if speech is detected
      setTimeout(async () => {
        clearInterval(noiseInterval);
        if (silenceCounter < 6) { // Only proceed if speech was detected
          console.log("Speech detected, stopping normally...");
          //await stopRecording();
        } else {
          console.log("Silence detected, stopping recording...");
          setSpeaking(false);
          if (newRecording) {
            await newRecording.stopAndUnloadAsync();
          }
        }
      }, 10000);
  
    } catch (error) {
      console.error("Failed to start recording", error);
    }
  };
  

const stopRecording = async () => {
setSpeaking(false)
if (!recording) return;

try {
await recording.stopAndUnloadAsync();
const uri = recording.getURI();
setAudioUri(uri);
console.log('Audio recorded at: ', uri);

// If no speech was detected, don't upload
if (!speaking) {
console.log("Skipping API call due to silence.");
return;
}
setaudioAPILoading(true)
// Upload the audio file to the backend
const formData = new FormData();
formData.append('audio', {
uri,
name: 'audio.m4a',
type: 'audio/m4a',
});

const response = await fetch(`${AUDIO_TEXT}?city=${myCity}`, {
method: 'POST',
body: formData,
headers: {
'Content-Type': 'multipart/form-data',
'Auth' : authToken
}
});

const result = await response.json();
console.log('Transcription:', result);
if(result.text != 'nothing'){
setUseMic(false)
if(infoMode == 1){
//pickup
setPickupName(result.text);
setPickupCoordinates(`${result.lat},${result.lng}`)
}else{
//drop
setDropName(result.text);
setDropCoordinates(`${result.lat},${result.lng}`)
}
sheetRef.current?.close()
}else{
    toast('error','Seems we detected nothing..')
    // const errorToSay = result.t2c;
    // Speech.speak(errorToSay);
}
setaudioAPILoading(false)
} catch (error) {
console.error('Failed to stop recording', error);
}
};

const enoughRecord = async () =>{
    setUseMic(false)
    if(recording){
        await recording.stopAndUnloadAsync();
    }
    
}

//weather
const getWeatherAnimation = (weatherTitle) => {
    const title = weatherTitle.toLowerCase(); // Convert to lowercase for easier comparison

    if (title.includes("and thunderstorm")) {
        setRaining(true)
        sheetRef5.current.open()
        return "storm";
    } else if (title.includes("rain") && title.includes("and rainshowers")) {
        setRaining(true)
        sheetRef5.current.open()
        return "heavy";
    } else if (title.includes("partly cloudy") || title.includes("cloudy")) {
        setRaining(false)
        return "cloudy";
    } else if (title.includes("sunny") || title.includes("clear")) {
        setRaining(false)
        return "sunny";
    } else {
        setRaining(false)
        return "sunny"; // Default fallback
    }
};
  

return (
    <>
<ScrollView nestedScrollEnabled={false} scrollEnabled={false} keyboardShouldPersistTaps="handled" >
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
    user?.userId == 'visitor' && (
        <View className="absolute top-24 z-50 w-full p-4">
       <View className="relative w-full">
         <HelloVisitor uwu={goLogin} />
         </View>
         </View>
    )
}



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
        <View className="px-2 mt-2">
            {
                data_science.length == 0 ? (
                    <View className="mb-4 h-7 w-80 bg-gray-200 rounded-lg"></View>
                ):(
                    <Text className="text-gray-600 text-lg">Are you heading to <Text className="text-blue-500 font-medium">{dropSuggest}?</Text></Text>
                )
            }
        
        </View>
{
    data_science.length != 0 && (
        <View className="p-2.5 py-4 flex-row justify-between items-center">
        <Button
onPress={() => setSuggest(false)}
bgColor="bg-slate-200"
textColor="text-gray-500"
fontSize="md"
bwidth="w-44"
>
No
</Button>
<Button
onPress={() => acceptAI()}
bgColor="bg-blue-500"
textColor="text-white"
fontSize="md"
bwidth="w-44"
>
Yes
</Button>
        </View>
    )
}
    </View>
</View>  
        )
    }






{/* map drag marker */}
<View className="h-screen w-screen relative">

{
    MapPin && (
        <View style={styles.marker}>
<LottieView
source={require('../assets/animation/marker.json')}
ref={lottieRef}
width={120}
height={120}
autoPlay={false} // Prevent autoplay
loop={false} // Disable looping
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
source={{ uri: `https://onthewaypo.com/OTW/api/playground/map/?rain=${weatherba ? isitRaining : false}` }}
javaScriptEnabled={true}
onMessage={handleWebViewMessage}
className="bg-white"
onLoad={()=>setWebLoad(true)}
onTouchStart={()=>draggingMap()}
onTouchEnd={()=>draggingStop()}
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
      ? 'bottom-[345px]'
      : offerCom == true
      ? 'bottom-[615px]'
      : calculated == true
      ? 'bottom-[570px]'
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
<View className="flex-row justify-end items-center mx-2.5 gap-x-2.5">

{
    weatherba && (
<TouchableOpacity onPress={()=>sheetRef5.current.open()} className="bg-white rounded-xl w-16 h-16 flex-row justify-center items-center mb-2 shadow-xl">
{
    weatherAnimation == 'storm' ? (
        <LottieView
        source={require('../assets/animation/storm.json')}
        autoPlay
        loop
        width={40}
        height={40}
        />
    ): weatherAnimation == 'heavy' ? (
        <LottieView
        source={require('../assets/animation/heavy-rain.json')}
        autoPlay
        loop
        width={40}
        height={40}
        />
    ): weatherAnimation == 'light' ? (
        <LottieView
        source={require('../assets/animation/ligh-rain.json')}
        autoPlay
        loop
        width={40}
        height={40}
        />
    ): weatherAnimation == 'cloudy' ? (
        <LottieView
        source={require('../assets/animation/clouds.json')}
        autoPlay
        loop
        width={40}
        height={40}
        />
    ):(
        <LottieView
        source={require('../assets/animation/sunny.json')}
        autoPlay
        loop
        width={40}
        height={40}
        />
    )
}
</TouchableOpacity>
    )
}




   {
     rider ? (
  
<TouchableOpacity onPress={()=>openChat()} className="bg-white border border-gray-200 rounded-xl w-16 h-16 flex-row justify-center items-center mb-2 shadow-xl">   
      <View className="relative">
      <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<Path d="M24 15.9999V20.9999C24 21.7955 23.6839 22.5586 23.1213 23.1212C22.5587 23.6838 21.7956 23.9999 21 23.9999H16C14.5971 23.9985 13.2192 23.6281 12.0047 22.926C10.7901 22.224 9.78145 21.2148 9.08 19.9999C9.83387 19.9945 10.5852 19.9114 11.322 19.7519C11.8832 20.4535 12.595 21.0199 13.4048 21.4091C14.2146 21.7982 15.1016 22.0001 16 21.9999H21C21.2652 21.9999 21.5196 21.8945 21.7071 21.707C21.8946 21.5195 22 21.2651 22 20.9999V15.9999C21.9998 15.1011 21.7972 14.2139 21.4074 13.4041C21.0175 12.5943 20.4504 11.8826 19.748 11.3219C19.9088 10.5852 19.9933 9.8339 20 9.07989C21.215 9.78134 22.2241 10.79 22.9262 12.0045C23.6282 13.2191 23.9986 14.597 24 15.9999ZM17.977 9.65089C18.0705 8.36253 17.8856 7.06913 17.4348 5.85859C16.9841 4.64804 16.278 3.54871 15.3646 2.63531C14.4512 1.7219 13.3518 1.01582 12.1413 0.565046C10.9308 0.114271 9.63736 -0.0706368 8.349 0.0228889C6.06592 0.283621 3.95693 1.37006 2.41918 3.07763C0.881427 4.7852 0.0210272 6.99606 0 9.29389L0 14.3339C0 16.8659 1.507 17.9999 3 17.9999H8.7C10.9988 17.9801 13.211 17.1203 14.9198 15.5824C16.6286 14.0446 17.7159 11.9349 17.977 9.65089ZM13.95 4.05089C14.6599 4.76239 15.2088 5.61809 15.5593 6.56008C15.9099 7.50207 16.054 8.50837 15.982 9.51089C15.7686 11.2946 14.9105 12.9387 13.5693 14.1338C12.2282 15.3289 10.4964 15.9926 8.7 15.9999H3C2.072 15.9999 2 14.7249 2 14.3339V9.29389C2.00834 7.49826 2.67265 5.76759 3.86792 4.42757C5.06319 3.08754 6.70699 2.23056 8.49 2.01789C8.656 2.00589 8.822 1.99989 8.988 1.99989C9.90927 1.99903 10.8217 2.17973 11.6731 2.53165C12.5245 2.88357 13.2982 3.39982 13.95 4.05089Z" fill="#374957"/>
</Svg>
<View className="hidden absolute h-4 w-4 bg-red-500 rounded-lg absolute -right-2 -top-2"></View>
</View>
        </TouchableOpacity>
        

     ): calculated && !scanRiderBooking ? (
        QRloading ? (
            <View className="bg-white rounded-xl w-16 h-16 flex-row justify-center items-center mb-2 shadow-xl">
                   <LottieView
                              source={require('../assets/animation/circle.json')}
                              autoPlay
                              loop
                              width={40}
                              height={40}
                          />
            </View>
        ):(
            <Pressable onPress={()=>QRBooking()} className="bg-blue-500 rounded-xl w-16 h-16 flex-row justify-center items-center mb-2 shadow-xl">   
        <TaraQR size={25} />  
         </Pressable>
        )
     ):(
        scanRiderBooking ? (
<Pressable onPress={()=>viewRiders()} className="bg-blue-500 rounded-xl w-16 h-16 flex-row justify-center items-center mb-2 shadow-xl">
<Image source={{ uri: riderInformation?.Photo }} alt={AssignRider} className="rounded-xl w-full h-full object-cover" />
<View className="absolute -left-20 -top-7 bg-green-500 px-2.5 py-1.5 rounded-xl shadow-lg">
    <Text className="text-md text-white">Waiting driver</Text>
</View>
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
                    <Text className="font-medium text-xl">{arrivalTime}</Text>
                    </View>
            </View>
                    </View>
            ) : bookState == 3 ? (
                <View>
                <View className="rounded-t-xl bg-slate-100 w-full flex-row justify-between items-center p-2.5">
                <View className="px-2">
                <Text className="text-slate-800 text-xl font-medium">Driver has picked you up..</Text>
                <Text className="text-slate-500 text-sm">Have a safe trip!</Text>
                    </View>
    
                    <View className="px-2.5">
                    <Text className="font-medium text-xl">{arrivalTime}</Text>
                    </View>
            </View> 
                </View>
            ):(
                <View>
                <View className="rounded-t-xl bg-gray-100 w-full flex-row justify-between items-center p-2.5">
                <View className="px-2">
                <Text className="text-gray-800 text-xl font-medium">Waiting to accept</Text>
                <Text className="text-gray-500 text-sm">Please wait for the driver to accept your booking</Text>
                    </View>
    
                    <View>
                    <LottieView
                    source={require('../assets/animation/tarawait.json')}
                    autoPlay
                    loop
                    width={45}
                    height={45}
                    />
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
            )
        }

        <View className="px-2.5 w-full">
            
            <View className="flex-row justify-between items-center w-full">


            <View className="flex-row">
           <View className="h-16 w-16 rounded-full rounded-full border-2 border-gray-300">
           <Image source={{uri: riderInformation?.Photo}} alt="" className="rounded-full w-full h-full object-cover" />
           </View>

           <View className=" h-16 w-16 rounded-full rounded-full -left-4 top-4">
           <Image source={{uri: `https://taranapo.com/assets/vehicle/${riderInformation?.Server}/${riderInformation?.Color}.png`}} alt="" className="rounded-full w-full h-full object-center" />
           </View>
           </View>



            <View className="px-4 text-right">
            <Text className="text-right text-2xl font-semibold text-gray-800">{riderInformation?.Plate_Number}</Text>
            <Text className="text-right text-gray-600 text-xs">{riderInformation?.Vehicle_Type} ({riderInformation?.Color})</Text>
            </View>

            </View>

            <View className="mt-2 pb-2 flex-row justify-between items-center">

            <View className="w-72 px-4 pb-2.5 flex-row justify-start items-center gap-x-2">
                <TaraLogo size={35} />
                <View>
                <Text className="text-left text-gray-600 text-xs">Tara Driver Name</Text>
                <Text numberOfLines={2} ellipsizeMode="tail" className="text-left text-gray-800 text-base">{riderInformation?.Legal_Name}</Text>
                </View>
                </View>


                <View className="w-24 flex-row justify-center items-center gap-x-1.5">
                <Svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <Path d="M1.32677 12.4004L4.88677 15.0004L3.53477 19.1874C3.31628 19.8368 3.31351 20.5394 3.52688 21.1905C3.74024 21.8416 4.15831 22.4063 4.71877 22.8004C5.26962 23.2072 5.93716 23.4251 6.62192 23.4217C7.30668 23.4183 7.97201 23.1937 8.51877 22.7814L11.9998 20.2194L15.4818 22.7784C16.0316 23.1829 16.6956 23.4026 17.3781 23.4059C18.0607 23.4092 18.7268 23.196 19.2805 22.797C19.8343 22.3979 20.2473 21.8335 20.4601 21.1849C20.6728 20.5363 20.6745 19.837 20.4648 19.1874L19.1128 15.0004L22.6728 12.4004C23.2219 11.999 23.6301 11.4342 23.8391 10.7868C24.0481 10.1395 24.0472 9.44263 23.8364 8.79583C23.6257 8.14903 23.216 7.58537 22.6658 7.18535C22.1156 6.78533 21.453 6.56941 20.7728 6.56844H16.3998L15.0728 2.43244C14.8641 1.7814 14.454 1.21346 13.9017 0.810508C13.3494 0.407559 12.6834 0.19043 11.9998 0.19043C11.3161 0.19043 10.6501 0.407559 10.0978 0.810508C9.5455 1.21346 9.13544 1.7814 8.92677 2.43244L7.59977 6.56844H3.23077C2.55051 6.56941 1.88796 6.78533 1.33775 7.18535C0.787534 7.58537 0.377806 8.14903 0.167087 8.79583C-0.0436323 9.44263 -0.044565 10.1395 0.164422 10.7868C0.37341 11.4342 0.781627 11.999 1.33077 12.4004H1.32677Z" fill="#FBBF24"/>
                </Svg>
                <Text className="text-gray-600 font-medium">{riderInformation?.Ratings}</Text>
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
            <Text className="font-normal text-xs">Notification sent to your Tara Safe contacts.</Text>
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



{/* pickup and drop card ======================================================== */}

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


{/* {
    minimizeView && (
<Pressable   className="h-full w-full absolute inset-0 z-40">
</Pressable>
    )
} */}
<View className="bg-white overflow-hidden gap-y-4 py-2.5 px-2">
<View className="flex-row justify-start items-center gap-x-2 w-full">
<TaraNavigation size={28} color="#22c55e" />
{
    searching || rider ? (
<View className="w-80">
    <Text numberOfLines={1} ellipsizeMode="tail" className="font-semibold text-lg">{pickupName}</Text>
</View>

    ): pickupName ? (
        <TouchableOpacity onPress={()=>selectLocation(1)} className="w-80">
        <Text numberOfLines={1} ellipsizeMode="tail" className={`font-semibold ${pickupName == 'Current Location' ? 'text-green-600' : 'text-gray-800'} text-lg`}>{pickupName}</Text>
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
<View className="relative flex-row justify-start items-center gap-x-2 w-full ">
<View className="absolute -top-3 -right-4  bottom-0 z-50 w-auto ">
<TouchableOpacity onPress={()=>switchLocations()} className="w-14 flex-row justify-center items-center">
<TaraChange size={20} color="#3b82f6" />
</TouchableOpacity>
</View>

<View className="h-px bg-gray-200 w-[300px]"></View>
</View>
    ):(
<View className="h-px bg-gray-200 w-full"></View>
    )
}






<View className="flex-row justify-start items-center gap-x-2 w-full">
<TaraMarker size={28} color="#ef4444" />
{
    searching || rider ? (
<View className="w-80">
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



{/* vehicle selection===================================================== */}


{
    searching && (
        <View className="mx-2.5 mb-2.5">
    <View className="flex-row justify-between items-center bg-white rounded-xl p-2 border border-gray-200 shadow-lg">
        <View className="px-2">
            <Text className="font-medium text-lg">Get ready to hop-in!</Text>
            <Text className="font-normal text-sm text-gray-500">Looking for our drivers nearby.. .</Text>
            </View>

            <View className="px-2 my-2 gap-x-1.5 overflow-hidden flex-row flex">
            
            {
                (
                    pickmotor && (
                        <View className="border border-green-500 bg-gray-100 rounded-full h-12 w-12 flex-row justify-center items-center">
            <TaraMotor size="28" />
            </View>
                    )
                )
            }

            {
                (
                    pickcar4 && (
                        <View className="border border-green-500 bg-gray-100 rounded-full h-12 w-12 flex-row justify-center items-center">
                        <TaraCar size="28" />
                        </View>
                    )
                )
            }

            {
                (
                    pickcard6 && (
                        <View className="border border-green-500 bg-gray-100 rounded-full h-12 w-12 flex-row justify-center items-center">
            <TaraCar size="28" />
            </View>
                    )
                )
            }


            {
                pickVan && (
                    <View className="border border-green-500 bg-gray-100 rounded-full h-12 w-12 flex-row justify-center items-center">
            <TaraVan size="28" />
            </View>
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
        <View className="flex-row justify-between items-center px-2 py-1.5">
        <Text className="font-medium text-lg ">Additional vehicle types?</Text>
        <TouchableOpacity onPress={()=>openVehiclePrompt()}>
        <TaraNotice size={20} color="#d1d5db" />
        </TouchableOpacity>
            </View>
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
    <View>
    <Text className="text-sm font-medium text-gray-800">MotorTaxi</Text>
    <View className="flex-row justify-center items-center gap-x-1.5">
    <Text className="text-[10px] font-normal text-gray-500">Good for 2</Text>
    <TaraUser size={9} />
    </View>
    </View>
   
    
</TouchableOpacity>
    ):(
<TouchableOpacity onPress={()=>RequestVehicle(2)}  className="opacity-50 w-44 flex-row justify-start items-center gap-x-2">
    <View className="border border-gray-300 rounded-lg h-6 w-6 flex-row justify-center items-center">
    </View>   
    <View className="ml-2 bg-slate-200 w-8 h-8 rounded-full">
    <TaraMotor size="28" />
    </View>
    <View>
    <Text className="text-sm font-medium text-gray-800">MotorTaxi</Text>
    <View className="flex-row justify-center items-center gap-x-1.5">
    <Text className="text-[10px] font-normal text-gray-500">Good for 2</Text>
    <TaraUser size={9} />
    </View>
    </View>
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
    <View>
    <Text className="text-sm font-medium text-gray-800">4 seater - Car</Text>
    <View className="flex-row justify-start items-center gap-x-1.5">
    <Text className="text-[10px] font-normal text-gray-500">Good for 3</Text>
    <TaraUser size={9} />
    </View>
    </View>
    
</TouchableOpacity>
    ):(
    <TouchableOpacity onPress={()=>RequestVehicle(4)}  className="opacity-50 w-44 flex-row justify-start items-center gap-x-2">
    <View className="border border-gray-300 rounded-lg h-6 w-6 flex-row justify-center items-center">
    </View>   
    <View className="ml-2 bg-slate-200 w-8 h-8 rounded-full">
    <TaraCar size="28" />
    </View>
    <View>
    <Text className="text-sm font-medium text-gray-800">4 seater - Car</Text>
    <View className="flex-row justify-start items-center gap-x-1.5">
    <Text className="text-[10px] font-normal text-gray-500">Good for 3</Text>
    <TaraUser size={9} />
    </View>
    </View>
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
    <View>
    <Text className="text-sm font-medium text-gray-800">6 seater - Car</Text>
    <View className="flex-row justify-start items-center gap-x-1.5">
    <Text className="text-[10px] font-normal text-gray-500">Good for 4</Text>
    <TaraUser size={9} />
    </View>
    </View>
</TouchableOpacity>
    ):(
<TouchableOpacity onPress={()=>RequestVehicle(4.5)}  className="opacity-50 w-44 flex-row justify-start items-center gap-x-2">
            <View className="border border-gray-300 rounded-lg h-6 w-6 flex-row justify-center items-center">
    </View>   
    <View className="ml-2 bg-slate-200 w-8 h-8 rounded-full">
    <TaraCar size="28" />
    </View>
    <View>
    <Text className="text-sm font-medium text-gray-800">6 seater - Car</Text>
    <View className="flex-row justify-center items-center gap-x-1.5">
    <Text className="text-[10px] font-normal text-gray-500">Good for 3</Text>
    <TaraUser size={9} />
    </View>
    </View>
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
    <View>
    <Text className="text-sm font-medium text-gray-800">Van Express</Text>
    <View className="flex-row justify-center items-center gap-x-1.5">
    <Text className="text-[10px] font-normal text-gray-500">Poll sharing</Text>
    <TaraUser size={9} />
    </View>
    </View>
</TouchableOpacity>
    ):(
        <TouchableOpacity onPress={()=>RequestVehicle(5)} className="opacity-50 w-44 flex-row justify-start items-center gap-x-2">
            <View className="border border-gray-300 rounded-lg h-6 w-6 flex-row justify-center items-center">
    </View>   
    <View className="ml-2 bg-slate-200 w-8 h-8 rounded-full">
    <TaraVan size="28" />
    </View>
    <View>
    <Text className="text-sm font-medium text-gray-800">Van Express</Text>
    <View className="flex-row justify-center items-center gap-x-1.5">
    <Text className="text-[10px] font-normal text-gray-500">Poll sharing</Text>
    <TaraUser size={9} />
    </View>
    </View>
</TouchableOpacity>
    )
}





    </View>
        </View>
        </View>
    )
}


{/* offer container ==================================================== */}


{
    calculated &&  minimizeView == false && searching == false && rider == false && (
        <View className="mx-2.5 mb-2.5 relative">

{
    slideGuide && offerCom && (
        <>
        <Pressable onPress={()=>checkSlidePrompt()} className="h-full w-full bg-gray-100 rounded-xl absolute z-30 opacity-50"></Pressable>
<Pressable onPress={()=>checkSlidePrompt()} className="inset-0 z-40 flex-row justify-center w-full h-full absolute top-16 -left-10">
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

    <Pressable onPress={()=>openBoxOffer()} className="py-1.5 flex-row justify-between items-center">

<View className="flex-row justify-start items-center gap-x-2.5">
<TaraLogo size={25} />
<Text className="font-medium text-xl">Make an offer?</Text>
    </View>

<TouchableOpacity onPress={()=>openBoxOffer()}>
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

    </TouchableOpacity>

        </Pressable>

{
    offerCom && (
<View className="relative">
    <Slider
    trackStyle={{height:10,borderRadius: 12,backgroundColor: '#e4e4e7'}}
    animateTransitions
    renderAboveThumbComponent={renderAboveThumbComponent}
    renderThumbComponent={CustomThumb}
    maximumValue={12}
    minimumValue={0}
    value={6}
    onValueChange={handleValueChange}
    onSlidingComplete={handleSlidingComplete}
    step={3} />




<View className="mt-1 flex-row justify-between items-center w-full">


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
 
<View className="w-32 bg-slate-300 p-1 flex-row justify-center items-center rounded-xl"></View >
 
</View >

<View className="py-8 flex-row justify-between items-center">


<View className="flex-row justify-start items-center gap-x-2">
<TaraInvoice size={20} />
<Text className="text-slate-800 text-xl font-semibold">&#8369;{fareRate ?? 0}.00</Text>

{
    calculated && !searching && (
        <TouchableOpacity onPress={()=>sheetRef2.current?.open() }>
            <TaraNotice size={20} color="#d1d5db" />
        </TouchableOpacity>
    )
}
</View>


<TouchableOpacity onPress={searching ? ()=>toast('try_again','You cannot update the payment method while searching.') : ()=>sheetRef3.current?.open()}>

{
    modeofpayment == 0 ? (
<View className="flex-row justify-start items-center gap-x-2">
<TaraCash size={28} />
<Text className="text-slate-800 text-xl font-semibold">Cash</Text>
<Svg
              xmlns="http://www.w3.org/2000/svg"
              width={28}
              height={28}
              viewBox="0 0 24 24"
              fill={searching ? '#cbd5e1' : "#3b82f6"}
            >
<Path d="M15.4,9.88,10.81,5.29a1,1,0,0,0-1.41,0,1,1,0,0,0,0,1.42L14,11.29a1,1,0,0,1,0,1.42L9.4,17.29a1,1,0,0,0,1.41,1.42l4.59-4.59A3,3,0,0,0,15.4,9.88Z"/>
</Svg>

</View>
    ):(
<View className="flex-row justify-start items-center gap-x-2">
<TaraLogo size={28} />
<Text className="text-slate-800 text-xl font-semibold">Wallet</Text>
<Svg
              xmlns="http://www.w3.org/2000/svg"
              width={28}
              height={28}
              viewBox="0 0 24 24"
              fill={searching ? '#cbd5e1' : "#3b82f6"}
            >
<Path d="M15.4,9.88,10.81,5.29a1,1,0,0,0-1.41,0,1,1,0,0,0,0,1.42L14,11.29a1,1,0,0,1,0,1.42L9.4,17.29a1,1,0,0,0,1.41,1.42l4.59-4.59A3,3,0,0,0,15.4,9.88Z"/>
</Svg>

</View>
    )
}


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
    ready2Cancel ? (
<Button
onPress={() => cancelSearch()}
bgColor="bg-neutral-700"
textColor="text-white"
fontSize="lg"
>
Cancel Book
</Button>
    ): bookState == 1 ? (
        <Button
        onPress={() => cancelSearch()}
        bgColor="bg-neutral-700"
        textColor="text-white"
        fontSize="lg"
        >
        Cancel Book
        </Button>     
    ):(
        <Button
        bgColor="bg-gray-100"
        textColor="text-white"
        fontSize="lg"
        >
        Cancel Book
        </Button>      
    )



) : calculated && pickmotor || pickcar4 || pickcard6 || pickVan ? (
maxwallet < walletBalance && modeofpayment == 1 ? (
<Button
onPress={() => changePaymentMethod()}
bgColor="bg-blue-500"
textColor="text-white"
fontSize="lg"
>
Book
</Button>
):(
    <Button
onPress={() => goSearchRider()}
bgColor="bg-blue-500"
textColor="text-white"
fontSize="lg"
>
Book
</Button>
)

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
        <Text className="text-xs text-slate-600 text-center">*Once a driver has accepted your booking, cancellation will no longer be possible..</Text>
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


{
    draggBlur && (
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
          fill="rgba(208, 205, 205, 0.4)" 
          filter="url(#blur)"
        />
      </Svg>

     
</View>
    )
}
</View>
):(
  
<View className="fixed bottom-[150px]">
<View  className=" rounded-t-3xl border-t border-x border-gray-200 h-full p-4 z-50 bg-white ">
<View   className="relative mt-2 flex-row justify-center items-center w-full">
<View className="w-32 bg-slate-300 p-1 flex-row justify-center items-center rounded-xl"></View >
</View >
<View className="my-2.5">

<LocationCardDrag
infoMode={infoMode}
DragLocationName={draglocaname}
data={cardCoor}
/>

{
    draglocaname == 'Error: INVALID_REQUEST' || draglocaname == 'Unknown location' || draglocaname == 'Unknown' ? (
<Button
bgColor="bg-slate-200"
textColor="text-white"
fontSize="md"
bwidth="w-full mt-2"
>
{acceptSuggestions ? 'Choose this pickup' : 'Select this location'}
</Button>
    ):(
<Button
onPress={() => selectThisLocation()}
bgColor="bg-blue-500"
textColor="text-white"
fontSize="md"
bwidth="w-full mt-2"
>
{acceptSuggestions ? 'Select this pickup' : 'Select this location'}
</Button>
    )
}


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

    <Pressable onPress={()=>setSettings(true)} className="bg-slate-200 rounded-lg p-1.5">
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<Path d="M12 8.00049C11.2089 8.00049 10.4355 8.23508 9.77772 8.67461C9.11993 9.11414 8.60723 9.73885 8.30448 10.4698C8.00173 11.2007 7.92252 12.0049 8.07686 12.7808C8.2312 13.5568 8.61216 14.2695 9.17157 14.8289C9.73098 15.3883 10.4437 15.7693 11.2196 15.9236C11.9956 16.078 12.7998 15.9988 13.5307 15.696C14.2616 15.3933 14.8864 14.8806 15.3259 14.2228C15.7654 13.565 16 12.7916 16 12.0005C16 10.9396 15.5786 9.92221 14.8284 9.17206C14.0783 8.42192 13.0609 8.00049 12 8.00049ZM12 14.0005C11.6044 14.0005 11.2178 13.8832 10.8889 13.6634C10.56 13.4437 10.3036 13.1313 10.1522 12.7659C10.0009 12.4004 9.96126 11.9983 10.0384 11.6103C10.1156 11.2223 10.3061 10.866 10.5858 10.5863C10.8655 10.3066 11.2219 10.1161 11.6098 10.0389C11.9978 9.96175 12.3999 10.0014 12.7654 10.1527C13.1308 10.3041 13.4432 10.5604 13.6629 10.8893C13.8827 11.2182 14 11.6049 14 12.0005C14 12.5309 13.7893 13.0396 13.4142 13.4147C13.0391 13.7898 12.5304 14.0005 12 14.0005Z" fill="#374957"/>
<Path d="M21.294 13.9L20.85 13.644C21.0499 12.5564 21.0499 11.4416 20.85 10.354L21.294 10.098C21.6355 9.90102 21.9348 9.63871 22.1748 9.32606C22.4149 9.01341 22.591 8.65654 22.6932 8.27582C22.7953 7.8951 22.8215 7.49799 22.7702 7.10716C22.7188 6.71633 22.591 6.33944 22.394 5.998C22.1971 5.65656 21.9348 5.35727 21.6221 5.1172C21.3095 4.87714 20.9526 4.70101 20.5719 4.59886C20.1911 4.49672 19.794 4.47056 19.4032 4.52189C19.0124 4.57321 18.6355 4.70102 18.294 4.898L17.849 5.155C17.0086 4.43692 16.0427 3.88025 15 3.513V3C15 2.20435 14.684 1.44129 14.1214 0.87868C13.5588 0.31607 12.7957 0 12 0C11.2044 0 10.4413 0.31607 9.87872 0.87868C9.31611 1.44129 9.00004 2.20435 9.00004 3V3.513C7.95743 3.88157 6.99189 4.4396 6.15204 5.159L5.70504 4.9C5.01548 4.50218 4.19612 4.39457 3.42723 4.60086C2.65833 4.80715 2.00287 5.31044 1.60504 6C1.20722 6.68956 1.09962 7.50892 1.30591 8.27782C1.5122 9.04672 2.01548 9.70218 2.70504 10.1L3.14904 10.356C2.94915 11.4436 2.94915 12.5584 3.14904 13.646L2.70504 13.902C2.01548 14.2998 1.5122 14.9553 1.30591 15.7242C1.09962 16.4931 1.20722 17.3124 1.60504 18.002C2.00287 18.6916 2.65833 19.1948 3.42723 19.4011C4.19612 19.6074 5.01548 19.4998 5.70504 19.102L6.15004 18.845C6.99081 19.5632 7.95702 20.1199 9.00004 20.487V21C9.00004 21.7956 9.31611 22.5587 9.87872 23.1213C10.4413 23.6839 11.2044 24 12 24C12.7957 24 13.5588 23.6839 14.1214 23.1213C14.684 22.5587 15 21.7956 15 21V20.487C16.0427 20.1184 17.0082 19.5604 17.848 18.841L18.295 19.099C18.9846 19.4968 19.804 19.6044 20.5729 19.3981C21.3418 19.1918 21.9972 18.6886 22.395 17.999C22.7929 17.3094 22.9005 16.4901 22.6942 15.7212C22.4879 14.9523 21.9846 14.2968 21.295 13.899L21.294 13.9ZM18.746 10.124C19.0847 11.3511 19.0847 12.6469 18.746 13.874C18.6869 14.0876 18.7004 14.3147 18.7844 14.5198C18.8684 14.7249 19.0181 14.8963 19.21 15.007L20.294 15.633C20.5239 15.7656 20.6916 15.9841 20.7603 16.2403C20.829 16.4966 20.7932 16.7697 20.6605 16.9995C20.5279 17.2293 20.3095 17.397 20.0532 17.4658C19.7969 17.5345 19.5239 17.4986 19.294 17.366L18.208 16.738C18.0159 16.6267 17.7923 16.5826 17.5723 16.6124C17.3523 16.6423 17.1485 16.7445 16.993 16.903C16.103 17.8117 14.9816 18.46 13.75 18.778C13.5351 18.8333 13.3446 18.9585 13.2086 19.1339C13.0727 19.3094 12.9989 19.525 12.999 19.747V21C12.999 21.2652 12.8937 21.5196 12.7062 21.7071C12.5186 21.8946 12.2643 22 11.999 22C11.7338 22 11.4795 21.8946 11.2919 21.7071C11.1044 21.5196 10.999 21.2652 10.999 21V19.748C10.9992 19.526 10.9254 19.3104 10.7894 19.1349C10.6535 18.9595 10.463 18.8343 10.248 18.779C9.01639 18.4597 7.89537 17.81 7.00604 16.9C6.85057 16.7415 6.64678 16.6393 6.4268 16.6094C6.20682 16.5796 5.98315 16.6237 5.79104 16.735L4.70704 17.362C4.59327 17.4287 4.46743 17.4722 4.33677 17.4901C4.2061 17.508 4.0732 17.4998 3.9457 17.4661C3.8182 17.4324 3.69862 17.3738 3.59386 17.2937C3.4891 17.2136 3.40122 17.1135 3.33528 16.9993C3.26934 16.8851 3.22664 16.759 3.20964 16.6282C3.19264 16.4974 3.20168 16.3646 3.23623 16.2373C3.27079 16.11 3.33017 15.9909 3.41098 15.8866C3.49178 15.7824 3.5924 15.6952 3.70704 15.63L4.79104 15.004C4.98299 14.8933 5.13272 14.7219 5.2167 14.5168C5.30069 14.3117 5.31417 14.0846 5.25504 13.871C4.9164 12.6439 4.9164 11.3481 5.25504 10.121C5.31311 9.90788 5.29898 9.68153 5.21486 9.47729C5.13074 9.27305 4.98136 9.10241 4.79004 8.992L3.70604 8.366C3.47623 8.23339 3.30851 8.01492 3.23978 7.75865C3.17105 7.50239 3.20693 7.22931 3.33954 6.9995C3.47215 6.76969 3.69062 6.60197 3.94689 6.53324C4.20316 6.46451 4.47623 6.50039 4.70604 6.633L5.79204 7.261C5.98362 7.37251 6.20682 7.41721 6.42657 7.38807C6.64632 7.35893 6.85015 7.25759 7.00604 7.1C7.89613 6.19134 9.01747 5.54302 10.249 5.225C10.4647 5.16956 10.6556 5.04375 10.7917 4.8675C10.9277 4.69125 11.001 4.47464 11 4.252V3C11 2.73478 11.1054 2.48043 11.2929 2.29289C11.4805 2.10536 11.7348 2 12 2C12.2653 2 12.5196 2.10536 12.7071 2.29289C12.8947 2.48043 13 2.73478 13 3V4.252C12.9999 4.47396 13.0737 4.68964 13.2096 4.86508C13.3456 5.04052 13.5361 5.16573 13.751 5.221C14.9831 5.54015 16.1044 6.18988 16.994 7.1C17.1495 7.25847 17.3533 7.36069 17.5733 7.39057C17.7933 7.42044 18.0169 7.37626 18.209 7.265L19.293 6.638C19.4068 6.5713 19.5327 6.52777 19.6633 6.5099C19.794 6.49204 19.9269 6.50019 20.0544 6.5339C20.1819 6.56761 20.3015 6.6262 20.4062 6.70631C20.511 6.78642 20.5989 6.88646 20.6648 7.00067C20.7307 7.11488 20.7734 7.24101 20.7904 7.37179C20.8074 7.50257 20.7984 7.63542 20.7639 7.76269C20.7293 7.88997 20.6699 8.00915 20.5891 8.11337C20.5083 8.2176 20.4077 8.30482 20.293 8.37L19.209 8.996C19.0181 9.10671 18.8691 9.27748 18.7854 9.48169C18.7016 9.68591 18.6878 9.9121 18.746 10.125V10.124Z" fill="#374957"/>
</Svg>
    </Pressable>
    </View>

 <View className="mt-6 border border-gray-300 rounded-xl p-2 flex-row justify-between items-center overflow-hidden">   

<View className="flex-row justify-start items-center gap-x-2 overflow-hidden">
{
    infoMode == 1 ? (
        <TaraNavigation size={28} color="#22c55e" />
    ):(
        <TaraMarker size={28} color="#ef4444" />
    )
}
<TextInput
    onChangeText={InputLocation}
    value={infoInput}
    className="font-medium text-lg text-blue-500 w-auto"
    placeholder={infoMode == 1 ? 'Where is your pickup location?' : 'Where is your drop destination?'}
/>

</View>

{
    user?.userId != 'visitor' && (
        <TouchableOpacity onPress={()=>setUseMic(true)} className="px-2.5">
<TaraBoldMic size={25} color="#475569" />
</TouchableOpacity>
    ) 
}


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

{
    user?.userId == 'visitor' ? (
<Button
bgColor="relative bg-slate-100"
textColor="text-gray-500"
fontSize="md"
bwidth="w-48"
hasIcon={true}
>
<View className="absolute -top-4 -right-2">
<Svg width="17" height="17" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<Path d="M19 8.424V6.99998C19 3.13402 15.866 0 12 0C8.13397 0 5 3.13402 5 6.99998V8.424C3.18003 9.2183 2.00263 11.0143 2 13V19C2.00328 21.76 4.23992 23.9967 6.99997 24H17C19.76 23.9967 21.9966 21.76 22 19V13C21.9974 11.0143 20.8199 9.2183 19 8.424ZM13 17C13 17.5523 12.5523 18 12 18C11.4477 18 11 17.5523 11 17V15C11 14.4477 11.4477 14 12 14C12.5523 14 13 14.4477 13 15V17ZM17 8.00002H6.99997V7.00003C6.99997 4.23863 9.23853 2.00002 12 2.00002C14.7614 2.00002 17 4.23858 17 7.00003V8.00002Z" fill="#fbbf24"/>
</Svg>
</View>
<TaraPin size={15} color="#94a3b8" />
<Text className="text-gray-400">Pin in map</Text>
</Button>
    ):(
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
    )
}



</View>




{
     user?.userId == 'visitor' ? (
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
<View className="w-80">
    <Text numberOfLines={2} ellipsizeMode="tail" className="font-medium text-gray-800">Our AI predict your destination and it's so awesome!</Text>
    <Text className="font-medium text-sm text-blue-500">AI suggestions</Text>
</View>
</TouchableOpacity>
     ):(
        infoMode == 2 && suggest && (
            <TouchableOpacity onPress={()=>acceptAI()} className="flex-row justify-start items-center p-2 gap-x-4">
            <View className="border border-gray-200 rounded-xl p-1.5">
            <LottieView
            source={require('../assets/animation/tara.json')}
            autoPlay
            loop
            width={40}
            height={40}
            />
            </View> 
            <View className="w-80">
                <Text numberOfLines={2} ellipsizeMode="tail" className="font-medium text-gray-800">Are heading to <Text className="font-medium text-blue-500">{dropSuggest}?</Text></Text>
                <Text className="font-normal text-sm text-gray-500">AI suggestions</Text>
            </View>
            </TouchableOpacity>
        )
     )
}







<FlatList
        data={locations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
            <LocationCard
            autoDrop={setInfoMode}
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
           <Text className="text-slate-600 font-medium text-lg">&#8369;{baseRate ?? 0}.00</Text>
           </View>

           <View className="flex-row justify-between items-center">
           <Text className="text-slate-500 font-normal text-lg">Per KM</Text>
           <Text className="text-slate-600 font-medium text-lg">&#8369;{perKM ?? 0}.00</Text>
           </View>

           <View className="flex-row justify-between items-center">
           <Text className="text-slate-500 font-normal text-lg">Night Diff.</Text>
           <Text className="text-slate-600 font-medium text-lg">&#8369;{fareAPIResponse?.night ?? 0}.00</Text>
           </View>

           <View className="flex-row justify-between items-center">
           <Text className="text-slate-500 font-normal text-lg">Total KM.</Text>
           <Text className="text-slate-600 font-medium text-lg">{fareAPIResponse?.distance ?? 0}</Text>
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
onClose={()=>setPaymentWarnig("Select Payment Method")}
style={{ backgroundColor: "#fff",zIndex:999 }}
    >
<View className="p-4">
        <View   className="relative mt-2 flex-row justify-center items-center w-full">
<View className="w-32 bg-slate-300 p-1 flex-row justify-center items-center rounded-xl"></View >
</View >
            <View className="p-4">
            <Text className="font-medium text-xl">{paymentwarning}</Text>



<View className="mb-4">
<TouchableOpacity onPress={()=>myPaymentMethed(0)}>
<View className="flex-row justify-between items-center gap-x-2 py-4">

<View className="flex-row justify-start items-center gap-x-4"> 
<TaraCash size={28} />
<Text className="text-blue-500 text-xl font-semibold">Cash</Text>
</View>  

{
    modeofpayment == 0 ? (
        <View className="h-6 w-6 border border-blue-500 rounded-full flex justify-center items-center">
    <View className="h-4 w-4 bg-blue-500 rounded-full"></View>
</View>
    ):(
        <View className="h-6 w-6 border border-gray-300 rounded-full flex justify-center items-center">
        <View className="h-4 w-4 bg-gray-100 rounded-full"></View>
    </View>    
    )
}

</View>
</TouchableOpacity>

{
    walletBalance == '0.00' || maxwallet > walletBalance ? (
<View>
<View className="flex-row justify-between items-center gap-x-2 py-4">

<View className="flex-row justify-start items-center gap-x-4"> 
 <TaraWalletIcon color="#94a3b8" size={25} />
 <View>
<Text className="text-gray-300 text-xl font-semibold">Tara Wallet <Text className="text-gray-800">(&#8369;{formatMoney(walletBalance)})</Text></Text>
<Text className="text-xs">You don't have enough balance.</Text>
</View>
</View>  

<Pressable onPress={()=>navigation.navigate("wallet")} className="px-2.5 rounded-full flex justify-center items-center">
    <View className="px-6 py-2.5 bg-blue-500 rounded-full">
        <Text className="text-white font-medium">Top up</Text>
    </View>
</Pressable>

</View>
</View>
    ):(
<TouchableOpacity onPress={()=>myPaymentMethed(1)}>
<View className="flex-row justify-between items-center gap-x-2 py-4">

<View className="flex-row justify-start items-center gap-x-4"> 
 <TaraWalletIcon color="#404040" size={25} />
 <View>
<Text className="text-blue-500 text-xl font-semibold">Tara Wallet <Text className="text-gray-800">(&#8369;{formatMoney(walletBalance)})</Text></Text>
<Text className="text-xs">Will deduct only once you're dropped.</Text>
</View>
</View>  

{
    modeofpayment == 1 ? (
        <View className="h-6 w-6 border border-blue-500 rounded-full flex justify-center items-center">
    <View className="h-4 w-4 bg-blue-500 rounded-full"></View>
</View>
    ):(
        <View className="h-6 w-6 border border-gray-300 rounded-full flex justify-center items-center">
        <View className="h-4 w-4 bg-gray-100 rounded-full"></View>
    </View>    
    )
}

</View>
</TouchableOpacity>
    )
}



</View>

<Button
onPress={() => sheetRef3.current?.close()}
bgColor="bg-slate-100"
textColor="text-slate-800"
fontSize="md"
bwidth="w-full mt-2"
>
Close
</Button>
</View>
</View>
</BottomSheet>


<BottomSheet
animationType="false"
ref={sheetRef4}
containerHeight={900}
hideDragHandle={true}
height={430}
style={{ backgroundColor: "#fff",zIndex:999 }}
    >
        <View>
<View className="pt-6 flex justify-center items-center w-full">
   <TaraSearch size={180} />
</View>
<View className="px-4">

<Text className="text-center text-sm text-gray-500 font-normal mt-2">There are no penalties for canceling a booking—you have the freedom to cancel as many times as you like. However, once a driver has accepted your booking, cancellation will no longer be possible.</Text>
<View className="mt-4 py-2 gap-y-2">
<Button
onPress={()=>sheetRef4.current.close()}
bgColor="bg-slate-200"
textColor="text-neutral-700"
>
No, Keep searching
</Button>
<Button
onPress={()=>confirmCancel()}
bgColor="bg-red-500"
textColor="text-white"
>
Yes, Cancel my booking
</Button>
</View>
</View>
</View>

</BottomSheet>


<BottomSheet
      animationType="false"
      ref={sheetRef5}
      containerHeight={900}
      hideDragHandle={true}
      style={{ backgroundColor: "#fff",zIndex:999 }}
    >
        <View className="p-4">
        <View   className="relative mt-2 flex-row justify-center items-center w-full">
<View className="w-32 bg-slate-300 p-1 flex-row justify-center items-center rounded-xl"></View >
</View >
            <View className="p-4">
         <View className="flex-row justify-center items-center">
            {
    weatherAnimation == 'storm' ? (
        <LottieView
        source={require('../assets/animation/storm.json')}
        autoPlay
        loop
        width={150}
        height={150}
        />
    ): weatherAnimation == 'heavy' ? (
        <LottieView
        source={require('../assets/animation/heavy-rain.json')}
        autoPlay
        loop
        width={150}
        height={150}
        />
    ): weatherAnimation == 'light' ? (
        <LottieView
        source={require('../assets/animation/ligh-rain.json')}
        autoPlay
        loop
        width={150}
        height={150}
        />
    ): weatherAnimation == 'cloudy' ? (
        <LottieView
        source={require('../assets/animation/clouds.json')}
        autoPlay
        loop
        width={150}
        height={150}
        />
    ):(
        <LottieView
        source={require('../assets/animation/sunny.json')}
        autoPlay
        loop
        width={150}
        height={150}
        />
    )
}
        
        </View>
           <View className="mt-4 gap-y-2.5">

       
<Text className="text-gray-800 font-medium text-center">{myCity}</Text>
<Text className="text-gray-600 font-medium text-center">{weatherforecarst.chance_of_rain == 'N/A' && 'Safe to rides!'}</Text>

<View className="my-2 px-2">
    <Text className="text-sm text-slate-600 text-center">*{weatherforecarst.weather_title}, keep your weather clothes ready.</Text>
</View>

<Button
onPress={() => sheetRef5.current?.close()}
bgColor="bg-slate-100"
textColor="text-slate-800"
fontSize="md"
bwidth="w-full mt-2"
>
Got it!
</Button>

           </View>
            </View>
        </View>
</BottomSheet>
{done && <RiderRatingModal user={user} booking={bookingID} navigation={navigation} page={0} riderdata={riderInformation} close={setCompleted} />}
{loader && <LoaderBa />}
{generateQR && <GenerateQRBooking QR={QrBook} close={setGenerateQR} />}
{vehiclePrompt  && <VehicleNotice close={readVehicleProm} />}
{slideTut && <OffeSlideNotice click={okImfine} mode={slidedontshow} close={setSlideTutor} />}
{showSettings && <SettingsMode susi={setLockMultiple} lock={lockMultiple} wrealtime={setWeather} navigation={navigation} mic={audioBook} weather={weatherba} view={theredview} multiple={multipleBook} ai={suggest}  close={setSettings} />}
{useMic && <SpeakLocation what={audioAPILoading} speak={speaking} go={startRecording} wait={stopRecording} close={enoughRecord} startSpeak={startspeak} />}
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
    padding={8}
    pieceSize={4}
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

const VehicleNotice = ({close}) =>{

    return (
      
              <View className="w-full h-full p-4 absolute bottom-0 bg-black/30 z-[100] ">
                <View
                  className="w-full px-6 py-8 absolute bottom-10 left-4 rounded-3xl shadow-xl shadow-black  bg-white
                flex gap-y-4"
                >
                  <Text className="text-center text-2xl font-bold">
                  Selection of ride categories
                  </Text>
                  <Text>You can select multiple vehicle types, and the system will prioritize whichever is available first. This allows you to search once while maximizing your chances of finding a ride quickly.</Text>
                  <View className="w-full flex gap-y-4">
            <Button
            onPress={()=>close(false)}
              bgColor="bg-slate-200"
              textColor="text-neutral-700"
            >
              OK! Got it
            </Button>
          </View>
                  </View>
                  </View>
    )
}

const OffeSlideNotice = ({click,mode,close}) =>{
    return (
      
              <View className="w-full h-full p-4 absolute bottom-0 bg-black/30 z-[100] ">
                <View
                  className="w-full px-6 py-8 absolute bottom-10 left-4 rounded-3xl shadow-xl shadow-black  bg-white
                flex gap-y-4"
                >
                  <View className="flex-row justify-start gap-x-2.5 items-center">
                    <Pressable onPress={()=>click()}>
                    {
                        mode ? (
                        <View className="flex-row justify-center items-center border border-gray-300 h-8 w-8 rounded-xl">
                        <View className="h-4 w-4 bg-blue-500 rounded"></View>
                        </View>
                        ):(
                            <View className="border border-gray-300 h-8 w-8 rounded-xl">
                        
                            </View>
                        )
                    }
                    </Pressable>
                  <Text>Don't show this slide guide again.</Text>
                  </View>
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
    )
}


const SpeakLocation = ({close,speak,startSpeak,wait,go,what}) =>{
    return (
      
              <View className="w-full h-full p-4 absolute bottom-0 bg-black/30 z-[100] ">

                {
                  what ? (
                    <View className="w-full px-6 py-8 absolute bottom-10 left-4 rounded-3xl shadow-xl shadow-black  bg-white
                flex gap-y-4">
<View className="flex-row justify-center items-center py-12">
<LottieView
                        source={require("../assets/animation/circle.json")}
                        autoPlay
                        loop
                        width={50}
                        height={50}
                      />
    </View>
    </View>
                  ):(
<View
                  className="w-full px-6 py-8 absolute bottom-10 left-4 rounded-3xl shadow-xl shadow-black  bg-white
                flex gap-y-4"
                >
                  {
                    speak ? (
                        <View>
                             <Text className="text-center text-2xl font-bold">
                  Listening..
                  </Text>
                  <View className="flex-row justify-center items-center">
                            <LottieView
                        source={require("../assets/animation/audio.json")}
                        autoPlay
                        loop
                        width={200}
                        height={100}
                      />
                      </View>
                            </View>
                    ):(
                        <View>
                            <Text className="text-center text-2xl font-bold">
                  Sing the location
                  </Text>
                  <View className="flex-row justify-center items-center">
                  <TaraLoud size={200}/>
                  </View>
                  </View>
                    )
                  }

                  <View className="w-full flex gap-y-4">
            {
                speak ? (
                    <Button
            onPress={()=>wait()}
              bgColor="bg-red-500"
              textColor="text-white"
            >
               Stop Speaking
            </Button>
                ):(
                    <Button
            onPress={()=>go()}
              bgColor="bg-blue-500"
              textColor="text-white"
              hasIcon={true}
            >
                <TaraBoldMic size={23} color="#fff" />
              <Text className="text-white font-medium">Start Speaking</Text>
            </Button>
                )
            }

            <Button
            onPress={()=>close()}
              bgColor="bg-slate-200"
              textColor="text-neutral-700"
            >
             Close
            </Button>
          </View>
                  </View>
                  )  
                }

                
                  </View>
    )
}

const LoaderBa = () =>{
        return (

<View className="w-full h-full p-4 absolute bottom-0 bg-black/30 z-[100] ">

<View className="w-full px-6 py-8 absolute bottom-10 left-4 rounded-3xl shadow-xl shadow-black  bg-white
flex gap-y-4">
<View className="flex-row justify-center items-center py-12">
<LottieView
source={require("../assets/animation/circle.json")}
autoPlay
loop
width={50}
height={50}
/>
</View>
</View>


</View>
        )
}

const ToggleCom = ({bukas,state,set,real}) =>{
const [isChecked, setIsChecked] = useState(state);
const toast = useToast();
const { data } = useContext(DataContext);
const { user} = useContext(AuthContext);

const changeToggle = async () =>{
setIsChecked(!isChecked)
if(isChecked){
 //off 
await updateSettings(data?.user?.UserID,set,"0",user)
real(false)  

}else{
//on
await updateSettings(data?.user?.UserID,set,"1",user)
real(true)

}
bukas(false)
toast("success", "Settings updated. Enjoy cool features!"); 
}
   



    return (
        <View className="flex-row items-center">
              <Pressable
               onPress={() => changeToggle()}
                className={`relative w-14 h-8 rounded-full ${
                  isChecked ? "bg-blue-500" : "bg-gray-200"
                }`}
              >
                <View
                  className={`absolute top-[3px] ${
                    isChecked
                      ? I18nManager.isRTL
                        ? "right-[2px]"
                        : "left-[25px]"
                      : "left-[4px]"
                  } w-6 h-6 bg-white rounded-full transition-transform`}
                />
              </Pressable>
            </View>
    )
}


const SettingsMode = ({susi,lock,navigation,mic,view,multiple, weather, ai,close,wrealtime}) =>{


const openTaraSafe = () =>{
navigation.navigate('account', {
purpose: 'tarasafe',
track: "user"
});
}
    

    return (
      
              <View className="w-full h-full p-4 absolute bottom-0 bg-black/30 z-[100] ">
                <View
                  className="w-full px-6 py-8 absolute bottom-10 left-4 rounded-3xl shadow-xl shadow-black  bg-white
                flex gap-y-4"
                >
              

                    <View className="gap-y-4">

                    <View className="flex-row justify-between items-center w-full">
                    <View className="w-72">
                    
                    <View className="flex-row justify-start items-center gap-x-2">
                        <TaraMagic size={20} />
                        <Text className="text-lg font-medium">AI Suggestions</Text>
                        </View>
                    <Text className="text-sm font-normal text-gray-500">Our AI predicts your booking every time you're about to book.</Text>
                    </View>
                    
                    <ToggleCom set="AISuggestions" bukas={null} real={null} state={ai} />
                    </View>

                    <View className="flex-row justify-between items-center w-full">
                    <View className="w-72">
                    <View className="flex-row justify-start items-center gap-x-2">
                        <TaraMultiple size={20} />
                        <Text className="text-lg font-medium">Multiple Booking</Text>
                        </View>
                    <Text className="text-sm font-normal text-gray-500">You can book for yourself and a friend using a single device.</Text>
                    </View>
                    <ToggleCom set="multiplebook" bukas={susi} real={close} state={multiple} />
                    </View>

                    <View className="flex-row justify-between items-center w-full">
                    <View className="w-72">
                    <View className="flex-row justify-start items-center gap-x-2">
                        <TaraCube size={20} />
                        <Text className="text-lg font-medium">3D Experience</Text>
                        </View>
                    
                    <Text className="text-sm font-normal text-gray-500">When the rider is on the way, see their live movement in 3D like an aerial camera.</Text>
                    </View>
                    <ToggleCom set="dview" bukas={null} real={null} state={view} />
                    </View>


                    <View className="flex-row justify-between items-center w-full">
                    <View className="w-72">
                    
                    <View className="flex-row justify-start items-center gap-x-2">
                        <TaraCloud size={20} />
                        <Text className="text-lg font-medium">Weather Experience</Text>
                        </View>
                    <Text className="text-sm font-normal text-gray-500">View real-time weather conditions directly on the map.</Text>
                    </View>
                    <ToggleCom set="weather" bukas={null} real={wrealtime} state={weather} />
                    </View>


                    <View className="flex-row justify-between items-center w-full">
                    <View className="w-72">
                        <View className="flex-row justify-start items-center gap-x-2">
                        <TaraMic size={20} />
                        <Text className="text-lg font-medium">Audio Protect</Text>
                        </View>
                    
                    <Text className="text-sm font-normal text-gray-500">Activate audio recording in the rider app for added security.</Text>
                    </View>
                    <ToggleCom set="weather" bukas={null} real={null} state={mic} />
                    </View>


                    <Pressable onPress={()=>openTaraSafe()} className="flex-row justify-between items-center w-full">
                    <View className="w-72">
                    <View className="flex-row justify-start items-center gap-x-2">
                        <TaraShield size={20} />
                        <Text className="text-lg font-medium">Tara Safe</Text>
                        </View>
                    <Text className="text-sm font-normal text-gray-500">When driver picks you up, we’ll send an SMS or email to your family or friends.</Text>
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
                    </Pressable>



                    </View>


                  <View className="w-full flex gap-y-4">
                    {
                        !lock && (
                            <Button
                                onPress={()=>close(false)}
                                bgColor="bg-slate-200"
                                textColor="text-neutral-700"
                                >
                                Close
                                </Button>
                        ) 
                    }


                
            
          </View>
                  </View>
                  </View>
    )
}



export default BookingPage;