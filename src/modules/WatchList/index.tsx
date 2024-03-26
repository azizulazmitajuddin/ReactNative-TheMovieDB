import { useFocusEffect } from "@react-navigation/core";
import React, { useCallback, useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import ActivityIndicators from "../../components/ActivityIndicator";
import CardMovie from "../../components/CardMovie";
import useMovieStore from "../../hooks/useMovieStore";
import useUserStore from "../../hooks/useUserStore";
import { API_KEY } from "../Dashboard";

const WatchListScreen = ({ route, navigation }) => {
  const movieStore = useMovieStore();
  const userStore = useUserStore();
  const [watchList, setWatchList] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleClick = (a) => () => {
    navigation.navigate("Details", { ...a });
  };

  const handleWatchlist = async (item) => {
    setIsLoading(true);
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
            media_id: item.id,
            watchlist: false,
          }),
        }
      );
      const json = await response.json();
      if (json.success) {
        setWatchList([]);
        fetchData();
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error fetching data:", error);
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/account/${userStore.user?.id}/watchlist/movies?${API_KEY}&session_id=${userStore.session}`
      );
      const json = await response.json();
      setIsLoading(false);
      setWatchList(json?.results);
    } catch (error) {
      setIsLoading(false);
      console.error("Error fetching data:", error);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  useFocusEffect(() => {
    if (watchList?.length === 0) {
      fetchData();
    }
  });

  return (
    <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      {isLoading && <ActivityIndicators />}
      <View style={styles.container}>
        <View style={styles.box}>
          <Text style={styles.title}>My Watchlist</Text>
        </View>
        <CardMovie
          handleWatchlist={handleWatchlist}
          handleClick={handleClick}
          list={watchList}
          screen={1}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#eef8ff",
    alignItems: "center",
    justifyContent: "center",
  },
  box: {
    width: "100%",
    justifyContent: "flex-start",
    marginTop: 25,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    paddingHorizontal: 30,
  },
});

export default WatchListScreen;
