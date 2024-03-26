import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ActivityIndicators from "../../components/ActivityIndicator";
import useUserStore from "../../hooks/useUserStore";
import { API_KEY } from "../Dashboard";

const LandingScreen = ({ navigation }) => {
  const userStore = useUserStore();

  const [isLoading, setIsLoading] = useState(false);

  const handlePress = (screenName) => () => {
    navigation.navigate(screenName);
  };

  const fetchDataRating = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/account?${API_KEY}&session_id=${userStore.session}`
      );
      const json = await response.json();
      if (json) {
        userStore.setUser(json);
        setIsLoading(false);
        navigation.navigate("Tab");
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (userStore.session) {
      fetchDataRating();
    }
  }, [userStore.session]);

  return (
    <View style={styles.container}>
      {isLoading && <ActivityIndicators />}
      <View style={styles.headerContainer}>
        <View style={styles.iconContainer}>
          <View style={styles.iconBox}>
            <Text style={styles.iconText}>The</Text>
            <View style={styles.firstBox} />
          </View>
          <Text style={styles.iconText2}>Movie</Text>
          <View style={styles.iconBox}>
            <View style={styles.secondBox} />
            <Text style={styles.iconText}>DB</Text>
          </View>
        </View>
      </View>

      <Text style={styles.title}>Millions of movies.</Text>
      <Text style={styles.subtitle}>Free and enjoy.</Text>

      <TouchableOpacity onPress={handlePress("Login")} style={styles.loginButton}>
        <Text style={styles.loginText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handlePress("Tab")}>
        <Text style={styles.skipText}>Skip for now</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eef8ff",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 10,
    paddingBottom: "25%",
  },
  iconContainer: {
    width: 170,
    height: 150,
    backgroundColor: "#032541",
    opacity: 0.8,
    borderRadius: 10,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "10%",
  },
  iconBox: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 5,
  },
  iconText: { fontSize: 30, color: "#fff", fontWeight: "800" },
  iconText2: { fontSize: 45, color: "#fff", fontWeight: "800" },
  firstBox: { width: 50, height: 20, borderRadius: 50, backgroundColor: "lightgrey" },
  secondBox: { width: 65, height: 20, borderRadius: 50, backgroundColor: "lightgrey" },
  headerContainer: {
    alignItems: "center",
    marginBottom: "45%",
  },
  title: {
    color: "#000",
    fontSize: 30,
    fontWeight: "bold",
  },
  subtitle: {
    color: "#000",
    fontSize: 20,
    fontWeight: "500",
    marginBottom: 30,
  },
  loginButton: {
    elevation: 8,
    backgroundColor: "#009688",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 35,
  },
  loginText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    alignSelf: "center",
    textTransform: "uppercase",
  },
  skipText: {
    fontSize: 16,
    color: "#000",
  },
});

export default LandingScreen;
