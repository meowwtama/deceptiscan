
import "react-native-gesture-handler";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons"; 

import HomeScreen from "./screens/HomeScreen";
import ServicesScreen from "./screens/ServicesScreen";
import AccountScreen from "./screens/AccountScreen"; 
const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;
            if (route.name === "Home") {
              iconName = "home-outline";
            } else if (route.name === "Services") {
              iconName = "grid-outline";
            } else if (route.name === "Account") {
              iconName = "person-outline";
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "#ff8c00",
          tabBarInactiveTintColor: "gray",
        })}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerTitle: "Home" }}
        />
        <Tab.Screen
          name="Services"
          component={ServicesScreen}
          options={{ headerTitle: "Services" }}
        />
        <Tab.Screen
          name="Account"
          component={AccountScreen}
          options={{ headerTitle: "Account" }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
