import AsyncStorage from "@react-native-async-storage/async-storage";

export const storeData = async (key: string, value: string) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    console.error("storeData", e);
  }
};

export const removeData = async () => {
  try {
    await AsyncStorage.removeItem("session_id");
  } catch (e) {
    console.error(e);
  }
};
