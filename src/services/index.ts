// src/services/index.ts

/**
 * Export all services from a single entry point
 * This makes imports cleaner throughout the app
 */

export { default as NotificationService } from './notificationService';
export { default as MqttService } from './mqttService';
export { default as DiscoveryService } from './discoveryService';

// Note: StorageService is in utils folder, not services
// Import it from utils instead: import StorageService from '../utils/storage'