// ScamSnifferScreen.js
import React, { useState } from 'react';
import { ScrollView, ImageBackground } from "react-native";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from "expo-clipboard";
import { auth } from '../firebaseConfig';
import { MESSAGE_ANALYSER_SERVICE_URL } from '../config';
import AnimatedCircularProgress from './AnimatedCircularProgress';

export default function ScamSnifferScreen() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleClipboardPaste = async () => {
    try {
      const text = await Clipboard.getStringAsync();
      if (text) setMessage(text);
    } catch (e) {
      console.error("Clipboard read failed:", e);
      setError("Failed to read from clipboard.");
    }
  };

  const handleSubmit = async () => {
    if (!message.trim()) {
      setError('Please enter a message to analyze.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const user = auth.currentUser;
      if (!user) throw new Error('You must be signed in');
      const idToken = await user.getIdToken();

      const resp = await fetch(
        `${MESSAGE_ANALYSER_SERVICE_URL}/message/analyze`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${idToken}`,
          },
          body: JSON.stringify({ message }),
        }
      );

      if (!resp.ok) {
        const text = await resp.text();
        throw new Error(`Server error ${resp.status}: ${text}`);
      }

      const json = await resp.json();
      setResult(json);
    } catch (err) {
      console.error('ScamSniffer error:', err);
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
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.card}>
          <Text style={styles.label}>
            Enter a message to check if it is a scam:
          </Text>
          <TextInput
            style={styles.textArea}
            placeholder="e.g. You've won a prize! Click this link..."
            value={message}
            onChangeText={setMessage}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />

          <View style={styles.divider} />

          <Text style={styles.label}>
            Or paste from clipboard below:
          </Text>
          <TouchableOpacity style={styles.clipboardBox} onPress={handleClipboardPaste}>
            <Ionicons name="clipboard-outline" size={40} color="#333" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.submitButton, loading && { opacity: 0.6 }]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitText}>Submit</Text>
          )}
        </TouchableOpacity>

        {error && <Text style={styles.error}>{error}</Text>}

        {result && (
          <View
            style={[
              styles.resultBox,
              result.classification === 'Scam'
                ? styles.scamBox
                : styles.safeBox,
            ]}
          >
            <Text style={styles.titleText}>
              Scam Probability:
            </Text>
            {result.scam_probability !== null && (
              <View style={styles.progressContainer}>
                <AnimatedCircularProgress percentage={result.scam_probability * 100} />
              </View>
            )}
            <Text style={styles.probabilityText}>
              <Text style={styles.labelText}>Classification: </Text>
              <Text style={result.classification === 'Safe' ? styles.safeText : styles.scamText}>
                {result.classification}
              </Text>
            </Text>
            <Text style={styles.resultText}>
              Summary: {result.summary}
            </Text>
          </View>
        )}
      </ScrollView>
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
    backgroundColor: 'transparent',
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
    width: '100%',
    maxWidth: 400,
    marginBottom: 32,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 10,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    padding: 12,
    minHeight: 100,
    marginBottom: 20,
  },
  divider: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 20,
  },
  clipboardBox: {
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 12,
    padding: 24,
    marginTop: 12,
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
  progressContainer: {
    marginTop: -10,
    marginBottom: 8,
    alignItems: 'center',
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
    textAlign: 'center',
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
