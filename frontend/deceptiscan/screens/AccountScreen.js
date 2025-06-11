// AccountScreen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  ImageBackground,
} from 'react-native';
import { auth } from '../firebaseConfig';

export default function AccountScreen({ navigation }) {
  const [username, setUsername] = useState('Guest');

  useEffect(() => {
    const u = auth.currentUser;
    if (u) {
      if (u.isAnonymous) {
        setUsername('Guest');
      } else {
        setUsername(u.displayName || u.email || 'Guest');
      }
    }
  }, []);

  const handleLogout = () => {
    auth.signOut();
    Alert.alert("Logged out", "You have been logged out.");
  };

  const handleHistory = () => {
    navigation.navigate("HistoryStack");
  };

  return (
    <ImageBackground
      source={require('../assets/bg.png')}
      style={styles.background}
      imageStyle={{ opacity: 0.1 }}
    >
      <View style={styles.container}>
        {/* Username */}
        <Text style={styles.username}>{username}</Text>

        {/* Profile Avatar */}
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
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#F0F4F8',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 60,
  },
  username: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  avatar: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
    borderRadius: 60,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 40,
  },
  itemRow: {
    width: '100%',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  itemText: {
    fontSize: 18,
    color: '#111',
  },
});
