import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "react-native-vector-icons";

type ListType = {
  original_title?: string;
  title?: string;
  poster_path?: string;
  release_date?: string;
  overview?: string;
  rating?: number;
};

const CardMovie = ({
  handleClick,
  handleRating,
  handleWatchlist,
  list,
  screen,
}: {
  handleClick?: (obj) => () => void;
  handleRating?: (obj) => void;
  handleWatchlist?: (obj) => void;
  list?: ListType[];
  screen?: number;
}) => {
  const handleOnPress = (a) => () => {
    handleClick(a);
  };
  const handleOnRating = (a) => () => {
    handleRating(a);
  };
  const handleRemoveWatchlist = (a) => () => {
    handleWatchlist(a);
  };

  return (
    <View style={styles.resultContainer}>
      <View style={styles.gap}>
        {list?.length > 0 ? (
          list?.map((a, i) =>
            a.original_title || a.title ? (
              <View key={i} style={styles.card}>
                <TouchableOpacity onPress={handleOnPress(a)}>
                  <View style={styles.images}>
                    {a.poster_path && (
                      <Image
                        source={{ uri: `https://image.tmdb.org/t/p/original${a.poster_path}` }}
                        style={{ width: 150, height: 250 }}
                      />
                    )}
                  </View>
                </TouchableOpacity>
                <View style={styles.cardDesc}>
                  <TouchableOpacity onPress={handleClick(a)}>
                    <Text numberOfLines={3} style={styles.title}>
                      {a.original_title || a.title}
                    </Text>
                    <Text style={styles.date}>{a.release_date}</Text>
                    <Text ellipsizeMode="tail" numberOfLines={5} style={styles.desc}>
                      {a.overview}
                    </Text>
                  </TouchableOpacity>
                  <View style={styles.cardAction}>
                    {screen == 2 && (
                      <View style={styles.boxStar}>
                        <TouchableOpacity style={styles.circleStar} onPress={handleOnRating(a)}>
                          <Ionicons
                            name={a.rating * 10 > 0 ? "star" : "star-outline"}
                            size={15}
                            color="#4F8EF7"
                          />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.circleStar} onPress={handleOnRating(a)}>
                          <Ionicons
                            name={a.rating * 10 >= 30 ? "star" : "star-outline"}
                            size={15}
                            color="#4F8EF7"
                          />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.circleStar} onPress={handleOnRating(a)}>
                          <Ionicons
                            name={a.rating * 10 >= 50 ? "star" : "star-outline"}
                            size={15}
                            color="#4F8EF7"
                          />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.circleStar} onPress={handleOnRating(a)}>
                          <Ionicons
                            name={a.rating * 10 >= 70 ? "star" : "star-outline"}
                            size={15}
                            color="#4F8EF7"
                          />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.circleStar} onPress={handleOnRating(a)}>
                          <Ionicons
                            name={a.rating * 10 >= 100 ? "star" : "star-outline"}
                            size={15}
                            color="#4F8EF7"
                          />
                        </TouchableOpacity>
                      </View>
                    )}
                    {/* <TouchableOpacity style={styles.circle} onPress={handleFavourite(a)}>
                      <Ionicons name="heart" size={15} />
                    </TouchableOpacity> */}
                    {screen == 1 && (
                      <TouchableOpacity style={styles.circle} onPress={handleRemoveWatchlist(a)}>
                        <Ionicons name="bookmark" size={15} color="red" />
                        <Text style={styles.remove}>Remove Watchlist</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>
            ) : null
          )
        ) : (
          <View style={styles.empty}>
            <Text>No Result</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "red",
    borderRadius: 50,
    paddingHorizontal: 16,
    paddingVertical: 8,
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
  circleStar: {
    flexDirection: "row",
    borderRadius: 50,
    paddingVertical: 8,
  },
  boxStar: { flexDirection: "row", gap: 10 },
  empty: { flex: 1, alignItems: "center", justifyContent: "center" },
  remove: { color: "red" },
});

export default CardMovie;
