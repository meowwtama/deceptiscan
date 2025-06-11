// NewsTruthScreen.js
import React, { useRef, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ImageBackground,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppLoading from 'expo-app-loading';
import * as Clipboard from 'expo-clipboard';
import { useFonts, FredokaOne_400Regular } from '@expo-google-fonts/fredoka-one';
import { auth } from '../firebaseConfig';
import { FAKE_NEWS_DETECTOR_URL } from '../config';
import AnimatedCircularProgress from './AnimatedCircularProgress';

export default function NewsTruthScreen() {
  let [fontsLoaded] = useFonts({ FredokaOne_400Regular });
  const [articleUrl, setArticleUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [classification, setClassification] = useState(null);
  const [fake_probability, setFakeProbability] = useState(null);
  const [result, setResult] = useState(null);

  if (!fontsLoaded) return <AppLoading />;

  const handleClipboardPaste = async () => {
    try {
      const text = await Clipboard.getStringAsync();
      if (text) setArticleUrl(text);
    } catch {
      setError("Failed to read from clipboard.");
    }
  };

  const handleCheckNews = async () => {
    if (!articleUrl.trim()) {
      setError('Please enter a news article URL');
      return;
    }
    setLoading(true); setError(null); setResult(null); setClassification(null); setFakeProbability(null);

    try {
      const user = auth.currentUser;
      if (!user) throw new Error('You must be signed in');
      const idToken = await user.getIdToken();
      const response = await fetch(`${FAKE_NEWS_DETECTOR_URL}/news/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${idToken}` },
        body: JSON.stringify({ url: articleUrl }),
      });
      if (!response.ok) throw new Error(`Error ${response.status}: ${await response.text()}`);
      const data = await response.json();
      setResult(data.explanation);
      setClassification(data.classification);
      setFakeProbability(data.fake_probability);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require('../assets/bg.png')}
      style={styles.background}
      imageStyle={{ opacity: 0.1 }}
    >
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.card}>
            <Text style={styles.label}>Enter a news article URL:</Text>
            <TextInput
              style={styles.input}
              placeholder="https://news-site.com/article"
              value={articleUrl}
              onChangeText={setArticleUrl}
              autoCapitalize="none"
            />

            <View style={styles.divider} />

            <Text style={styles.label}>Or paste from clipboard below:</Text>
            <TouchableOpacity style={styles.clipboardBox} onPress={handleClipboardPaste}>
              <Ionicons name="clipboard-outline" size={40} color="#333" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.submitButton, loading && { opacity: 0.6 }]}
            onPress={handleCheckNews}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitText}>Submit</Text>}
          </TouchableOpacity>

          {error && <Text style={styles.error}>{error}</Text>}

          {(classification || fake_probability !== null || result) && (
            <View style={[styles.resultBox,
                  classification === 'Fake' ? styles.scamBox : styles.safeBox]}>
              {fake_probability !== null && (
                <>
                  <Text style={styles.titleLabel}>Fake Probability</Text>
                  <View style={styles.progressContainer}>
                    <AnimatedCircularProgress percentage={fake_probability * 100} />
                  </View>
                </>
              )}
              {classification && (
                <Text style={styles.resultLabel}>
                  <Text>Classification: </Text>
                  <Text style={classification === 'Real' ? styles.safeText : styles.scamText}>
                    {classification}
                  </Text>
                </Text>
              )}
              {result && (
                <Text>
                  <Text style={styles.resultTitle}>Analysis: </Text>
                  <Text style={styles.resultText}>{result}</Text>
                </Text>
              )}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background:      { flex: 1, backgroundColor: '#F0F4F8' },
  safe:            { flex: 1 },
  scrollContent:   { padding: 24, alignItems: 'center' },

  card:            { backgroundColor: '#fff', borderRadius: 16, padding: 24, width: '100%', maxWidth: 400, marginBottom: 32 },
  label:           { fontSize: 14, fontWeight: '500', marginBottom: 10 },
  input:           { borderWidth: 1, borderColor: '#aaa', borderRadius: 8, padding: 12, marginBottom: 20 },
  divider:         { height: 1, backgroundColor: '#ccc', marginVertical: 20 },
  clipboardBox:    { alignSelf: 'center', borderWidth: 1, borderColor: '#333', borderRadius: 12, padding: 24, marginTop: 12 },

  submitButton:    { backgroundColor: '#007BFF', paddingVertical: 14, paddingHorizontal: 32, borderRadius: 30, alignSelf: 'center' },
  submitText:      { color: '#fff', fontSize: 16, fontWeight: '600' },
  error:           { marginTop: 12, color: 'red', textAlign: 'center' },

  resultBox:       { marginTop: 20, padding: 16, backgroundColor: '#fff', borderRadius: 8, borderWidth: 3, width: '100%', maxWidth: 400 },
  titleLabel:      { fontSize: 18, fontWeight: '600', marginBottom: 8, textAlign: 'center' },
  progressContainer:{ marginTop: -10, marginBottom: 8, alignItems: 'center' },
  resultLabel:     { fontSize: 18, fontWeight: '600', marginBottom: 8 },
  resultTitle:     { fontSize: 14, color: '#666', marginBottom: 8, fontWeight: '600' },
  resultText:      { fontSize: 14, color: '#666', marginBottom: 8 },
  safeBox:         { borderColor: '#00b300' },
  scamBox:         { borderColor: '#ff4d4d' },
  safeText:        { color: 'green' },
  scamText:        { color: 'red' },

  newsImage:       { width: '100%', height: 180, resizeMode: 'cover', borderWidth: 1, borderColor: '#000' },
});
