import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, AppSettings } from '../types';
// import { Theme } from '../constants/config';
import StorageService from '../utils/storage';
import MQTTService from '../services/mqttService';
import { Theme } from '../constants/colors';

type SettingsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Settings'
>;

interface Props {
  navigation: SettingsScreenNavigationProp;
}

export const SettingsScreen: React.FC<Props> = ({ navigation }) => {
  const [settings, setSettings] = useState<AppSettings | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const data = await StorageService.getSettings();
    setSettings(data);
  };

  const updateSetting = async (key: keyof AppSettings, value: any) => {
    if (!settings) return;

    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    await StorageService.saveSettings(newSettings);
  };

  const disconnect = async () => {
    Alert.alert(
      'Disconnect',
      'Are you sure you want to disconnect from the Health Monitor?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Disconnect',
          style: 'destructive',
          onPress: async () => {
            await MQTTService.disconnect();
            navigation.reset({
              index: 0,
              routes: [{ name: 'Connection' }],
            });
          },
        },
      ]
    );
  };

  const clearAllData = () => {
    Alert.alert(
      'Clear All Data',
      'This will clear all history and settings. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            await StorageService.clearAll();
            Alert.alert('Success', 'All data cleared');
            await loadSettings();
          },
        },
      ]
    );
  };

  if (!settings) {
    return <View style={styles.container} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Settings</Text>

        {/* Notifications Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Enable Notifications</Text>
            <Switch
              value={settings.notificationsEnabled}
              onValueChange={(value) => updateSetting('notificationsEnabled', value)}
              trackColor={{ false: Theme.border, true: Theme.primary }}
            />
          </View>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Notification Sound</Text>
            <Switch
              value={settings.notificationSound}
              onValueChange={(value) => updateSetting('notificationSound', value)}
              disabled={!settings.notificationsEnabled}
              trackColor={{ false: Theme.border, true: Theme.primary }}
            />
          </View>
        </View>

        {/* Connection Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Connection</Text>
          
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Auto Reconnect</Text>
            <Switch
              value={settings.autoReconnect}
              onValueChange={(value) => updateSetting('autoReconnect', value)}
              trackColor={{ false: Theme.border, true: Theme.primary }}
            />
          </View>
        </View>

        {/* Actions Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actions</Text>
          
          <TouchableOpacity style={styles.actionButton} onPress={disconnect}>
            <Text style={styles.actionButtonText}>Disconnect Device</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.dangerButton]}
            onPress={clearAllData}
          >
            <Text style={[styles.actionButtonText, styles.dangerButtonText]}>
              Clear All Data
            </Text>
          </TouchableOpacity>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.aboutText}>Health Monitor App v1.0.0</Text>
          <Text style={styles.aboutText}>
            Real-time health monitoring with AI-powered recommendations
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.backgroundGray,
  },
  scrollContent: {
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Theme.textPrimary,
    marginBottom: 24,
  },
  section: {
    backgroundColor: Theme.background,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Theme.textPrimary,
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Theme.border,
  },
  settingLabel: {
    fontSize: 16,
    color: Theme.textPrimary,
  },
  actionButton: {
    backgroundColor: Theme.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  actionButtonText: {
    color: Theme.textLight,
    fontSize: 16,
    fontWeight: '600',
  },
  dangerButton: {
    backgroundColor: Theme.error,
  },
  dangerButtonText: {
    color: Theme.textLight,
  },
  aboutText: {
    fontSize: 14,
    color: Theme.textSecondary,
    marginBottom: 8,
    lineHeight: 20,
  },
});