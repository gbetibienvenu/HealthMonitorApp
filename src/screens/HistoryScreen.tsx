import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Theme } from '../constants/colors';
import { HistoryItem, PriorityLevel } from '../types';
import { StorageService } from '../utils/storage';
// import { ConnectionStatusBar } from '../components/StatusBar';
import {ConnectionStatusBar} from '../components/StatusBar'
import { PriorityBadge } from '../components/PriorityBadge';
import { Formatters } from '../utils/formatters';
import { getMQTTService } from '../services/mqttService';
import Icon from 'react-native-vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export const HistoryScreen: React.FC = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [filter, setFilter] = useState<PriorityLevel | 'all'>('all');
  const [isLoading, setIsLoading] = useState(true);

  const mqttService = getMQTTService();

  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [])
  );

  const loadHistory = async () => {
    setIsLoading(true);
    const historyData = await StorageService.getHistory();
    setHistory(historyData);
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

  const filteredHistory =
    filter === 'all'
      ? history
      : history.filter((item) => item.priority === filter);

  const renderItem = ({ item }: { item: HistoryItem }) => (
    <View style={styles.historyCard}>
      <View style={styles.historyHeader}>
        <PriorityBadge priority={item.priority} size="small" />
        <Text style={styles.timestamp}>
          {Formatters.formatDateTime(item.timestamp)}
        </Text>
      </View>
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

  const connectionState = mqttService.getConnectionState();

  return (
    <SafeAreaView style={styles.container}>
      <ConnectionStatusBar
        isConnected={connectionState.isConnected}
        brokerPort={1883}
      />

      <View style={styles.header}>
        <View>
          <Text style={styles.title}>📜 History</Text>
          <Text style={styles.subtitle}>{history.length} recommendations</Text>
        </View>
        {history.length > 0 && (
          <TouchableOpacity onPress={handleClearHistory}>
            <Icon name="trash-outline" size={24} color={Theme.error} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.filterContainer}>
        <FilterButton
          label="All"
          isActive={filter === 'all'}
          onPress={() => setFilter('all')}
        />
        <FilterButton
          label="Critical"
          isActive={filter === 'critical'}
          onPress={() => setFilter('critical')}
          color={Theme.critical}
        />
        <FilterButton
          label="Warning"
          isActive={filter === 'warning'}
          onPress={() => setFilter('warning')}
          color={Theme.warning}
        />
        <FilterButton
          label="Caution"
          isActive={filter === 'caution'}
          onPress={() => setFilter('caution')}
          color={Theme.caution}
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
              : 'Try a different filter'}
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const FilterButton: React.FC<{
  label: string;
  isActive: boolean;
  onPress: () => void;
  color?: string;
}> = ({ label, isActive, onPress, color = Theme.primary }) => (
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
        isActive && { color: Theme.textLight },
      ]}
    >
      {label}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Theme.textLight,
  },
  subtitle: {
    fontSize: 14,
    color: Theme.textSecondary,
    marginTop: 4,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Theme.backgroundGray,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Theme.textLight,
  },
  listContent: {
    padding: 16,
  },
  historyCard: {
    backgroundColor: Theme.textLight,
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
    marginBottom: 12,
  },
  timestamp: {
    fontSize: 12,
    color: Theme.textSecondary,
  },
  message: {
    fontSize: 14,
    color: Theme.textLight,
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
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  labelText: {
    fontSize: 10,
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
    color: Theme.primary,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: Theme.primary,
    textAlign: 'center',
  },
});