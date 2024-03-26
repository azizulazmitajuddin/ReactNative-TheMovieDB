import React from "react";
import { ActivityIndicator, Dimensions, StyleSheet, View } from "react-native";

const ActivityIndicators = (props) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: Dimensions.get("window").height,
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000",
    opacity: 0.6,
  },
});

export default ActivityIndicators;
