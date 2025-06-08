import React, { useEffect } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from "react-native";

const servicesList = [
  {
    id: "1",
    name: "LinkGuard",
    description: "Analyze suspicious URL links",
    icon: require("../assets/LinkGuard.png"),
  },
  {
    id: "2",
    name: "RealOrRender",
    description: "Identify AI generated images",
    icon: require("../assets/RealOrRender.png"),
  },
  {
    id: "3",
    name: "NewsTruth",
    description: "Filter out fake news articles",
    icon: require("../assets/NewsTruth.png"),
  },
  {
    id: "4",
    name: "ScamSniffer",
    description: "Check messages from unknown senders",
    icon: require("../assets/ScamSniffer.png"),
  },
  {
    id: "5",
    name: "TeleDigest",
    description: "Get a quick summary on public telegram groups",
    icon: require("../assets/TeleDigest.png"),
  },
  {
    id: "6",
    name: "ScamWise",
    description: "Check out the resources on current scams",
    icon: require("../assets/ScamWise.png"),
  },
];

export default function ServicesScreen({ navigation, route }) {
  useEffect(() => {
    if (route?.params?.screen) {
      navigation.navigate(route.params.screen);
    }
  }, [route?.params?.screen]);

  const renderServiceItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate(item.name)}
    >
      <Image source={item.icon} style={styles.cardIcon} resizeMode="contain" />
      <Text style={styles.cardTitle}>{item.name}</Text>
      <Text style={styles.cardDesc}>{item.description}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={servicesList}
        renderItem={renderServiceItem}
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
    flex: 1,
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
