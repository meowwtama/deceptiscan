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

const Stack = createStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    // Auto‐anonymous in case of no user yet
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

  // While we wait for Firebase to tell us if there's a user:
  if (initializing) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/** If no user, show Auth flow **/}
        {!user ? (
          <>
            <Stack.Screen name="Login"  component={LoginScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
          </>
        ) : (
          <>
            {/** Once signed in, show Main and History stacks **/}
            <Stack.Screen name="Main"           component={MainTabs} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
