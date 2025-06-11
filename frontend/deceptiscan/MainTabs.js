// MainTabs.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from './contexts/LanguageContext';

import HomeScreen from './screens/HomeScreen';
import ServicesScreen from './screens/ServicesScreen';
import AccountScreen from './screens/AccountScreen';
import LinkGuardScreen from './screens/LinkGuardScreen';
import RealOrRenderScreen from './screens/RealOrRenderScreen';
import NewsTruthScreen from './screens/NewsTruthScreen';
import ScamSnifferScreen from './screens/ScamSnifferScreen';
import TeleDigestScreen from './screens/TeleDigestScreen';
import ScamWiseScreen from './screens/ScamWiseScreen';
import NewsArticleScreen from './screens/NewsArticleScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function ServicesStack() {
  const { language } = useLanguage();

  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen
        name="ServicesHome"
        component={ServicesScreen}
        options={{ title: language === 'zh' ? '服务' : 'Services' }}
      />
      <Stack.Screen
        name="LinkGuard"
        component={LinkGuardScreen}
        options={{ title: language === 'zh' ? '链接守护' : 'LinkGuard' }}
      />
      <Stack.Screen
        name="RealOrRender"
        component={RealOrRenderScreen}
        options={{ title: language === 'zh' ? '真假图片' : 'RealOrRender' }}
      />
      <Stack.Screen
        name="NewsTruth"
        component={NewsTruthScreen}
        options={{ title: language === 'zh' ? '新闻真假' : 'NewsTruth' }}
      />
      <Stack.Screen
        name="ScamSniffer"
        component={ScamSnifferScreen}
        options={{ title: language === 'zh' ? '诈骗探测' : 'ScamSniffer' }}
      />
      <Stack.Screen
        name="TeleDigest"
        component={TeleDigestScreen}
        options={{ title: language === 'zh' ? '电报摘要' : 'TeleDigest' }}
      />
      <Stack.Screen
        name="ScamWise"
        component={ScamWiseScreen}
        options={{ title: language === 'zh' ? '诈骗智库' : 'ScamWise' }}
      />
      <Stack.Screen
        name="NewsArticle"
        component={NewsArticleScreen}
        options={{ title: language === 'zh' ? '文章' : 'Article' }}
      />
    </Stack.Navigator>
  );
}

export default function MainTabs() {
  const { language } = useLanguage();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarShowLabel: true,
        tabBarLabel:
          language === 'zh'
            ? route.name === 'Home'
              ? '首页'
              : route.name === 'Services'
              ? '服务'
              : '账户'
            : route.name,
        headerShown: false,
        tabBarIcon: ({ focused }) => {
          let icon =
            route.name === 'Home'
              ? 'home-outline'
              : route.name === 'Services'
              ? 'grid-outline'
              : 'person-outline';
          return (
            <Ionicons
              name={icon}
              size={28}
              color={focused ? '#FF8C00' : '#888'}
            />
          );
        },
        tabBarStyle: { backgroundColor: '#fff', borderTopColor: '#DDD' },
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 4,
          color: '#333',
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: true,
          headerTitle:
            language === 'zh' ? '首页' : 'Home',
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
          headerTitle:
            language === 'zh' ? '账户' : 'Account',
          headerTitleAlign: 'center',
          headerStyle: { backgroundColor: '#fff', elevation: 0, shadowOpacity: 0 },
          headerTintColor: '#333',
        }}
      />
    </Tab.Navigator>
  );
}
