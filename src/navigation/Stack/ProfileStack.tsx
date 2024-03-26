import AsyncStorage from "@react-native-async-storage/async-storage";
import { createStackNavigator } from "@react-navigation/stack";
import { TouchableOpacity } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "react-native-vector-icons/";
import useUserStore from "../../hooks/useUserStore";
import DetailsScreen from "../../modules/Details";
import ProfileScreen from "../../modules/Profile";

const Stack = createStackNavigator();

export default function ProfileStackNavigation({ route, navigation }) {
  const userStore = useUserStore();
  const handleLogout = async () => {
    userStore.reset();
    AsyncStorage.removeItem("session_id");
    navigation.navigate("LoginTab");
  };
  return (
    <Stack.Navigator initialRouteName="ProfileScreen">
      <Stack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{
          headerLeft: () => null,
          headerRight: (props) => {
            return (
              <TouchableOpacity {...props} style={{ marginRight: 10 }} onPress={handleLogout}>
                <MaterialCommunityIcons name="logout" size={25} />
              </TouchableOpacity>
            );
          },
        }}
      />
      <Stack.Screen
        name="Details"
        component={DetailsScreen}
        options={{
          headerLeft: (props) => {
            return (
              <TouchableOpacity {...props}>
                <Ionicons name="chevron-back-outline" size={25} />
              </TouchableOpacity>
            );
          },
        }}
      />
    </Stack.Navigator>
  );
}
