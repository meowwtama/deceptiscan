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

const { width } = Dimensions.get('window');
const CARD_MARGIN = 16;
const CARD_WIDTH = (width - CARD_MARGIN * 4) / 2; // adjust for even padding

const services = [
  {
    id: 'LinkGuard',
    title: 'LinkGuard',
    subtitle: 'Analyze suspicious URLs',
    icon: <Ionicons name="link-outline" size={36} color="#33A1FD" />,
  },
  {
    id: 'RealOrRender',
    title: 'RealOrRender',
    subtitle: 'Identify AI-generated images',
    icon: <MaterialCommunityIcons name="image-search-outline" size={36} color="#2E5AAC" />,
  },
  {
    id: 'NewsTruth',
    title: 'NewsTruth',
    subtitle: 'Filter fake news articles',
    icon: <FontAwesome5 name="newspaper" size={36} color="#C14D3E" />,
  },
  {
    id: 'ScamSniffer',
    title: 'ScamSniffer',
    subtitle: 'Check messages from unknown senders',
    icon: <MaterialCommunityIcons name="chat-alert-outline" size={36} color="#3EBF2E" />,
  },
  {
    id: 'TeleDigest',
    title: 'TeleDigest',
    subtitle: 'Summarize telegram groups',
    icon: <FontAwesome5 name="telegram-plane" size={36} color="#0088CC" />,
  },
  {
    id: 'ScamWise',
    title: 'ScamWise',
    subtitle: 'Resources on current scams',
    icon: <MaterialCommunityIcons name="school-outline" size={36} color="#E4C800" />,
  },
];

export default function ServicesScreen({ navigation, route }) {
  useEffect(() => {
    if (route?.params?.screen) {
      navigation.navigate(route.params.screen);
    }
  }, [route?.params?.screen]);

  return (
    <ImageBackground
      source={require('../assets/bg.png')}
      style={styles.background}
      imageStyle={{ opacity: 0.1 }}
    >
      <SafeAreaView style={styles.container}>
        <FlatList
          data={services}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate(item.id)}
            >
              <View style={styles.iconWrapper}>{item.icon}</View>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.subtitle}>{item.subtitle}</Text>
            </TouchableOpacity>
          )}
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
  background:    { flex: 1, backgroundColor: '#F0F4F8' },
  container:     { flex: 1 },
  header:        {
                   fontSize: 24,
                   fontWeight: '600',
                   color: '#333',
                   alignSelf: 'center',
                   marginVertical: 16,
                  },
  listContainer: {
                   paddingBottom: 20,
                  },
  columnWrapper: {
                   justifyContent: 'space-evenly',
                   paddingHorizontal: CARD_MARGIN,
                  },
  card:          {
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
  iconWrapper:   { marginBottom: 12 },
  title:         {
                   fontSize: 16,
                   fontWeight: '600',
                   color: '#333',
                   textAlign: 'center',
                   marginBottom: 6,
                  },
  subtitle:      {
                   fontSize: 12,
                   color: '#666',
                   textAlign: 'center',
                  },
});
