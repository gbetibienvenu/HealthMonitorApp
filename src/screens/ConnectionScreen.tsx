// src/screens/ConnectionScreen.tsx

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
// import { RootStackParamList, DiscoveredService } from '../types';
import { RootStackParamList, DiscoveredDevice } from '../types';
import { Theme } from '../constants/colors';
// import { MQTTConfig } from '../constants/config';
import Config from '../constants/config';
// import DiscoveryService from '../services/discoveryService';
import { getDiscoveryService } from '../services/discoveryService';
import MQTTService from '../services/mqttService';
import StorageService from '../utils/storage';
import { LoadingIndicator } from '../components/LoadingIndicator';
// import { SafeAreaView } from 'react-native-safe-area-context';


type ConnectionScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Connection'
>;

interface Props {
  navigation: ConnectionScreenNavigationProp;
}

export const ConnectionScreen: React.FC<Props> = ({ navigation }) => {
  const [isSearching, setIsSearching] = useState(false);
  // const [discoveredDevice, setDiscoveredDevice] = useState<DiscoveredService | null>(null);
  const [discoveredDevice, setDiscoveredDevice] = useState<DiscoveredDevice | null>(null);
  const [manualIP, setManualIP] = useState('');
  const [manualPort, setManualPort] = useState(Config.mqtt.defaultPort.toString());
  // const [manualPort, setManualPort] = useState(MQTTConfig.DEFAULT_PORT.toString());
  const [isConnecting, setIsConnecting] = useState(false);
  const [lastConnection, setLastConnection] = useState<string | null>(null);

  useEffect(() => {
    loadLastConnection();
    startAutoDiscovery();
    
    return () => {
      getDiscoveryService().stopScan();
    };
  }, []);

  /**
   * Load last successful connection
   */
  const loadLastConnection = async () => {
    // const connection = await StorageService.getConnection();
    const connection = await StorageService.getLastConnection();
    if (connection) {
      setLastConnection(`${connection.ipAddress}:${connection.port}`);
      setManualIP(connection.ipAddress);
      setManualPort(connection.port.toString());
    }
  };

  /**
   * Start automatic device discovery
   */
  const startAutoDiscovery = () => {
    setIsSearching(true);
    setDiscoveredDevice(null);


    getDiscoveryService().startScan(
  (service) => {
    console.log('Device found:', service);
    setDiscoveredDevice(service);
    setIsSearching(false);

    // Auto-fill manual fields with discovered device
    if (service.addresses.length > 0) {
      setManualIP(service.addresses[0]);
      setManualPort(service.port.toString());
    }
  },
  () => {
    console.log('Discovery timeout');
    setIsSearching(false);
    Alert.alert(
      'Device Not Found',
      'Could not find Health Monitor on the network. Try manual connection.',
      [{ text: 'OK' }]
    );
  }
);
  };

  /**
   * Connect to discovered device
   */
  const connectToDiscoveredDevice = async () => {
    if (!discoveredDevice || discoveredDevice.addresses.length === 0) {
      Alert.alert('Error', 'No device address available');
      return;
    }

    const ipAddress = discoveredDevice.addresses[0];
    const port = discoveredDevice.port;

    await connectToDevice(ipAddress, port);
  };

  /**
   * Connect manually using entered IP and port
   */
  const connectManually = async () => {
    if (!manualIP.trim()) {
      Alert.alert('Error', 'Please enter an IP address');
      return;
    }

    const port = parseInt(manualPort, 10);
    if (isNaN(port) || port < 1 || port > 65535) {
      Alert.alert('Error', 'Please enter a valid port number (1-65535)');
      return;
    }

    await connectToDevice(manualIP.trim(), port);
  };

  /**
   * Connect to MQTT broker
   */
  const connectToDevice = async (ipAddress: string, port: number) => {
    setIsConnecting(true);

    try {
      // Connect to MQTT
      await MQTTService.connect(ipAddress, port);

      Alert.alert(
        'Connected',
        `Successfully connected to Health Monitor at ${ipAddress}:${port}`,
        [
          {
            text: 'OK',
            onPress: () => navigation.replace('Main'),
          },
        ]
      );
    } catch (error) {
      console.error('Connection error:', error);
      Alert.alert(
        'Connection Failed',
        `Could not connect to ${ipAddress}:${port}. Please check the IP address and ensure the device is on the same network.`,
        [{ text: 'OK' }]
      );
    } finally {
      setIsConnecting(false);
    }
  };

  if (isConnecting) {
    return (
      <SafeAreaView style={styles.container}>
        <LoadingIndicator message="Connecting to Health Monitor..." />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>🏥 Health Monitor</Text>
          <Text style={styles.headerSubtitle}>Connect to your device</Text>
        </View>

        {/* Auto Discovery Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Automatic Discovery</Text>
          
          {isSearching ? (
            <View style={styles.searchingContainer}>
              <LoadingIndicator 
                message="Searching for Health Monitor..." 
                size="small" 
              />
            </View>
          ) : discoveredDevice ? (
            <View style={styles.deviceCard}>
              <View style={styles.deviceHeader}>
                <Text style={styles.deviceName}>
                  📱 {discoveredDevice.name}
                </Text>
                <View style={styles.foundBadge}>
                  <Text style={styles.foundText}>Found</Text>
                </View>
              </View>
              <Text style={styles.deviceAddress}>
                {discoveredDevice.addresses[0]}:{discoveredDevice.port}
              </Text>
              <TouchableOpacity
                style={styles.connectButton}
                onPress={connectToDiscoveredDevice}
              >
                <Text style={styles.connectButtonText}>Connect</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.retryButton}
              onPress={startAutoDiscovery}
            >
              <Text style={styles.retryButtonText}>🔍 Search Again</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Manual Connection Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Manual Connection</Text>
          
          {lastConnection && (
            <Text style={styles.lastConnection}>
              Last connected: {lastConnection}
            </Text>
          )}

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>IP Address</Text>
            <TextInput
              style={styles.input}
              placeholder="192.168.1.105"
              value={manualIP}
              onChangeText={setManualIP}
              keyboardType="numeric"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Port</Text>
            <TextInput
              style={styles.input}
              placeholder="1883"
              value={manualPort}
              onChangeText={setManualPort}
              keyboardType="numeric"
            />
          </View>

          <TouchableOpacity
            style={[styles.connectButton, styles.manualConnectButton]}
            onPress={connectManually}
          >
            <Text style={styles.connectButtonText}>Connect Manually</Text>
          </TouchableOpacity>
        </View>

        {/* Info Section */}
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>💡 Connection Tips</Text>
          <Text style={styles.infoText}>
            • Ensure your phone and Raspberry Pi are on the same WiFi network
          </Text>
          <Text style={styles.infoText}>
            • Check that the MQTT broker is running on the Raspberry Pi
          </Text>
          <Text style={styles.infoText}>
            • Default port is 1883 for MQTT
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
  header: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Theme.primary,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: Theme.textSecondary,
  },
  section: {
    backgroundColor: Theme.background,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Theme.textPrimary,
    marginBottom: 16,
  },
  searchingContainer: {
    paddingVertical: 20,
  },
  deviceCard: {
    borderWidth: 2,
    borderColor: Theme.success,
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#F1F8F4',
  },
  deviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Theme.textPrimary,
  },
  foundBadge: {
    backgroundColor: Theme.success,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  foundText: {
    color: Theme.textLight,
    fontSize: 12,
    fontWeight: 'bold',
  },
  deviceAddress: {
    fontSize: 14,
    color: Theme.textSecondary,
    marginBottom: 12,
  },
  connectButton: {
    backgroundColor: Theme.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  connectButtonText: {
    color: Theme.textLight,
    fontSize: 16,
    fontWeight: 'bold',
  },
  retryButton: {
    borderWidth: 2,
    borderColor: Theme.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: Theme.background,
  },
  retryButtonText: {
    color: Theme.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  lastConnection: {
    fontSize: 12,
    color: Theme.textSecondary,
    marginBottom: 12,
    fontStyle: 'italic',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Theme.textPrimary,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: Theme.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: Theme.background,
  },
  manualConnectButton: {
    marginTop: 8,
  },
  infoSection: {
    backgroundColor: Theme.primaryLight,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Theme.primary,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: Theme.textPrimary,
    marginBottom: 6,
    lineHeight: 20,
  },
});