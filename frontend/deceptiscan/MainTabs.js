import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator }       from '@react-navigation/stack';
import { Ionicons }                    from '@expo/vector-icons';

// Top-level screens
import HomeScreen     from './screens/HomeScreen';
import AccountScreen  from './screens/AccountScreen';

// Services tab screens
import ServicesScreen     from './screens/ServicesScreen';
import LinkGuardScreen    from './screens/LinkGuardScreen';
import RealOrRenderScreen from './screens/RealOrRenderScreen';
import NewsTruthScreen    from './screens/NewsTruthScreen';
import ScamSnifferScreen  from './screens/ScamSnifferScreen';
import TeleDigestScreen   from './screens/TeleDigestScreen';
import ScamWiseScreen     from './screens/ScamWiseScreen';
import NewsArticleScreen  from './screens/NewsArticleScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function ServicesStackScreen() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen
        name="ServicesHome"
        component={ServicesScreen}
        options={{ title: 'Services' }}
      />
      <Stack.Screen name="LinkGuard"     component={LinkGuardScreen} />
      <Stack.Screen name="RealOrRender"  component={RealOrRenderScreen} />
      <Stack.Screen name="NewsTruth"     component={NewsTruthScreen} />
      <Stack.Screen name="ScamSniffer"   component={ScamSnifferScreen} />
      <Stack.Screen name="TeleDigest"    component={TeleDigestScreen} />
      <Stack.Screen name="ScamWise"      component={ScamWiseScreen} />
      <Stack.Screen
        name="NewsArticle"
        component={NewsArticleScreen}
        options={{ title: 'Article' }}
      />
    </Stack.Navigator>
  );
}

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Home')     iconName = 'home-outline';
          if (route.name === 'Services') iconName = 'grid-outline';
          if (route.name === 'Account')  iconName = 'person-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor:   '#FF8C00',
        tabBarInactiveTintColor: 'gray',
        headerShown: true,
      })}
    >
      <Tab.Screen name="Home"     component={HomeScreen} />
      <Tab.Screen
        name="Services"
        component={ServicesStackScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen name="Account"  component={AccountScreen} />
    </Tab.Navigator>
  );
}
