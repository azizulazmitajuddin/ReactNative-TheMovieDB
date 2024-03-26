import React, { useCallback, useEffect, useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import CardMovie from "../../components/CardMovie";
import SearchBar from "../../components/SearchBar";
import { API_KEY } from "../Dashboard";

const SearchScreen = ({ route, navigation }) => {
  const { searchText } = route.params;
  const [listResult, setListResult] = useState([]);

  const [refreshing, setRefreshing] = useState(false);

  const handleClick = (a) => () => {
    navigation.navigate("Details", { ...a });
  };
  const fetchSearchData = async (val) => {
    const temp = val.replace(" ", "+");
    try {
      const response = await fetch(
        "https://api.themoviedb.org/3/search/movie?query=" + temp + "&" + API_KEY
      );
      const json = await response.json();
      setListResult(json?.results);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSearch = (text) => {
    fetchSearchData(text);
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchSearchData(searchText);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  useEffect(() => {
    fetchSearchData(searchText);
  }, []);

  return (
    <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      <View style={styles.container}>
        <View style={styles.searchbar}>
          <SearchBar searchText={searchText} handleSearch={handleSearch} />
        </View>

        <Text style={styles.resultTitle}>Result</Text>
        <CardMovie handleClick={handleClick} list={listResult} screen={0} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#eef8ff",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  searchbar: {
    minWidth: "100%",
    paddingHorizontal: 10,
    paddingVertical: 20,
    backgroundColor: "#1897f2",
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginVertical: 20,
    paddingHorizontal: 30,
  },
  resultContainer: {
    minWidth: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#eef8ff",
  },
  gap: {
    gap: 10,
  },
  card: {
    flexDirection: "row",
    borderWidth: 2,
    borderRadius: 10,
    gap: 10,
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  images: {
    width: 150,
    height: 250,
    backgroundColor: "lightgrey",
  },
  cardDesc: {
    justifyContent: "center",
    alignItems: "flex-start",
    width: "50%",
    height: 250,
  },
  cardAction: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    marginTop: 20,
    paddingHorizontal: 10,
    gap: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: "800",
  },
  date: {
    fontSize: 14,
    fontWeight: "600",
  },
  desc: {
    fontSize: 14,
    marginTop: 5,
  },
  circle: {
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 50,
    padding: 5,
  },
});

export default SearchScreen;
