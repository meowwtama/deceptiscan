import "react-native-gesture-handler";
import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import { auth } from "./firebaseConfig";

// Screens
import HomeScreen from "./screens/HomeScreen";
import ServicesScreen from "./screens/ServicesScreen";
import AccountScreen from "./screens/AccountScreen";
import LinkGuardScreen from "./screens/LinkGuardScreen";
import RealOrRenderScreen from "./screens/RealOrRenderScreen";
import NewsTruthScreen from "./screens/NewsTruthScreen";
import ScamSnifferScreen from "./screens/ScamSnifferScreen";
import TeleDigestScreen from "./screens/TeleDigestScreen";
import ScamWiseScreen from "./screens/ScamWiseScreen";
import NewsArticleScreen from "./screens/NewsArticleScreen";

//History Screens
import OverallHistoryScreen from "./screens/OverallHistoryScreen";
import ScamSnifferHistoryScreen from "./screens/ScamSnifferHistoryScreen";
import LinkGuardHistoryScreen from "./screens/LinkGuardHistoryScreen";
import TeleDigestHistoryScreen from "./screens/TeleDigestHistoryScreen";
import RealOrRenderHistoryScreen from "./screens/RealOrRenderHistoryScreen";

const RootStack = createStackNavigator();
const Tab = createBottomTabNavigator();
const ServicesStack = createStackNavigator();
const HistoryStack = createStackNavigator();

// Services Tab Stack
function ServicesStackScreen() {
  return (
    <ServicesStack.Navigator screenOptions={{ headerShown: true }}>
      <ServicesStack.Screen name="ServicesHome" component={ServicesScreen} options={{ title: "Services" }} />
      <ServicesStack.Screen name="LinkGuard" component={LinkGuardScreen} />
      <ServicesStack.Screen name="RealOrRender" component={RealOrRenderScreen} />
      <ServicesStack.Screen name="NewsTruth" component={NewsTruthScreen} />
      <ServicesStack.Screen name="ScamSniffer" component={ScamSnifferScreen} />
      <ServicesStack.Screen name="TeleDigest" component={TeleDigestScreen} />
      <ServicesStack.Screen name="ScamWise" component={ScamWiseScreen} />
      <ServicesStack.Screen name="NewsArticle" component={NewsArticleScreen} options={{ title: "Article" }} />
    </ServicesStack.Navigator>

  );
}

// History Stack
function HistoryStackScreen() {
  return (
    <HistoryStack.Navigator screenOptions={{ headerShown: true }}>
      <HistoryStack.Screen name="OverallHistory" component={OverallHistoryScreen} options={{ title: "History" }} />
      <HistoryStack.Screen name="ScamSniffer History" component={ScamSnifferHistoryScreen} options={{ title: "Message History" }} />
      <HistoryStack.Screen name="LinkGuard History" component={LinkGuardHistoryScreen} options={{ title: "Message History" }} />
      <HistoryStack.Screen name="TeleDigest History" component={TeleDigestHistoryScreen}options={{ title: "Telegram Group History" }}/>
      <HistoryStack.Screen name="RealOrRender History" component={RealOrRenderHistoryScreen}options={{ title: "Image Analysis History" }}/>
    </HistoryStack.Navigator>
  );
}

// Main bottom tab
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "Home") iconName = "home-outline";
          else if (route.name === "Services") iconName = "grid-outline";
          else if (route.name === "Account") iconName = "person-outline";
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#FF8C00",
        tabBarInactiveTintColor: "gray",
        headerShown: true,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Services" component={ServicesStackScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Account" component={AccountScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  useEffect(() => {
    if (!auth.currentUser) {
      auth.signInAnonymously()
        .then(() => console.log("Signed in anonymously"))
        .catch((err) => console.error("Anonymous sign-in failed:", err));
    }

    const unsubscribe = auth.onAuthStateChanged((user) => {
      console.log("Auth state changed:", user?.uid);
    });

    return unsubscribe;
  }, []);

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        <RootStack.Screen name="Account" component={MainTabs} />
        <RootStack.Screen name="HistoryStack" component={HistoryStackScreen} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
