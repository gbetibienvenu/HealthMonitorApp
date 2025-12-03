// src/utils/formatters.ts

import { PriorityLevel } from '../types';

export const Formatters = {
  // Format timestamp to readable string
  formatTimestamp(timestamp: string): string {
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  },

  // Format date to readable string
  formatDate(timestamp: string): string {
    const date = new Date(timestamp);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  },

  // Format date and time
  formatDateTime(timestamp: string): string {
    return `${this.formatDate(timestamp)} ${this.formatTimestamp(timestamp)}`;
  },

  // Format sensor value with unit
  formatSensorValue(value: number, unit: string): string {
    return `${value.toFixed(1)}${unit}`;
  },

  // Get priority emoji
  getPriorityEmoji(priority: PriorityLevel): string {
    switch (priority) {
      case 'critical':
        return '🔴';
      case 'warning':
        return '🟠';
      case 'caution':
        return '🟡';
      case 'normal':
        return '🟢';
      default:
        return '⚪';
    }
  },

  // Get priority label
  getPriorityLabel(priority: PriorityLevel): string {
    switch (priority) {
      case 'critical':
        return 'CRITICAL';
      case 'warning':
        return 'WARNING';
      case 'caution':
        return 'CAUTION';
      case 'normal':
        return 'NORMAL';
      default:
        return 'UNKNOWN';
    }
  },

  // Format IP address with port
  formatBrokerAddress(ip: string, port: number): string {
    return `${ip}:${port}`;
  },

  // Get time ago string
  getTimeAgo(timestamp: string): string {
    const now = new Date();
    const then = new Date(timestamp);
    const diffMs = now.getTime() - then.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins === 1) return '1 minute ago';
    if (diffMins < 60) return `${diffMins} minutes ago`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours === 1) return '1 hour ago';
    if (diffHours < 24) return `${diffHours} hours ago`;

    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return '1 day ago';
    return `${diffDays} days ago`;
  },

  // Truncate text with ellipsis
  truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return `${text.substring(0, maxLength)}...`;
  },

  // Format sensor name to display name
  formatSensorName(sensorKey: string): string {
    const names: { [key: string]: string } = {
      body_temp: 'Body Temperature',
      ambient_temp: 'Ambient Temperature',
      pressure_hpa: 'Pressure',
      humidity_pct: 'Humidity',
      accel_x: 'Acceleration X',
      accel_y: 'Acceleration Y',
      accel_z: 'Acceleration Z',
      gyro_x: 'Gyro X',
      gyro_y: 'Gyro Y',
      gyro_z: 'Gyro Z',
      heart_rate_bpm: 'Heart Rate',
      spo2_pct: 'Blood Oxygen',
    };
    return names[sensorKey] || sensorKey;
  },

  // Get sensor unit
  getSensorUnit(sensorKey: string): string {
    const units: { [key: string]: string } = {
      body_temp: '°C',
      ambient_temp: '°C',
      pressure_hpa: ' hPa',
      humidity_pct: '%',
      accel_x: ' g',
      accel_y: ' g',
      accel_z: ' g',
      gyro_x: '°/s',
      gyro_y: '°/s',
      gyro_z: '°/s',
      heart_rate_bpm: ' BPM',
      spo2_pct: '%',
    };
    return units[sensorKey] || '';
  },
};