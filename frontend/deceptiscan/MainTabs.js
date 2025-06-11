// MainTabs.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator }       from '@react-navigation/stack';
import { Ionicons }                    from '@expo/vector-icons';

import HomeScreen       from './screens/HomeScreen';
import ServicesScreen   from './screens/ServicesScreen';
import AccountScreen    from './screens/AccountScreen';
import LinkGuardScreen  from './screens/LinkGuardScreen';
import RealOrRenderScreen from './screens/RealOrRenderScreen';
import NewsTruthScreen  from './screens/NewsTruthScreen';
import ScamSnifferScreen from './screens/ScamSnifferScreen';
import TeleDigestScreen  from './screens/TeleDigestScreen';
import ScamWiseScreen    from './screens/ScamWiseScreen';
import NewsArticleScreen from './screens/NewsArticleScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function ServicesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen
        name="ServicesHome"
        component={ServicesScreen}
        options={{ title: 'Services' }}
      />
      <Stack.Screen name="LinkGuard"     component={LinkGuardScreen}    options={{ title: 'LinkGuard' }} />
      <Stack.Screen name="RealOrRender"  component={RealOrRenderScreen} options={{ title: 'RealOrRender' }} />
      <Stack.Screen name="NewsTruth"     component={NewsTruthScreen}    options={{ title: 'NewsTruth' }} />
      <Stack.Screen name="ScamSniffer"   component={ScamSnifferScreen}  options={{ title: 'ScamSniffer' }} />
      <Stack.Screen name="TeleDigest"    component={TeleDigestScreen}   options={{ title: 'TeleDigest' }} />
      <Stack.Screen name="ScamWise"      component={ScamWiseScreen}     options={{ title: 'ScamWise' }} />
      <Stack.Screen name="NewsArticle"   component={NewsArticleScreen}  options={{ title: 'Article' }} />
    </Stack.Navigator>
  );
}

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarShowLabel: false,
        headerShown: false,  // default, overridden per-screen below
        tabBarIcon: ({ focused }) => {
          let icon =
            route.name === 'Home'     ? 'home-outline' :
            route.name === 'Services' ? 'grid-outline' :
                                        'person-outline';
          return <Ionicons name={icon} size={28} color={focused ? '#FF8C00' : '#888'} />;
        },
        tabBarStyle: { backgroundColor: '#fff', borderTopColor: '#DDD' },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: true,
          headerTitle: 'Home',
          headerTitleAlign: 'center',
          headerStyle: { backgroundColor: '#fff', elevation: 0, shadowOpacity: 0 },
          headerTintColor: '#333',
        }}
      />
      <Tab.Screen
        name="Services"
        component={ServicesStack}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Account"
        component={AccountScreen}
        options={{
          headerShown: true,
          headerTitle: 'Account',
          headerTitleAlign: 'center',
          headerStyle: { backgroundColor: '#fff', elevation: 0, shadowOpacity: 0 },
          headerTintColor: '#333',
        }}
      />
    </Tab.Navigator>
  );
}
