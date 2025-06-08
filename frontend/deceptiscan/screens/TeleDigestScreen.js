import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';

export default function TeleDigestScreen() {
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    console.log("Submitted tele group link:", message);
    // TODO: Add backend request here
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.label}>Enter a public group's t.me link:</Text>
        <TextInput
          style={styles.textArea}
          placeholder="e.g. scamgroup"
          value={message}
          onChangeText={setMessage}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />

        <View style={styles.divider} />

        <Text style={styles.label}>Or simply paste from clipboard below:</Text>
        <TouchableOpacity style={styles.clipboardBox}>
          <Ionicons name="clipboard-outline" size={40} color="#333" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D9D9D9',
    padding: 24,
    alignItems: 'center',
    paddingTop: 40,
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
});
