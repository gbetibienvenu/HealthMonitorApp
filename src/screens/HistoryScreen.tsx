// src/screens/HistoryScreen.tsx

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Theme, getPriorityEmoji } from '../constants/colors';
import { HistoryItem, PriorityLevel } from '../types';
import { StorageService } from '../utils/storage';
import { ConnectionStatusBar } from '../components/StatusBar';
import { Formatters } from '../utils/formatters';
import MQTTService from '../services/mqttService';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

export const HistoryScreen: React.FC = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [filter, setFilter] = useState<PriorityLevel | 'all'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [connectionState, setConnectionState] = useState<any>('connected');
  const [brokerAddress, setBrokerAddress] = useState<string>('');

  useFocusEffect(
    useCallback(() => {
      loadHistory();
      loadConnectionInfo();
    }, [])
  );

  const loadConnectionInfo = async () => {
    try {
      const lastIp = await StorageService.getLastConnectedIp();
      const settings = await StorageService.getSettings();
      if (lastIp && settings.brokerPort) {
        setBrokerAddress(`${lastIp}:${settings.brokerPort}`);
      }
      const state = MQTTService.getConnectionState();
      setConnectionState(state);
    } catch (error) {
      console.error('Error loading connection info:', error);
    }
  };

  const loadHistory = async () => {
    setIsLoading(true);
    try {
      const historyData = await StorageService.getHistory();
      setHistory(historyData);
    } catch (error) {
      console.error('Error loading history:', error);
    }
    setIsLoading(false);
  };

  const handleClearHistory = () => {
    Alert.alert(
      'Clear History',
      'Are you sure you want to clear all history?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            await StorageService.clearHistory();
            setHistory([]);
          },
        },
      ]
    );
  };

  const handleDeleteItem = (id: string) => {
    Alert.alert(
      'Delete Item',
      'Delete this recommendation?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await StorageService.deleteHistoryItem(id);
            loadHistory();
          },
        },
      ]
    );
  };

  const filteredHistory =
    filter === 'all'
      ? history
      : history.filter((item) => item.priority === filter);

  const formatDateTime = (timestamp: string): string => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
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

  const renderItem = ({ item }: { item: HistoryItem }) => (
    <View style={styles.historyCard}>
      <View style={styles.historyHeader}>
        <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(item.priority) }]}>
          <Text style={styles.priorityText}>
            {getPriorityEmoji(item.priority)} {item.priority.toUpperCase()}
          </Text>
        </View>
        <TouchableOpacity onPress={() => handleDeleteItem(item.id)}>
          <Ionicons name="trash-outline" size={20} color={Theme.error} />
        </TouchableOpacity>
      </View>
      
      <Text style={styles.timestamp}>{formatDateTime(item.timestamp)}</Text>
      
      <Text style={styles.message}>{item.message}</Text>
      
      {item.active_labels && item.active_labels.length > 0 && (
        <View style={styles.labels}>
          {item.active_labels.map((label, index) => (
            <View key={index} style={styles.labelChip}>
              <Text style={styles.labelText}>{label}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ConnectionStatusBar
        connectionState={connectionState}
        brokerAddress={brokerAddress}
      />

      <View style={styles.header}>
        <View>
          <Text style={styles.title}>📜 History</Text>
          <Text style={styles.subtitle}>
            {filteredHistory.length} {filteredHistory.length === 1 ? 'item' : 'items'}
          </Text>
        </View>
        {history.length > 0 && (
          <TouchableOpacity onPress={handleClearHistory} style={styles.clearButton}>
            <Ionicons name="trash" size={24} color={Theme.error} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.filterContainer}>
        <FilterButton
          label="All"
          count={history.length}
          isActive={filter === 'all'}
          onPress={() => setFilter('all')}
        />
        <FilterButton
          label="Critical"
          count={history.filter(h => h.priority === 'critical').length}
          isActive={filter === 'critical'}
          onPress={() => setFilter('critical')}
          color={Theme.critical}
        />
        <FilterButton
          label="Warning"
          count={history.filter(h => h.priority === 'warning').length}
          isActive={filter === 'warning'}
          onPress={() => setFilter('warning')}
          color={Theme.warning}
        />
        <FilterButton
          label="Caution"
          count={history.filter(h => h.priority === 'caution').length}
          isActive={filter === 'caution'}
          onPress={() => setFilter('caution')}
          color={Theme.caution}
        />
        <FilterButton
          label="Normal"
          count={history.filter(h => h.priority === 'normal').length}
          isActive={filter === 'normal'}
          onPress={() => setFilter('normal')}
          color={Theme.normal}
        />
      </View>

      {filteredHistory.length > 0 ? (
        <FlatList
          data={filteredHistory}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📭</Text>
          <Text style={styles.emptyText}>
            {history.length === 0 ? 'No history yet' : 'No items match filter'}
          </Text>
          <Text style={styles.emptySubtext}>
            {history.length === 0
              ? 'Recommendations will appear here'
              : 'Try selecting a different filter'}
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const FilterButton: React.FC<{
  label: string;
  count: number;
  isActive: boolean;
  onPress: () => void;
  color?: string;
}> = ({ label, count, isActive, onPress, color = Theme.primary }) => (
  <TouchableOpacity
    style={[
      styles.filterButton,
      isActive && { backgroundColor: color },
    ]}
    onPress={onPress}
  >
    <Text
      style={[
        styles.filterButtonText,
        isActive && { color: '#FFFFFF' },
      ]}
    >
      {label}
    </Text>
    {count > 0 && (
      <View style={[styles.countBadge, isActive && { backgroundColor: 'rgba(255,255,255,0.3)' }]}>
        <Text style={[styles.countText, isActive && { color: '#FFFFFF' }]}>
          {count}
        </Text>
      </View>
    )}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.backgroundGray,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Theme.background,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Theme.textPrimary,
  },
  subtitle: {
    fontSize: 14,
    color: Theme.textSecondary,
    marginTop: 4,
  },
  clearButton: {
    padding: 8,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 8,
    backgroundColor: Theme.background,
    borderBottomWidth: 1,
    borderBottomColor: Theme.border,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Theme.backgroundGray,
    gap: 6,
  },
  filterButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: Theme.textPrimary,
  },
  countBadge: {
    backgroundColor: Theme.border,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center',
  },
  countText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: Theme.textSecondary,
  },
  listContent: {
    padding: 16,
  },
  historyCard: {
    backgroundColor: Theme.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  priorityBadge: {
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  priorityText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  timestamp: {
    fontSize: 12,
    color: Theme.textSecondary,
    marginBottom: 12,
  },
  message: {
    fontSize: 14,
    color: Theme.textPrimary,
    lineHeight: 20,
  },
  labels: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 12,
  },
  labelChip: {
    backgroundColor: Theme.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  labelText: {
    fontSize: 11,
    color: Theme.primary,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: Theme.textPrimary,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: Theme.textSecondary,
    textAlign: 'center',
  },
});