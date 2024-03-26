import { createStackNavigator } from "@react-navigation/stack";
import { useCallback, useEffect, useState } from "react";
import { Pressable, TouchableOpacity } from "react-native";
import { Ionicons } from "react-native-vector-icons/";
import useMovieStore from "../../hooks/useMovieStore";
import useUserStore from "../../hooks/useUserStore";
import DashboardScreen, { API_KEY } from "../../modules/Dashboard";
import DetailsScreen from "../../modules/Details";
import SearchScreen from "../../modules/Search";

const Stack = createStackNavigator();

export default function DashboardStackNavigation() {
  const movieStore = useMovieStore();
  const userStore = useUserStore();

  const [isFav, setIsFav] = useState(false);

  const getListWatchlist = async () => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/account/${userStore?.user?.id}/watchlist/movies?${API_KEY}&session_id=${userStore.session}`
      );
      const json = await response.json();
      if (json.results) {
        const result = json.results.filter((a) => a.id == movieStore?.details?.id)?.[0];
        setIsFav(Boolean(result?.id));
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleAddWatchlist = useCallback(async () => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/account/${userStore?.user?.id}/watchlist?${API_KEY}&session_id=${userStore.session}`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            media_type: "movie",
            media_id: movieStore?.details.id,
            watchlist: !isFav,
          }),
        }
      );
      const json = await response.json();
      if (json.success) {
        setIsFav(!isFav);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [isFav]);

  useEffect(() => {
    getListWatchlist();
  }, [userStore?.user?.id, movieStore?.details.id]);

  return (
    <Stack.Navigator initialRouteName="DashboardScreen">
      <Stack.Screen
        name="DashboardScreen"
        component={DashboardScreen}
        options={{ title: "The Movie DB", headerLeft: () => null }}
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
          headerRight: (props) => {
            return userStore?.user?.id ? (
              <Pressable onPress={handleAddWatchlist} {...props} style={{ marginRight: 10 }}>
                <Ionicons
                  name={isFav ? "bookmark" : "bookmark-outline"}
                  size={25}
                  color={isFav ? "#009688" : "#000"}
                />
              </Pressable>
            ) : null;
          },
        }}
      />
      <Stack.Screen
        name="Search"
        component={SearchScreen}
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
