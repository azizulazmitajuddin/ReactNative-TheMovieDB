import { useFocusEffect } from "@react-navigation/core";
import React, { useCallback, useState } from "react";
import {
  Dimensions,
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import ActivityIndicators from "../../components/ActivityIndicator";
import CardMovie from "../../components/CardMovie";
import useUserStore from "../../hooks/useUserStore";
import { API_KEY } from "../Dashboard";

type DetailsType = {
  id?: number;
  title?: string;
};

const RatingScreen = ({ route, navigation }) => {
  const userStore = useUserStore();
  const [ratingList, setRatingList] = useState([]);
  const [movieDetails, setMovieDetails] = useState<DetailsType>({});
  const [rating, setRating] = useState(0);

  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const handleClick = (a) => () => {
    navigation.navigate("Details", { ...a });
  };

  const handleRating = (a) => {
    setRating(a.rating * 10);
    setModalVisible(!modalVisible);
    setMovieDetails(a);
  };

  const handleStar = (value: number) => () => {
    setRating(value);
  };

  const handleSubmitRating = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${movieDetails?.id}/rating?${API_KEY}&session_id=${userStore.session}`,
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
        fetchData();
        setModalVisible(false);
        setIsLoading(false);
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
        `https://api.themoviedb.org/3/account/${userStore.user?.id}/rated/movies?${API_KEY}&session_id=${userStore.session}`
      );
      const json = await response.json();
      setIsLoading(false);
      setRatingList(json?.results);
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
    if (ratingList.length == 0) {
      fetchData();
    }
  });

  return (
    <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      {isLoading && <ActivityIndicators />}
      <View style={styles.container}>
        <View style={styles.box}>
          <Text style={styles.title}>Rating</Text>
        </View>
        <CardMovie
          handleRating={handleRating}
          handleClick={handleClick}
          list={ratingList}
          screen={2}
        />

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
            <Text style={styles.modalSubtitle}>What do you think about {movieDetails?.title}?</Text>

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

export default RatingScreen;
