import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { auth } from '../firebaseConfig';

export default function AccountScreen({ navigation }) {
  const handleLogout = () => {
    auth.signOut();
    Alert.alert("Logged out", "You have been logged out.");
  };

  const handleHistory = () => {
    navigation.navigate("HistoryStack");
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/profile.png')}
        style={styles.avatar}
      />

      <TouchableOpacity onPress={handleHistory} style={styles.itemRow}>
        <Text style={styles.itemText}>History</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleLogout} style={styles.itemRow}>
        <Text style={styles.itemText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    backgroundColor: '#fff',
  },
  avatar: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 40,
  },
  itemRow: {
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  itemText: {
    fontSize: 18,
    color: '#111',
  },
});
