// OverallHistoryScreen.js
import React, { useEffect } from "react";
import {
  SafeAreaView,
  FlatList,
  View,
  Text,
  StyleSheet,
  Dimensions,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";

const { width } = Dimensions.get("window");
const CARD_MARGIN = 16;
const CARD_WIDTH = (width - CARD_MARGIN * 3) / 2;

const historyList = [
  {
    id: "1",
    name: "LinkGuard History",
    route: "LinkGuard History",
    description: "Past URL analysis results",
    icon: <Ionicons name="link-outline" size={48} color="#33A1FD" />,
  },
  {
    id: "2",
    name: "RealOrRender History",
    route: "RealOrRender History",
    description: "Past image analysis results",
    icon: <MaterialCommunityIcons name="image-search-outline" size={48} color="#2E5AAC" />,
  },
  {
    id: "3",
    name: "NewsTruth History",
    route: "NewsTruth History",
    description: "Past article verifications",
    icon: <FontAwesome5 name="newspaper" size={48} color="#C14D3E" />,
  },
  {
    id: "4",
    name: "ScamSniffer History",
    route: "ScamSniffer History",
    description: "Past message analysis results",
    icon: <MaterialCommunityIcons name="chat-alert-outline" size={48} color="#3EBF2E" />,
  },
  {
    id: "5",
    name: "TeleDigest History",
    route: "TeleDigest History",
    description: "Past telegram group analyses",
    icon: <FontAwesome5 name="telegram-plane" size={48} color="#0088CC" />,
  },
];

export default function OverallHistoryScreen({ navigation }) {
  const renderHistoryItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate(item.route)}
    >
      <View style={styles.iconWrapper}>{item.icon}</View>
      <Text style={styles.cardTitle}>{item.name}</Text>
      <Text style={styles.cardDesc}>{item.description}</Text>
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={require("../assets/bg.png")}
      style={styles.background}
      imageStyle={{ opacity: 0.1 }}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <Text style={styles.header}></Text>
        <View style={styles.spacer} />

        <FlatList
          data={historyList}
          renderItem={renderHistoryItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          columnWrapperStyle={styles.columnWrapper}
        />
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background:     { flex: 1, backgroundColor: "#F0F4F8" },
  container:      { flex: 1, paddingTop: 24 },

  header:         {
                   fontSize: 24,
                   fontWeight: "700",
                   color: "#333",
                   alignSelf: "center",
                  },
  spacer:         { height: 16 },

  listContainer:  { paddingBottom: 20 },
  columnWrapper:  { justifyContent: "space-between", paddingHorizontal: CARD_MARGIN },

  card:           {
                   width: CARD_WIDTH,
                   backgroundColor: "#fff",
                   borderRadius: 12,
                   padding: 16,
                   marginBottom: CARD_MARGIN,
                   alignItems: "center",
                   shadowColor: "#000",
                   shadowOpacity: 0.05,
                   shadowOffset: { width: 0, height: 1 },
                   shadowRadius: 2,
                   elevation: 2,
                  },
  iconWrapper:    { marginBottom: 12 },
  cardTitle:      {
                   fontSize: 16,
                   fontWeight: "600",
                   color: "#333",
                   textAlign: "center",
                   marginBottom: 4,
                  },
  cardDesc:       {
                   fontSize: 12,
                   color: "#555",
                   textAlign: "center",
                  },
});
