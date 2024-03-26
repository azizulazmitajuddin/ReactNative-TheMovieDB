import React, { useState } from "react";
import { StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { TabBar, TabView } from "react-native-tab-view";
import { Ionicons } from "react-native-vector-icons/";
import useUserStore from "../../hooks/useUserStore";
import RatingScreen from "../Rating";
import WatchListScreen from "../WatchList";

const renderTabBar = (props) => (
  <TabBar
    {...props}
    activeColor="#009688"
    inactiveColor="#000"
    tabStyle={{ flexDirection: "row" }}
    indicatorStyle={{ backgroundColor: "#009688", color: "#000" }}
    style={{ backgroundColor: "#fff", color: "#000" }}
    renderLabel={({ route, focused, color }) => (
      <Text style={{ color: color, margin: 8 }}>{route.title}</Text>
    )}
    renderIcon={({ route, focused, color }) =>
      route?.title == "Watchlist" ? (
        <Ionicons name="bookmark" size={20} color={color} />
      ) : (
        <Ionicons name={"star"} size={20} color={color} />
      )
    }
  />
);

const renderScene = ({ route, navigation }) => {
  switch (route.key) {
    case "watchlist":
      return <WatchListScreen route={route} navigation={navigation} />;
    case "rating":
      return <RatingScreen route={route} navigation={navigation} />;
    default:
      return null;
  }
};

const ProfileScreen = ({ route, navigation }) => {
  const userStore = useUserStore();
  const layout = useWindowDimensions();

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "watchlist", title: "Watchlist" },
    { key: "rating", title: "Rating" },
  ]);

  return (
    <View style={styles.container}>
      <View style={styles.headerBox}>
        <View style={styles.imageBox}>
          <Text style={styles.name}>
            {userStore.user?.name?.charAt(0)?.toLocaleUpperCase() ||
              userStore.user?.username?.charAt(0)?.toLocaleUpperCase()}
          </Text>
        </View>
        <Text style={styles.name}>{userStore.user.name || userStore.user.username}</Text>
      </View>

      <View style={{ height: "82%" }}>
        <TabView
          navigationState={{ index, routes }}
          renderScene={({ route }) => {
            return renderScene({ route: route, navigation: navigation });
          }}
          onIndexChange={setIndex}
          initialLayout={{ width: layout.width, height: layout.height }}
          renderTabBar={renderTabBar}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eef8ff",
  },
  headerBox: {
    backgroundColor: "lightblue",
    paddingTop: 25,
    paddingBottom: 15,
    width: "100%",
    height: "18%",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  imageBox: {
    width: 50,
    height: 50,
    borderRadius: 500,
    backgroundColor: "lightgrey",
    justifyContent: "center",
    alignItems: "center",
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  button: {
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 25,
  },
  textButton: {
    color: "#fff",
    borderColor: "#fff",
    backgroundColor: "#009688",
    fontWeight: "bold",
  },
  list: {
    width: "100%",
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  lastList: {
    width: "100%",
    paddingVertical: 10,
    borderTopWidth: 1,
  },
});

export default ProfileScreen;
