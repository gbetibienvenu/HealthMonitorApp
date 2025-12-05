// src/utils/storage.ts

import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppSettings, HealthRecommendation, HistoryItem } from '../types';
import { Config } from '../constants/config';

export class StorageService {
  // ==================== Last Connected IP ====================
  
  static async saveLastConnectedIp(ip: string): Promise<void> {
    try {
      await AsyncStorage.setItem(Config.storage.lastConnectedIp, ip);
      console.log('Last connected IP saved:', ip);
    } catch (error) {
      console.error('Error saving last connected IP:', error);
      throw error;
    }
  }

  static async getLastConnectedIp(): Promise<string | null> {
    try {
      const ip = await AsyncStorage.getItem(Config.storage.lastConnectedIp);
      console.log('Retrieved last connected IP:', ip);
      return ip;
    } catch (error) {
      console.error('Error getting last connected IP:', error);
      return null;
    }
  }

  // ==================== App Settings ====================

  static async saveSettings(settings: AppSettings): Promise<void> {
    try {
      const settingsJson = JSON.stringify(settings);
      await AsyncStorage.setItem(Config.storage.settings, settingsJson);
      console.log('Settings saved:', settings);
    } catch (error) {
      console.error('Error saving settings:', error);
      throw error;
    }
  }

  static async getSettings(): Promise<AppSettings> {
    try {
      const settingsJson = await AsyncStorage.getItem(Config.storage.settings);
      
      if (settingsJson) {
        const settings = JSON.parse(settingsJson);
        console.log('Settings retrieved:', settings);
        return settings;
      }
      
      console.log('No settings found, returning defaults');
      return Config.defaultSettings;
    } catch (error) {
      console.error('Error getting settings:', error);
      return Config.defaultSettings;
    }
  }

  static async updateSettings(partialSettings: Partial<AppSettings>): Promise<AppSettings> {
    try {
      const currentSettings = await this.getSettings();
      const updatedSettings = { ...currentSettings, ...partialSettings };
      await this.saveSettings(updatedSettings);
      return updatedSettings;
    } catch (error) {
      console.error('Error updating settings:', error);
      throw error;
    }
  }

  // ==================== Recommendation History ====================

  static async saveRecommendationToHistory(
    recommendation: HealthRecommendation
  ): Promise<void> {
    try {
      const historyJson = await AsyncStorage.getItem(Config.storage.history);
      let history: HistoryItem[] = historyJson ? JSON.parse(historyJson) : [];

      // Create new history item with unique ID
      const newItem: HistoryItem = {
        ...recommendation,
        id: `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      };

      // Add to beginning of array (newest first)
      history.unshift(newItem);

      // Keep only last N items
      if (history.length > Config.app.maxHistoryItems) {
        history = history.slice(0, Config.app.maxHistoryItems);
      }

      await AsyncStorage.setItem(Config.storage.history, JSON.stringify(history));
      console.log('Recommendation saved to history:', newItem.id);
    } catch (error) {
      console.error('Error saving recommendation to history:', error);
      throw error;
    }
  }

  static async getHistory(): Promise<HistoryItem[]> {
    try {
      const historyJson = await AsyncStorage.getItem(Config.storage.history);
      
      if (historyJson) {
        const history: HistoryItem[] = JSON.parse(historyJson);
        console.log(`Retrieved ${history.length} history items`);
        return history;
      }
      
      console.log('No history found');
      return [];
    } catch (error) {
      console.error('Error getting history:', error);
      return [];
    }
  }

  static async clearHistory(): Promise<void> {
    try {
      await AsyncStorage.removeItem(Config.storage.history);
      console.log('History cleared');
    } catch (error) {
      console.error('Error clearing history:', error);
      throw error;
    }
  }

  static async deleteHistoryItem(id: string): Promise<void> {
    try {
      const history = await this.getHistory();
      const filteredHistory = history.filter((item) => item.id !== id);
      await AsyncStorage.setItem(
        Config.storage.history,
        JSON.stringify(filteredHistory)
      );
      console.log('History item deleted:', id);
    } catch (error) {
      console.error('Error deleting history item:', error);
      throw error;
    }
  }

  // ==================== Last Recommendation (for offline mode) ====================

  static async saveLastRecommendation(
    recommendation: HealthRecommendation
  ): Promise<void> {
    try {
      const recommendationJson = JSON.stringify(recommendation);
      await AsyncStorage.setItem(
        Config.storage.lastRecommendation,
        recommendationJson
      );
      console.log('Last recommendation saved for offline mode');
    } catch (error) {
      console.error('Error saving last recommendation:', error);
      throw error;
    }
  }

  static async getLastRecommendation(): Promise<HealthRecommendation | null> {
    try {
      const recommendationJson = await AsyncStorage.getItem(
        Config.storage.lastRecommendation
      );
      
      if (recommendationJson) {
        const recommendation: HealthRecommendation = JSON.parse(recommendationJson);
        console.log('Last recommendation retrieved');
        return recommendation;
      }
      
      console.log('No last recommendation found');
      return null;
    } catch (error) {
      console.error('Error getting last recommendation:', error);
      return null;
    }
  }

  // ==================== Sensor Data Cache (optional, for offline charts) ====================

  static async saveSensorDataCache(data: any): Promise<void> {
    try {
      const cacheJson = JSON.stringify(data);
      await AsyncStorage.setItem('@health_monitor:sensor_cache', cacheJson);
      console.log('Sensor data cached');
    } catch (error) {
      console.error('Error saving sensor cache:', error);
    }
  }

  static async getSensorDataCache(): Promise<any | null> {
    try {
      const cacheJson = await AsyncStorage.getItem('@health_monitor:sensor_cache');
      return cacheJson ? JSON.parse(cacheJson) : null;
    } catch (error) {
      console.error('Error getting sensor cache:', error);
      return null;
    }
  }

  // ==================== Clear All Data ====================

  static async clearAll(): Promise<void> {
    try {
      const keys = [
        Config.storage.lastConnectedIp,
        Config.storage.settings,
        Config.storage.history,
        Config.storage.lastRecommendation,
        '@health_monitor:sensor_cache',
      ];
      
      await AsyncStorage.multiRemove(keys);
      console.log('All storage data cleared');
    } catch (error) {
      console.error('Error clearing all storage:', error);
      throw error;
    }
  }

  // ==================== Debug & Development ====================

  static async getAllKeys(): Promise<string[]> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      console.log('All storage keys:', keys);
      return keys;
    } catch (error) {
      console.error('Error getting all keys:', error);
      return [];
    }
  }

  static async getStorageSize(): Promise<number> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      let totalSize = 0;

      for (const key of keys) {
        const value = await AsyncStorage.getItem(key);
        if (value) {
          totalSize += value.length;
        }
      }

      console.log(`Total storage size: ${totalSize} bytes`);
      return totalSize;
    } catch (error) {
      console.error('Error calculating storage size:', error);
      return 0;
    }
  }

  // ==================== Export/Import (for backup) ====================

  static async exportAllData(): Promise<string> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const data: { [key: string]: string | null } = {};

      for (const key of keys) {
        data[key] = await AsyncStorage.getItem(key);
      }

      const exportJson = JSON.stringify(data, null, 2);
      console.log('Data exported successfully');
      return exportJson;
    } catch (error) {
      console.error('Error exporting data:', error);
      throw error;
    }
  }

  static async importAllData(importJson: string): Promise<void> {
    try {
      const data: { [key: string]: string } = JSON.parse(importJson);
      
      for (const [key, value] of Object.entries(data)) {
        if (value !== null) {
          await AsyncStorage.setItem(key, value);
        }
      }

      console.log('Data imported successfully');
    } catch (error) {
      console.error('Error importing data:', error);
      throw error;
    }
  }
}

// Export as singleton instance as well
export default StorageService;