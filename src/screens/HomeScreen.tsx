// src/screens/HomeScreen.tsx

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { HealthRecommendation, ConnectionState } from '../types';
import { Theme } from '../constants/colors';
import MQTTService from '../services/mqttService';
import { StorageService } from '../utils/storage';
import { ConnectionStatusBar } from '../components/StatusBar';
import { LoadingIndicator } from '../components/LoadingIndicator';

export const HomeScreen: React.FC = () => {
  const insets = useSafeAreaInsets();

  const [recommendation, setRecommendation] = useState<HealthRecommendation | null>(null);
  const [connectionState, setConnectionState] = useState<ConnectionState>('connected');
  const [brokerAddress, setBrokerAddress] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    initializeScreen();
    setupMQTTListeners();

    return () => {
      // Cleanup if needed
    };
  }, []);

  const initializeScreen = async () => {
    try {
      console.log('🏠 Initializing Home screen...');
      const lastIp = await StorageService.getLastConnectedIp();
      const settings = await StorageService.getSettings();

      if (lastIp && settings.brokerPort) {
        setBrokerAddress(`${lastIp}:${settings.brokerPort}`);
      }

      const lastRecommendation = await StorageService.getLastRecommendation();
      if (lastRecommendation) {
        setRecommendation(lastRecommendation);
      }

      const state = MQTTService.getConnectionState();
      setConnectionState(state);

      setIsLoading(false);
      console.log('✅ Home screen initialized');
    } catch (error) {
      console.error('❌ Error initializing home screen:', error);
      setIsLoading(false);
    }
  };

  const setupMQTTListeners = () => {
    MQTTService.onRecommendation((data) => {
      setRecommendation(data);
    });

    MQTTService.onConnectionState((state) => {
      setConnectionState(state);

      if (state === 'error' || state === 'disconnected') {
        Alert.alert('Connection Lost', 'Lost connection to Health Monitor. Attempting to reconnect...', [{ text: 'OK' }]);
      } else if (state === 'connected') {
        Alert.alert('Connected', 'Successfully reconnected to Health Monitor', [{ text: 'OK' }]);
      }
    });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await initializeScreen();
    setRefreshing(false);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right', 'bottom']}>
        <ConnectionStatusBar connectionState={connectionState} brokerAddress={brokerAddress} />
        <LoadingIndicator message="Loading health data..." />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right', 'bottom']}>
      <ConnectionStatusBar connectionState={connectionState} brokerAddress={brokerAddress} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 24 + insets.bottom }]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Theme.primary]}
            tintColor={Theme.primary}
          />
        }
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Current Status</Text>
          {recommendation ? (
            <View style={styles.recommendationCard}>
              <View style={styles.header}>
                <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(recommendation.priority) }]}>
                  <Text style={styles.priorityText}>
                    {getPriorityEmoji(recommendation.priority)} {recommendation.priority.toUpperCase()}
                  </Text>
                </View>
                <Text style={styles.timestamp}>{formatTime(recommendation.timestamp)}</Text>
              </View>
              <View style={styles.content}>
                <Text style={styles.summary}>{recommendation.summary}</Text>
                <Text style={styles.advice}>{recommendation.advice}</Text>
              </View>
            </View>
          ) : (
            <View style={styles.noDataCard}>
              <Text style={styles.noDataIcon}>🔄</Text>
              <Text style={styles.noDataTitle}>Waiting for Data</Text>
              <Text style={styles.noDataText}>Your health monitor will send updates every 5 minutes</Text>
            </View>
          )}
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>ℹ️ How it works</Text>
          <Text style={styles.infoText}>
            Your Health Monitor analyzes sensor data every 5 minutes and provides personalized recommendations based on your activity and environment.
          </Text>
        </View>

        {connectionState !== 'connected' && (
          <View style={[styles.statusCard, { backgroundColor: Theme.warning + '20' }]}>
            <Text style={styles.statusCardTitle}>⚠️ Connection Status</Text>
            <Text style={styles.statusCardText}>
              {connectionState === 'reconnecting'
                ? 'Reconnecting to Health Monitor...'
                : connectionState === 'error'
                ? 'Connection error. Please check your network.'
                : 'Not connected to Health Monitor'}
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

// Helper functions (unchanged)
const formatTime = (timestamp: string): string => {
  try {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  } catch {
    return timestamp;
  }
};

const getPriorityColor = (priority: string): string => {
  switch (priority) {
    case 'critical':
      return Theme.critical;
    case 'warning':
      return Theme.warning;
    case 'caution':
      return Theme.caution;
    case 'normal':
      return Theme.normal;
    default:
      return Theme.info;
  }
};

const getPriorityEmoji = (priority: string): string => {
  switch (priority) {
    case 'critical':
      return '🔴';
    case 'warning':
      return '🟠';
    case 'caution':
      return '🟡';
    case 'normal':
      return '🟢';
    default:
      return '⚪';
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.backgroundGray,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  section: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Theme.textPrimary,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  recommendationCard: {
    backgroundColor: Theme.background,
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  priorityBadge: {
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  priorityText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  timestamp: {
    fontSize: 14,
    color: Theme.textSecondary,
    fontWeight: '500',
  },
  content: {
    marginBottom: 16,
  },
  summary: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Theme.textPrimary,
    marginBottom: 12,
    lineHeight: 24,
  },
  advice: {
    fontSize: 16,
    color: Theme.textSecondary,
    lineHeight: 22,
  },
  noDataCard: {
    backgroundColor: Theme.background,
    borderRadius: 16,
    padding: 40,
    marginHorizontal: 16,
    marginVertical: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  noDataIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  noDataTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Theme.textPrimary,
    marginBottom: 8,
  },
  noDataText: {
    fontSize: 14,
    color: Theme.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  infoCard: {
    backgroundColor: Theme.background,
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginTop: 16,
    borderLeftWidth: 4,
    borderLeftColor: Theme.primary,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Theme.textPrimary,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: Theme.textSecondary,
    marginBottom: 8,
    lineHeight: 20,
  },
  statusCard: {
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginTop: 16,
  },
  statusCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Theme.textPrimary,
    marginBottom: 8,
  },
  statusCardText: {
    fontSize: 14,
    color: Theme.textSecondary,
    lineHeight: 20,
  },
});
