// App.js
import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator }    from '@react-navigation/stack';
import { auth }                     from './firebaseConfig';
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';

// Auth screens
import LoginScreen  from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';

// Main screens (wrapped in MainTabs)
import MainTabs             from './MainTabs';

// History screens
import OverallHistoryScreen from './screens/OverallHistoryScreen';
import ScamSnifferHistoryScreen from './screens/ScamSnifferHistoryScreen';
import LinkGuardHistoryScreen from './screens/LinkGuardHistoryScreen';
import RealOrRenderHistoryScreen from './screens/RealOrRenderHistoryScreen';
import NewsTruthHistoryScreen from './screens/NewsTruthHistoryScreen';
import TeleDigestHistoryScreen from './screens/TeleDigestHistoryScreen';

const Stack = createStackNavigator();
const HistoryStack = createStackNavigator();

function HistoryStackScreen() {
  return (
    <HistoryStack.Navigator screenOptions={{ headerShown: true }}>
      <HistoryStack.Screen 
        name="OverallHistory" 
        component={OverallHistoryScreen} 
        options={{ title: "History" }}
      />
      <HistoryStack.Screen 
        name="ScamSniffer History" 
        component={ScamSnifferHistoryScreen}
        options={{ title: "Message History" }}
      />
      <HistoryStack.Screen 
        name="LinkGuard History" 
        component={LinkGuardHistoryScreen}
        options={{ title: "Link History" }}
      />
      <HistoryStack.Screen 
        name="RealOrRender History" 
        component={RealOrRenderHistoryScreen}
        options={{ title: "Image Analysis History" }}
      />
      <HistoryStack.Screen 
        name="NewsTruth History" 
        component={NewsTruthHistoryScreen}
        options={{ title: "Article History" }}
      />
      <HistoryStack.Screen 
        name="TeleDigest History" 
        component={TeleDigestHistoryScreen}
        options={{ title: "Telegram Group History" }}
      />
    </HistoryStack.Navigator>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    // Auto-anonymous in case of no user yet
    if (!auth.currentUser) {
      signInAnonymously(auth).catch(console.error);
    }
    // Subscribe to auth changes
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (initializing) setInitializing(false);
    });
    return unsub;
  }, []);

  if (initializing) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Main" component={MainTabs} />
            <Stack.Screen name="HistoryStack" component={HistoryStackScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
