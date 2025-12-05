// src/services/discoveryService.ts

import Zeroconf from 'react-native-zeroconf';
import { DiscoveredDevice } from '../types';
import { Config } from '../constants/config';

export class DiscoveryService {
  private zeroconf: Zeroconf;
  private discoveredDevices: Map<string, DiscoveredDevice> = new Map();
  private onDeviceFoundCallback?: (device: DiscoveredDevice) => void;
  private onErrorCallback?: (error: Error) => void;

  constructor() {
    this.zeroconf = new Zeroconf();
    this.setupListeners();
  }

  private setupListeners(): void {
    // When a service is resolved
    this.zeroconf.on('resolved', (service: any) => {
      console.log('Service resolved:', service);

      // Check if this is our health monitoring service
      if (
        service.txt &&
        service.txt.service === 'health-monitoring' &&
        service.addresses &&
        service.addresses.length > 0
      ) {
        const device: DiscoveredDevice = {
          name: service.name || Config.mdns.serviceName,
          host: service.host || service.addresses[0],
          addresses: service.addresses,
          port: service.port || Config.mqtt.defaultPort,
          txt: service.txt,
        };

        const deviceKey = `${device.host}:${device.port}`;
        if (!this.discoveredDevices.has(deviceKey)) {
          this.discoveredDevices.set(deviceKey, device);
          console.log('Device discovered:', device);

          if (this.onDeviceFoundCallback) {
            this.onDeviceFoundCallback(device);
          }
        }
      }
    });

    // When a service is found
    this.zeroconf.on('found', (service: any) => {
      console.log('Service found:', service.name);
    });

    // When a service is removed
    this.zeroconf.on('remove', (service: any) => {
      console.log('Service removed:', service.name);
      const deviceKey = `${service.host}:${service.port}`;
      this.discoveredDevices.delete(deviceKey);
    });

    // On error
    this.zeroconf.on('error', (error: Error) => {
      console.error('Zeroconf error:', error);
      if (this.onErrorCallback) {
        this.onErrorCallback(error);
      }
    });
  }

  // Start scanning for devices
  async startScan(
    onDeviceFound?: (device: DiscoveredDevice) => void,
    onError?: (error: Error) => void
  ): Promise<void> {
    try {
      this.onDeviceFoundCallback = onDeviceFound;
      this.onErrorCallback = onError;
      this.discoveredDevices.clear();

      console.log('Starting mDNS scan...');
      
      // Scan for MQTT services
      this.zeroconf.scan('mqtt', 'tcp', 'local.');

      // Set timeout to stop scan
      setTimeout(() => {
        this.stopScan();
      }, Config.mdns.scanTimeout);
    } catch (error) {
      console.error('Error starting scan:', error);
      if (onError) {
        onError(error as Error);
      }
    }
  }

  // Stop scanning
  stopScan(): void {
    try {
      console.log('Stopping mDNS scan...');
      this.zeroconf.stop();
    } catch (error) {
      console.error('Error stopping scan:', error);
    }
  }

  // Get discovered devices
  getDiscoveredDevices(): DiscoveredDevice[] {
    return Array.from(this.discoveredDevices.values());
  }

  // Clear discovered devices
  clearDiscoveredDevices(): void {
    this.discoveredDevices.clear();
  }

  // Check if any devices found
  hasDevices(): boolean {
    return this.discoveredDevices.size > 0;
  }

  // Get first discovered device
  getFirstDevice(): DiscoveredDevice | null {
    const devices = this.getDiscoveredDevices();
    return devices.length > 0 ? devices[0] : null;
  }

  // Remove listeners and cleanup
  destroy(): void {
    this.stopScan();
    this.zeroconf.removeAllListeners();
    this.discoveredDevices.clear();
    this.onDeviceFoundCallback = undefined;
    this.onErrorCallback = undefined;
  }
}


// Singleton instance
let discoveryServiceInstance: DiscoveryService | null = null;

export const getDiscoveryService = (): DiscoveryService => {
  if (!discoveryServiceInstance) {
    discoveryServiceInstance = new DiscoveryService();
  }
  return discoveryServiceInstance;
};

// ✅ Add this line at the end
export default getDiscoveryService();

// Singleton instance
// let discoveryServiceInstance: DiscoveryService | null = null;

// export const getDiscoveryService = (): DiscoveryService => {
//   if (!discoveryServiceInstance) {
//     discoveryServiceInstance = new DiscoveryService();
//   }
//   return discoveryServiceInstance;
// };
