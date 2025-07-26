import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

// Import your screens - TEMPORARILY DISABLED TO PREVENT AMPLIFY ERRORS
// import HomeScreen from './screens/SimpleHomeScreen';
// import ExploreScreen from './screens/ExploreScreen';
// import TripsScreen from './screens/TripsScreen';
// import ChatScreen from './screens/ChatScreen';
// import ProfileScreen from './screens/ProfileScreen';

// Temporary placeholder components
const HomeScreen = () => <Text style={{color: '#FF8C42', fontSize: 24, textAlign: 'center', marginTop: 50}}>🏠 Home</Text>;
const ExploreScreen = () => <Text style={{color: '#FF8C42', fontSize: 24, textAlign: 'center', marginTop: 50}}>🔍 Explore</Text>;
const TripsScreen = () => <Text style={{color: '#FF8C42', fontSize: 24, textAlign: 'center', marginTop: 50}}>✈️ Trips</Text>;
const ChatScreen = () => <Text style={{color: '#FF8C42', fontSize: 24, textAlign: 'center', marginTop: 50}}>💬 Chat</Text>;
const ProfileScreen = () => <Text style={{color: '#FF8C42', fontSize: 24, textAlign: 'center', marginTop: 50}}>👤 Profile</Text>;

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// African sunset theme colors
const theme = {
  primary: '#FF8C42',      // Bright orange
  secondary: '#FFD700',    // Gold
  accent: '#FF6B35',       // Deep orange
  background: '#1A1A1A',   // Dark background
  surface: '#2A2A2A',      // Card background
  text: '#FFFFFF',         // White text
  textSecondary: '#CCCCCC', // Light gray text
  tabBackground: '#1A1A1A',
  tabActive: '#FF8C42',
  tabInactive: '#666666',
};

// Main Tab Navigator
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.tabBackground,
          borderTopColor: '#333333',
          borderTopWidth: 1,
          height: 70,
          paddingBottom: 10,
          paddingTop: 10,
        },
        tabBarActiveTintColor: theme.tabActive,
        tabBarInactiveTintColor: theme.tabInactive,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          title: 'Discover Africa',
          tabBarIcon: ({ color, size, focused }) => (
            <Text style={{ 
              color, 
              fontSize: focused ? 24 : 20,
              textShadowColor: focused ? 'rgba(255, 140, 66, 0.8)' : 'transparent',
              textShadowOffset: { width: 0, height: 0 },
              textShadowRadius: focused ? 8 : 0,
            }}>🌍</Text>
          ),
        }}
      />
      <Tab.Screen 
        name="Explore" 
        component={ExploreScreen}
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, size, focused }) => (
            <Text style={{ 
              color, 
              fontSize: focused ? 24 : 20,
              textShadowColor: focused ? 'rgba(255, 140, 66, 0.8)' : 'transparent',
              textShadowOffset: { width: 0, height: 0 },
              textShadowRadius: focused ? 8 : 0,
            }}>🔍</Text>
          ),
        }}
      />
      <Tab.Screen 
        name="Trips" 
        component={TripsScreen}
        options={{
          title: 'My Trips',
          tabBarIcon: ({ color, size, focused }) => (
            <Text style={{ 
              color, 
              fontSize: focused ? 24 : 20,
              textShadowColor: focused ? 'rgba(255, 140, 66, 0.8)' : 'transparent',
              textShadowOffset: { width: 0, height: 0 },
              textShadowRadius: focused ? 8 : 0,
            }}>✈️</Text>
          ),
        }}
      />
      <Tab.Screen 
        name="Chat" 
        component={ChatScreen}
        options={{
          title: 'Connect',
          tabBarIcon: ({ color, size, focused }) => (
            <Text style={{ 
              color, 
              fontSize: focused ? 24 : 20,
              textShadowColor: focused ? 'rgba(255, 140, 66, 0.8)' : 'transparent',
              textShadowOffset: { width: 0, height: 0 },
              textShadowRadius: focused ? 8 : 0,
            }}>💬</Text>
          ),
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size, focused }) => (
            <Text style={{ 
              color, 
              fontSize: focused ? 24 : 20,
              textShadowColor: focused ? 'rgba(255, 140, 66, 0.8)' : 'transparent',
              textShadowOffset: { width: 0, height: 0 },
              textShadowRadius: focused ? 8 : 0,
            }}>👤</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function SpiritedTravelsApp() {
  return (
    <NavigationContainer>
      <MainTabs />
    </NavigationContainer>
  );
}

export { theme };
