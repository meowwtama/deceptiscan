import React, { useState, useEffect } from 'react';


import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  ScrollView,
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

  // 0. Always ask permission on mount (all platforms)
  useEffect(() => {
    (async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission required',
          'We need permission to access your photos to upload images.'
        );
      }
    })();
  }, []);

  // 1. Pick an image
  const handleUpload = async () => {
    setPrediction(null);
    setError(null);
    console.log('Opening image picker…');

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
      });

      if (result.cancelled) {
        console.log('ImagePicker cancelled');
        return;
      }
      const uri =
        result.uri ?? // old versions
        (Array.isArray(result.assets) && result.assets[0].uri); // new versions

      if (!uri) {
        console.error('Could not find URI in picker result', result);
        Alert.alert('Error', 'Could not read the selected image.');
        return;
      }

      console.log('Picked image URI:', uri);
      setLocalUri(uri);
    } catch (e) {
      console.error('Error launching image picker:', e);
      Alert.alert('Error', 'Could not open image library.');
    }
  };

  // 2. Upload + predict
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

      // prepare form-data
      const filename = localUri.split('/').pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image';

      const form = new FormData();
      form.append('file', { uri: localUri, name: filename, type });

      console.log('Uploading to', `${AI_IMAGE_DETECTOR_SERVICE_URL}/images/upload`);
      let resp = await fetch(
        `${AI_IMAGE_DETECTOR_SERVICE_URL}/images/upload`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${idToken}`,
          },
          body: form,
        }
      );
      if (!resp.ok) throw new Error(`Upload failed: ${resp.status}`);
      const { filename: savedName } = await resp.json();
      console.log('Upload success:', savedName);

      // now predict
      console.log(
        'Predicting via',
        `${AI_IMAGE_DETECTOR_SERVICE_URL}/images/predict/${savedName}`
      );
      resp = await fetch(
        `${AI_IMAGE_DETECTOR_SERVICE_URL}/images/predict/${savedName}`,
        {
          method: 'GET',
          headers: { Authorization: `Bearer ${idToken}` },
        }
      );
      if (!resp.ok) throw new Error(`Predict failed: ${resp.status}`);
      const json = await resp.json();
      console.log('Prediction:', json);
      setPrediction(json);
    } catch (e) {
      console.error('handleSubmit error:', e);
      setError(e.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.card}>
        <Text style={styles.label}>
          Upload an image to check for AI usage:
        </Text>

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
        {uploading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitText}>Submit</Text>
        )}
      </TouchableOpacity>

      {error && <Text style={styles.error}>{error}</Text>}

      {prediction && (
        <View
          style={[
            styles.resultBox,
            prediction.predicted_label === 'real'
              ? styles.safeBox
              : styles.scamBox,
          ]}
        >
          <Text style={styles.titleText}>
            AI Probability
          </Text>
          {prediction.probabilities[0][1] !== null && (
            <View style={{ marginTop: -10, marginBottom: 8, alignItems: "center" }}>
              <AnimatedCircularProgress percentage={prediction.probabilities[0][1] * 100} />
            </View>
          )}
          <Text style={styles.probabilityText}>
            <Text style={styles.labelText}>Label: </Text>
            <Text style={prediction.predicted_label === 'real' ? styles.safeText : styles.scamText}>
              {prediction.predicted_label === 'real' ? 'Real' : 'Not Real'}
            </Text>
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D9D9D9',
  },
  scrollContent: {
    padding: 24,
    paddingTop: 40,
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    marginBottom: 40,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 20,
  },
  imageBox: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  preview: {
    width: 160,
    height: 160,
    borderRadius: 8,
  },
  submitButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 30,
    alignSelf: 'center',
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  error: {
    marginTop: 12,
    color: 'red',
    textAlign: 'center',
  },
  resultText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  resultImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginTop: 12,
  },
  resultBox: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 3,
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  safeBox: {
    borderColor: '#00b300',
  },
  scamBox: {
    borderColor: '#ff4d4d',
  },
  probabilityText: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    color: '#333',
  },
  titleText: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    color: '#333',
    textAlign: 'center'
  },
  resultText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  safeText: {
  color: 'green',
  },
  scamText: {
    color: 'red',
  },
  labelText: {
    color: "#000"
  }
});
