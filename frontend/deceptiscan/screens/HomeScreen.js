import React, { useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  Image,
  TouchableOpacity,
  FlatList,
} from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const carouselData = [
  {
    id: "1",
    title: "Make sure to download anti-virus programs to safeguard your devices",
    icon: require("../assets/WarningSign.png"),
  },
  {
    id: "2",
    title: "Beware of phishing emails—never click unknown links!",
    icon: require("../assets/WarningSign.png"),
  },
  {
    id: "3",
    title: "Always verify bank SMS sender before transferring funds.",
    icon: require("../assets/WarningSign.png"),
  },
];

const trendingNews = [
  {
    id: "1",
    title:
      "Scam tracker: What are the latest trends in Singapore and how much money has been lost?",
    sourceLogo: require("../assets/StraitsTimes.png"),
  },
  {
    id: "2",
    title:
      "Fake Bank SMSes Target Thousands in new “OTP” phishing scam. How to protect yourself.",
    sourceLogo: require("../assets/ScamSign.png"),
  },
  {
    id: "3",
    title:
      "Cryptocurrency rug-pulls ramp up. Learn how to spot fake token launches.",
    sourceLogo: require("../assets/StraitsTimes.png"),
  },
];

export default function HomeScreen({ navigation }) {
  const scrollRef = useRef(null);

  const renderCarouselItem = (item) => (
    <View style={[styles.carouselItem, { width: SCREEN_WIDTH - 60 }]} key={item.id}>
      <Text style={styles.carouselText}>{item.title}</Text>
      <Image source={item.icon} style={styles.carouselIcon} resizeMode="contain" />
    </View>
  );

  const renderNewsItem = ({ item }) => (
    <TouchableOpacity style={styles.newsCard}>
      <View style={styles.newsCardHeader}>
        <Image source={item.sourceLogo} style={styles.newsLogo} resizeMode="contain" />
        <Text style={styles.newsTitle}>{item.title}</Text>
      </View>
    </TouchableOpacity>
  );

  const serviceIcons = [
    { key: "LinkGuard", icon: require("../assets/LinkGuard.png") },
    { key: "RealOrRender", icon: require("../assets/RealOrRender.png") },
    { key: "NewsTruth", icon: require("../assets/NewsTruth.png") },
    { key: "ScamSniffer", icon: require("../assets/ScamSniffer.png") },
  ];

  return (
    <View style={styles.container}>
      {/* Boxed Card for Carousel + Icons + "View All" */}
      <View style={styles.boxContainer}>
        {/* 1) Carousel */}
        <View style={styles.carouselContainer}>
          <ScrollView
            ref={scrollRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 30 }}
          >
            {carouselData.map(renderCarouselItem)}
          </ScrollView>
          <View style={styles.paginationDots}>
            {/* Simple static dots; you can make these dynamic */}
            <View style={[styles.dot, styles.dotActive]} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>
        </View>

        {/* "View All Services ›" */}
        <TouchableOpacity
          style={styles.viewAllContainer}
          onPress={() => navigation.navigate("Services")}
        >
          <Text style={styles.viewAllText}>View All Services ›</Text>
        </TouchableOpacity>

        {/* 2) Row of service icons */}
        <View style={styles.iconRowContainer}>
          {serviceIcons.map((svc) => (
            <TouchableOpacity
              key={svc.key}
              style={styles.iconCircle}
              onPress={() => navigation.navigate("Services")}
            >
              <Image source={svc.icon} style={styles.iconImage} resizeMode="contain" />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* 3) Trending News Section */}
      <View style={styles.trendingContainer}>
        <Text style={styles.trendingHeader}>Trending News Articles</Text>
        <FlatList
          data={trendingNews}
          keyExtractor={(item) => item.id}
          renderItem={renderNewsItem}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Overall screen background
  container: {
    flex: 1,
    backgroundColor: "#e0e0e0",
    paddingTop: 16,
  },

  // The white "box" that holds carousel + icons + View All
  boxContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginHorizontal: 16,
    paddingBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },

  // Carousel area
  carouselContainer: {
    marginTop: 16,
  },
  carouselItem: {
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 16,
    marginRight: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  carouselText: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    marginRight: 12,
  },
  carouselIcon: {
    width: 48,
    height: 48,
  },
  paginationDots: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#bbb",
    marginHorizontal: 4,
  },
  dotActive: {
    backgroundColor: "#333",
  },

  // "View All Services ›" link
  viewAllContainer: {
    alignSelf: "flex-end",
    marginRight: 24,
    marginTop: 12,
  },
  viewAllText: {
    fontSize: 14,
    color: "#FF8C00",
    fontWeight: "600",
  },

  // Row of icons
  iconRowContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 12,
    marginHorizontal: 16,
  },
  iconCircle: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f2f2f2",
    width: 72,
    height: 72,
    borderRadius: 36,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2,
  },
  iconImage: {
    width: 40,
    height: 40,
  },

  // Trending News section
  trendingContainer: {
    flex: 1,
    marginTop: 24,
  },
  trendingHeader: {
    fontSize: 18,
    fontWeight: "700",
    marginLeft: 24,
    marginBottom: 12,
    color: "#333",
  },
  newsCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 1,
  },
  newsCardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  newsLogo: {
    width: 32,
    height: 32,
    marginRight: 12,
  },
  newsTitle: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
});
