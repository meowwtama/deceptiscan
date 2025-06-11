// OverallHistoryScreen.js
import React from 'react';
import {
  SafeAreaView,
  FlatList,
  View,
  Text,
  StyleSheet,
  Dimensions,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { useLanguage } from '../contexts/LanguageContext';

const { width } = Dimensions.get('window');
const CARD_MARGIN = 16;
const CARD_WIDTH = (width - CARD_MARGIN * 3) / 2;

const historyList = [
  {
    id: 'LinkGuard History',
    route: 'LinkGuard History',
    icon: <Ionicons name="link-outline" size={48} color="#33A1FD" />,
    labelEn: 'LinkGuard History',
    labelZh: '链接守护 历史',
    descEn: 'Past URL analysis results',
    descZh: '过去的链接分析结果',
  },
  {
    id: 'RealOrRender History',
    route: 'RealOrRender History',
    icon: <MaterialCommunityIcons name="image-search-outline" size={48} color="#2E5AAC" />,
    labelEn: 'RealOrRender History',
    labelZh: '真假图片 历史',
    descEn: 'Past image analysis results',
    descZh: '过去的图片分析结果',
  },
  {
    id: 'NewsTruth History',
    route: 'NewsTruth History',
    icon: <FontAwesome5 name="newspaper" size={48} color="#C14D3E" />,
    labelEn: 'NewsTruth History',
    labelZh: '新闻真假 历史',
    descEn: 'Past article verifications',
    descZh: '过去的文章验证结果',
  },
  {
    id: 'ScamSniffer History',
    route: 'ScamSniffer History',
    icon: <MaterialCommunityIcons name="chat-alert-outline" size={48} color="#3EBF2E" />,
    labelEn: 'ScamSniffer History',
    labelZh: '诈骗探测 历史',
    descEn: 'Past message analysis results',
    descZh: '过去的消息分析结果',
  },
  {
    id: 'TeleDigest History',
    route: 'TeleDigest History',
    icon: <FontAwesome5 name="telegram-plane" size={48} color="#0088CC" />,
    labelEn: 'TeleDigest History',
    labelZh: '电报摘要 历史',
    descEn: 'Past telegram group analyses',
    descZh: '过去的电报群组分析结果',
  },
];

export default function OverallHistoryScreen({ navigation }) {
  const { language } = useLanguage();

  const renderHistoryItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate(item.route)}
    >
      <View style={styles.iconWrapper}>{item.icon}</View>
      <Text style={styles.cardTitle}>
        {language === 'zh' ? item.labelZh : item.labelEn}
      </Text>
      <Text style={styles.cardDesc}>
        {language === 'zh' ? item.descZh : item.descEn}
      </Text>
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={require('../assets/bg.png')}
      style={styles.background}
      imageStyle={{ opacity: 0.1 }}
    >
      <SafeAreaView style={styles.container}>
        <Text style={styles.header}>
          {language === 'zh' ? '历史记录' : 'History'}
        </Text>
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
  background: { flex: 1, backgroundColor: '#F0F4F8' },
  container: { flex: 1, paddingTop: 24 },

  header: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    alignSelf: 'center',
  },
  spacer: { height: 16 },

  listContainer: { paddingBottom: 20 },
  columnWrapper: { justifyContent: 'space-between', paddingHorizontal: CARD_MARGIN },

  card: {
    width: CARD_WIDTH,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: CARD_MARGIN,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2,
  },
  iconWrapper: { marginBottom: 12 },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 12,
    color: '#555',
    textAlign: 'center',
  },
});
