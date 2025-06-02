// ./screens/AccountScreen.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function AccountScreen() {
  return (
    <View style={styles.centered}>
      <Text style={styles.text}>Account Page (coming soon!)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 16,
    color: "#444",
  },
});
