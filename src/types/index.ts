// src/types/index.ts - COMPLETE FIXED VERSION

export type PriorityLevel = 'critical' | 'warning' | 'caution' | 'normal';

export type ConnectionState = 
  | 'disconnected' 
  | 'connecting' 
  | 'connected' 
  | 'reconnecting' 
  | 'error';

export interface HealthRecommendation {
  timestamp: string;
  message: string;
  summary: string;
  advice: string;
  priority: PriorityLevel;
  active_labels?: string[];
}

export interface SensorData {
  timestamp: string;
  sensors: {
    body_temp: number;
    ambient_temp: number;
    pressure_hpa: number;
    humidity_pct: number;
    accel_x: number;
    accel_y: number;
    accel_z: number;
    gyro_x: number;
    gyro_y: number;
    gyro_z: number;
    heart_rate_bpm: number;
    spo2_pct: number;
  };
}

export interface HealthStatus {
  timestamp: string;
  priority: PriorityLevel;
}

export interface HealthAlert {
  timestamp: string;
  level: 'critical' | 'warning';
  message: string;
  labels: string[];
}

export interface DiscoveredDevice {
  name: string;
  host: string;
  addresses: string[];
  port: number;
  txt?: {
    version?: string;
    service?: string;
    description?: string;
  };
}

export interface MQTTConfig {
  uri: string;
  clientId: string;
  keepalive: number;
  clean?: boolean;
  reconnectPeriod?: number;
}

export interface AppSettings {
  brokerAddress: string;
  brokerPort: number;  // ADDED THIS
  notificationsEnabled: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;  // ADDED THIS
  connectionTimeout: number;
  autoReconnect: boolean;  // ADDED THIS
  lastConnectedIp: string | null;
  chartRefreshRate?: number;  // ADDED THIS
  historyRetentionDays?: number;  // ADDED THIS
  darkModeEnabled?: boolean;  // ADDED THIS
  language?: string;  // ADDED THIS
}

export interface SensorChartData {
  timestamp: string;
  value: number;
}

export interface HistoryItem extends HealthRecommendation {
  id: string;
}

// Navigation types
export type RootStackParamList = {
  Connection: undefined;
  Main: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Sensors: undefined;
  History: undefined;
  Settings: undefined;
};


// // src/types/index.ts

// /**
//  * Priority Levels for Health Status
//  */
// export type PriorityLevel = 'critical' | 'warning' | 'caution' | 'normal';

// /**
//  * MQTT Topic 1: health/recommendation
//  * QoS: 1 (At least once delivery)
//  * Main health recommendation message
//  */
// export interface HealthRecommendation {
//   timestamp: string;
//   message: string;
//   summary: string;
//   advice: string;
//   priority: PriorityLevel;
//   active_labels?: string[];
// }

// /**
//  * MQTT Topic 2: health/sensors
//  * QoS: 0 (Fire and forget)
//  * Raw sensor data for visualization
//  */
// export interface SensorData {
//   timestamp: string;
//   sensors: {
//     body_temp: number;
//     ambient_temp: number;
//     pressure_hpa: number;
//     humidity_pct: number;
//     accel_x: number;
//     accel_y: number;
//     accel_z: number;
//     gyro_x: number;
//     gyro_y: number;
//     gyro_z: number;
//     heart_rate_bpm: number;
//     spo2_pct: number;
//   };
// }

// /**
//  * MQTT Topic 3: health/status
//  * QoS: 1
//  * Quick health status overview
//  */
// export interface HealthStatus {
//   timestamp: string;
//   priority: PriorityLevel;
// }

// /**
//  * MQTT Topic 4: health/alerts
//  * QoS: 2 (Exactly once)
//  * Critical alerts requiring immediate attention
//  */
// export interface HealthAlert {
//   timestamp: string;
//   level: 'critical' | 'warning';
//   message: string;
//   labels: string[];
// }

// /**
//  * mDNS Service Discovery
//  */
// export interface DiscoveredService {
//   name: string;
//   host: string;
//   addresses: string[];
//   port: number;
//   txt?: Record<string, string>;
// }

// /**
//  * MQTT Connection Configuration
//  */
// export interface MQTTConfig {
//   brokerAddress: string;
//   brokerPort: number;
//   clientId: string;
//   keepalive: number;
//   reconnectPeriod: number;
// }

// /**
//  * Connection State
//  */
// export type ConnectionState = 
//   | 'disconnected' 
//   | 'searching' 
//   | 'connecting' 
//   | 'connected' 
//   | 'reconnecting' 
//   | 'error';

// /**
//  * Stored Connection Info
//  */
// export interface StoredConnection {
//   ipAddress: string;
//   port: number;
//   lastConnected: string;
// }

// /**
//  * History Item
//  */
// export interface HistoryItem extends HealthRecommendation {
//   id: string;
// }

// /**
//  * App Settings
//  */
// export interface AppSettings {
//   notificationsEnabled: boolean;
//   notificationSound: boolean;
//   connectionTimeout: number;
//   autoReconnect: boolean;
//   theme: 'light' | 'dark';
// }

// /**
//  * Chart Data Point
//  */
// export interface ChartDataPoint {
//   timestamp: Date;
//   value: number;
// }

// /**
//  * Sensor Chart Data
//  */
// export interface SensorChartData {
//   bodyTemp: ChartDataPoint[];
//   heartRate: ChartDataPoint[];
//   spo2: ChartDataPoint[];
//   ambientTemp: ChartDataPoint[];
// }

// /**
//  * Navigation Types
//  */
// export type RootStackParamList = {
//   Connection: undefined;
//   Main: undefined;
//   Home: undefined;
//   Sensors: undefined;
//   History: undefined;
//   Settings: undefined;
// };