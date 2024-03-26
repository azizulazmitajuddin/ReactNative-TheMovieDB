import { createStackNavigator } from "@react-navigation/stack";
import { useEffect, useState } from "react";
import useUserStore from "../../hooks/useUserStore";
import LoginScreen from "../../modules/Login";
import ProfileScreen from "../../modules/Profile";

const Stack = createStackNavigator();

export default function LoginStackNavigation() {
  const userStore = useUserStore();

  const [initialName, setInitialName] = useState("");

  useEffect(() => {
    setInitialName(userStore.isLoggedIn ? "ProfileScreen" : "LoginScreen");
  }, [userStore.isLoggedIn]);
  return (
    <Stack.Navigator initialRouteName={initialName}>
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
    </Stack.Navigator>
  );
}
