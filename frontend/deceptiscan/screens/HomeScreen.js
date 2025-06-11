// HomeScreen.js
import React, { useRef, useState } from "react";
import {
  SafeAreaView,
  FlatList,
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AppLoading from "expo-app-loading";
import { useFonts, FredokaOne_400Regular } from "@expo-google-fonts/fredoka-one";

const { width } = Dimensions.get("window");
const CARD_RADIUS = 16;
const CARD_WIDTH = width * 0.9;
const CARD_SPACING = 16;

// 1. Carousel tips (now just images + overlay text)
const tips = [
  { id: "1", header: "🚨 Watch Out for Phishy SMS!", image: require("../assets/tip1.png") },
  { id: "2", header: "🔒 Secure Your Wi-Fi!",        image: require("../assets/tip2.jpg") },
  { id: "3", header: "🔧 Get Anti virus Software!",        image: require("../assets/tip3.jpg") },
];

// 2. Top 3 services
const topServices = [
  { id: "NewsTruth",    label: "NewsTruth",    icon: "newspaper" },
  { id: "RealOrRender", label: "RealOrRender", icon: "image-outline" },
  { id: "ScamSniffer",  label: "ScamSniffer",  icon: "chatbox-ellipsis-outline" },
];

// 3. Trending news
const trending = [
  { id: "1", title: "What are the latest scams in Singapore",     subtitle: "ScamTracker", image: require("../assets/news1.avif"), url: "https://www.straitstimes.com/singapore/scam-tracker-what-are-the-latest-trends-in-spore-and-how-much-money-has-been-lost" },
  { id: "2", title: "Bank SMS Scam Targets Seniors", subtitle: "Daily News",  image: require("../assets/news2.png"),     url: "https://example.com/2" },
  { id: "3", title: "5 Tips to Harden Your Wi-Fi",   subtitle: "Tech Today",  image: require("../assets/wifirouter.jpg"),    url: "https://example.com/3" },
];

export default function HomeScreen({ navigation }) {
  let [fontsLoaded] = useFonts({ FredokaOne_400Regular });
  const [activeTip, setActiveTip] = useState(0);

  if (!fontsLoaded) return <AppLoading />;

  const onTipScroll = (e) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / (CARD_WIDTH + CARD_SPACING));
    setActiveTip(idx);
  };

  const renderTip = ({ item }) => (
    <ImageBackground
      source={item.image}
      style={[styles.tipCard, { width: CARD_WIDTH, height: 180 }]}
      imageStyle={{ borderRadius: CARD_RADIUS }}
    >
      <View style={styles.tipOverlay}>
        <Text style={styles.tipHeader}>{item.header}</Text>
      </View>
    </ImageBackground>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>

        {/* Spacer */}
        <View style={{ height: 16 }} />

        {/* Tip Carousel */}
        <FlatList
          data={tips}
          keyExtractor={(t) => t.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: (width - CARD_WIDTH) / 2 }}
          snapToInterval={CARD_WIDTH + CARD_SPACING}
          decelerationRate="fast"
          snapToAlignment="start"
          ItemSeparatorComponent={() => <View style={{ width: CARD_SPACING }} />}
          onMomentumScrollEnd={onTipScroll}
          renderItem={renderTip}
        />
        <View style={styles.dots}>
          {tips.map((_, i) => (
            <View key={i} style={[styles.dot, i === activeTip ? styles.dotActive : styles.dotInactive]} />
          ))}
        </View>

        {/* Most Popular Services */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Most Popular Services</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Services")}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingLeft: 16, marginBottom: 24 }}
        >
          {topServices.map((s) => (
            <TouchableOpacity
              key={s.id}
              style={styles.servicePill}
              onPress={() => navigation.navigate("Services", { screen: s.id })}
            >
              <Ionicons name={s.icon} size={22} color="#2575FC" />
              <Text style={styles.serviceText}>{s.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Trending News */}
        <Text style={styles.trendingHeader}>Trending News Articles</Text>
        <View style={{ paddingHorizontal: 16, paddingBottom: 24 }}>
          {trending.map((a) => (
            <TouchableOpacity
              key={a.id}
              style={styles.newsCard}
              onPress={() => a.url && Linking.openURL(a.url)}
            >
              <Image source={a.image} style={styles.newsImage} />
              <View style={styles.newsText}>
                <Text style={styles.newsTitle}>{a.title}</Text>
                <Text style={styles.newsSubtitle}>{a.subtitle}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:      { flex: 1, backgroundColor: '#F0F4F8' },
  tipCard:        {
                   borderRadius: CARD_RADIUS,
                   overflow: 'hidden',
                   marginBottom: 16,
                   justifyContent: 'flex-end',
                  },
  tipOverlay:     {
                   backgroundColor: 'rgba(0,0,0,0.3)',
                   padding: 12,
                  },
  tipHeader:      {
                   fontSize: 18,
                   color: '#fff',
                   fontFamily: 'FredokaOne_400Regular',
                  },

  dots:           { flexDirection: 'row', justifyContent: 'center', marginVertical: 8 },
  dot:            { width: 12, height: 4, borderRadius: 2, marginHorizontal: 4, backgroundColor: '#CCC' },
  dotActive:      { backgroundColor: '#2575FC' },
  dotInactive:    {},

  sectionHeader:  {
                   flexDirection: 'row',
                   justifyContent: 'space-between',
                   alignItems: 'center',
                   marginHorizontal: 16,
                   marginBottom: 8,
                  },
  sectionTitle:   { fontSize: 20, fontWeight: '800', color: '#333' },
  viewAllText:    { fontSize: 14, color: '#2575FC', textDecorationLine: 'underline' },

  servicePill:    {
                   flexDirection: 'row',
                   alignItems: 'center',
                   backgroundColor: '#fff',
                   paddingVertical: 8,
                   paddingHorizontal: 16,
                   borderRadius: 20,
                   marginRight: 12,
                   shadowColor: '#000',
                   shadowOpacity: 0.03,
                   shadowOffset: { width: 0, height: 2 },
                   shadowRadius: 6,
                   elevation: 2,
                  },
  serviceText:    { marginLeft: 8, fontSize: 14, fontWeight: '600', color: '#2575FC' },

  trendingHeader: { fontSize: 20, fontWeight: '800', color: '#333', marginLeft: 16, marginBottom: 12 },
  newsCard:       {
                   backgroundColor: '#fff',
                   borderRadius: CARD_RADIUS,
                   overflow: 'hidden',
                   marginBottom: 16,
                   shadowColor: '#000',
                   shadowOpacity: 0.03,
                   shadowOffset: { width: 0, height: 2 },
                   shadowRadius: 6,
                   elevation: 2,
                  },
  newsImage:      { width: '100%', height: 180, resizeMode: 'cover', borderWidth: 1, borderColor: '#000' },
  newsText:       { padding: 12 },
  newsTitle:      { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 4 },
  newsSubtitle:   { fontSize: 12, color: '#666' },
});
