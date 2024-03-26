import { debounce } from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";

const SearchBar = (props) => {
  const [searchText, setSearchText] = useState("");
  const timer = props?.timer || 500;

  const handler = useCallback(debounce(props?.handleSearch, timer), []);

  const handleOnChange = (text) => {
    setSearchText(text);
    handler(text);
  };

  useEffect(() => {
    setSearchText(props?.searchText);
  }, []);

  return (
    <View style={styles.container}>
      {/* <Ionicons name="ios-search" size={24} color="black" style={styles.icon} /> */}
      <TextInput
        style={styles.input}
        placeholder="Search..."
        value={searchText}
        onChangeText={handleOnChange}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e0e0e0",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginHorizontal: 20,
    marginVertical: 10,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 40,
  },
});

export default SearchBar;
