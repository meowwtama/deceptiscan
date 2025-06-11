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
import { Picker } from '@react-native-picker/picker';
import { auth } from '../firebaseConfig';
import { useLanguage } from '../contexts/LanguageContext';

export default function AccountScreen({ navigation }) {
  const [username, setUsername] = useState('Guest');
  const { language, setLanguage } = useLanguage();

  useEffect(() => {
    const u = auth.currentUser;
    if (u) {
      setUsername(
        u.isAnonymous ?
          (language === 'zh' ? '访客' : 'Guest') :
          (u.displayName || u.email || (language === 'zh' ? '访客' : 'Guest'))
      );
  }}, [language]);

  const handleLogout = () => {
    auth.signOut();
    Alert.alert(
      language === 'zh' ? '登出成功' : 'Logged out',
      language === 'zh' ? '您已登出。' : 'You have been logged out.'
    );
  };

  const handleHistory = () => {
    navigation.navigate('HistoryStack');
  };

  return (
    <ImageBackground
      source={require('../assets/bg.png')}
      style={styles.background}
      imageStyle={{ opacity: 0.1 }}
    >
      <View style={styles.container}>
        <Text style={styles.username}>{username}</Text>

        <Image
          source={require('../assets/profile.png')}
          style={styles.avatar}
        />

        <Text style={styles.label}>{language === 'zh' ? '语言' : 'Language'}</Text>
        <Picker
          selectedValue={language}
          onValueChange={(lang) => setLanguage(lang)}
          style={styles.picker}
        >
          <Picker.Item label="English" value="en" />
          <Picker.Item label="中文" value="zh" />
        </Picker>

        <TouchableOpacity onPress={handleHistory} style={styles.itemRow}>
          <Text style={styles.itemText}>
            {language === 'zh' ? '历史记录' : 'History'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleLogout} style={styles.itemRow}>
          <Text style={styles.itemText}>
            {language === 'zh' ? '登出' : 'Log Out'}
          </Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, backgroundColor: '#F0F4F8' },
  container: { flex: 1, alignItems: 'center', paddingTop: 60 },
  username: { fontSize: 20, fontWeight: '600', color: '#333', marginBottom: 12 },
  avatar: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
    borderRadius: 60,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 20,
  },
  label: { fontSize: 16, fontWeight: '500', color: '#333', marginBottom: 8 },
  picker: { width: 200, marginBottom: 30 },
  itemRow: {
    width: '100%',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  itemText: { fontSize: 18, color: '#111' },
});
