import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { auth } from "../firebaseConfig";
import { HISTORY_SERVICE_URL } from "../config";

export default function LinkGuardHistoryScreen() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("You must be signed in");
      const idToken = await user.getIdToken();

      const response = await fetch(
        `${HISTORY_SERVICE_URL}/history/linkAnalyser`,
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${await response.text()}`);
      }

      const data = await response.json();
      setHistory(data);
    } catch (err) {
      console.error("Failed to fetch history:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderHistoryItem = ({ item }) => {
    let dateString = "No date";
    if (item.createdAt) {
      try {
        if (typeof item.createdAt === 'object' && item.createdAt.toDate) {
          dateString = new Date(item.createdAt.toDate()).toLocaleDateString();
        } else if (item.createdAt._seconds) {
          dateString = new Date(item.createdAt._seconds * 1000).toLocaleDateString();
        } else {
          dateString = new Date(item.createdAt).toLocaleDateString();
        }
      } catch (err) {
        console.error('Error parsing date:', err);
        dateString = "Invalid date";
      }
    }

    return (
      <View style={styles.historyCard}>
        <Text style={styles.urlText}>URL: {item.url}</Text>
        <Text style={styles.safetyText}>
          Safe: {item.safe ? "Yes" : "No"}
        </Text>
        <Text style={styles.issuesText}>
          Issues: {item.issues?.join(", ")}
        </Text>
        <Text style={styles.dateText}>{dateString}</Text>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={history}
        renderItem={renderHistoryItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No history found</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContainer: {
    padding: 16,
  },
  historyCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  messageText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
  },
  classificationText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  summaryText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  urlText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
  },
  safetyText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  issuesText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  dateText: {
    fontSize: 12,
    color: "#999",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    margin: 16,
  },
  emptyText: {
    textAlign: "center",
    color: "#666",
    marginTop: 32,
  },
});