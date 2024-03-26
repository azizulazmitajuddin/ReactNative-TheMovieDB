import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { TouchableOpacity } from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { EvilIcons, MaterialCommunityIcons, MaterialIcons } from "react-native-vector-icons/";
import useUserStore from "../hooks/useUserStore";
import LoginScreen from "../modules/Login";
import ProfileScreen from "../modules/Profile";
import DashboardStackNavigation from "./Stack/dashboardStack";

const Tab = createBottomTabNavigator();

export default function TabNavigation({ route, navigation }) {
  const userStore = useUserStore();

  const [isLogin, setIsLogin] = useState(false);

  const handleLogout = async () => {
    userStore.reset();
    AsyncStorage.removeItem("session_id");
    navigation.navigate("LoginTab");
  };

  useEffect(() => {
    setIsLogin(userStore.isLoggedIn);
  }, [userStore.isLoggedIn]);

  return (
    <Tab.Navigator initialRouteName="DashboardTab" backBehavior="none">
      <Tab.Screen
        name="DashboardTab"
        component={DashboardStackNavigation}
        options={{
          title: "Dashboard",
          headerShown: false,
          tabBarIcon: (props) => <MaterialIcons name="dashboard" size={20} {...props} />,
          tabBarLabelStyle: {
            fontSize: 14,
            fontWeight: "600",
          },
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          title: "Profile",
          tabBarIcon: (props) => <EvilIcons name="user" size={20} {...props} />,
          tabBarLabelStyle: {
            fontSize: 14,
            fontWeight: "600",
          },
          tabBarButton: (props) => {
            return isLogin ? (
              <TouchableOpacity {...props}>{props.children}</TouchableOpacity>
            ) : null;
          },
          headerRight: (props) => {
            return (
              <TouchableOpacity {...props} style={{ marginRight: 10 }} onPress={handleLogout}>
                <MaterialCommunityIcons name="logout" size={25} />
              </TouchableOpacity>
            );
          },
        }}
      />
      <Tab.Screen
        name="LoginTab"
        component={LoginScreen}
        options={{
          title: "Login",
          tabBarIcon: (props) => <MaterialIcons name="login" size={20} {...props} />,
          tabBarLabelStyle: {
            fontSize: 14,
            fontWeight: "600",
          },
          tabBarButton: (props) =>
            !isLogin ? <TouchableOpacity {...props}>{props.children}</TouchableOpacity> : null,
        }}
      />
    </Tab.Navigator>
  );
}
