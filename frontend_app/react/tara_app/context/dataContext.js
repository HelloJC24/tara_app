import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useEffect, useState } from "react";

export const DataContext = createContext({});

const DataProvider = ({ children }) => {
  const [data, setData] = useState(null);

  // Load data only once on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const savedData = await AsyncStorage.getItem("data");
        if (savedData) {
          setData(JSON.parse(savedData));
        }
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    loadData();
  }, []);

  // Save data when it changes
  useEffect(() => {
    const saveData = async () => {
      try {
        if (data) {
          await AsyncStorage.setItem("data", JSON.stringify(data));
        }
      } catch (error) {
        console.error("Error saving data:", error);
      }
    };

    saveData();
  }, [data]);

  return (
    <DataContext.Provider value={{ data, setData }}>
      {children}
    </DataContext.Provider>
  );
};

export default DataProvider;
