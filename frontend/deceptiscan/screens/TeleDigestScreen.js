import React, { useState } from 'react';
import { ScrollView } from "react-native";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { auth } from '../firebaseConfig';
import { TELEGRAM_SERVICE_URL } from '../config';  // add this

export default function TeleDigestScreen() {
  const [groupLink, setGroupLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    const trimmed = groupLink.trim();
    if (!trimmed) {
      setError('Please enter a Telegram group link.');
      return;
    }

    setLoading(true);
    setError(null);
    setSummary(null);

    try {
      // 1) Get your Firebase ID token
      const user = auth.currentUser;
      if (!user) throw new Error('You must be signed in.');
      const idToken = await user.getIdToken();

      // 2) POST to your FastAPI service
      const resp = await fetch(
        `${TELEGRAM_SERVICE_URL}/telegram/analyze`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${idToken}`,
          },
          body: JSON.stringify({ group_link: trimmed }),
        }
      );

      if (!resp.ok) {
        const text = await resp.text();
        throw new Error(`Server ${resp.status}: ${text}`);
      }
      const json = await resp.json();
      setSummary(json.summary);
    } catch (err) {
      console.error('TeleDigest error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.card}>
        <Text style={styles.label}>
          Enter a public group's t.me link:
        </Text>
        <TextInput
          style={styles.textArea}
          placeholder="e.g. scamgroup"
          value={groupLink}
          onChangeText={setGroupLink}
          multiline
          numberOfLines={2}
          textAlignVertical="top"
        />

        <View style={styles.divider} />

        <Text style={styles.label}>
          Or paste from clipboard below:
        </Text>
        <TouchableOpacity style={styles.clipboardBox}>
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

      {summary && (
        <View style={styles.resultBox}>
          <Text style={styles.resultLabel}>Group Summary:</Text>
          <Text style={styles.resultText}>{summary}</Text>
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
    minHeight: 60,
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
    width: '100%',
    maxWidth: 400,
  },
  resultLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  resultText: {
    fontSize: 14,
  },
});
