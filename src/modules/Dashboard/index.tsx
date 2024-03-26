import React, { useCallback, useEffect, useState } from "react";
import {
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ActivityIndicators from "../../components/ActivityIndicator";
import SearchBar from "../../components/SearchBar";
import useMovieStore from "../../hooks/useMovieStore";

export const API_KEY = "api_key=a56875fb9419e356898ebb125c0a6a87";

const DashboardScreen = ({ navigation }) => {
  const movieStore = useMovieStore();

  const [listTrending, setListTrending] = useState([]);
  const [listLatest, setListLatest] = useState([]);
  const [listPopular, setListPopular] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const resp1 = await fetch("https://api.themoviedb.org/3/trending/all/day?" + API_KEY);
      const json1 = await resp1.json();
      setListTrending(json1?.results);
      const resp2 = await fetch("https://api.themoviedb.org/3/movie/now_playing?" + API_KEY);
      const json2 = await resp2.json();
      setListLatest(json2?.results);

      const resp3 = await fetch("https://api.themoviedb.org/3/movie/popular?" + API_KEY);
      const json3 = await resp3.json();
      setListPopular(json3?.results);

      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setIsLoading(false);
    }
  };

  const handleClick = (a) => () => {
    movieStore.setDetails(a);
    navigation.navigate("Details", { ...a });
  };

  const handleSearch = (searchText) => {
    navigation.navigate("Search", { searchText });
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      <View style={styles.container}>
        {isLoading && <ActivityIndicators />}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Welcome.</Text>
          <Text style={styles.headerDesc}>Millions of movies to discover. Explore now.</Text>
        </View>

        <View style={styles.searchbarContainer}></View>
        <View style={styles.searchbar}>
          <SearchBar handleSearch={handleSearch} timer={1000} />
        </View>

        {listTrending?.length > 0 && (
          <View style={styles.commonContainer}>
            <Text style={styles.commonTitle}>Trending</Text>
            <ScrollView horizontal={true}>
              <View style={[styles.flexRow, styles.gap]}>
                {listTrending?.map((a, i) =>
                  a.original_title || a.title ? (
                    <TouchableOpacity key={i} onPress={handleClick(a)}>
                      <View style={styles.gap}>
                        <View style={styles.images}>
                          {a.poster_path && (
                            <Image
                              source={{
                                uri: `https://image.tmdb.org/t/p/original${a.poster_path}`,
                              }}
                              style={{ width: 150, height: 250 }}
                            />
                          )}
                        </View>
                        <View>
                          <Text style={styles.desc}>{a.original_titler || a.title}</Text>
                          <Text style={styles.desc}>{a.release_date}</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ) : null
                )}
              </View>
            </ScrollView>
          </View>
        )}

        {listLatest?.length > 0 && (
          <View style={[styles.commonContainer, styles.invertedContainer]}>
            <Text style={[styles.commonTitle, styles.invertedTitle]}>Latest Trailers</Text>
            <ScrollView horizontal={true}>
              <View style={[styles.flexRow, styles.gap]}>
                {listLatest?.map((a, i) =>
                  a.original_title || a.title ? (
                    <TouchableOpacity key={i} onPress={handleClick(a)}>
                      <View style={styles.gap}>
                        <View style={styles.images}>
                          {a.poster_path && (
                            <Image
                              source={{
                                uri: `https://image.tmdb.org/t/p/original${a.poster_path}`,
                              }}
                              style={{ width: 150, height: 250 }}
                            />
                          )}
                        </View>
                        <View>
                          <Text style={[styles.desc, styles.invertedDesc]}>
                            {a.original_titler || a.title}
                          </Text>
                          <Text style={[styles.desc, styles.invertedDesc]}>{a.release_date}</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ) : null
                )}
              </View>
            </ScrollView>
          </View>
        )}

        {listPopular?.length > 0 && (
          <View style={styles.commonContainer}>
            <Text style={styles.commonTitle}>What's Popular</Text>
            <ScrollView horizontal={true}>
              <View style={[styles.flexRow, styles.gap]}>
                {listPopular?.map((a, i) =>
                  a.original_title || a.title ? (
                    <TouchableOpacity key={i} onPress={handleClick(a)}>
                      <View style={styles.gap}>
                        <View style={styles.images}>
                          {a.poster_path && (
                            <Image
                              source={{
                                uri: `https://image.tmdb.org/t/p/original${a.poster_path}`,
                              }}
                              style={{ width: 150, height: 250 }}
                            />
                          )}
                        </View>
                        <View>
                          <Text style={styles.desc}>{a.original_titler || a.title}</Text>
                          <Text style={styles.desc}>{a.release_date}</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ) : null
                )}
              </View>
            </ScrollView>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eef8ff",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    minWidth: "100%",
    backgroundColor: "#1897f2",
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
  },
  headerDesc: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  searchbarContainer: {
    minWidth: "100%",
    height: 20,
    backgroundColor: "#1897f2",
  },
  searchbar: {
    minWidth: "100%",
    paddingHorizontal: 10,
    marginTop: -30,
  },
  commonContainer: {
    flex: 1,
    minWidth: "100%",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    gap: 10,
  },
  commonTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  images: {
    width: 150,
    height: 250,
    backgroundColor: "lightgrey",
  },
  invertedContainer: {
    backgroundColor: "#1897f2",
  },
  invertedTitle: {
    color: "#fff",
  },
  flexRow: { flexDirection: "row" },
  gap: {
    gap: 10,
  },
  desc: {
    fontSize: 14,
    marginBottom: 3,
    fontWeight: "500",
    width: 150,
  },
  invertedDesc: {
    color: "#fff",
  },
});

export default DashboardScreen;
