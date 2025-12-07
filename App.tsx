/**
 * App.tsx
 * Health Monitor App - Entry Point (SwipeableTabs + Bottom icon bar)
 */

import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { LogBox, View, TouchableOpacity, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';

// Import screens (your existing screen components)
import { ConnectionScreen } from './src/screens/ConnectionScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { SensorScreen } from './src/screens/SensorScreen';
import { HistoryScreen } from './src/screens/HistoryScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';

// Import services
import NotificationService from './src/services/notificationService';

// Import constants
import { Theme } from './src/constants/colors';

// Types
import { RootStackParamList } from './src/types';

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
  'EventEmitter.removeListener',
]);

const Stack = createStackNavigator<RootStackParamList>();

/**
 * SwipeableTabs component
 * - uses react-native-tab-view for swipe gestures
 * - renders a bottom icon bar (custom) synchronized with TabView index
 * - hides any top tab bar
 */
const SwipeableTabs: React.FC = () => {
  const layout = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const routes = [
    { key: 'home', title: 'Home', icon: (focused: boolean) => (focused ? 'home' : 'home-outline') },
    { key: 'sensors', title: 'Sensors', icon: (focused: boolean) => (focused ? 'pulse' : 'pulse-outline') },
    { key: 'history', title: 'History', icon: (focused: boolean) => (focused ? 'time' : 'time-outline') },
    { key: 'settings', title: 'Settings', icon: (focused: boolean) => (focused ? 'settings' : 'settings-outline') },
  ];

  // Scenes map: each scene renders your existing screen component.
  const renderScene = SceneMap({
    home: () => <HomeScreen />,
    sensors: () => <SensorScreen />,
    history: () => <HistoryScreen />,
    settings: () => <SettingsScreen />,
  });

  // TabView index state
  const [index, setIndex] = React.useState<number>(0);

  return (
    <View style={styles.flex}>
      {/* TabView: swipe between routes; hide tab bar by not rendering one */}
      <TabView
        navigationState={{ index, routes: routes.map(r => ({ key: r.key, title: r.title })) }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        renderTabBar={() => null} // hide the built-in tab bar (we use custom bottom bar)
        swipeEnabled
      />

      {/* Custom Bottom Icon Bar (keeps same icon set as before) */}
      <View
        style={[
          styles.bottomBar,
          {
            // raise the bar above the phone home indicator / back area
            paddingBottom: Math.max(insets.bottom, 8),
            height: 56 + Math.max(insets.bottom, 8),
          },
        ]}
      >
        {routes.map((r, i) => {
          const focused = i === index;
          return (
            <TouchableOpacity
              key={r.key}
              style={styles.tabButton}
              activeOpacity={0.7}
              onPress={() => setIndex(i)} // jumping to a tab
            >
              <Ionicons name={r.icon(focused) as any} size={24} color={focused ? Theme.primary : Theme.textSecondary} />
              <Text style={[styles.tabLabel, { color: focused ? Theme.primary : Theme.textSecondary }]}>
                {r.title}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

/**
 * Main App component (Stack navigator with Connection and Main)
 */
const App: React.FC = () => {
  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      console.log('🚀 Initializing Health Monitor App...');
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
        <Stack.Navigator initialRouteName="Main" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Connection" component={ConnectionScreen} />
          {/* Use the SwipeableTabs as the main entrypoint that supports swipe and bottom icons */}
          <Stack.Screen name="Main" component={SwipeableTabs} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;

/* Styles */
const styles = StyleSheet.create({
  flex: { flex: 1 },
  bottomBar: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 12, // slight inset from screen edge
    flexDirection: 'row',
    backgroundColor: Theme.background, // match app background or customize
    borderRadius: 16,
    marginHorizontal: 6,
    justifyContent: 'space-around',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    paddingTop: 8,
    paddingHorizontal: 8,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  tabLabel: {
    fontSize: 10,
    marginTop: 2,
  },
});


// /**
//  * Health Monitor App
//  * Main Application Entry Point
//  */

// import React, { useEffect } from 'react';
// import { StatusBar } from 'expo-status-bar';
// import { SafeAreaProvider } from 'react-native-safe-area-context';
// import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { Ionicons } from '@expo/vector-icons';
// import { LogBox } from 'react-native';

// // Import screens
// import { ConnectionScreen } from './src/screens/ConnectionScreen';
// import { HomeScreen } from './src/screens/HomeScreen';
// import { SensorScreen } from './src/screens/SensorScreen';
// import { HistoryScreen } from './src/screens/HistoryScreen';
// import { SettingsScreen } from './src/screens/SettingsScreen';

// // Import services
// import NotificationService from './src/services/notificationService';

// // Import constants
// import { Theme } from './src/constants/colors';

// // Import types
// import { RootStackParamList } from './src/types';

// // Ignore specific warnings
// LogBox.ignoreLogs([
//   'Non-serializable values were found in the navigation state',
//   'EventEmitter.removeListener',
// ]);

// const Stack = createStackNavigator<RootStackParamList>();
// const Tab = createBottomTabNavigator();

// /**
//  * Main Tab Navigator
//  */
// const MainTabs = () => {
//   return (
//     <Tab.Navigator
//       screenOptions={({ route }) => ({
//         headerShown: false,
//         tabBarActiveTintColor: Theme.primary,
//         tabBarInactiveTintColor: Theme.textSecondary,
//         tabBarStyle: {
//           paddingBottom: 5,
//           paddingTop: 5,
//           height: 60,
//         },
//         tabBarIcon: ({ focused, color, size }) => {
//           let iconName: keyof typeof Ionicons.glyphMap;

//           if (route.name === 'Home') {
//             iconName = focused ? 'home' : 'home-outline';
//           } else if (route.name === 'Sensors') {
//             iconName = focused ? 'pulse' : 'pulse-outline';
//           } else if (route.name === 'History') {
//             iconName = focused ? 'time' : 'time-outline';
//           } else if (route.name === 'Settings') {
//             iconName = focused ? 'settings' : 'settings-outline';
//           } else {
//             iconName = 'help-outline';
//           }

//           return <Ionicons name={iconName} size={size} color={color} />;
//         },
//       })}
//     >
//       <Tab.Screen name="Home" component={HomeScreen} />
//       <Tab.Screen name="Sensors" component={SensorScreen} />
//       <Tab.Screen name="History" component={HistoryScreen} />
//       <Tab.Screen name="Settings" component={SettingsScreen} />
//     </Tab.Navigator>
//   );
// };

// /**
//  * Main App Component
//  */
// const App: React.FC = () => {
//   useEffect(() => {
//     initializeApp();
//   }, []);

//   /**
//    * Initialize app services
//    */
//   const initializeApp = async () => {
//     try {
//       console.log('🚀 Initializing Health Monitor App...');

//       // Initialize notification service
//       await NotificationService.initialize();
//       await NotificationService.requestPermissions();

//       console.log('✅ App initialization complete');
//     } catch (error) {
//       console.error('❌ Error initializing app:', error);
//     }
//   };

//   return (
//     <SafeAreaProvider>
//       <StatusBar style="light" backgroundColor="#2196F3" />
//       <NavigationContainer>
//         <Stack.Navigator
//           initialRouteName="Main"  // 👈 Add this line
//           screenOptions={{
//             headerShown: false
//           }}
//         >
//           <Stack.Screen
//             name="Connection"
//             component={ConnectionScreen}
//           />
//           <Stack.Screen
//             name="Main"
//             component={MainTabs}
//           />
//         </Stack.Navigator>
//       </NavigationContainer>
//     </SafeAreaProvider>
//   );
// };

// export default App;