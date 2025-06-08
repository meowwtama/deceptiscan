import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';

export default function RealOrRenderScreen() {
  const [image, setImage] = useState(null);

  const handleUpload = () => {
    console.log("Image upload tapped");
    // Implement image picker or clipboard paste logic here
  };

  const handleSubmit = () => {
    console.log("Submit tapped with image:", image);
    // Implement fetch to backend
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.label}>Upload an image to check for AI usage:</Text>

        <TouchableOpacity style={styles.imageBox} onPress={handleUpload}>
          <Image
            source={require('../assets/AddImage.png')} 
            style={styles.uploadIcon}
            resizeMode="contain"
          />
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
    paddingTop: 40, 
  },
  header: {
    fontSize: 22,
    fontWeight: '700',
    alignSelf: 'center',
    marginBottom: 24,
    color: '#333',
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
    color: '#333',
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
  uploadIcon: {
    width: 72,
    height: 72,
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
