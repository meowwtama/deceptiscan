import React, { useState, useEffect } from "react";
import { ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { auth } from "../firebaseConfig";
import { LINK_ANALYSER_SERVICE_URL } from "../config";
import { useLanguage } from '../contexts/LanguageContext';
import { useRoute } from '@react-navigation/native';

export default function LinkGuardScreen() {
  const { language } = useLanguage();
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const route = useRoute();

  const labelUrl = language === 'zh' ? '输入要检查的链接：' : 'Enter a URL to check:';
  const pasteLabel = language === 'zh' ? '或从剪贴板粘贴：' : 'Or paste from clipboard:';
  const submitText = language === 'zh' ? '提交' : 'Submit';
  const statusText = language === 'zh' ? '安全状态：' : 'Safety Status: ';
  const issuesText = language === 'zh' ? '发现问题：' : 'Identified Issues: ';
  const redirectsText = language === 'zh' ? '重定向详情：' : 'Redirect Details:';
  const noRedirectText = language === 'zh' ? '未检测到重定向' : 'No redirects detected';

  useEffect(() => {
    if (route.params?.link) {
      const linkFromScamSniffer = route.params.link;
      setUrl(linkFromScamSniffer);
      // Auto-submit after setting the URL
      setTimeout(() => {
        handleSubmitWithUrl(linkFromScamSniffer);
      }, 100);
    }
  }, [route.params]);

  const handleClipboardPaste = async () => {
    try {
      const text = await Clipboard.getStringAsync();
      if (text) setUrl(text);
    } catch (e) {
      console.error("Clipboard read failed:", e);
      setError(language === 'zh' ? '无法读取剪贴板。' : 'Failed to read from clipboard.');
    }
  };

  const handleSubmitWithUrl = async (urlToSubmit) => {
    if (!urlToSubmit) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const user = auth.currentUser;
      if (!user) throw new Error(language === 'zh' ? '您必须先登录。' : 'You must be signed in');

      const idToken = await user.getIdToken();
      const response = await fetch(`${LINK_ANALYSER_SERVICE_URL}/link/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}`,
        },
        body: JSON.stringify({ url: urlToSubmit }),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`${language === 'zh' ? '错误' : 'Error'} ${response.status}: ${text}`);
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  const handleSubmit = async () => {
    await handleSubmitWithUrl(url);
  };

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.card}>
        <Text style={styles.label}>{labelUrl}</Text>
        <TextInput
          style={styles.input}
          placeholder="https://example.com"
          autoCapitalize="none"
          value={url}
          onChangeText={setUrl}
        />

        <View style={styles.divider} />

        <Text style={styles.label}>{pasteLabel}</Text>
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
          <Text style={styles.submitText}>{submitText}</Text>
        )}
      </TouchableOpacity>

      {error && <Text style={styles.error}>{error}</Text>}

      {result && (
        <View
          style={[
            styles.resultBox,
            !result.safe ? styles.scamBox : styles.safeBox,
          ]}
        >
          <Text style={styles.resultText}>
            <Text style={styles.labelText}>{statusText}</Text>
            <Text style={result.safe ? styles.safeText : styles.scamText}>
              {result.safe 
                ? (language === 'zh' ? '安全' : 'Safe') 
                : (language === 'zh' ? '潜在不安全' : 'Potentially Unsafe')}
            </Text>
          </Text>
          <Text style={styles.resultText}>
            <Text style={styles.labelText}>{issuesText}</Text>
            {result.issues?.length 
              ? result.issues.join(', ') 
              : (language === 'zh' ? '无' : 'None')}
          </Text>

          <Text style={styles.resultText}>{redirectsText}</Text>
          {Array.isArray(result.url_chain) && result.url_chain.length > 0 ? (
            result.url_chain.map((line, idx) => (
              <Text key={idx} style={styles.resultTextNB}>
                • {line}
              </Text>
            ))
          ) : (
            <Text style={styles.resultTextNB}>{noRedirectText}</Text>
          )}
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
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    padding: 12,
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
  resultText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  resultTextNB: {
    fontSize: 14,
    marginBottom: 6,
    color: '#333',
  },
  error: {
    marginTop: 12,
    color: 'red',
    textAlign: 'center',
  },
  safeBox: {
    borderColor: '#00b300',
  },
  scamBox: {
    borderColor: '#ff4d4d',
  },
  safeText: {
    color: 'green',
  },
  scamText: {
    color: 'red',
  },
  labelText: {
    color: '#000',
    fontWeight: '700',
  },
});
