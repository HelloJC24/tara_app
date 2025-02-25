import { View, Text, Button, Alert, SafeAreaView, TextInput, Pressable } from "react-native";
import { StatusBar } from 'expo-status-bar';
import { useState, useEffect, useContext, useRef } from "react";
import { searchLocation, getLocation, createLocation, pullLocations, authorizeUser } from '../API/endpoint';
import * as Location from "expo-location";
import { TokenContext } from "../context/TokenContext";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";

function Index() {
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
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  const mapRef = useRef(null);

  // Function to get address from coordinates using Nominatim API
  const getAddressFromCoords = async (latitude, longitude) => {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&email=elisha.delight5@gmail.com`;

    try {
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'LocationFeeding/1.0 (elisha.delight5@gmail.com)', // Replace with your app details
        }
      });

      const data = response.data;
      console.log(data.address)

      if (data && data.address) {
        const { city, region, country } = data.address;
        const formattedAddress = `${city || ""}, ${region || ""}, ${country || ""}`.replace(/, , /g, ", ").trim();

        console.log("Formatted Address:", formattedAddress);
        return formattedAddress;
      }

      console.error("Invalid response from Nominatim:", data);
      return null;
    } catch (error) {
      console.error("Nominatim Error:", error.message);
      return null;
    }
  };

  // Function to fetch address and create a location entry
  const getAddress = async () => {
    try {
      // Ensure location data exists
      if (!currentLocation || !currentLocation.latitude || !currentLocation.longitude) {
        Alert.alert("Error", "Current location not available!");
        return;
      }

      const { latitude, longitude } = currentLocation;
      const locationName = await getAddressFromCoords(latitude, longitude);

      if (locationName) {
        await createLocation({
          Email: "elisha.delight5@gmail.com",
          UserID: 233223,
          locationID: "LOC1221",
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
    getLocation("LOC1221");
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

  // const currentLocation = {
  //   latitude: location?.coords?.latitude || 0,
  //   longitude: location?.coords?.longitude || 0,
  //   latitudeDelta: 0.05,
  //   longitudeDelta: 0.05,
  //   locationName: "My location"
  // };

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
  }, [location])

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

      {/* Bottom View */}
      <View style={{
        alignItems: "center",
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 230,
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30,
        backgroundColor: "white",
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
      }}>
        {/* {location && (
          <Text style={{ marginTop: 20, fontSize: 14 }}>
            {JSON.stringify(location, null, 2)}
          </Text>
        )} */}
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

          <Pressable
            style={{
              height: 50,
              width: 320,
              borderRadius: 25,
              backgroundColor: "#28a745",
              justifyContent: "center",
              alignItems: "center",
              marginTop: 15,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 5,
              elevation: 5,
            }}
            android_ripple={{ color: "#1e7e34" }}
          >
            <Text style={{ color: "white", fontSize: 18, fontWeight: "600", letterSpacing: 0.8 }}>
              Pull Location
            </Text>
          </Pressable>

          <Pressable
            style={{
              height: 50,
              width: 320,
              borderRadius: 25,
              backgroundColor: "#dc3545",
              justifyContent: "center",
              alignItems: "center",
              marginTop: 15,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 5,
              elevation: 5,
            }}
            android_ripple={{ color: "#bd2130" }}
          >
            <Text style={{ color: "white", fontSize: 18, fontWeight: "600", letterSpacing: 0.8 }}>
              Get Location
            </Text>
          </Pressable>
        </View>

      </View>
    </SafeAreaView>
  );
}

export default Index;
