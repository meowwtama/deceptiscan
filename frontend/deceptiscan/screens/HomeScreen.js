// HomeScreen.js
import React, { useState } from 'react';
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
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AppLoading from 'expo-app-loading';
import { useFonts, FredokaOne_400Regular } from '@expo-google-fonts/fredoka-one';
import { useLanguage } from '../contexts/LanguageContext';

const { width } = Dimensions.get('window');
const CARD_RADIUS = 16;
const CARD_WIDTH = width * 0.9;
const CARD_SPACING = 16;

const tips = [
  { id: '1', header: '🚨 Watch Out for Phishy SMS!', image: require('../assets/tip1.png') },
  { id: '2', header: '🔒 Secure Your Wi-Fi!', image: require('../assets/tip2.jpg') },
  { id: '3', header: '🔧 Get Anti-virus Software!', image: require('../assets/tip3.jpg') },
];

const topServices = [
  { id: 'NewsTruth', icon: 'newspaper-variant-outline', labelEn: 'NewsTruth', labelZh: '新闻真假' },
  { id: 'RealOrRender', icon: 'image-outline', labelEn: 'RealOrRender', labelZh: '真假图片' },
  { id: 'ScamSniffer', icon: 'chat-alert-outline', labelEn: 'ScamSniffer', labelZh: '诈骗探测' },
];

const trending = [
  { id: '1', title: 'Latest scams in Singapore', subtitle: 'ScamTracker', image: require('../assets/news1.avif'), url: 'https://www.straitstimes.com/singapore/scam-tracker-what-are-the-latest-trends-in-spore-and-how-much-money-has-been-lost' },
  { id: '2', title: 'Bank SMS Scam Targets Seniors', subtitle: 'Daily News', image: require('../assets/news2.png'), url: 'https://example.com/2' },
  { id: '3', title: '5 Tips to Harden Your Wi-Fi', subtitle: 'Tech Today', image: require('../assets/wifirouter.jpg'), url: 'https://example.com/3' },
];

export default function HomeScreen({ navigation }) {
  const [activeTip, setActiveTip] = useState(0);
  let [fontsLoaded] = useFonts({ FredokaOne_400Regular });
  const { language } = useLanguage();

  if (!fontsLoaded) return <AppLoading />;

  const onTipScroll = e => {
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
    <ImageBackground
      source={require('../assets/bg.png')}
      style={styles.background}
      imageStyle={{ opacity: 0.1 }}
    >
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <View style={{ height: 16 }} />

          <FlatList
            data={tips}
            keyExtractor={t => t.id}
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

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {language === 'zh' ? '最受欢迎的服务' : 'Most Popular Services'}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Services')}>
              <Text style={styles.viewAllText}>
                {language === 'zh' ? '查看全部' : 'View All'}
              </Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingLeft: 16, marginBottom: 24 }}>
            {topServices.map(s => (
              <TouchableOpacity
                key={s.id}
                style={styles.servicePill}
                onPress={() => navigation.navigate('Services', { screen: s.id })}
              >
                <MaterialCommunityIcons name={s.icon} size={22} color="#2575FC" />
                <Text style={styles.serviceText}>
                  {language === 'zh' ? s.labelZh : s.labelEn}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={styles.trendingHeader}>
            {language === 'zh' ? '热门新闻文章' : 'Trending News Articles'}
          </Text>
          <View style={{ paddingHorizontal: 16, paddingBottom: 24 }}>
            {trending.map(a => (
              <TouchableOpacity key={a.id} style={styles.newsCard} onPress={() => a.url && Linking.openURL(a.url)}>
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
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, backgroundColor: '#F0F4F8' },
  container: { flex: 1 },

  tipCard: { borderRadius: CARD_RADIUS, overflow: 'hidden', marginBottom: 16, justifyContent: 'flex-end' },
  tipOverlay: { backgroundColor: 'rgba(0,0,0,0.3)', padding: 12 },
  tipHeader: { fontSize: 18, color: '#fff', fontFamily: 'FredokaOne_400Regular' },

  dots: { flexDirection: 'row', justifyContent: 'center', marginVertical: 8 },
  dot: { width: 12, height: 4, borderRadius: 2, marginHorizontal: 4, backgroundColor: '#CCC' },
  dotActive: { backgroundColor: '#2575FC' },
  dotInactive: {},

  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 16, marginBottom: 8 },
  sectionTitle: { fontSize: 20, fontWeight: '800', color: '#333' },
  viewAllText: { fontSize: 14, color: '#2575FC', textDecorationLine: 'underline' },

  servicePill: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, marginRight: 12, shadowColor: '#000', shadowOpacity: 0.03, shadowOffset: { width: 0, height: 2 }, shadowRadius: 6, elevation: 2 },
  serviceText: { marginLeft: 8, fontSize: 14, fontWeight: '600', color: '#2575FC' },

  trendingHeader: { fontSize: 20, fontWeight: '800', color: '#333', marginLeft: 16, marginBottom: 12 },
  newsCard: { backgroundColor: '#fff', borderRadius: CARD_RADIUS, overflow: 'hidden', marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.03, shadowOffset: { width: 0, height: 2 }, shadowRadius: 6, elevation: 2 },
  newsImage: { width: '100%', height: 180, resizeMode: 'cover', borderWidth: 1, borderColor: '#000' },
  newsText: { padding: 12 },
  newsTitle: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 4 },
  newsSubtitle: { fontSize: 12, color: '#666' },
});
