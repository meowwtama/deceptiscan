// ServicesScreen.js
import React, { useEffect } from 'react';
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

const services = [
  {
    id: 'LinkGuard',
    icon: <Ionicons name="link-outline" size={36} color="#33A1FD" />,
    titleEn: 'LinkGuard',
    titleZh: '链接守护',
    subtitleEn: 'Analyze suspicious URLs',
    subtitleZh: '分析可疑链接',
  },
  {
    id: 'RealOrRender',
    icon: <MaterialCommunityIcons name="image-search-outline" size={36} color="#2E5AAC" />,
    titleEn: 'RealOrRender',
    titleZh: '真假图片',
    subtitleEn: 'Identify AI-generated images',
    subtitleZh: '识别 AI 生成图片',
  },
  {
    id: 'NewsTruth',
    icon: <FontAwesome5 name="newspaper" size={36} color="#C14D3E" />,
    titleEn: 'NewsTruth',
    titleZh: '新闻真假',
    subtitleEn: 'Filter fake news articles',
    subtitleZh: '过滤假新闻文章',
  },
  {
    id: 'ScamSniffer',
    icon: <MaterialCommunityIcons name="chat-alert-outline" size={36} color="#3EBF2E" />,
    titleEn: 'ScamSniffer',
    titleZh: '诈骗探测',
    subtitleEn: 'Check messages from unknown senders',
    subtitleZh: '检查未知发件人消息',
  },
  {
    id: 'TeleDigest',
    icon: <FontAwesome5 name="telegram-plane" size={36} color="#0088CC" />,
    titleEn: 'TeleDigest',
    titleZh: '电报摘要',
    subtitleEn: 'Summarize telegram groups',
    subtitleZh: '总结电报群组',
  },
  {
    id: 'ScamWise',
    icon: <MaterialCommunityIcons name="school-outline" size={36} color="#E4C800" />,
    titleEn: 'ScamWise',
    titleZh: '诈骗智库',
    subtitleEn: 'Resources on current scams',
    subtitleZh: '当前诈骗资源',
  },
];

export default function ServicesScreen({ navigation, route }) {
  const { language } = useLanguage();

  useEffect(() => {
    if (route?.params?.screen) {
      navigation.navigate(route.params.screen);
    }
  }, [route?.params?.screen]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate(item.id)}
    >
      <View style={styles.iconWrapper}>{item.icon}</View>
      <Text style={styles.cardTitle}>
        {language === 'zh' ? item.titleZh : item.titleEn}
      </Text>
      <Text style={styles.cardSubtitle}>
        {language === 'zh' ? item.subtitleZh : item.subtitleEn}
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
          {language === 'zh' ? '服务列表' : ''}
        </Text>
        <View style={styles.spacer} />

        <FlatList
          data={services}
          renderItem={renderItem}
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
  container: { flex: 1, paddingTop: 16 },
  header: { fontSize: 24, fontWeight: '700', color: '#333', alignSelf: 'center' },
  spacer: { height: 16 },
  listContainer: { paddingBottom: 20 },
  columnWrapper: { justifyContent: 'space-between', paddingHorizontal: CARD_MARGIN },
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: CARD_MARGIN,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 3,
  },
  iconWrapper: { marginBottom: 12 },
  cardTitle: { fontSize: 16, fontWeight: '600', color: '#333', textAlign: 'center', marginBottom: 4 },
  cardSubtitle: { fontSize: 12, color: '#666', textAlign: 'center' },
});
