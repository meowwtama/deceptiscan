import "react-native-gesture-handler";
import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

// Firebase
import { auth } from "./firebaseConfig";

import HomeScreen from "./screens/HomeScreen";
import ServicesScreen from "./screens/ServicesScreen";
import AccountScreen from "./screens/AccountScreen";
import LinkGuardScreen from "./screens/LinkGuardScreen";
import RealOrRenderScreen from "./screens/RealOrRenderScreen";
import NewsTruthScreen from "./screens/NewsTruthScreen";
import ScamSnifferScreen from "./screens/ScamSnifferScreen";
import TeleDigestScreen from "./screens/TeleDigestScreen";
import ScamWiseScreen from "./screens/ScamWiseScreen";

const RootStack = createStackNavigator();
const Tab = createBottomTabNavigator();
const ServicesStack = createStackNavigator();

function ServicesStackScreen() {
  return (
    <ServicesStack.Navigator screenOptions={{ headerShown: true }}>
      <ServicesStack.Screen
        name="ServicesHome"
        component={ServicesScreen}
        options={{ title: "Services" }}
      />
      <ServicesStack.Screen name="LinkGuard" component={LinkGuardScreen} />
      <ServicesStack.Screen
        name="RealOrRender"
        component={RealOrRenderScreen}
      />
      <ServicesStack.Screen name="NewsTruth" component={NewsTruthScreen} />
      <ServicesStack.Screen name="ScamSniffer" component={ScamSnifferScreen} />
      <ServicesStack.Screen name="TeleDigest" component={TeleDigestScreen} />
      <ServicesStack.Screen name="ScamWise" component={ScamWiseScreen} />
    </ServicesStack.Navigator>
  );
}

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
      <Tab.Screen
        name="Services"
        component={ServicesStackScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen name="Account" component={AccountScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  useEffect(() => {
  // If there is no user, sign in anonymously
  if (!auth.currentUser) {
    auth
      .signInAnonymously()
      .then(() => console.log("Signed in anonymously"))
      .catch((err) => {
        console.error("Anonymous sign-in failed:", err);
      });
  }

  // Listen to auth state changes
  const unsubscribe = auth.onAuthStateChanged((user) => {
    console.log("Auth state changed, current user:", user?.uid);
  });

  return unsubscribe;
}, []);

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        <RootStack.Screen name="Main" component={MainTabs} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
