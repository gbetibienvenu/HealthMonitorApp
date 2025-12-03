/**
 * Health Monitor App
 * Main Application Entry Point
 */

import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { LogBox } from 'react-native';

// Import screens
import { ConnectionScreen } from './src/screens/ConnectionScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { SensorScreen } from './src/screens/SensorScreen';
import { HistoryScreen } from './src/screens/HistoryScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';

// Import services
import NotificationService from './src/services/notificationService';

// Import constants
import { Theme } from './src/constants/colors';

// Import types
import { RootStackParamList } from './src/types';

// Ignore specific warnings
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
  'EventEmitter.removeListener',
]);

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

/**
 * Main Tab Navigator
 */
const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: Theme.primary,
        tabBarInactiveTintColor: Theme.textSecondary,
        tabBarStyle: {
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Sensors') {
            iconName = focused ? 'pulse' : 'pulse-outline';
          } else if (route.name === 'History') {
            iconName = focused ? 'time' : 'time-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          } else {
            iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Sensors" component={SensorScreen} />
      <Tab.Screen name="History" component={HistoryScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

/**
 * Main App Component
 */
const App: React.FC = () => {
  useEffect(() => {
    initializeApp();
  }, []);

  /**
   * Initialize app services
   */
  const initializeApp = async () => {
    try {
      console.log('🚀 Initializing Health Monitor App...');

      // Initialize notification service
      await NotificationService.initialize();
      await NotificationService.requestPermissions();

      console.log('✅ App initialization complete');
    } catch (error) {
      console.error('❌ Error initializing app:', error);
    }
  };

  return (
    <SafeAreaProvider>
      <StatusBar style="light" backgroundColor="#2196F3" />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Main"  // 👈 Add this line
          screenOptions={{
            headerShown: false
          }}
        >
          <Stack.Screen
            name="Connection"
            component={ConnectionScreen}
          />
          <Stack.Screen
            name="Main"
            component={MainTabs}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;