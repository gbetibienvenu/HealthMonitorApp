// src/services/mqttService.ts - FIXED FOR PAHO MQTT

import Paho from 'paho-mqtt';
import { 
  HealthRecommendation, 
  SensorData, 
  HealthStatus, 
  HealthAlert,
  ConnectionState 
} from '../types';
import { Config } from '../constants/config';
import NotificationService from './notificationService';
import { StorageService } from '../utils/storage';

/**
 * MQTT Service using Paho MQTT (React Native compatible)
 */
class MQTTService {
  private client: Paho.Client | null = null;
  private connectionState: ConnectionState = 'disconnected';
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private brokerAddress: string = '';
  private brokerPort: number = 1883;
  
  // Callback handlers
  private onRecommendationCallback: ((data: HealthRecommendation) => void) | null = null;
  private onSensorDataCallback: ((data: SensorData) => void) | null = null;
  private onStatusCallback: ((data: HealthStatus) => void) | null = null;
  private onAlertCallback: ((data: HealthAlert) => void) | null = null;
  private onConnectionStateCallback: ((state: ConnectionState) => void) | null = null;

  /**
   * Connect to MQTT broker
   */
  async connect(brokerAddress: string, brokerPort: number): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.brokerAddress = brokerAddress;
        this.brokerPort = brokerPort;
        this.updateConnectionState('connecting');
        
        console.log(`🔌 Connecting to MQTT broker at ${brokerAddress}:${brokerPort}...`);

        // Create Paho client
        const clientId = `health_monitor_${Date.now()}_${Math.random().toString(36).substring(7)}`;
        this.client = new Paho.Client(brokerAddress, brokerPort, clientId);

        // Set up callbacks
        this.client.onConnectionLost = this.onConnectionLost.bind(this);
        this.client.onMessageArrived = this.onMessageArrived.bind(this);

        // Connect options
        const connectOptions: Paho.ConnectionOptions = {
          timeout: Config.mqtt.connectTimeout / 1000,
          keepAliveInterval: Config.mqtt.keepalive,
          cleanSession: Config.mqtt.cleanSession,
          useSSL: false,
          onSuccess: async () => {
            console.log('✅ Connected to MQTT broker successfully');
            this.updateConnectionState('connected');
            this.subscribeToTopics();
            
            // Save connection info
            await StorageService.saveLastConnectedIp(brokerAddress);
            await StorageService.updateSettings({ 
              brokerAddress, 
              brokerPort,
              lastConnectedIp: brokerAddress,
            });
            
            resolve();
          },
          onFailure: (error: any) => {
            console.error('❌ MQTT connection failed:', error);
            this.updateConnectionState('error');
            reject(new Error(error.errorMessage || 'Connection failed'));
          },
        };

        // Connect
        this.client.connect(connectOptions);

      } catch (error) {
        console.error('❌ MQTT connection error:', error);
        this.updateConnectionState('error');
        reject(error);
      }
    });
  }

  /**
   * Disconnect from MQTT broker
   */
  async disconnect(): Promise<void> {
    try {
      if (this.reconnectTimer) {
        clearTimeout(this.reconnectTimer);
        this.reconnectTimer = null;
      }

      if (this.client && this.client.isConnected()) {
        this.client.disconnect();
      }

      this.client = null;
      this.updateConnectionState('disconnected');
      console.log('✅ Disconnected from MQTT broker');
    } catch (error) {
      console.error('❌ MQTT disconnect error:', error);
      throw error;
    }
  }

  /**
   * Subscribe to all health monitoring topics
   */
  private subscribeToTopics(): void {
    if (!this.client || !this.client.isConnected()) {
      console.error('Cannot subscribe: MQTT client not connected');
      return;
    }

    try {
      // Subscribe to recommendation topic (QoS 1)
      this.client.subscribe(Config.topics.recommendation, {
        qos: Config.mqtt.qos.recommendation,
      });
      console.log(`✅ Subscribed to ${Config.topics.recommendation}`);

      // Subscribe to sensor data topic (QoS 0)
      this.client.subscribe(Config.topics.sensors, {
        qos: Config.mqtt.qos.sensors,
      });
      console.log(`✅ Subscribed to ${Config.topics.sensors}`);

      // Subscribe to status topic (QoS 1)
      this.client.subscribe(Config.topics.status, {
        qos: Config.mqtt.qos.status,
      });
      console.log(`✅ Subscribed to ${Config.topics.status}`);

      // Subscribe to alerts topic (QoS 2)
      this.client.subscribe(Config.topics.alerts, {
        qos: Config.mqtt.qos.alerts,
      });
      console.log(`✅ Subscribed to ${Config.topics.alerts}`);

    } catch (error) {
      console.error('❌ Error subscribing to topics:', error);
    }
  }

  /**
   * Handle message arrived
   */
  private onMessageArrived(message: Paho.Message): void {
    try {
      const topic = message.destinationName;
      const payload = message.payloadString;
      const data = JSON.parse(payload);
      
      console.log(`📨 Message received on ${topic}`);

      switch (topic) {
        case Config.topics.recommendation:
          this.handleRecommendation(data);
          break;
        case Config.topics.sensors:
          this.handleSensorData(data);
          break;
        case Config.topics.status:
          this.handleStatus(data);
          break;
        case Config.topics.alerts:
          this.handleAlert(data);
          break;
        default:
          console.warn('⚠️ Unknown topic:', topic);
      }
    } catch (error) {
      console.error('❌ Error handling message:', error);
    }
  }

  /**
   * Handle connection lost
   */
  private onConnectionLost(response: any): void {
    console.log('❌ MQTT connection lost:', response.errorMessage);
    this.updateConnectionState('disconnected');
    this.attemptReconnect();
  }

  /**
   * Handle recommendation message
   */
  private async handleRecommendation(data: HealthRecommendation): Promise<void> {
    try {
      await StorageService.saveRecommendationToHistory(data);
      await StorageService.saveLastRecommendation(data);

      if (this.onRecommendationCallback) {
        this.onRecommendationCallback(data);
      }

      if (data.priority === 'warning' || data.priority === 'critical') {
        await NotificationService.showRecommendation(data.message, data.priority);
      }
    } catch (error) {
      console.error('❌ Error handling recommendation:', error);
    }
  }

  /**
   * Handle sensor data message
   */
  private handleSensorData(data: SensorData): void {
    if (this.onSensorDataCallback) {
      this.onSensorDataCallback(data);
    }
  }

  /**
   * Handle status message
   */
  private handleStatus(data: HealthStatus): void {
    if (this.onStatusCallback) {
      this.onStatusCallback(data);
    }
  }

  /**
   * Handle alert message
   */
  private async handleAlert(data: HealthAlert): Promise<void> {
    try {
      await NotificationService.showHealthAlert(data);

      if (this.onAlertCallback) {
        this.onAlertCallback(data);
      }
    } catch (error) {
      console.error('❌ Error handling alert:', error);
    }
  }

  /**
   * Attempt to reconnect
   */
  private async attemptReconnect(): Promise<void> {
    try {
      const settings = await StorageService.getSettings();
      
      if (!settings?.autoReconnect) {
        console.log('Auto-reconnect is disabled');
        return;
      }

      if (this.reconnectTimer) {
        return;
      }

      console.log('🔄 Attempting reconnect in 5 seconds...');
      this.updateConnectionState('reconnecting');
      
      this.reconnectTimer = setTimeout(async () => {
        this.reconnectTimer = null;
        
        if (this.brokerAddress && this.brokerPort) {
          try {
            await this.connect(this.brokerAddress, this.brokerPort);
          } catch (error) {
            console.error('❌ Reconnection failed:', error);
          }
        }
      }, Config.mqtt.reconnectPeriod);
    } catch (error) {
      console.error('❌ Error in reconnect attempt:', error);
    }
  }

  /**
   * Update connection state and notify listeners
   */
  private updateConnectionState(state: ConnectionState): void {
    this.connectionState = state;
    if (this.onConnectionStateCallback) {
      this.onConnectionStateCallback(state);
    }
  }

  /**
   * Register callback handlers
   */
  onRecommendation(callback: (data: HealthRecommendation) => void): void {
    this.onRecommendationCallback = callback;
  }

  onSensorData(callback: (data: SensorData) => void): void {
    this.onSensorDataCallback = callback;
  }

  onStatus(callback: (data: HealthStatus) => void): void {
    this.onStatusCallback = callback;
  }

  onAlert(callback: (data: HealthAlert) => void): void {
    this.onAlertCallback = callback;
  }

  onConnectionState(callback: (state: ConnectionState) => void): void {
    this.onConnectionStateCallback = callback;
  }

  /**
   * Get current connection state
   */
  getConnectionState(): { isConnected: boolean; isConnecting: boolean; error: string | null; lastConnected: string | null } {
    return {
      isConnected: this.connectionState === 'connected',
      isConnecting: this.connectionState === 'connecting' || this.connectionState === 'reconnecting',
      error: this.connectionState === 'error' ? 'Connection error' : null,
      lastConnected: this.connectionState === 'connected' ? new Date().toISOString() : null,
    };
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.connectionState === 'connected' && this.client?.isConnected() === true;
  }
}

// Export singleton
export const getMQTTService = (() => {
  let instance: MQTTService | null = null;
  return () => {
    if (!instance) {
      instance = new MQTTService();
    }
    return instance;
  };
})();

export default getMQTTService();

// // src/services/mqttService.ts

// import * as mqtt from 'mqtt';
// import { 
//   HealthRecommendation, 
//   SensorData, 
//   HealthStatus, 
//   HealthAlert,
//   ConnectionState 
// } from '../types';
// import { Config } from '../constants/config';
// import NotificationService from './notificationService';
// import { StorageService } from '../utils/storage';

// /**
//  * MQTT Service
//  * Handles connection to Raspberry Pi MQTT broker and message handling
//  */
// class MQTTService {
//   private client: mqtt.MqttClient | null = null;
//   private connectionState: ConnectionState = 'disconnected';
//   private reconnectTimer: NodeJS.Timeout | null = null;
  
//   // Callback handlers
//   private onRecommendationCallback: ((data: HealthRecommendation) => void) | null = null;
//   private onSensorDataCallback: ((data: SensorData) => void) | null = null;
//   private onStatusCallback: ((data: HealthStatus) => void) | null = null;
//   private onAlertCallback: ((data: HealthAlert) => void) | null = null;
//   private onConnectionStateCallback: ((state: ConnectionState) => void) | null = null;

//   /**
//    * Connect to MQTT broker
//    */
//   async connect(brokerAddress: string, brokerPort: number): Promise<void> {
//     try {
//       this.updateConnectionState('connecting');
      
//       console.log(`🔌 Connecting to MQTT broker at ${brokerAddress}:${brokerPort}...`);

//       // Create MQTT client with mqtt.js
//       const brokerUrl = `mqtt://${brokerAddress}:${brokerPort}`;
      
//       this.client = mqtt.connect(brokerUrl, {
//         clientId: `health_monitor_${Date.now()}`,
//         keepalive: Config.mqtt.keepalive,
//         reconnectPeriod: Config.mqtt.reconnectPeriod,
//         connectTimeout: Config.mqtt.connectTimeout,
//         clean: Config.mqtt.cleanSession,
//       });

//       // Set up event handlers
//       this.setupEventHandlers();

//       // Save connection info
//       await StorageService.saveLastConnectedIp(brokerAddress);
//       await StorageService.updateSettings({ 
//         brokerAddress, 
//         brokerPort,
//         lastConnectedIp: brokerAddress,
//       });

//     } catch (error) {
//       console.error('❌ MQTT connection error:', error);
//       this.updateConnectionState('error');
//       throw error;
//     }
//   }

//   /**
//    * Disconnect from MQTT broker
//    */
//   async disconnect(): Promise<void> {
//     try {
//       if (this.reconnectTimer) {
//         clearTimeout(this.reconnectTimer);
//         this.reconnectTimer = null;
//       }

//       if (this.client) {
//         this.client.end(true);
//         this.client = null;
//       }

//       this.updateConnectionState('disconnected');
//       console.log('✅ Disconnected from MQTT broker');
//     } catch (error) {
//       console.error('❌ MQTT disconnect error:', error);
//       throw error;
//     }
//   }

//   /**
//    * Setup MQTT event handlers
//    */
//   private setupEventHandlers(): void {
//     if (!this.client) return;

//     // Connection successful
//     this.client.on('connect', () => {
//       console.log('✅ Connected to MQTT broker successfully');
//       this.updateConnectionState('connected');
//       this.subscribeToTopics();
//     });

//     // Message received
//     this.client.on('message', (topic: string, message: Buffer) => {
//       this.handleMessage(topic, message);
//     });

//     // Connection lost
//     this.client.on('close', () => {
//       console.log('❌ MQTT connection closed');
//       this.updateConnectionState('disconnected');
//       this.attemptReconnect();
//     });

//     // Error occurred
//     this.client.on('error', (error: Error) => {
//       console.error('⚠️ MQTT error:', error);
//       this.updateConnectionState('error');
//     });

//     // Reconnecting
//     this.client.on('reconnect', () => {
//       console.log('🔄 MQTT reconnecting...');
//       this.updateConnectionState('reconnecting');
//     });

//     // Offline
//     this.client.on('offline', () => {
//       console.log('📴 MQTT client is offline');
//       this.updateConnectionState('disconnected');
//     });
//   }

//   /**
//    * Subscribe to all health monitoring topics
//    */
//   private subscribeToTopics(): void {
//     if (!this.client) {
//       console.error('Cannot subscribe: MQTT client not connected');
//       return;
//     }

//     try {
//       // Subscribe to recommendation topic (QoS 1)
//       this.client.subscribe(
//         Config.topics.recommendation, 
//         { qos: Config.mqtt.qos.recommendation as mqtt.QoS },
//         (err) => {
//           if (err) {
//             console.error(`❌ Error subscribing to ${Config.topics.recommendation}:`, err);
//           } else {
//             console.log(`✅ Subscribed to ${Config.topics.recommendation}`);
//           }
//         }
//       );

//       // Subscribe to sensor data topic (QoS 0)
//       this.client.subscribe(
//         Config.topics.sensors, 
//         { qos: Config.mqtt.qos.sensors as mqtt.QoS },
//         (err) => {
//           if (err) {
//             console.error(`❌ Error subscribing to ${Config.topics.sensors}:`, err);
//           } else {
//             console.log(`✅ Subscribed to ${Config.topics.sensors}`);
//           }
//         }
//       );

//       // Subscribe to status topic (QoS 1)
//       this.client.subscribe(
//         Config.topics.status, 
//         { qos: Config.mqtt.qos.status as mqtt.QoS },
//         (err) => {
//           if (err) {
//             console.error(`❌ Error subscribing to ${Config.topics.status}:`, err);
//           } else {
//             console.log(`✅ Subscribed to ${Config.topics.status}`);
//           }
//         }
//       );

//       // Subscribe to alerts topic (QoS 2)
//       this.client.subscribe(
//         Config.topics.alerts, 
//         { qos: Config.mqtt.qos.alerts as mqtt.QoS },
//         (err) => {
//           if (err) {
//             console.error(`❌ Error subscribing to ${Config.topics.alerts}:`, err);
//           } else {
//             console.log(`✅ Subscribed to ${Config.topics.alerts}`);
//           }
//         }
//       );

//     } catch (error) {
//       console.error('Error subscribing to topics:', error);
//     }
//   }

//   /**
//    * Handle incoming MQTT messages
//    */
//   private handleMessage(topic: string, message: Buffer): void {
//     try {
//       const data = JSON.parse(message.toString());
//       console.log(`📨 Message received on ${topic}`);

//       switch (topic) {
//         case Config.topics.recommendation:
//           this.handleRecommendation(data);
//           break;
//         case Config.topics.sensors:
//           this.handleSensorData(data);
//           break;
//         case Config.topics.status:
//           this.handleStatus(data);
//           break;
//         case Config.topics.alerts:
//           this.handleAlert(data);
//           break;
//         default:
//           console.warn('⚠️ Unknown topic:', topic);
//       }
//     } catch (error) {
//       console.error('❌ Error handling message:', error);
//     }
//   }

//   /**
//    * Handle recommendation message
//    */
//   private async handleRecommendation(data: HealthRecommendation): Promise<void> {
//     try {
//       // Save to history using static method
//       await StorageService.saveRecommendationToHistory(data);
      
//       // Save as last recommendation for offline mode
//       await StorageService.saveLastRecommendation(data);

//       // Notify callback
//       if (this.onRecommendationCallback) {
//         this.onRecommendationCallback(data);
//       }

//       // Show notification if priority is warning or critical
//       if (data.priority === 'warning' || data.priority === 'critical') {
//         await NotificationService.showRecommendation(data.message, data.priority);
//       }
//     } catch (error) {
//       console.error('❌ Error handling recommendation:', error);
//     }
//   }

//   /**
//    * Handle sensor data message
//    */
//   private handleSensorData(data: SensorData): void {
//     if (this.onSensorDataCallback) {
//       this.onSensorDataCallback(data);
//     }
//   }

//   /**
//    * Handle status message
//    */
//   private handleStatus(data: HealthStatus): void {
//     if (this.onStatusCallback) {
//       this.onStatusCallback(data);
//     }
//   }

//   /**
//    * Handle alert message
//    */
//   private async handleAlert(data: HealthAlert): Promise<void> {
//     try {
//       // Show push notification
//       await NotificationService.showHealthAlert(data);

//       // Notify callback
//       if (this.onAlertCallback) {
//         this.onAlertCallback(data);
//       }
//     } catch (error) {
//       console.error('❌ Error handling alert:', error);
//     }
//   }

//   /**
//    * Attempt to reconnect
//    */
//   private async attemptReconnect(): Promise<void> {
//     try {
//       const settings = await StorageService.getSettings();
      
//       if (!settings?.autoReconnect) {
//         console.log('Auto-reconnect is disabled');
//         return;
//       }

//       if (this.reconnectTimer) {
//         return;
//       }

//       console.log('🔄 Attempting reconnect in 5 seconds...');
      
//       this.reconnectTimer = setTimeout(async () => {
//         this.reconnectTimer = null;
        
//         const lastIp = await StorageService.getLastConnectedIp();
//         if (lastIp && settings.brokerPort) {
//           try {
//             await this.connect(lastIp, settings.brokerPort);
//           } catch (error) {
//             console.error('❌ Reconnection failed:', error);
//           }
//         }
//       }, Config.mqtt.reconnectPeriod);
//     } catch (error) {
//       console.error('❌ Error in reconnect attempt:', error);
//     }
//   }

//   /**
//    * Update connection state and notify listeners
//    */
//   private updateConnectionState(state: ConnectionState): void {
//     this.connectionState = state;
//     if (this.onConnectionStateCallback) {
//       this.onConnectionStateCallback(state);
//     }
//   }

//   /**
//    * Register callback handlers
//    */
//   onRecommendation(callback: (data: HealthRecommendation) => void): void {
//     this.onRecommendationCallback = callback;
//   }

//   onSensorData(callback: (data: SensorData) => void): void {
//     this.onSensorDataCallback = callback;
//   }

//   onStatus(callback: (data: HealthStatus) => void): void {
//     this.onStatusCallback = callback;
//   }

//   onAlert(callback: (data: HealthAlert) => void): void {
//     this.onAlertCallback = callback;
//   }

//   onConnectionState(callback: (state: ConnectionState) => void): void {
//     this.onConnectionStateCallback = callback;
//   }

//   /**
//    * Get current connection state
//    */
//   getConnectionState(): ConnectionState {
//     return this.connectionState;
//   }

//   /**
//    * Check if connected
//    */
//   isConnected(): boolean {
//     return this.connectionState === 'connected' && this.client?.connected === true;
//   }
// }

// export default new MQTTService();