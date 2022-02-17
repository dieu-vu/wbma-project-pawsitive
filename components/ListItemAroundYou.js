import React from "react";
import { SafeAreaView, ScrollView, View, StyleSheet } from "react-native";
import { Button, Text, Tile } from "react-native-elements";
import { getFonts } from "../utils/Utils";

const ListItemAroundYou = ({ navigation }) => {
  getFonts();

  return (
    <Tile
      imageSrc={{ uri: "http://placekitten.com/140/100" }}
      title="Pet name"
      titleStyle={{}}
      imageContainerStyle={{borderRadius:20}}
      featured
      activeOpacity={1}
      width={300}
      height={200}
    />
  );
};

const styles = StyleSheet.create({});

ListItemAroundYou.propTypes = {};

export default ListItemAroundYou;
