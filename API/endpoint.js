import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

export const api = axios.create({
    baseURL: 'https://dwayon.tech/api/',
    headers: {
        'Content-Type': 'application/json',
    },
});

const getToken = async () => {
    try {
        const response = await AsyncStorage.getItem("Token");

        if (!response) {
            console.log("No token found in storage.");
            return null;
        }

        const parsedResponse = JSON.parse(response);
        console.log("Bearer now:", parsedResponse.Bearer);

        return parsedResponse;
    } catch (error) {
        console.error("Error retrieving token:", error.message);
        return null;
    }
};


const getAuthHeaders = async () => {
    const tokenData = await getToken();

    if (tokenData) {
        return {
            "Auth": tokenData.Bearer,
            "refresh": tokenData.Refresh
        };
    }

    return {};
};

// Authorization function
export const authorizeUser = async () => {
    try {
        const response = await api.post(
            "authorization/create/",
            {},
            {
                headers: {
                    key: "9Siqh4JevTVGWe2ILC0MBfWvYA93",
                },
            }
        );
        const responseData = {
            Bearer: response.data.bearer_id_token,
            Refresh: response.data.refresh,
        };

        console.log("Authorization Successful:", JSON.stringify(responseData));
        return JSON.stringify(responseData);
    } catch (error) {
        console.error("Authorization Error:", error);
        throw error;
    }
};

const msgToken = () => {
    Alert.alert("Success", "Restart app, New Token generated!");
}

// Function to search for a location
export const searchLocation = async (locationName) => {
    try {
        if (locationName) {
            const headers = await getAuthHeaders();
            const response = await api.get(`locations/search/`, {
                params: { Location_Name: locationName },
                headers,
            });
            if (response.data.status === "token expired") {
                Alert.alert(
                    "Error",
                    "Token Expired, Generate a new token!",
                    [{
                        text: "Generate Token",
                        onPress: async () => {
                            await AsyncStorage.removeItem("Token");
                            await authorizeUser();
                            msgToken();
                        }
                    }]
                );
            }
            return response.data;
        }

    } catch (error) {
        console.error("Error searching location:", error);
        throw error;
    }
};

// Function to get a location by ID
export const getLocation = async (locationID) => {
    try {
        if (locationID) {
            const headers = await getAuthHeaders();
            const response = await api.get(`locations/get/`, {
                params: { locationID },
                headers,
            });
            console.log("Location Data:", response.data);
            if (response.data.status === "token expired") {
                Alert.alert(
                    "Error",
                    "Token Expired, Generate a new token!",
                    [{
                        text: "Generate Token",
                        onPress: async () => {
                            await AsyncStorage.removeItem("Token");
                            await authorizeUser();
                            msgToken();
                        }
                    }]
                );
            }
            return response.data;
        }

    } catch (error) {
        console.error("Error fetching location:", error);
        throw error;
    }
};

// Function to create a new location
export const createLocation = async (locationData) => {
    try {
        if (locationData) {
            const headers = await getAuthHeaders();
            const response = await api.post(`locations/create/`, locationData, {
                headers,
            });

            if (response.data.status === "token expired") {
                Alert.alert(
                    "Error",
                    "Token Expired, Generate a new token!",
                    [{
                        text: "Generate Token",
                        onPress: async () => {
                            await AsyncStorage.removeItem("Token");
                            await authorizeUser();
                            msgToken();
                        }
                    }]
                );
            } else {
                Alert.alert("Success", `${response.data.message}`);
            }
            console.log("Location Created:", response.data);
            return response.data;
        }

    } catch (error) {
        console.error("Error creating location:", error);
        throw error;
    }
};

// Function to pull locations based on a date range
export const pullLocations = async (startDate, endDate) => {
    try {
        if (startDate && endDate) {
            const headers = await getAuthHeaders();
            const response = await api.get(`locations/pull/`, {
                params: { start_date: startDate, end_date: endDate },
                headers,
            });
            if (response.data.status === "token expired") {
                Alert.alert(
                    "Error",
                    "Token Expired, Generate a new token!",
                    [{
                        text: "Generate Token",
                        onPress: async () => {
                            await AsyncStorage.removeItem("Token");
                            await authorizeUser();
                            msgToken();
                        }
                    }]
                );
            }
            return response.data;
        }

    } catch (error) {
        console.error("Error pulling locations:", error);
        throw error;
    }
};
