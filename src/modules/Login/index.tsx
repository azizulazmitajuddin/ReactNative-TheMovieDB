import React, { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import ActivityIndicators from "../../components/ActivityIndicator";
import useUserStore from "../../hooks/useUserStore";
import { storeData } from "../../utils";
import { API_KEY } from "../Dashboard";

const LoginScreen = ({ route, navigation }) => {
  const userStore = useUserStore();

  const [username, setUsername] = useState("azizulazmitajuddin");
  const [password, setPassword] = useState("1234");

  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const respToken = await fetch(
        "https://api.themoviedb.org/3/authentication/token/new?" + API_KEY
      );
      const jsonToken = await respToken.json();
      if (jsonToken?.request_token) {
        const response = await fetch(
          "https://api.themoviedb.org/3/authentication/token/validate_with_login?" + API_KEY,
          {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: username,
              password: password,
              request_token: jsonToken?.request_token,
            }),
          }
        );
        const json = await response.json();
        if (json.success) {
          const respNew = await fetch(
            "https://api.themoviedb.org/3/authentication/session/new?" + API_KEY,
            {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                request_token: json?.request_token,
              }),
            }
          );

          const jsonNew = await respNew.json();

          if (jsonNew.success) {
            const respDetails = await fetch(
              `https://api.themoviedb.org/3/account?${API_KEY}&session_id=${jsonNew?.session_id}`
            );
            const jsonDetails = await respDetails.json();

            userStore.setUser(jsonDetails);
            storeData("session_id", jsonNew?.session_id);

            navigation.navigate(route.name == "Login" ? "Tab" : "ProfileTab");
            setIsLoading(false);
          }
        }
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error login:", error);
    }
  };

  return (
    <View style={styles.container}>
      {isLoading && <ActivityIndicators />}
      <Text style={styles.text}>Username</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={(text) => setUsername(text)}
      />
      <Text style={styles.text}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry={true}
        value={password}
        onChangeText={(text) => setPassword(text)}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 10,
    padding: 25,
    backgroundColor: "#eef8ff",
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
  },
  input: {
    width: "100%",
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderRadius: 10,
  },
  button: {
    backgroundColor: "#009688",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    paddingVertical: 10,
    marginTop: 15,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
  },
});

export default LoginScreen;
