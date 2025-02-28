import { View, Text, Alert, SafeAreaView, FlatList, TextInput, Pressable, } from "react-native";
import { StatusBar } from 'expo-status-bar';
import { useState, useEffect, useContext, useRef } from "react";
import { searchLocation, createLocation, pullLocations } from '../API/endpoint';
import * as Location from "expo-location";
import { TokenContext } from "../context/TokenContext";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";

function index() {
    const [positionWatcher, setPositionWatcher] = useState(null);
    const [location, setLocation] = useState(null);
    const [locationData, setLocationData] = useState(null);
    const [currentAddress, setCurrentAddress] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [searchText, setSearchText] = useState("");
    const { token } = useContext(TokenContext);
    const [region, setRegion] = useState({
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0.10,
        longitudeDelta: 0.10,
    });
    const [startDate, setStartDate] = useState("");
    const [endDtae, setEndDate] = useState("");
    const [locationArray, setLocationArray] = useState(null);
    const [showLocationArray, setShowLocationArray] = useState(true);
    const [isSearched, setIsSearched] = useState(false);
    const [pullMarkerLocation, setPullMarkerLocation] = useState(null);
    const [locationArrayCoords, setLocationArrayCoords] = useState(null);

    const mapRef = useRef(null);

    // // Function to get address from coordinates using Nominatim API
    // const getAddressFromCoords = async (latitude, longitude) => {
    //     const accessToken = "pk.eyJ1Ijoic2FmZXJpZGVyLTAxIiwiYSI6ImNsdGxrOWUxcjE0Z2YyaXF2OHczaG83ZXAifQ.3qratOTlNyc8wpTOKHpjhQ"; // Replace with your actual Mapbox token
    //     const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${accessToken}`;

    //     try {
    //         const response = await axios.get(url);
    //         const data = response.data;

    //         if (data && data.features.length > 0) {
    //             const place = data.features[0].context || {};
    //             const city = place.find((item) => item.id.includes("place"))?.text || "";
    //             const region = place.find((item) => item.id.includes("region"))?.text || "";
    //             const country = place.find((item) => item.id.includes("country"))?.text || "";
    //             const formattedAddress = `${city}, ${region}, ${country}`.replace(/, , /g, ", ").trim();

    //             console.log("Formatted Address:", formattedAddress);
    //             return formattedAddress;
    //         }

    //         console.error("Invalid response from Mapbox:", data);
    //         return null;
    //     } catch (error) {
    //         console.error("Mapbox API Error:", error.message);
    //         return null;
    //     }
    // };

    // Function to get address from coordinates using Google Maps Geocoding API
    const getAddressFromCoords = async (latitude, longitude) => {
        const apiKey = ""; // Replace with your actual Google Maps API key
        const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;

        try {
            const response = await axios.get(url);
            const data = response.data;

            if (data.status === "OK" && data.results.length > 0) {
                const formattedAddress = data.results[0].formatted_address;
                console.log("Formatted Address:", formattedAddress);
                return formattedAddress;
            } else {
                console.error("Invalid response from Google Maps API:", data);
                return null;
            }
        } catch (error) {
            console.error("Google Maps API Error:", error.message);
            return null;
        }
    };


    const generatedIDs = new Set();

    const generateRandomID = (length = 10) => {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let randomID;

        do {
            randomID = "";
            for (let i = 0; i < length; i++) {
                randomID += chars.charAt(Math.floor(Math.random() * chars.length));
            }
        } while (generatedIDs.has(randomID));

        generatedIDs.add(randomID);
        return randomID;
    };

    // Function to fetch address and create a location entry
    const getAddress = async () => {
        try {
            if (!region || !region.latitude || !region.longitude) {
                Alert.alert("Error", "Current location not available!");
                return;
            }

            const { latitude, longitude } = region;
            const locationName = await getAddressFromCoords(latitude, longitude);

            if (locationName) {
                const randomLocationID = generateRandomID(10);

                await createLocation({
                    Email: "elisha.delight5@gmail.com",
                    UserID: 233223,
                    locationID: randomLocationID,
                    Location_Name: locationName,
                    Coordinate_1: latitude,
                    Coordinate_2: longitude,
                    Source: "Admin",
                });
            } else {
                Alert.alert("Error", "Address not available!");
            }
        } catch (error) {
            console.error("Error fetching address:", error);
            Alert.alert("Error", "Something went wrong!");
        }
    };

    // Function to get Location Name from coords
    const getCurrentAddress = async (currentLocation) => {
        try {

            if (!currentLocation || !currentLocation.coords) {
                Alert.alert("Error", "Current location not available!");
                return;
            }

            const { latitude, longitude } = currentLocation.coords;
            const locationName = await getAddressFromCoords(latitude, longitude);

            if (locationName) {
                setCurrentAddress(locationName);
                return locationName;
            } else {
                Alert.alert("Error", "Address not available!");
                return null;
            }
        } catch (error) {
            console.error("Error fetching address:", error);
            Alert.alert("Error", "Something went wrong!");
            return null;
        }
    };

    const getLocations = async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                setErrorMsg("Permission to access location was denied");
                return;
            }

            const currentLocation = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High,
            });

            setLocation(currentLocation);
            const address = await getCurrentAddress(currentLocation);
            setCurrentAddress(address || "No address available");

        } catch (error) {
            console.error("Error fetching location:", error);
            setErrorMsg("Error fetching location");
        }
    };

    const startWatchingLocation = async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                setErrorMsg("Permission to access location was denied");
                return;
            }

            // Start watching position
            const sub = await Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.High,
                    timeInterval: 10000,
                    distanceInterval: 10,
                },
                async (newLocation) => {
                    const newCoords = {
                        latitude: newLocation.coords.latitude,
                        longitude: newLocation.coords.longitude,
                        latitudeDelta: 0.05,
                        longitudeDelta: 0.05,
                    };
                    setRegion(newCoords);
                    setLocation(newLocation);

                    mapRef.current?.animateToRegion(newCoords, 1000);
                    await getCurrentAddress(newLocation);
                }
            );

            setPositionWatcher(sub);

        } catch (error) {
            console.error("Error starting location watch:", error);
            setErrorMsg("Error starting location tracking");
        }
    };

    const stopWatchingLocation = () => {
        if (positionWatcher) {
            positionWatcher.remove();
            setPositionWatcher(null);
        }
    };

    useEffect(() => {
        getLocations();
        startWatchingLocation();
        return () => stopWatchingLocation();
    }, []);

    const fetchData = async () => {
        try {
            const data = await searchLocation(searchText);
            if (!data || !data.locations || data.locations.length === 0) {
                throw new Error("No location data found");
            }

            const locationResponse = data.locations[0];

            setLocationData({
                latitude: parseFloat(locationResponse?.latitude),
                longitude: parseFloat(locationResponse?.longitude),
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
                locationName: locationResponse?.Location
            });
        } catch (error) {
            console.error("Error fetching location:", error);
        }
    };


    const fetchDataList = async () => {
        try {
            const data = await searchLocation(searchText);
            if (!data || !data.locations || data.locations.length === 0) {
                throw new Error("No location data found");
            }

            const locationsArray = data.locations.map(item => ({
                latitude: item.latitude,
                longitude: item.longitude,
                location: item.Location
            }));
            setLocationArray(locationsArray);

            const firstLocation = locationsArray[0];

            if (firstLocation) {
                setLocationArrayCoords({
                    latitude: firstLocation.latitude,
                    longitude: firstLocation.longitude,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                    locationName: firstLocation.locationName
                });
            }

        } catch (error) {
        }
    };

    useEffect(() => {
        fetchDataList();
        if (searchText === "") {
            setShowLocationArray(false);
        }
        if (isSearched) {
            setShowLocationArray(false);
            setIsSearched(false);
        } else {
            setShowLocationArray(true);
        }
    }, [searchText])

    useEffect(() => {
        if (locationData && mapRef.current) {
            mapRef.current.animateToRegion({
                ...locationData,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
            }, 1000);
        }
    }, [locationData]);
    useEffect(() => {
        if (region && mapRef.current) {
            mapRef.current.animateToRegion({
                ...region,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
            }, 1000);
        }
    }, [location, currentAddress]);

    useEffect(() => {
        if (locationArrayCoords && mapRef.current) {
            mapRef.current.animateToRegion({
                ...locationArrayCoords,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
            }, 1000);
        }
    }, [locationArrayCoords]);
    const lightModeStyle = [
        [
            {
                elementType: 'geometry',
                stylers: [{ color: '#f5f5f5' }],
            },
            {
                elementType: 'labels.icon',
                stylers: [{ visibility: 'off' }],
            },
            {
                elementType: 'labels.text.fill',
                stylers: [{ color: '#616161' }],
            },
            {
                elementType: 'labels.text.stroke',
                stylers: [{ color: '#f5f5f5' }],
            },
            {
                featureType: 'administrative',
                elementType: 'geometry',
                stylers: [{ visibility: 'off' }],
            },
            {
                featureType: 'administrative.land_parcel',
                stylers: [{ visibility: 'off' }],
            },
            {
                featureType: 'administrative.neighborhood',
                stylers: [{ visibility: 'off' }],
            },
            {
                featureType: 'poi',
                elementType: 'labels.text',
                stylers: [{ visibility: 'off' }],
            },
            {
                featureType: 'poi.park',
                elementType: 'geometry',
                stylers: [{ color: '#e5e5e5' }],
            },
            {
                featureType: 'road',
                elementType: 'geometry',
                stylers: [{ color: '#ffffff' }],
            },
            {
                featureType: 'road.arterial',
                elementType: 'labels.text.fill',
                stylers: [{ color: '#757575' }],
            },
            {
                featureType: 'road.highway',
                elementType: 'geometry',
                stylers: [{ color: '#dadada' }],
            },
            {
                featureType: 'road.highway',
                elementType: 'labels.text.fill',
                stylers: [{ color: '#616161' }],
            },
            {
                featureType: 'road.local',
                elementType: 'labels.text.fill',
                stylers: [{ color: '#9e9e9e' }],
            },
            {
                featureType: 'transit.line',
                stylers: [{ visibility: 'off' }],
            },
            {
                featureType: 'water',
                elementType: 'geometry',
                stylers: [{ color: '#c9c9c9' }],
            },
            {
                featureType: 'water',
                elementType: 'labels.text.fill',
                stylers: [{ color: '#9e9e9e' }],
            },
        ],
    ];

    const LocationArrayView = () => {
        return (
            <FlatList
                data={locationArray}
                keyExtractor={(item) => `${item.latitude}-${item.longitude}`}
                style={{ position: "absolute", top: 215, left: 20, right: 20, zIndex: 10 }}
                renderItem={({ item }) => (
                    <Pressable
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            padding: 12,
                            borderBottomWidth: 1,
                            borderBottomColor: "#ddd",
                            borderRadius: 8,
                            backgroundColor: "#fff",
                            elevation: 1,
                            marginBottom: 8,
                        }}
                        onPress={() => {
                            setSearchText(item.location);
                            setShowLocationArray(false);
                            setIsSearched(true);
                        }}
                    >
                        <View
                            style={{
                                backgroundColor: "#EAEAEA",
                                width: 40,
                                height: 40,
                                borderRadius: 20,
                                alignItems: "center",
                                justifyContent: "center",
                                marginRight: 12,
                            }}
                        >
                            <Text style={{ fontSize: 18 }}>📍</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontSize: 16, fontWeight: "bold", color: "#333" }}>
                                {item.location}
                            </Text>
                        </View>
                    </Pressable>
                )}
            />
        );
    };


    const pullRangeLocation = async () => {
        try {
            const data = await pullLocations(startDate, endDtae);

            const formattedLocations = data.locations.map((item) => ({
                location_name: item.Location_Name,
                coordinate_1: item.Coordinate_1,
                coordinate_2: item.Coordinate_2
            }));
            setPullMarkerLocation(formattedLocations);


        } catch (error) {
            console.error("Error fetching locations:", error);
        }
    };




    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
            <StatusBar translucent backgroundColor="black" barStyle="light-content" />

            <MapView
                style={{ flex: 1 }}
                ref={mapRef}
                provider={PROVIDER_GOOGLE}
                initialRegion={region}
                customMapStyle={lightModeStyle}
            >
                <Marker coordinate={region} title={"My Location"} description={currentAddress} />
                {locationData && (
                    <Marker coordinate={locationData} title={locationData?.locationName} description="Registered location!" />
                )}

                {pullMarkerLocation?.map((item, index) => (
                    <Marker
                        key={index}
                        coordinate={{
                            latitude: parseFloat(item.coordinate_1),
                            longitude: parseFloat(item.coordinate_2),
                        }}
                        title={item.location_name}
                        description="Registered location!"
                    />
                ))}

            </MapView>

            {/* Search Bar */}
            <View style={{ position: "absolute", top: 80, left: 20, right: 20, zIndex: 10 }}>
                <View style={{
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: "white",
                    borderRadius: 10,
                    paddingHorizontal: 10,
                    elevation: 5,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.2,
                    shadowRadius: 4,
                    height: 60,
                }}>
                    <Ionicons name="location-outline" size={24} color="gray" />
                    <TextInput
                        placeholder="Search location"
                        value={searchText}
                        onChangeText={setSearchText}
                        style={{ flex: 1, backgroundColor: "transparent", marginLeft: 10, fontSize: 16, paddingVertical: 8 }}
                    />
                    <Pressable onPress={fetchData}>
                        <Ionicons name="search-outline" size={24} color="gray" />
                    </Pressable>
                </View>
            </View>


            <View style={{ position: "absolute", top: 150, left: 20, right: 20, zIndex: 10 }}>
                <View style={{
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: "white",
                    borderRadius: 10,
                    paddingHorizontal: 10,
                    elevation: 5,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.2,
                    shadowRadius: 4,
                    height: 60,
                }}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Ionicons name="calendar-clear-outline" size={24} color="gray" />
                        <TextInput
                            placeholder="Start Date"
                            value={startDate}
                            onChangeText={setStartDate}
                            style={{ flex: 1, backgroundColor: "transparent", marginLeft: 10, fontSize: 16, paddingVertical: 8 }}
                        />

                        <Ionicons name="calendar-clear-outline" size={24} color="gray" />
                        <TextInput
                            placeholder="End Date"
                            value={endDtae}
                            onChangeText={setEndDate}
                            style={{ flex: 1, backgroundColor: "transparent", marginLeft: 10, fontSize: 16, paddingVertical: 8 }}
                        />
                        <Pressable onPress={() => { pullRangeLocation() }}>
                            <Ionicons name="search-outline" size={24} color="gray" />
                        </Pressable>
                    </View>

                </View>
            </View>

            {/* Bottom View */}
            <View style={{
                alignItems: "center",
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: 170,
                borderTopRightRadius: 30,
                borderTopLeftRadius: 30,
                backgroundColor: "white",
                elevation: 5,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: -2 },
                shadowOpacity: 0.2,
                shadowRadius: 5,
            }}>
                <View style={{ alignItems: "center", marginTop: 30 }}>
                    <Pressable
                        onPress={() => { getAddress() }}
                        style={{
                            height: 50,
                            width: 320,
                            borderRadius: 25,
                            backgroundColor: "#007bff",
                            justifyContent: "center",
                            alignItems: "center",
                            shadowColor: "#000",
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.2,
                            shadowRadius: 5,
                            elevation: 5,
                        }}
                        android_ripple={{ color: "#0056b3" }}
                    >
                        <Text style={{ color: "white", fontSize: 18, fontWeight: "600", letterSpacing: 0.8 }}>
                            Upload Current Location
                        </Text>
                    </Pressable>
                </View>

                <View style={{ alignItems: "center", marginTop: 10 }}>
                    <Pressable
                        onPress={() => { setPullMarkerLocation(null) }}
                        style={{
                            height: 50,
                            width: 320,
                            borderRadius: 25,
                            backgroundColor: "#007bff",
                            justifyContent: "center",
                            alignItems: "center",
                            shadowColor: "#000",
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.2,
                            shadowRadius: 5,
                            elevation: 5,
                        }}
                        android_ripple={{ color: "#0056b3" }}
                    >
                        <Text style={{ color: "white", fontSize: 18, fontWeight: "600", letterSpacing: 0.8 }}>
                            Clear Map
                        </Text>
                    </Pressable>
                </View>


            </View>
            {
                showLocationArray ? <LocationArrayView /> : null
            }
        </SafeAreaView>
    );
}

export default index;
