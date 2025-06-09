import React from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from "react-native";

const historyList = [
  {
    id: "1",
    name: "LinkGuard History",
    description: "Past URL analysis results",
    icon: require("../assets/LinkGuard.png"),
  },
  {
    id: "2",
    name: "RealOrRender History",
    description: "Past image analysis results",
    icon: require("../assets/RealOrRender.png"),
  },
  {
    id: "3",
    name: "NewsTruth History",
    description: "Past article verifications",
    icon: require("../assets/NewsTruth.png"),
  },
  {
    id: "4",
    name: "ScamSniffer History",
    route: "ScamSniffer History", // Add this
    description: "Past message analysis results",
    icon: require("../assets/ScamSniffer.png"),
  },
  {
    id: "5",
    name: "TeleDigest History",
    description: "Past telegram group analyses",
    icon: require("../assets/TeleDigest.png"),
  },
];

export default function OverallHistoryScreen({ navigation }) {
  const renderHistoryItem = ({ item }) => (
  <TouchableOpacity
    style={styles.card}
    onPress={() => navigation.navigate(item.route)}
  >
    <Image source={item.icon} style={styles.cardIcon} resizeMode="contain" />
    <Text style={styles.cardTitle}>{item.name}</Text>
    <Text style={styles.cardDesc}>{item.description}</Text>
  </TouchableOpacity>
);

  return (
    <View style={styles.container}>
      <FlatList
        data={historyList}
        renderItem={renderHistoryItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    paddingTop: 16,
  },
  listContainer: {
    paddingHorizontal: 12,
    paddingBottom: 20,
  },
  card: {
    width: '45%',
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    margin: 8,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 1,
  },
  cardIcon: {
    width: 48,
    height: 48,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
    textAlign: "center",
  },
  cardDesc: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
  },
});