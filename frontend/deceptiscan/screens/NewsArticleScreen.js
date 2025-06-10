import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { NEWS_SERVICE_URL } from "../config";
import { auth } from "../firebaseConfig";

export default function NewsArticleScreen() {
  const { params } = useRoute();  // articleId should be passed via navigation
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const user = auth.currentUser;
        if (!user) throw new Error("User not authenticated");
        const token = await user.getIdToken();

        const response = await fetch(`${NEWS_SERVICE_URL}/news/${params.articleId}`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error("Failed to fetch article");
        }

        const data = await response.json();
        setArticle(data);
      } catch (err) {
        Alert.alert("Error", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [params.articleId]);

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  if (!article) {
    return (
      <View style={styles.loading}>
        <Text>Unable to load article.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{article.title}</Text>

      {article.image && (
        <Image
          source={{ uri: article.image }}
          style={styles.image}
          resizeMode="contain"
        />
      )}

      <Text style={styles.body}>{article.body}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 16,
    textAlign: "center",
    color: "#222",
  },
  image: {
    width: "100%",
    height: 200,
    marginBottom: 20,
    borderRadius: 8,
  },
  body: {
    fontSize: 16,
    color: "#333",
    lineHeight: 24,
  },
});
