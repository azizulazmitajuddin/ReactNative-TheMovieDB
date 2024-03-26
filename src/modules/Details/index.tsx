import React, { useCallback, useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { TouchableOpacity } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/Ionicons";
import ActivityIndicators from "../../components/ActivityIndicator";
import useUserStore from "../../hooks/useUserStore";
import { API_KEY } from "../Dashboard";

type GenresType = {
  id?: number;
  name?: string;
};

type DetailsType = {
  vote_average?: number;
  release_date?: string;
  runtime?: number;
  genres?: GenresType[];
  tagline?: string;
  overview?: string;
  status?: string;
  budget?: number;
  revenue?: number;
  title?: string;
};

const DetailsScreen = ({ route, navigation }) => {
  const { id, poster_path, title, release_date, vote_average } = route.params;
  const userStore = useUserStore();

  const [details, setDetails] = useState<DetailsType>({});
  const [review, setReview] = useState([]);
  const [dataRating, setDataRating] = useState([]);
  const [rating, setRating] = useState(0);

  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const time_convert = (num) => {
    var hours = Math.floor(num / 60);
    var minutes = num % 60;
    return hours + "h " + minutes + "m";
  };

  const handleStar = (value: number) => () => {
    setRating(value);
  };

  const handleSubmitRating = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${id}/rating?${API_KEY}&session_id=${userStore.session}`,
        {
          method: rating > 0 ? "POST" : "DELETE",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body:
            rating > 0
              ? JSON.stringify({
                  value: rating / 10,
                })
              : null,
        }
      );
      const json = await response.json();
      if (json?.success) {
        setModalVisible(false);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error fetching data:", error);
    }
  };

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const resp1 = await fetch(
        `https://api.themoviedb.org/3/movie/${id}?${API_KEY}&append_to_response=videos`
      );
      const json1 = await resp1.json();
      setDetails(json1);

      const resp2 = await fetch(`https://api.themoviedb.org/3/movie/${id}/reviews?${API_KEY}`);
      const json2 = await resp2.json();
      setReview(json2.results);

      const resp3 = await fetch(
        `https://api.themoviedb.org/3/account/${userStore?.user?.id}/rated/movies?${API_KEY}&session_id=${userStore.session}`
      );
      const json3 = await resp3.json();
      if (json3.results) {
        const result = json3?.results?.filter((a) => a.id === id)?.[0];
        setDataRating(result);
        setRating(result?.rating * 10);
      }

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("Error fetching data:", error);
    }
  }, [id]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  return (
    <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      <View style={styles.container}>
        {isLoading && <ActivityIndicators />}
        <View style={styles.headerContainer}>
          <Image
            source={{ uri: `https://image.tmdb.org/t/p/original${poster_path}` }}
            style={styles.bgHeaderImg}
          />
          <Image
            source={{ uri: `https://image.tmdb.org/t/p/original${poster_path}` }}
            style={styles.headerImg}
          />
          <Text style={styles.headerText}>
            {title} ({release_date?.substring(0, 4)})
          </Text>
        </View>

        <View style={styles.scoreContainer}>
          <View style={styles.userScore}>
            <AnimatedCircularProgress
              size={40}
              width={5}
              fill={Math.round(vote_average * 10)}
              rotation={0}
              tintColor="#00e0ff"
              backgroundColor="lightgrey"
            >
              {() => <Text>{Math.round(vote_average * 10)}</Text>}
            </AnimatedCircularProgress>
            <Text style={styles.fontWeight}>User Score</Text>
          </View>
          <Text>|</Text>

          <TouchableOpacity onPress={() => setModalVisible(Boolean(userStore?.user?.id))}>
            {rating > 0 ? (
              <Text style={styles.fontWeight}>
                Your Vibe <Text style={styles.vibe}>{rating}%</Text>
              </Text>
            ) : (
              <Text style={styles.vibe}>What's Your Vibe?</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.bannerContainer}>
          <View style={styles.bannerFlex}>
            <Text style={styles.fontColor}>{details?.release_date}</Text>
            <View style={styles.bannerFlex}></View>
            {details?.runtime ? (
              <Text style={styles.fontColor}>{time_convert(details?.runtime)}</Text>
            ) : null}
          </View>

          <View style={styles.bannerFlex}>
            {details?.genres?.map((a, i, arr) => (
              <Text style={styles.fontColor} key={i}>
                {a.name}
                {i < arr.length - 1 ? "," : ""}
              </Text>
            ))}
          </View>
        </View>

        {details.tagline ? <Text style={styles.tagline}>{details.tagline}</Text> : null}

        <View style={styles.commonContainer}>
          <Text style={styles.commonTitle}>Overview</Text>
          <Text>{details.overview}</Text>
        </View>

        <View style={styles.commonContainer}>
          <Text style={styles.commonTitle}>Status</Text>
          {details.status && <Text>{details.status}</Text>}
        </View>
        <View style={styles.commonContainer}>
          <Text style={styles.commonTitle}>Budget</Text>
          {details.budget ? (
            <Text>
              {new Intl.NumberFormat("en-MY", {
                style: "currency",
                currency: "MYR",
                minimumFractionDigits: 0,
              }).format(details.budget)}
            </Text>
          ) : (
            <Text>-</Text>
          )}
        </View>
        <View style={styles.commonContainer}>
          <Text style={styles.commonTitle}>Revenue</Text>
          {details.revenue ? (
            <Text>
              {new Intl.NumberFormat("en-MY", {
                style: "currency",
                currency: "MYR",
                minimumFractionDigits: 0,
              }).format(details.revenue)}
            </Text>
          ) : (
            <Text>-</Text>
          )}
        </View>

        {review.length > 1 ? (
          <View style={styles.reviewContainer}>
            <Text style={styles.commonTitle}>Review</Text>

            <View style={[styles.card, styles.reviewBox]}>
              <Text style={styles.titleReview}>A review by {review?.[0]?.author}</Text>
              <View style={styles.flexRow}>
                <View style={styles.ratingBox}>
                  <Text style={[styles.fontColor, styles.fontWeight]}>
                    <Icon name="star" size={10} color="#fff" />{" "}
                    {review?.[0]?.author_details?.rating}
                    .0
                  </Text>
                </View>
                <Text>
                  <Text style={styles.fontGrey}>Written by </Text>
                  {review?.[0]?.author_details?.name || review?.[0]?.author}
                  <Text style={styles.fontGrey}>
                    {` on ${new Date(review?.[0]?.created_at).toLocaleDateString()}`}
                  </Text>
                </Text>
              </View>
              <Text>{review?.[0]?.content}</Text>
            </View>

            {review.length > 1 && <Text style={styles.fontWeight}>Read All Reviews</Text>}
          </View>
        ) : null}

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <Pressable style={styles.centeredView} onPress={() => setModalVisible(false)} />
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Rating</Text>
            <Text style={styles.modalSubtitle}>What do you think about {details?.title}?</Text>

            <View style={styles.starBox}>
              <Pressable onPress={handleStar(10)}>
                <Icon name={rating > 0 ? "star" : "star-outline"} size={30} color="#4F8EF7" />
              </Pressable>
              <Pressable onPress={handleStar(30)}>
                <Icon name={rating >= 30 ? "star" : "star-outline"} size={30} color="#4F8EF7" />
              </Pressable>
              <Pressable onPress={handleStar(50)}>
                <Icon name={rating >= 50 ? "star" : "star-outline"} size={30} color="#4F8EF7" />
              </Pressable>
              <Pressable onPress={handleStar(70)}>
                <Icon name={rating >= 70 ? "star" : "star-outline"} size={30} color="#4F8EF7" />
              </Pressable>
              <Pressable onPress={handleStar(100)}>
                <Icon name={rating == 100 ? "star" : "star-outline"} size={30} color="#4F8EF7" />
              </Pressable>
            </View>

            <View style={styles.actionBox}>
              <Pressable style={[styles.button, styles.textClear]} onPress={handleStar(0)}>
                <Text style={styles.textClear}>Clear Rating</Text>
              </Pressable>
              <Pressable style={[styles.button, styles.textSubmit]} onPress={handleSubmitRating}>
                <Text style={styles.textSubmit}>Submit</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
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
  headerContainer: {
    width: "100%",
    height: 350,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 15,
  },
  bgHeaderImg: {
    position: "absolute",
    top: 0,
    left: 0,
    width: Dimensions.get("window").width,
    height: 330,
    opacity: 0.5,
    backgroundColor: "lightgrey",
  },
  headerImg: { width: 150, height: 250, backgroundColor: "lightgrey" },
  headerText: { fontSize: 16, fontWeight: "700" },
  scoreContainer: {
    paddingBottom: 15,
    flexDirection: "row",
    flex: 1,
    gap: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  userScore: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 5 },
  fontWeight: { fontWeight: "600" },

  vibe: {
    color: "#1478e0",
    fontWeight: "bold",
    textAlign: "center",
  },
  bannerContainer: { width: "100%", backgroundColor: "#1897f2", paddingVertical: 8 },
  bannerFlex: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  fontColor: {
    color: "#fff",
  },
  fontGrey: {
    color: "#807474",
  },
  ratingBox: {
    backgroundColor: "#000",
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  tagline: { marginVertical: 20, paddingHorizontal: 20, fontStyle: "italic", color: "grey" },
  overviewContainer: {
    width: "100%",
    marginTop: 10,
    marginBottom: 30,
    paddingHorizontal: 14,
    gap: 10,
  },
  commonContainer: {
    width: "100%",
    marginVertical: 10,
    paddingHorizontal: 14,
    gap: 10,
  },
  commonTitle: {
    fontWeight: "bold",
    fontSize: 16,
  },
  reviewContainer: {
    width: "100%",
    marginVertical: 25,
    paddingHorizontal: 14,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderColor: "lightgrey",
    gap: 10,
    backgroundColor: "#fff",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 8,
    paddingVertical: 25,
    paddingHorizontal: 25,
    width: "100%",
    marginVertical: 10,
  },
  reviewBox: {
    width: "100%",
    borderRadius: 5,
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    borderWidth: 1,
    borderColor: "lightgrey",
  },
  titleReview: {
    fontSize: 16,
    fontWeight: "700",
  },
  flexRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginVertical: 5,
  },
  centeredView: {
    flex: 1,
    backgroundColor: "#000",
    opacity: 0.75,
  },
  modalView: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: "35%",
    backgroundColor: "#fff",
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    padding: 35,
  },
  modalTitle: {
    marginBottom: 10,
    fontSize: 18,
    fontWeight: "bold",
  },
  modalSubtitle: {
    marginBottom: 25,
    fontSize: 14,
    fontWeight: "600",
  },
  starBox: {
    flexDirection: "row",
    justifyContent: "center",
    gap: (Dimensions.get("window").width * 10) / 100,
  },
  actionBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 45,
  },
  button: {
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 25,
  },
  textClear: {
    color: "#e02525",
    borderColor: "#e02525",
  },
  textSubmit: {
    color: "#fff",
    borderColor: "#fff",
    backgroundColor: "#009688",
    fontWeight: "bold",
  },
});

export default DetailsScreen;
