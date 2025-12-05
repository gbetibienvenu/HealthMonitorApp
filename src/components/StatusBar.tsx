// src/components/StatusBar.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ConnectionState } from '../types';
import { Theme } from '../constants/colors';

interface StatusBarProps {
  connectionState: ConnectionState;
  brokerAddress?: string;
}

export const ConnectionStatusBar: React.FC<StatusBarProps> = ({ 
  connectionState, 
  brokerAddress 
}) => {
  const getStatusColor = () => {
    switch (connectionState) {
      case 'connected':
        return Theme.success;
      case 'connecting':
      case 'reconnecting':
        return Theme.warning;
      case 'error':
        return Theme.error;
      default:
        return Theme.textSecondary;
    }
  };

  const getStatusText = () => {
    switch (connectionState) {
      case 'connected':
        return 'Connected';
      case 'connecting':
        return 'Connecting...';
      case 'reconnecting':
        return 'Reconnecting...';
      case 'disconnected':
        return 'Disconnected';
      case 'searching':
        return 'Searching...';
      case 'error':
        return 'Connection Error';
      default:
        return 'Unknown';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <Text style={styles.title}>⚡ Health Monitor</Text>
      </View>
      <View style={styles.rightSection}>
        <View style={[styles.statusDot, { backgroundColor: getStatusColor() }]} />
        <Text style={styles.statusText}>{getStatusText()}</Text>
        {brokerAddress && connectionState === 'connected' && (
          <Text style={styles.address}>{brokerAddress}</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Theme.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  statusText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  address: {
    fontSize: 10,
    color: '#FFFFFF',
    marginLeft: 8,
    opacity: 0.8,
  },
});
