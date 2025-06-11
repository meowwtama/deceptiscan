// RealOrRenderScreen.js
import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  ImageBackground,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { auth } from '../firebaseConfig';
import { AI_IMAGE_DETECTOR_SERVICE_URL } from '../config';
import AnimatedCircularProgress from './AnimatedCircularProgress';

export default function RealOrRenderScreen() {
  const [localUri, setLocalUri] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission required',
          'We need permission to access your photos to upload images.'
        );
      }
    })();
  }, []);

  const handleUpload = async () => {
    setPrediction(null);
    setError(null);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
      });
      if (result.cancelled) return;
      const uri = result.assets?.[0]?.uri || result.uri;
      setLocalUri(uri);
    } catch (e) {
      Alert.alert('Error', 'Could not open image library.');
    }
  };

  const handleSubmit = async () => {
    if (!localUri) {
      Alert.alert('No image', 'Please pick an image first.');
      return;
    }
    setUploading(true);
    setError(null);
    setPrediction(null);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('You must be signed in');
      const idToken = await user.getIdToken();

      const filename = localUri.split('/').pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image';
      const form = new FormData();
      form.append('file', { uri: localUri, name: filename, type });

      let resp = await fetch(`${AI_IMAGE_DETECTOR_SERVICE_URL}/images/upload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${idToken}`,
        },
        body: form,
      });
      if (!resp.ok) throw new Error(`Upload failed: ${resp.status}`);
      const { filename: savedName } = await resp.json();

      resp = await fetch(
        `${AI_IMAGE_DETECTOR_SERVICE_URL}/images/predict/${savedName}`,
        { method: 'GET', headers: { Authorization: `Bearer ${idToken}` } }
      );
      if (!resp.ok) throw new Error(`Predict failed: ${resp.status}`);
      const json = await resp.json();
      setPrediction(json);
    } catch (e) {
      setError(e.message);
    } finally {
      setUploading(false);
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
            <Text style={styles.label}>Upload an image to check for AI usage:</Text>
            <TouchableOpacity style={styles.imageBox} onPress={handleUpload}>
              {localUri ? (
                <Image source={{ uri: localUri }} style={styles.preview} />
              ) : (
                <Ionicons name="camera" size={48} color="#888" />
              )}
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.submitButton, uploading && { opacity: 0.6 }]}
            onPress={handleSubmit}
            disabled={uploading}
          >
            {uploading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitText}>Submit</Text>}
          </TouchableOpacity>

          {error && <Text style={styles.error}>{error}</Text>}

          {prediction && (
            <View
              style={[
                styles.resultBox,
                prediction.predicted_label === 'real' ? styles.safeBox : styles.scamBox,
              ]}
            >
              <Text style={styles.titleText}>AI Probability</Text>
              <View style={styles.progressContainer}>
                <AnimatedCircularProgress percentage={prediction.probabilities[0][1] * 100} />
              </View>
              <Text style={styles.probabilityText}>
                Label:{' '}
                <Text style={prediction.predicted_label === 'real' ? styles.safeText : styles.scamText}>
                  {prediction.predicted_label === 'real' ? 'Real' : 'Not Real'}
                </Text>
              </Text>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background:       { flex: 1, backgroundColor: '#F0F4F8' },
  safe:             { flex: 1 },
  scrollContent:    { padding: 24, paddingTop: 40, alignItems: 'center' },

  card:             { backgroundColor: '#fff', borderRadius: 16, padding: 24, marginBottom: 40 },
  label:            { fontSize: 14, fontWeight: '500', marginBottom: 20 },
  imageBox:         {
                     backgroundColor: '#f9f9f9',
                     borderRadius: 8,
                     height: 180,
                     justifyContent: 'center',
                     alignItems: 'center',
                     borderWidth: 1,
                     borderColor: '#ccc',
                    },
  preview:          { width: 160, height: 160, borderRadius: 8 },

  submitButton:     { backgroundColor: '#007BFF', paddingVertical: 14, paddingHorizontal: 32, borderRadius: 30, alignSelf: 'center' },
  submitText:       { color: '#fff', fontSize: 16, fontWeight: '600' },
  error:            { marginTop: 12, color: 'red', textAlign: 'center' },

  resultBox:        { marginTop: 20, padding: 16, backgroundColor: '#fff', borderRadius: 8, borderWidth: 3, width: '100%', maxWidth: 400, alignSelf: 'center' },
  titleText:        { fontSize: 18, fontWeight: '700', marginBottom: 8, textAlign: 'center' },
  progressContainer:{ marginTop: -10, marginBottom: 8, alignItems: 'center' },
  probabilityText:  { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  safeBox:          { borderColor: '#00b300' },
  scamBox:          { borderColor: '#ff4d4d' },
  safeText:         { color: 'green' },
  scamText:         { color: 'red' },
});
