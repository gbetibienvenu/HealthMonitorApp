// src/constants/config.ts

import { AppSettings } from '../types';

/**
 * Complete configuration for the Health Monitor App
 * All app constants, MQTT settings, and default values
 */

// ==================== MQTT Configuration ====================
export const Config = {
  mqtt: {
    // Connection settings
    defaultPort: 1883,
    defaultHost: '',
    keepalive: 60,                    // Keep-alive interval in seconds
    reconnectPeriod: 5000,            // Reconnect after 5 seconds
    connectTimeout: 30000,            // Connection timeout (30 seconds)
    cleanSession: true,
    useSSL: false,
    
    // Quality of Service levels for each topic
    qos: {
      recommendation: 1,              // At least once delivery
      sensors: 0,                     // Fire and forget
      status: 1,                      // At least once delivery
      alerts: 2,                      // Exactly once delivery
    },

    // Retry settings
    maxReconnectAttempts: 10,
    reconnectBackoff: 1.5,            // Exponential backoff multiplier
  },

  // ==================== mDNS/Zeroconf Configuration ====================
  mdns: {
    serviceName: 'VitaBand',          // The service name to look for
    serviceType: '_mqtt._tcp.local.',  // mDNS service type
    scanTimeout: 30000,                // Stop scanning after 30 seconds
    rescanInterval: 60000,             // Rescan every 60 seconds if needed
    
    // Expected service properties
    expectedProperties: {
      service: 'health-monitoring',
      version: '1.0',
    },
  },

  // ==================== MQTT Topics ====================
  topics: {
    recommendation: 'health/recommendation',  // Main health recommendations
    sensors: 'health/sensors',                // Real-time sensor data
    status: 'health/status',                  // Quick status updates
    alerts: 'health/alerts',                  // Critical alerts
    
    // Wildcard topics (for debugging)
    all: 'health/#',                          // Subscribe to all health topics
  },

  // ==================== App Configuration ====================
  app: {
    // Update intervals
    updateInterval: 300000,           // 5 minutes in milliseconds
    sensorUpdateInterval: 5000,       // Sensor data every 5 seconds
    statusCheckInterval: 10000,       // Check connection status every 10 seconds
    
    // Data limits
    maxHistoryItems: 100,             // Keep last 100 recommendations
    chartDataPoints: 15,              // Show last 15 data points in charts
    maxCachedSensorData: 50,          // Cache last 50 sensor readings
    
    // Notification settings
    notificationChannelId: 'health_alerts',
    notificationChannelName: 'Health Alerts',
    notificationChannelDescription: 'Critical health alerts and recommendations',
    
    // UI settings
    animationDuration: 300,           // Animation duration in ms
    refreshThreshold: 80,             // Pull-to-refresh threshold
    
    // App metadata
    appName: 'Health Monitor',
    appVersion: '1.0.0',
    appDescription: 'Real-time health monitoring system',
  },

  // ==================== Storage Keys ====================
  storage: {
    lastConnectedIp: '@health_monitor:last_ip',
    lastConnectedPort: '@health_monitor:last_port',
    settings: '@health_monitor:settings',
    history: '@health_monitor:history',
    lastRecommendation: '@health_monitor:last_recommendation',
    sensorCache: '@health_monitor:sensor_cache',
    userPreferences: '@health_monitor:user_preferences',
    appState: '@health_monitor:app_state',
    
    // Keys for different data types
    keys: {
      firstLaunch: '@health_monitor:first_launch',
      onboardingCompleted: '@health_monitor:onboarding_completed',
      notificationPermission: '@health_monitor:notification_permission',
      themePreference: '@health_monitor:theme_preference',
    },
  },

  // ==================== Default Settings ====================
  defaultSettings: {
    brokerAddress: '',
    brokerPort: 1883,
    notificationsEnabled: true,
    soundEnabled: true,
    vibrationEnabled: true,
    connectionTimeout: 30000,
    autoReconnect: true,
    lastConnectedIp: null,
    
    // Additional settings
    chartRefreshRate: 5000,
    historyRetentionDays: 30,
    darkModeEnabled: false,
    language: 'en',
  } as AppSettings,

  // ==================== Test/Development Configuration ====================
  development: {
    // Public MQTT test broker (for testing without Raspberry Pi)
    testBroker: {
      host: 'test.mosquitto.org',
      port: 1883,
      protocol: 'mqtt',
    },
    
    // Alternative test brokers
    alternativeBrokers: [
      {
        name: 'Eclipse Mosquitto',
        host: 'mqtt.eclipse.org',
        port: 1883,
      },
      {
        name: 'HiveMQ Public',
        host: 'broker.hivemq.com',
        port: 1883,
      },
    ],
    
    // Mock data settings
    useMockData: false,
    mockDataInterval: 5000,
    enableDebugLogs: true,
  },

  // ==================== Sensor Configuration ====================
  sensors: {
    // Sensor types and their properties
    types: {
      bodyTemperature: {
        key: 'body_temp',
        name: 'Body Temperature',
        unit: '°C',
        min: 35.0,
        max: 42.0,
        normalRange: [36.5, 37.5],
        chartColor: '#FF5722',
      },
      heartRate: {
        key: 'heart_rate_bpm',
        name: 'Heart Rate',
        unit: 'BPM',
        min: 40,
        max: 200,
        normalRange: [60, 100],
        chartColor: '#E91E63',
      },
      spO2: {
        key: 'spo2_pct',
        name: 'Blood Oxygen',
        unit: '%',
        min: 70,
        max: 100,
        normalRange: [95, 100],
        chartColor: '#2196F3',
      },
      ambientTemperature: {
        key: 'ambient_temp',
        name: 'Ambient Temperature',
        unit: '°C',
        min: -10,
        max: 50,
        normalRange: [18, 26],
        chartColor: '#FF9800',
      },
      humidity: {
        key: 'humidity_pct',
        name: 'Humidity',
        unit: '%',
        min: 0,
        max: 100,
        normalRange: [30, 60],
        chartColor: '#00BCD4',
      },
      pressure: {
        key: 'pressure_hpa',
        name: 'Pressure',
        unit: 'hPa',
        min: 950,
        max: 1050,
        normalRange: [1000, 1020],
        chartColor: '#9C27B0',
      },
    },
  },

  // ==================== Priority Levels ====================
  priority: {
    levels: {
      critical: {
        name: 'Critical',
        emoji: '🔴',
        color: '#F44336',
        notificationPriority: 'high',
        vibrationPattern: [0, 500, 200, 500],
        requiresImmediate: true,
      },
      warning: {
        name: 'Warning',
        emoji: '🟠',
        color: '#FF9800',
        notificationPriority: 'high',
        vibrationPattern: [0, 300, 100, 300],
        requiresImmediate: false,
      },
      caution: {
        name: 'Caution',
        emoji: '🟡',
        color: '#FFC107',
        notificationPriority: 'default',
        vibrationPattern: [0, 200],
        requiresImmediate: false,
      },
      normal: {
        name: 'Normal',
        emoji: '🟢',
        color: '#4CAF50',
        notificationPriority: 'low',
        vibrationPattern: [],
        requiresImmediate: false,
      },
    },
  },

  // ==================== Network Configuration ====================
  network: {
    timeout: 30000,                    // Network timeout
    retryAttempts: 3,                  // Number of retry attempts
    retryDelay: 2000,                  // Delay between retries
    
    // WiFi requirements
    requiresWiFi: true,                // App requires WiFi (same network as Pi)
    allowCellular: false,              // Don't allow cellular data
    
    // Connection health check
    healthCheckInterval: 30000,        // Check connection health every 30s
    healthCheckTimeout: 5000,          // Health check timeout
  },

  // ==================== UI Configuration ====================
  ui: {
    // Touch target sizes (accessibility)
    minTouchTarget: 44,                // Minimum touch target size (iOS HIG)
    
    // Spacing
    spacing: {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
    },
    
    // Border radius
    borderRadius: {
      sm: 4,
      md: 8,
      lg: 12,
      xl: 16,
      round: 999,
    },
    
    // Font sizes
    fontSize: {
      xs: 10,
      sm: 12,
      md: 14,
      lg: 16,
      xl: 18,
      xxl: 20,
      display: 24,
      hero: 32,
    },
  },

  // ==================== Feature Flags ====================
  features: {
    enableNotifications: true,
    enableSensorCharts: true,
    enableHistory: true,
    enableOfflineMode: true,
    enableAutoReconnect: true,
    enableBackgroundMode: false,       // Background mode (future feature)
    enableDataExport: true,
    enableDarkMode: false,             // Dark mode (future feature)
  },

  // ==================== Performance Configuration ====================
  performance: {
    // Chart performance
    maxChartDataPoints: 50,            // Limit chart data for performance
    chartUpdateThrottle: 1000,         // Throttle chart updates (1 second)
    
    // List performance
    listPageSize: 20,                  // Items per page in lists
    listInitialNumToRender: 10,        // Initial items to render
    
    // Memory management
    enableMemoryOptimization: true,
    clearCacheOnLowMemory: true,
  },

  // ==================== Error Messages ====================
  errors: {
    connection: {
      timeout: 'Connection timeout. Please check your network.',
      refused: 'Connection refused. Check if device is online.',
      lost: 'Connection lost. Attempting to reconnect...',
      noDevice: 'No device found. Make sure you\'re on the same WiFi network.',
    },
    mqtt: {
      subscriptionFailed: 'Failed to subscribe to topics.',
      publishFailed: 'Failed to publish message.',
      invalidMessage: 'Received invalid message format.',
    },
    storage: {
      saveFailed: 'Failed to save data.',
      loadFailed: 'Failed to load data.',
      clearFailed: 'Failed to clear data.',
    },
  },

  // ==================== Success Messages ====================
  success: {
    connection: {
      connected: 'Successfully connected to Health Monitor!',
      reconnected: 'Reconnected successfully.',
      deviceFound: 'Device found!',
    },
    storage: {
      saved: 'Data saved successfully.',
      cleared: 'Data cleared successfully.',
      exported: 'Data exported successfully.',
    },
  },
};

// ==================== Environment-specific Configuration ====================
export const getEnvironmentConfig = () => {
  const isDevelopment = __DEV__;
  
  return {
    isDevelopment,
    apiEndpoint: isDevelopment ? Config.development.testBroker.host : '',
    enableLogging: isDevelopment && Config.development.enableDebugLogs,
    useMockData: isDevelopment && Config.development.useMockData,
  };
};

// ==================== Helper Functions ====================

/**
 * Get sensor configuration by key
 */
export const getSensorConfig = (sensorKey: string) => {
  const sensorTypes = Config.sensors.types;
  return Object.values(sensorTypes).find((s) => s.key === sensorKey);
};

/**
 * Get priority configuration by level
 */
export const getPriorityConfig = (level: string) => {
  return Config.priority.levels[level as keyof typeof Config.priority.levels];
};

/**
 * Validate broker address format
 */
export const isValidBrokerAddress = (address: string): boolean => {
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
  const hostnameRegex = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return ipv4Regex.test(address) || hostnameRegex.test(address);
};

/**
 * Validate port number
 */
export const isValidPort = (port: number): boolean => {
  return port >= 1 && port <= 65535;
};

// ==================== Export ====================
export default Config;