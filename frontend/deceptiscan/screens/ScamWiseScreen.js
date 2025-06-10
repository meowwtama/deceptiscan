import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';

const resources = [
  {
    id: '1',
    title: "ScamShield: Singapore’s Official Scam-Blocking App",
    description:
      "ScamShield, developed by the National Crime Prevention Council (NCPC) and the Open Government Products team, helps users detect scam messages and block calls ...",
    tag: 'News',
    image: require('../assets/sw1.png'),
  },
  {
    id: '2',
    title: "NCPC’s “Spot the Signs. Stop the Crimes.” Campaign",
    description:
      'The NCPC launched the "Spot the Signs. Stop the Crimes." campaign to help people recognize common scam tactics such as impersonation, false job offers, or fake ...',
    tag: 'News',
    image: require('../assets/sw2.png'),
  },
  {
    id: '3',
    title: "Singapore Police Force’s “Scam Alert” Videos",
    description:
      'The Singapore Police Force regularly releases videos under the “Scam Alert” initiative to show real-life scam scenarios and how people fall victim. These videos aim to raise ...',
    tag: 'Video',
    image: require('../assets/sw3.png'),
  },
];

export default function ScamWiseScreen({ navigation }) {
  const renderItem = ({ item }) => {
    const backgroundColor = item.tag === 'Video' ? '#FFE2CC' : '#D6E4FF';

    return (
      <View style={[styles.card, { backgroundColor }]}>
        <Image source={item.image} style={styles.cardImage} resizeMode="cover" />
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardDescription}>{item.description}</Text>
          <TouchableOpacity
            style={styles.viewButton}
            onPress={() => navigation.navigate('NewsArticle', { articleId: item.id })}
          >
            <Text style={styles.viewButtonText}>View</Text>
          </TouchableOpacity>
          <View style={styles.tag}>
            <Text style={styles.tagText}>{item.tag}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Education Resources that can help against scams</Text>
      <FlatList
        data={resources}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D9D9D9',
    paddingTop: 12,
    paddingHorizontal: 16,
  },
  header: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  listContainer: {
    paddingBottom: 40,
  },
  card: {
    flexDirection: 'row',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    padding: 12,
  },
  cardImage: {
    width: 90,
    height: '100%',
    borderRadius: 12,
    marginRight: 12,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontWeight: '700',
    fontSize: 16,
    color: '#222',
    marginBottom: 6,
  },
  cardDescription: {
    fontSize: 14,
    color: '#444',
    marginBottom: 10,
  },
  viewButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 6,
    paddingHorizontal: 14,
    alignSelf: 'flex-end',
    borderRadius: 10,
  },
  viewButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  tag: {
    position: 'absolute',
    bottom: 8,
    left: 0,
    backgroundColor: '#FFD700',
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '600',
  },
});
