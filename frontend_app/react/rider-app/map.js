import { View, Text, TouchableOpacity, ScrollView, TextInput, Pressable, StyleSheet, Animated, Image, PanResponder, FlatList, Alert } from "react-native";
import { WebView } from 'react-native-webview';
import Svg, { Circle, Path, Rect, Defs, Filter, FeGaussianBlur } from "react-native-svg";
import LottieView from 'lottie-react-native';
import BottomSheet from "@devvie/bottom-sheet";
import { useRef, useEffect, useState, useContext } from "react";
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
    TaraKilometer,
    TaraSpeedClock,
    TaraVan
} from "../components/CustomIcon";
import { LocationCard, LocationCardDrag } from "../components/Cards";
import { Slider } from '@miblanchard/react-native-slider';
import axios from 'axios';
import * as Location from 'expo-location';
import { useToast } from "../components/ToastNotify";
import QRCodeStyled from 'react-native-qrcode-styled';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserSettings, updateSettings } from "../config/hooks";
import { AuthContext } from "../context/authContext";
import { DataContext } from "../context/dataContext";
import { hookConf } from "../config/hooks";

const BookingPage = ({ route, navigation }) => {
    const sheetRef = useRef(null);
    const sheetRef2 = useRef(null);
    const sheetRef3 = useRef(null);
    const lottieRef = useRef(null);
    const [suggest, setSuggest] = useState(false)
    const [viewRiderMap, setViewRiders] = useState(false)
    const [vehicleType, setVehicle] = useState(1)
    const [pickupName, setPickupName] = useState("")
    const [dropName, setDropName] = useState("")
    const [infoMode, setInfoMode] = useState(1) //using 2 is drop mode
    const [infoInput, setInfoInput] = useState("")
    const [MapPin, setMapPin] = useState(false)
    const [calculated, setCalculated] = useState(false) //already calculated the rate
    const [offerCom, setComOffer] = useState(false)
    const [minimizeView, setMinizeView] = useState(false)
    const [fareRate, setFareRate] = useState(0)
    const [cSlide, setCustomSlide] = useState(0)
    const [cSlideEffect, setCSlideEffect] = useState("blue")
    const [searching, setSearching] = useState(false) // true searching and false - try agian
    const [rider, setRider] = useState(false) //true rider found
    const [bookState, setBookState] = useState(1) //1 waiting, 2 ontheway, 3 pickup,
    const [taraSafe, setTaraSafe] = useState(true)
    const [bookingID, setBookingID] = useState(null)
    const [pickupCoordinates, setPickupCoordinates] = useState(null)
    const [dropCoordinates, setDropCoordinates] = useState(null)
    const [fareAPIResponse, setFareAPIResponse] = useState([])
    const [pickmotor, selectMotor] = useState(false)
    const [pickcar4, selectCard4] = useState(false)
    const [pickcard6, selectCar6] = useState(false)
    const [pickVan, selectVan] = useState(false)
    const [activemotor, selectActiveMotor] = useState(true)
    const [activecar4, selectActiveCard4] = useState(true)
    const [activecard6, selectActiveCar6] = useState(true)
    const [activeVan, selectActiveVan] = useState(true)
    const [myLocation, setMyLocation] = useState([])
    const webViewRef = useRef(null);
    const [webLoad, setWebLoad] = useState(false)
    const [locationPermission, setPermissionAsk] = useState(false);
    const [location, setLocation] = useState([])
    const [showCurrentLocation, setCurrentLocation] = useState(false);
    const toast = useToast();
    const [slideGuide, setSlideGuide] = useState(true);
    const [generateQR, setGenerateQR] = useState(false);
    const [modeofpayment, setModeofPayment] = useState(1) //0 cash 1 is wallet and GET WHAT DEFAULT PAYMENT SET
    const [walletBalance, setWalletBalance] = useState("454.00");
    const [cardCoor, setcardCoord] = useState([])
    const [draglocaname, setdragLocName] = useState("Unknown location")
    const [vehiclePrompt, readVehicleProm] = useState(false)
    const [slideTut, setSlideTutor] = useState(false)
    const [slidedontshow, setSlideDontShow] = useState(false)
    const { user, setUser } = useContext(AuthContext);
    const { data } = useContext(DataContext);
    const [authToken, setAuthToken] = useState(null)

    const showToast = (type, msg) => {
        toast(type, msg);
    };


    useEffect(() => {
        //get tutorials
        const getData = async () => {
            try {
                const value = await AsyncStorage.getItem('slide-guide');
                //console.log("storage",value)
                if (value == 'true') {
                    setSlideGuide(false)
                }
            } catch (e) {
                console.log(e)
            }
        };
        getData();
        // const {wheels,start} = route.params;
        // if(route.params){
        // addVehicle(wheels)
        // setMyLocation(`${start.coords.latitude}>>>${start.coords.longitude}`)
        //setVehicle(wheels)
        //disabling vehicles
        // if (typeof wheels === "undefined") {
        //     console.error("Wheels is undefined");
        //     return;
        // }

        // switch (wheels) {
        //     case 2:
        //         return selectActiveVan(false);
        //     case 5:
        //         return selectActiveMotor(false);
        //     default:
        //         console.warn("Invalid wheel count:", wheels);
        // }

        // }




    }, [route, setSlideTutor])

    //pull settings
    useEffect(() => {
        const pullSettings = async () => {
            console.log("pulling settings")
            const sets = await getUserSettings(data?.user?.UserID, user);
            if (sets.message == 'No settings found for the provided UserID or TaraID.') {
                //create
                //console.log("creating a settings")
                //const weeh = await createSettings(data?.user?.UserID,user);
            } else {
                //load settings
                if (sets.data[0].PaymentType == 'wallet') {
                    setModeofPayment(1)
                } else {
                    setModeofPayment(0)
                }
            }
        }


        //token
        const readyToken = async () => {
            setAuthToken(await hookConf(user))
        }

        readyToken();
        pullSettings();
    }, [data, user])



    useEffect(() => {
        const calculateMetric = async () => {
            const fareAPI = await axios.get(
                `https://onthewaypo.com/OTW/api/metrics/`,
                {
                    params: {
                        from: pickupCoordinates,
                        to: dropCoordinates
                    },
                }
            );

            //console.log(fareAPI.data)
            if (fareAPI.data) {
                setFareAPIResponse(fareAPI.data.data)
                setCalculated(true)
                setFareRate(fareAPI.data.data.amount)
            }
        }

        calculateMetric();

    }, [dropCoordinates])

    const myPinLocation = async () => {
        const location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High,
        });
        if (location.mocked) {
            //exit
            return;
        } else {
            setLocation(location);
            setCurrentLocation(true);
            //replace start
            setMyLocation(`${location.coords.latitude}>>>${location.coords.longitude}`)
            //provide name in the pickup
            return `${location.coords.latitude},${location.coords.longitude}`;
        }


    }

    const switchLocations = () => {
        setPickupCoordinates(dropCoordinates)
        setPickupName(dropName)
        setDropCoordinates(pickupCoordinates)
        setDropName(pickupName)
        setCalculated(false)
    }

    const selectLocation = (selectMode) => {
        setInfoMode(selectMode)
        sheetRef.current?.open();
    }

    const addVehicle = (vh) => {
        switch (vh) {
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

    const RequestVehicle = () => {
        showToast("try_again", "This is vehicle is not available.");
    }

    const myPaymentMethed = (pt) => {
        setModeofPayment(pt);
        sheetRef3.current.close();
    }

    const goSearchRider = async () => {
        //connect to API
        setSearching(true);
    }

    const cancelSearch = () => {
        setSearching(false);
    }

    const selectCurrentLocation = async () => {
        sheetRef.current?.close();
        setSuggest(false);
        const myCULocation = await myPinLocation();
        //run location permission
        setPickupCoordinates(myCULocation)
        setPickupName('Current Location')
    }

    const selectPinMap = () => {
        sheetRef.current?.close();
        setSuggest(false);
        setMapPin(true)
    }

    const viewRiders = () => {
        setSuggest(false);
        setViewRiders(true)
        showToast("try_again", "Viewing nearby drivers..");
        //run api
    }

    const backToBooking = () => {
        setViewRiders(false)
        //clear markers
    }

    const InputLocation = async (e) => {
        setInfoInput(e)
        await searchLocations(e);
    }

    const checkSlidePrompt = () => {
        setSlideGuide(false)
        setSlideTutor(true);

    }

    const okImfine = async () => {
        setSlideDontShow(slidedontshow ? false : true)
        if (!slidedontshow) {
            try {
                await AsyncStorage.setItem('slide-guide', 'true');
                console.log("Saved")
            } catch (e) {
                // saving error
                console.log("dont save")
            }
        } else {
            console.log("reset")
            await AsyncStorage.removeItem('slide-guide');
        }
    }

    const selectThisLocation = () => {
        setMapPin(false)
        const theStopDrag = `${cardCoor.lat},${cardCoor.lng}`
        if (infoMode == 1) {
            //pickup
            setPickupCoordinates(theStopDrag);
            setPickupName(draglocaname)
        } else {
            //drop
            setDropCoordinates(theStopDrag);
            setDropName(draglocaname)
        }
    }

    const openBoxOffer = () => {
        if (offerCom) {
            setComOffer(false)
        } else {
            setComOffer(true)
        }
    }

    const closeMap = () => {
        if (MapPin) {
            setMapPin(false)
        } else if (viewRiderMap) {
            setViewRiders(false)
        } else {
            navigation.goBack()
        }
    }


    //SCREEN NAVIGATION

    const openTaraSafe = () => {
        navigation.navigate('account', {
            purpose: 'tarasafe',
            track: "user"
        });
    }

    const openChat = () => {
        navigation.navigate('inbox', {
            purpose: 'chat',
            sender: "user",
            receiver: "riderID"
        });
    }

    const QRBooking = () => {
        if (generateQR) {
            setGenerateQR(false)
        } else {
            setGenerateQR(true)
        }
    }


    //ANIMATION MARK
    const draggingMap = () => {
        if (lottieRef.current) {
            lottieRef.current.play(25, undefined);
        }
        if (!MapPin) {
            setMinizeView(true);
        }
    }

    const draggingStop = async () => {
        const mapboxCeb = `${cardCoor.lat},${cardCoor.lng}`
        if (MapPin) {
            //run API
            try {
                const response = await axios.get(
                    `https://dwayon.tech/api/locations/google/`,
                    {
                        params: {
                            coordinates: mapboxCeb
                        },
                        headers: {
                            Auth: authToken
                        }
                    }
                );

                if (response.data) {
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
        if (MapPin) {
            //Alert.alert("Message from Web Page", data.message);
            setcardCoord(JSON.parse(data.message))
            //run API
        }
    };



    useEffect(() => {
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
            timestamp: new Date().toISOString()
        });
        // console.log(jsonData)
        webViewRef.current?.injectJavaScript(`
        document.dispatchEvent(new MessageEvent('message', { data: '${jsonData}' }));
        true; // Suppress warnings
    `);
    }, [webViewRef,
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
        setMapPin
    ])





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
            width: 100
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
                return setFareRate(fareAPIResponse.tip1)
            case 12:
                return setFareRate(fareAPIResponse.tip2)
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
                `https://onthewaypo.com/OTW/api/locations/google.php`,
                {
                    params: {
                        search: infoInput,
                        start: myLocation
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
                    <View className="relative h-full w-full">


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
                                source={{ uri: `https://onthewaypo.com/OTW/api/playground/map/` }}
                                javaScriptEnabled={true}
                                onMessage={handleWebViewMessage}
                                className="bg-white"
                                onLoad={() => setWebLoad(true)}
                                onTouchStart={() => draggingMap()}
                                onTouchEnd={() => draggingStop()}
                                cacheEnabled={true}

                            />




                        </View>







                    </View>





                    {
                        !MapPin ? (

                            <View
                                className={`fixed ${viewRiderMap
                                    ? 'bottom-[70px]'
                                    : minimizeView == true && rider == true && bookState == 3
                                        ? 'bottom-[310px]'
                                        : minimizeView == true && rider == true
                                            ? 'bottom-[270px]'
                                            : minimizeView == true
                                                ? 'bottom-[20px]'
                                                : rider == true
                                                    ? 'bottom-[610px]'
                                                    : searching == true
                                                        ? 'bottom-[280px]'
                                                        : offerCom == true
                                                            ? 'bottom-[615px]'
                                                            : calculated == true
                                                                ? 'bottom-[570px]'
                                                                : 'bottom-[460px]'
                                    } `}
                            >


                                <Animated.View
                                    className="z-50"
                                    {...panResponder.panHandlers}
                                    style={[{ transform: pan.getTranslateTransform() }]}
                                >
                                    <View >

                                        {
                                            !viewRiderMap ? (
                                                <Pressable onTouchStart={() => setMinizeView(false)} className=" rounded-t-3xl border-t border-x border-gray-200 h-full p-4 z-50 bg-white ">

                                                    {/* Customer Info */}
                                                    <View className="absolute top-[-100px] left-4 right-4 bg-white rounded-xl p-4 flex-row items-center justify-between">
                                                        <View className="flex-row items-center">
                                                            <TaraLogo size={50} />
                                                            <View>
                                                                <Text className="text-md font-bold text-gray-800">Customer Name</Text>
                                                                <Text className="text-sm text-gray-600">John Doe</Text>
                                                            </View>
                                                        </View>
                                                        {/* <View className="flex-row space-x-3">
                                                            <Tara
                                                            <Ionicons name="chatbubble-outline" size={24} color="#3B82F6" />
                                                            <Ionicons name="call-outline" size={24} color="#22C55E" />
                                                        </View> */}
                                                    </View>


                                                    <View className="relative mt-2 flex-row justify-center items-center w-full">

                                                        <View className="w-32 bg-slate-300 p-1 flex-row justify-center items-center rounded-xl"></View >

                                                    </View >

                                                    {/* Fare */}
                                                    <View className="bg-white rounded-xl p-4 mt-4 items-center">
                                                        <Text className="text-4xl font-bold text-gray-900">₱45.00</Text>
                                                        <View className="w-full h-1 rounded-full bg-slate-200 mt-6" />

                                                        {/* Booking Details */}
                                                        <View className="bg-white items-center rounded-xl p-4 mt-4">
                                                            <Text className="text-3xl font-bold text-gray-900 mb-2">Booking Details</Text>

                                                            <View className="flex-row items-center mb-2 gap-x-2">
                                                                <TaraNavigation size={16} color="#22c55e" />
                                                                <Text numberOfLines={2} ellipsizeMode="tail" className="text-sm text-gray-700 flex-1">
                                                                    Sta. Lourdes, Sonny Village and Condo, Puerto Princesa City
                                                                </Text>
                                                                <View className="p-1 bg-slate-200 rounded-lg" >
                                                                     <TaraNavigation size={25} color="#3B82F6" />
                                                                </View>
                                                            </View>

                                                            <View className="flex-row items-center gap-x-2">
                                                                <TaraMarker size={16} color="red" />
                                                                <Text numberOfLines={2} length={30} ellipsizeMode="tail" className="text-sm text-gray-700 flex-1">
                                                                    Wescom Road, Kalikasan Village, Puerto Princesa City
                                                                </Text>
                                                                {/* <View className="w-32 h-32 bg-slate-100" /> */}
                                                                <View className="p-1 bg-slate-200 rounded-lg" >
                                                                     <TaraNavigation size={25} color="#3B82F6" />
                                                                </View>
                                                               
                                                            </View>

                                                        </View>


                                                        {/* Trip Info */}
                                                        <View className="flex-row items-center justify-between mt-4 space-x-4">
                                                            <View className="flex-row items-center space-x-2">
                                                                <TaraSpeedClock size={15} color="#ddd" />
                                                                <Text className="text-sm text-gray-600 ml-1 mr-3">10 min</Text>
                                                            </View>

                                                            <View className="flex-row items-center space-x-2">
                                                                <TaraKilometer size={15} color="#ddd" />
                                                                <Text className="text-sm text-gray-600 ml-1 mr-3">8.0KM</Text>
                                                            </View>

                                                            <Text className="text-sm text-gray-600 ml-1 mr-3">🚖 Regular</Text>

                                                            <View className="flex-row items-center space-x-2">
                                                                <TaraCash size={15} color="#ddd" />
                                                                <Text className="text-sm text-gray-600 ml-1">Cash</Text>
                                                            </View>
                                                        </View>

                                                        {/* Warnings & Tips */}
                                                        <View className="bg-yellow-100 p-3 rounded-md mt-4 w-full">
                                                            <Text className="text-yellow-700 text-sm">The pickup is 50 meters away from your location.</Text>
                                                        </View>
                                                        <View className="bg-green-100 p-3 justify-center items-center rounded-lg mt-2 w-full">
                                                            <Text className="text-green-700 text-sm">₱5.00 tip is provided in this trip!</Text>
                                                        </View>

                                                        {/* Accept Button */}
                                                        <Pressable className="bg-gray-900 p-4 rounded-3xl items-center mt-4 w-full">
                                                            <Text className="text-white text-xl font-bold">Accept Booking</Text>
                                                        </Pressable>

                                                    </View>



                                                </Pressable >
                                            ) : (
                                                <Pressable onPress={() => backToBooking()} className=" rounded-t-3xl border-t border-x border-gray-200 h-full p-4 z-50 bg-white ">
                                                    <View className="relative mt-2 flex-row justify-center items-center w-full">
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
                        ) : (

                            <View className="fixed bottom-[150px]">
                                <View className=" rounded-t-3xl border-t border-x border-gray-200 h-full p-4 z-50 bg-white ">
                                    <View className="relative mt-2 flex-row justify-center items-center w-full">
                                        <View className="w-32 bg-slate-300 p-1 flex-row justify-center items-center rounded-xl"></View >
                                    </View >
                                    <View className="my-2.5">

                                        <LocationCardDrag
                                            infoMode={infoMode}
                                            DragLocationName={draglocaname}
                                            data={cardCoor}
                                        />

                                        {
                                            draglocaname == 'Error: INVALID_REQUEST' || draglocaname == 'Unknown location' ? (
                                                <Button
                                                    bgColor="bg-slate-200"
                                                    textColor="text-white"
                                                    fontSize="md"
                                                    bwidth="w-full mt-2"
                                                >
                                                    Select this location
                                                </Button>
                                            ) : (
                                                <Button
                                                    onPress={() => selectThisLocation()}
                                                    bgColor="bg-blue-500"
                                                    textColor="text-white"
                                                    fontSize="md"
                                                    bwidth="w-full mt-2"
                                                >
                                                    Select this location
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
                style={{ backgroundColor: "#fff", zIndex: 999 }}
                onClose={() => setInfoMode(infoMode)}
            >

                <View className="p-4">
                    <View className="mt-4 flex-row justify-between items-center">

                        <TouchableOpacity onPress={() => sheetRef.current?.close()}>
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
                            <Svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <Path d="M12 8.00049C11.2089 8.00049 10.4355 8.23508 9.77772 8.67461C9.11993 9.11414 8.60723 9.73885 8.30448 10.4698C8.00173 11.2007 7.92252 12.0049 8.07686 12.7808C8.2312 13.5568 8.61216 14.2695 9.17157 14.8289C9.73098 15.3883 10.4437 15.7693 11.2196 15.9236C11.9956 16.078 12.7998 15.9988 13.5307 15.696C14.2616 15.3933 14.8864 14.8806 15.3259 14.2228C15.7654 13.565 16 12.7916 16 12.0005C16 10.9396 15.5786 9.92221 14.8284 9.17206C14.0783 8.42192 13.0609 8.00049 12 8.00049ZM12 14.0005C11.6044 14.0005 11.2178 13.8832 10.8889 13.6634C10.56 13.4437 10.3036 13.1313 10.1522 12.7659C10.0009 12.4004 9.96126 11.9983 10.0384 11.6103C10.1156 11.2223 10.3061 10.866 10.5858 10.5863C10.8655 10.3066 11.2219 10.1161 11.6098 10.0389C11.9978 9.96175 12.3999 10.0014 12.7654 10.1527C13.1308 10.3041 13.4432 10.5604 13.6629 10.8893C13.8827 11.2182 14 11.6049 14 12.0005C14 12.5309 13.7893 13.0396 13.4142 13.4147C13.0391 13.7898 12.5304 14.0005 12 14.0005Z" fill="#374957" />
                                <Path d="M21.294 13.9L20.85 13.644C21.0499 12.5564 21.0499 11.4416 20.85 10.354L21.294 10.098C21.6355 9.90102 21.9348 9.63871 22.1748 9.32606C22.4149 9.01341 22.591 8.65654 22.6932 8.27582C22.7953 7.8951 22.8215 7.49799 22.7702 7.10716C22.7188 6.71633 22.591 6.33944 22.394 5.998C22.1971 5.65656 21.9348 5.35727 21.6221 5.1172C21.3095 4.87714 20.9526 4.70101 20.5719 4.59886C20.1911 4.49672 19.794 4.47056 19.4032 4.52189C19.0124 4.57321 18.6355 4.70102 18.294 4.898L17.849 5.155C17.0086 4.43692 16.0427 3.88025 15 3.513V3C15 2.20435 14.684 1.44129 14.1214 0.87868C13.5588 0.31607 12.7957 0 12 0C11.2044 0 10.4413 0.31607 9.87872 0.87868C9.31611 1.44129 9.00004 2.20435 9.00004 3V3.513C7.95743 3.88157 6.99189 4.4396 6.15204 5.159L5.70504 4.9C5.01548 4.50218 4.19612 4.39457 3.42723 4.60086C2.65833 4.80715 2.00287 5.31044 1.60504 6C1.20722 6.68956 1.09962 7.50892 1.30591 8.27782C1.5122 9.04672 2.01548 9.70218 2.70504 10.1L3.14904 10.356C2.94915 11.4436 2.94915 12.5584 3.14904 13.646L2.70504 13.902C2.01548 14.2998 1.5122 14.9553 1.30591 15.7242C1.09962 16.4931 1.20722 17.3124 1.60504 18.002C2.00287 18.6916 2.65833 19.1948 3.42723 19.4011C4.19612 19.6074 5.01548 19.4998 5.70504 19.102L6.15004 18.845C6.99081 19.5632 7.95702 20.1199 9.00004 20.487V21C9.00004 21.7956 9.31611 22.5587 9.87872 23.1213C10.4413 23.6839 11.2044 24 12 24C12.7957 24 13.5588 23.6839 14.1214 23.1213C14.684 22.5587 15 21.7956 15 21V20.487C16.0427 20.1184 17.0082 19.5604 17.848 18.841L18.295 19.099C18.9846 19.4968 19.804 19.6044 20.5729 19.3981C21.3418 19.1918 21.9972 18.6886 22.395 17.999C22.7929 17.3094 22.9005 16.4901 22.6942 15.7212C22.4879 14.9523 21.9846 14.2968 21.295 13.899L21.294 13.9ZM18.746 10.124C19.0847 11.3511 19.0847 12.6469 18.746 13.874C18.6869 14.0876 18.7004 14.3147 18.7844 14.5198C18.8684 14.7249 19.0181 14.8963 19.21 15.007L20.294 15.633C20.5239 15.7656 20.6916 15.9841 20.7603 16.2403C20.829 16.4966 20.7932 16.7697 20.6605 16.9995C20.5279 17.2293 20.3095 17.397 20.0532 17.4658C19.7969 17.5345 19.5239 17.4986 19.294 17.366L18.208 16.738C18.0159 16.6267 17.7923 16.5826 17.5723 16.6124C17.3523 16.6423 17.1485 16.7445 16.993 16.903C16.103 17.8117 14.9816 18.46 13.75 18.778C13.5351 18.8333 13.3446 18.9585 13.2086 19.1339C13.0727 19.3094 12.9989 19.525 12.999 19.747V21C12.999 21.2652 12.8937 21.5196 12.7062 21.7071C12.5186 21.8946 12.2643 22 11.999 22C11.7338 22 11.4795 21.8946 11.2919 21.7071C11.1044 21.5196 10.999 21.2652 10.999 21V19.748C10.9992 19.526 10.9254 19.3104 10.7894 19.1349C10.6535 18.9595 10.463 18.8343 10.248 18.779C9.01639 18.4597 7.89537 17.81 7.00604 16.9C6.85057 16.7415 6.64678 16.6393 6.4268 16.6094C6.20682 16.5796 5.98315 16.6237 5.79104 16.735L4.70704 17.362C4.59327 17.4287 4.46743 17.4722 4.33677 17.4901C4.2061 17.508 4.0732 17.4998 3.9457 17.4661C3.8182 17.4324 3.69862 17.3738 3.59386 17.2937C3.4891 17.2136 3.40122 17.1135 3.33528 16.9993C3.26934 16.8851 3.22664 16.759 3.20964 16.6282C3.19264 16.4974 3.20168 16.3646 3.23623 16.2373C3.27079 16.11 3.33017 15.9909 3.41098 15.8866C3.49178 15.7824 3.5924 15.6952 3.70704 15.63L4.79104 15.004C4.98299 14.8933 5.13272 14.7219 5.2167 14.5168C5.30069 14.3117 5.31417 14.0846 5.25504 13.871C4.9164 12.6439 4.9164 11.3481 5.25504 10.121C5.31311 9.90788 5.29898 9.68153 5.21486 9.47729C5.13074 9.27305 4.98136 9.10241 4.79004 8.992L3.70604 8.366C3.47623 8.23339 3.30851 8.01492 3.23978 7.75865C3.17105 7.50239 3.20693 7.22931 3.33954 6.9995C3.47215 6.76969 3.69062 6.60197 3.94689 6.53324C4.20316 6.46451 4.47623 6.50039 4.70604 6.633L5.79204 7.261C5.98362 7.37251 6.20682 7.41721 6.42657 7.38807C6.64632 7.35893 6.85015 7.25759 7.00604 7.1C7.89613 6.19134 9.01747 5.54302 10.249 5.225C10.4647 5.16956 10.6556 5.04375 10.7917 4.8675C10.9277 4.69125 11.001 4.47464 11 4.252V3C11 2.73478 11.1054 2.48043 11.2929 2.29289C11.4805 2.10536 11.7348 2 12 2C12.2653 2 12.5196 2.10536 12.7071 2.29289C12.8947 2.48043 13 2.73478 13 3V4.252C12.9999 4.47396 13.0737 4.68964 13.2096 4.86508C13.3456 5.04052 13.5361 5.16573 13.751 5.221C14.9831 5.54015 16.1044 6.18988 16.994 7.1C17.1495 7.25847 17.3533 7.36069 17.5733 7.39057C17.7933 7.42044 18.0169 7.37626 18.209 7.265L19.293 6.638C19.4068 6.5713 19.5327 6.52777 19.6633 6.5099C19.794 6.49204 19.9269 6.50019 20.0544 6.5339C20.1819 6.56761 20.3015 6.6262 20.4062 6.70631C20.511 6.78642 20.5989 6.88646 20.6648 7.00067C20.7307 7.11488 20.7734 7.24101 20.7904 7.37179C20.8074 7.50257 20.7984 7.63542 20.7639 7.76269C20.7293 7.88997 20.6699 8.00915 20.5891 8.11337C20.5083 8.2176 20.4077 8.30482 20.293 8.37L19.209 8.996C19.0181 9.10671 18.8691 9.27748 18.7854 9.48169C18.7016 9.68591 18.6878 9.9121 18.746 10.125V10.124Z" fill="#374957" />
                            </Svg>

                        </View>
                    </View>

                    <View className="mt-6 border border-gray-300 rounded-xl p-2 flex-row justify-start items-center gap-x-2 overflow-hidden">
                        {
                            infoMode == 1 ? (
                                <TaraNavigation size={28} color="#22c55e" />
                            ) : (
                                <TaraMarker size={28} color="#ef4444" />
                            )
                        }
                        <TextInput onChangeText={(e) => InputLocation(e)} value={infoInput} className="font-medium text-lg text-blue-500 w-full" placeholder={infoMode == 1 ? 'Where is your pickup location?' : 'Where is your drop destination?'} />
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
                style={{ backgroundColor: "#fff", zIndex: 999 }}
            >
                <View className="p-4">
                    <View className="relative mt-2 flex-row justify-center items-center w-full">
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
                style={{ backgroundColor: "#fff", zIndex: 999 }}
            >
                <View className="p-4">
                    <View className="relative mt-2 flex-row justify-center items-center w-full">
                        <View className="w-32 bg-slate-300 p-1 flex-row justify-center items-center rounded-xl"></View >
                    </View >
                    <View className="p-4">
                        <Text className="font-medium text-xl">Select Payment Method</Text>



                        <View className="mb-4">
                            <TouchableOpacity onPress={() => myPaymentMethed(0)}>
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
                                        ) : (
                                            <View className="h-6 w-6 border border-gray-300 rounded-full flex justify-center items-center">
                                                <View className="h-4 w-4 bg-gray-100 rounded-full"></View>
                                            </View>
                                        )
                                    }

                                </View>
                            </TouchableOpacity>

                            {
                                walletBalance == '0.00' || fareRate > walletBalance ? (
                                    <View>
                                        <View className="flex-row justify-between items-center gap-x-2 py-4">

                                            <View className="flex-row justify-start items-center gap-x-4">
                                                <TaraWalletIcon color="#94a3b8" size={25} />
                                                <View>
                                                    <Text className="text-gray-300 text-xl font-semibold">Tara Wallet <Text className="text-gray-800">(&#8369;{walletBalance})</Text></Text>
                                                    <Text className="text-xs">You don't have enough balance.</Text>
                                                </View>
                                            </View>

                                            <Pressable onPress={() => navigation.navigate("wallet")} className="px-2.5 rounded-full flex justify-center items-center">
                                                <View className="px-6 py-2.5 bg-blue-500 rounded-full">
                                                    <Text className="text-white font-medium">Top up</Text>
                                                </View>
                                            </Pressable>

                                        </View>
                                    </View>
                                ) : (
                                    <TouchableOpacity onPress={() => myPaymentMethed(1)}>
                                        <View className="flex-row justify-between items-center gap-x-2 py-4">

                                            <View className="flex-row justify-start items-center gap-x-4">
                                                <TaraWalletIcon color="#404040" size={25} />
                                                <View>
                                                    <Text className="text-blue-500 text-xl font-semibold">Tara Wallet <Text className="text-gray-800">(&#8369;{walletBalance})</Text></Text>
                                                    <Text className="text-xs">Will deduct only once you're dropped.</Text>
                                                </View>
                                            </View>

                                            {
                                                modeofpayment == 1 ? (
                                                    <View className="h-6 w-6 border border-blue-500 rounded-full flex justify-center items-center">
                                                        <View className="h-4 w-4 bg-blue-500 rounded-full"></View>
                                                    </View>
                                                ) : (
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


            {generateQR && <GenerateQRBooking QR={"sdds"} close={setGenerateQR} />}
            {vehiclePrompt && <VehicleNotice close={readVehicleProm} />}
            {slideTut && <OffeSlideNotice click={okImfine} mode={slidedontshow} close={setSlideTutor} />}

        </>



    )


};


const GenerateQRBooking = ({ QR, close }) => {
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
                            style={{ backgroundColor: 'transparent' }}
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
                        onPress={() => close(false)}
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

const VehicleNotice = ({ close }) => {
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
                        onPress={() => close(false)}
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

const OffeSlideNotice = ({ click, mode, close }) => {
    return (

        <View className="w-full h-full p-4 absolute bottom-0 bg-black/30 z-[100] ">
            <View
                className="w-full px-6 py-8 absolute bottom-10 left-4 rounded-3xl shadow-xl shadow-black  bg-white
                flex gap-y-4"
            >
                <View className="flex-row justify-start gap-x-2.5 items-center">
                    <Pressable onPress={() => click()}>
                        {
                            mode ? (
                                <View className="flex-row justify-center items-center border border-gray-300 h-8 w-8 rounded-xl">
                                    <View className="h-4 w-4 bg-blue-500 rounded"></View>
                                </View>
                            ) : (
                                <View className="border border-gray-300 h-8 w-8 rounded-xl">

                                </View>
                            )
                        }
                    </Pressable>
                    <Text>Don't show this slide guide again.</Text>
                </View>
                <View className="w-full flex gap-y-4">
                    <Button
                        onPress={() => close(false)}
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




export default BookingPage;