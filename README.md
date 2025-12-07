# 🏥 Health Monitor App

<div align="center">

![Health Monitor](https://img.shields.io/badge/Health-Monitor-2196F3?style=for-the-badge&logo=heart&logoColor=white)
![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![MQTT](https://img.shields.io/badge/MQTT-660066?style=for-the-badge&logo=mqtt&logoColor=white)
![Status](https://img.shields.io/badge/Status-Active-success?style=for-the-badge)

**A comprehensive React Native mobile application for real-time health monitoring and activity tracking via IoT sensors**

### 📱 Download the App

[![Download APK](https://img.shields.io/badge/Download-APK-blue?style=for-the-badge&logo=android)](https://expo.dev/accounts/bienbien/projects/HealthMonitorApp/builds/6f9c9b1d-6c1b-4fc7-aef7-9f84895a7b75)

[Features](#-features) • [Installation](#-installation) • [Architecture](#-architecture) • [Usage](#-usage) • [Team](#-team)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Download & Install](#-download--install)
- [Technology Stack](#-technology-stack)
- [System Architecture](#-system-architecture)
- [Prerequisites](#-prerequisites)
- [Installation from Source](#-installation-from-source)
- [Configuration](#-configuration)
- [Usage Guide](#-usage-guide)
- [Project Structure](#-project-structure)
- [MQTT Topics](#-mqtt-topics)
- [API Documentation](#-api-documentation)
- [Screenshots](#-screenshots)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [Team STACK](#-team-stack)
- [License](#-license)
- [Support](#-support)

---

## 🎯 Overview

**Health Monitor App** is a cutting-edge mobile application designed to provide real-time health monitoring and personalized health recommendations. The app connects seamlessly to a Raspberry Pi-based IoT health monitoring system via MQTT protocol, delivering instant health insights, sensor data visualization, and critical health alerts.

### 🚀 Quick Start

1. **Download the APK**: [Click here to download](https://expo.dev/accounts/bienbien/projects/HealthMonitorApp/builds/6f9c9b1d-6c1b-4fc7-aef7-9f84895a7b75)
2. **Install** on your Android device
3. **Connect** to your Raspberry Pi health monitor
4. **Start monitoring** your health in real-time!

### 🎪 Key Highlights

- 🔌 **Real-time Monitoring**: Live health data streaming via MQTT
- 🔍 **Auto-Discovery**: Automatic device detection using mDNS/Zeroconf
- 🚨 **Smart Alerts**: Priority-based notifications (Critical, Warning, Caution, Normal)
- 📊 **Data Visualization**: Interactive charts for sensor data
- 💾 **Offline Support**: Cached data access when disconnected
- 📱 **Cross-Platform**: Works on both iOS and Android

---

## ✨ Key Features

### 🔌 Connectivity
- ✅ Automatic device discovery via mDNS (VitaBand service)
- ✅ Manual IP/Port connection fallback
- ✅ Auto-reconnection with exponential backoff
- ✅ Real-time connection status indicators
- ✅ Last connected device quick connect

### 📊 Health Monitoring
- ✅ Real-time health recommendations (updated every 5 minutes)
- ✅ 24 different health/activity states classification
- ✅ Priority-based alert system:
  - 🔴 **Critical** - Immediate action required
  - 🟠 **Warning** - Take action soon
  - 🟡 **Caution** - Be aware
  - 🟢 **Normal** - All good
- ✅ Active health labels display
- ✅ Accurate timestamp tracking

### 📈 Sensor Data Visualization
- ✅ **Body Temperature** monitoring (°C)
- ✅ **Heart Rate** tracking (BPM)
- ✅ **Blood Oxygen (SpO2)** levels (%)
- ✅ **Ambient Temperature** (°C)
- ✅ **Humidity & Pressure** readings
- ✅ **Accelerometer** data (X, Y, Z axes)
- ✅ **Gyroscope** data (X, Y, Z axes)
- ✅ Real-time line charts (last 15 data points)
- ✅ Min/Max/Average statistics

### 🔔 Notifications
- ✅ Push notifications for critical/warning alerts
- ✅ In-app alerts with priority-based colors
- ✅ Sound and vibration support
- ✅ Background notification handling
- ✅ Customizable notification preferences

### 📜 History & Storage
- ✅ Recommendation history (last 100 items)
- ✅ Filter by priority level
- ✅ Date and time formatted display
- ✅ Local data persistence (AsyncStorage)
- ✅ Clear history option
- ✅ Search and sort capabilities

### ⚙️ Settings & Configuration
- ✅ MQTT broker configuration
- ✅ Notification preferences
- ✅ Connection timeout settings
- ✅ Sound and vibration controls
- ✅ Clear data functionality
- ✅ App information and version display

---

## 📱 Download & Install

### Direct APK Download

**Latest Version: v1.0.0**

[![Download APK](https://img.shields.io/badge/Download-Latest_APK-brightgreen?style=for-the-badge&logo=android)](https://expo.dev/accounts/bienbien/projects/HealthMonitorApp/builds/6f9c9b1d-6c1b-4fc7-aef7-9f84895a7b75)

### Installation Steps

1. **Download** the APK from the link above
2. **Enable** "Install from Unknown Sources" in your Android settings:
   - Go to **Settings** → **Security** → Enable **Unknown Sources**
   - Or **Settings** → **Apps** → **Special Access** → **Install Unknown Apps**
3. **Open** the downloaded APK file
4. **Tap** "Install" and wait for installation to complete
5. **Open** the Health Monitor app
6. **Grant** necessary permissions (Location, Notifications)
7. **Connect** to your Raspberry Pi health monitor

### System Requirements

| Platform | Requirement |
|----------|-------------|
| **Android** | Android 5.0 (API 21) or higher |
| **iOS** | iOS 12.0 or higher (Build from source) |
| **Storage** | 50 MB free space |
| **RAM** | 2 GB minimum |
| **Network** | WiFi (same network as Raspberry Pi) |

---

## 🛠️ Technology Stack

### Frontend (Mobile App)

| Technology | Version | Purpose |
|------------|---------|---------|
| **React Native** | 0.72.6 | Cross-platform mobile framework |
| **TypeScript** | 4.8.4 | Type-safe development |
| **React Navigation** | 6.x | Navigation and routing |
| **AsyncStorage** | 1.19.5 | Local data persistence |
| **React Native Vector Icons** | 10.0.2 | UI icons and graphics |
| **React Native Safe Area Context** | 4.7.4 | Safe area handling |

### Communication & Services

| Technology | Purpose |
|------------|---------|
| **Paho MQTT** | MQTT client for React Native |
| **React Native Zeroconf** | mDNS service discovery |
| **React Native Push Notification** | Local push notifications |

### Backend System (Raspberry Pi)

| Component | Technology |
|-----------|------------|
| **Platform** | Raspberry Pi 4 with Docker |
| **Sensors** | MPU6050, BME280, DS18B20, MAX30102 |
| **ML Model** | Multi-label classifier (24 health/activity states) |
| **MQTT Broker** | Mosquitto (Port 1883) |
| **Service** | mDNS advertising as "VitaBand" |
| **Protocol** | MQTT v3.1.1 |

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Mobile App Layer                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ Connection   │  │    Home      │  │   Sensors    │          │
│  │   Screen     │  │   Screen     │  │   Screen     │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│  ┌──────────────┐  ┌──────────────┐                            │
│  │   History    │  │   Settings   │                            │
│  │   Screen     │  │   Screen     │                            │
│  └──────────────┘  └──────────────┘                            │
└─────────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────▼─────────┐
                    │  Services Layer   │
                    ├───────────────────┤
                    │ • MQTT Service    │
                    │ • Discovery Svc   │
                    │ • Notification    │
                    │ • Storage Service │
                    └─────────┬─────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
   ┌────▼────┐         ┌──────▼──────┐      ┌──────▼──────┐
   │  MQTT   │         │    mDNS     │      │ AsyncStorage│
   │ Broker  │         │ (Zeroconf)  │      │   (Local)   │
   │Port 1883│         │  Discovery  │      │   Storage   │
   └────┬────┘         └─────────────┘      └─────────────┘
        │
   ┌────▼─────────────────────────────────────────────┐
   │         Raspberry Pi Health Monitor              │
   ├──────────────────────────────────────────────────┤
   │  • MPU6050 (Accelerometer/Gyroscope)             │
   │  • BME280 (Temperature/Humidity/Pressure)        │
   │  • DS18B20 (Body Temperature Sensor)             │
   │  • MAX30102 (Heart Rate/SpO2 Sensor)             │
   │  • ML Classifier (24 Health/Activity States)    │
   └──────────────────────────────────────────────────┘
```

### Data Flow Diagram

```
┌──────────────┐
│   Sensors    │ ──→ Read every 5 seconds
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  ML Classifier│ ──→ Predict health state (24 classes)
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ MQTT Publish │ ──→ 4 Topics with different QoS levels
│              │     • health/recommendation (QoS 1)
│              │     • health/sensors (QoS 0)
│              │     • health/status (QoS 1)
│              │     • health/alerts (QoS 2)
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Mobile App  │ ──→ Display, Notify, Store, Visualize
│              │     • Real-time updates
│              │     • Push notifications
│              │     • Local caching
│              │     • Charts & history
└──────────────┘
```

---

## 📋 Prerequisites

### For Using the APK

- ✅ Android device (Android 5.0+)
- ✅ WiFi connection
- ✅ Raspberry Pi Health Monitor on same network

### For Building from Source

**Required Software:**
- Node.js >= 16.x
- npm or yarn (latest version)
- React Native CLI: `npm install -g react-native-cli`
- Android Studio (for Android development)
- Xcode (for iOS development - macOS only)
- CocoaPods (for iOS dependencies - macOS only)

**Device Requirements:**
- Android: API Level 21+ (Android 5.0+)
- iOS: iOS 12.0+
- WiFi: Same network as Raspberry Pi

**Backend Requirements:**
- Raspberry Pi with Health Monitor System running
- MQTT Broker (Mosquitto) on port 1883
- mDNS service advertising as "VitaBand"

---

## 📥 Installation from Source

### 1. Clone the Repository

```bash
git clone https://github.com/teamstack/health-monitor-app.git
cd health-monitor-app
```

### 2. Install Dependencies

```bash
# Install npm packages
npm install

# For iOS only (macOS)
cd ios
pod install
cd ..
```

### 3. Install Required Native Modules

```bash
# React Navigation dependencies
npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs
npm install react-native-screens react-native-safe-area-context react-native-gesture-handler

# MQTT and Discovery
npm install paho-mqtt react-native-zeroconf

# Utilities
npm install @react-native-async-storage/async-storage
npm install react-native-vector-icons
npm install react-native-push-notification

# Link vector icons (if needed)
npx react-native link react-native-vector-icons
```

### 4. Platform-Specific Setup

#### Android Configuration

Add to `android/app/src/main/AndroidManifest.xml`:

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    
    <!-- Add these permissions -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.ACCESS_WIFI_STATE" />
    <uses-permission android:name="android.permission.CHANGE_WIFI_MULTICAST_STATE" />
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
    <uses-permission android:name="android.permission.VIBRATE" />
    
    <application>
        <!-- Your app configuration -->
    </application>
</manifest>
```

#### iOS Configuration

Add to `ios/HealthMonitorApp/Info.plist`:

```xml
<key>NSLocalNetworkUsageDescription</key>
<string>Used to discover health monitoring device on local network</string>

<key>NSBonjourServices</key>
<array>
    <string>_mqtt._tcp</string>
</array>

<key>UIBackgroundModes</key>
<array>
    <string>remote-notification</string>
</array>
```

### 5. Build and Run

#### Android
```bash
npx react-native run-android
```

#### iOS
```bash
npx react-native run-ios
```

---

## ⚙️ Configuration

### MQTT Configuration

Edit `src/constants/config.ts`:

```typescript
export const Config = {
  mqtt: {
    defaultPort: 1883,              // MQTT broker port
    keepalive: 60,                  // Keep-alive in seconds
    reconnectPeriod: 5000,          // Reconnect delay in ms
    connectTimeout: 30000,          // Connection timeout
    qos: {
      recommendation: 1,            // QoS for recommendations
      sensors: 0,                   // QoS for sensor data
      status: 1,                    // QoS for status
      alerts: 2,                    // QoS for alerts
    },
  },
  
  mdns: {
    serviceName: 'VitaBand',        // mDNS service name
    serviceType: '_mqtt._tcp.local.',
    scanTimeout: 30000,             // Discovery timeout
  },
  
  topics: {
    recommendation: 'health/recommendation',
    sensors: 'health/sensors',
    status: 'health/status',
    alerts: 'health/alerts',
  },
  
  app: {
    updateInterval: 300000,         // 5 minutes
    chartDataPoints: 15,            // Chart data points
    maxHistoryItems: 100,           // Max history items
  },
};
```

### Color Theme Configuration

Edit `src/constants/colors.ts`:

```typescript
export const Colors = {
  primary: '#2196F3',        // Main blue color
  success: '#4CAF50',        // Green for normal
  warning: '#FF9800',        // Orange for warning
  error: '#F44336',          // Red for critical
  critical: '#F44336',
  caution: '#FF9800',
  normal: '#4CAF50',
  // ... more colors
};

export const Theme = Colors;  // Export as Theme for compatibility
```

---

## 📱 Usage Guide

### First Time Setup

1. **Download & Install** the APK from the link above
2. **Open** Health Monitor app
3. **Grant Permissions** when prompted:
   - Location (for mDNS discovery)
   - Notifications (for health alerts)
4. **Wait for Auto-Discovery** or enter IP manually
5. **Connect** to your Raspberry Pi device

### Connection Methods

#### Method 1: Auto-Discovery (Recommended)

1. App automatically searches for "VitaBand" service
2. Device appears with IP address
3. Tap "Connect" button
4. Connection established!

#### Method 2: Manual Connection

1. Tap "Manual Connection"
2. Enter Raspberry Pi IP address (e.g., `192.168.1.105`)
3. Enter port (default: `1883`)
4. Tap "Connect Manually"

#### Method 3: Quick Connect

1. Use last connected device
2. Tap on "Last connected: XXX.XXX.XXX.XXX"
3. Instant reconnection

### Daily Usage

#### Home Screen
- View latest health recommendation
- See priority level (Critical/Warning/Caution/Normal)
- Read health advice and summary
- Check active health labels

#### Sensors Screen
- Monitor real-time sensor data
- View interactive charts
- Check current readings
- See min/max/average values

#### History Screen
- Browse past recommendations
- Filter by priority level
- View timestamps
- Clear history if needed

#### Settings Screen
- Configure MQTT connection
- Manage notifications
- Adjust app preferences
- View app information

---

## 📁 Project Structure

```
HealthMonitorApp/
├── android/                      # Android native code
│   ├── app/
│   │   └── src/main/
│   │       ├── AndroidManifest.xml
│   │       └── res/mipmap-*/     # App icons
│   └── build.gradle
│
├── ios/                          # iOS native code
│   ├── HealthMonitorApp/
│   │   ├── Info.plist
│   │   └── Images.xcassets/
│   └── Podfile
│
├── src/
│   ├── components/               # Reusable UI components
│   │   ├── LoadingIndicator.tsx # Loading spinner
│   │   ├── PriorityBadge.tsx    # Priority level badges
│   │   ├── RecommendationCard.tsx # Recommendation display
│   │   ├── SensorChart.tsx      # Chart component
│   │   └── StatusBar.tsx        # Connection status bar
│   │
│   ├── constants/                # App constants
│   │   ├── colors.ts            # Color theme (exported as Theme)
│   │   └── config.ts            # App configuration
│   │
│   ├── navigation/               # Navigation setup
│   │   └── AppNavigator.tsx     # Root navigator
│   │
│   ├── screens/                  # Screen components
│   │   ├── ConnectionScreen.tsx  # Device discovery & connection
│   │   ├── HomeScreen.tsx        # Main health recommendations
│   │   ├── SensorScreen.tsx      # Real-time sensor data
│   │   ├── HistoryScreen.tsx     # Recommendation history
│   │   └── SettingsScreen.tsx    # App settings
│   │
│   ├── services/                 # Business logic services
│   │   ├── discoveryService.ts   # mDNS device discovery
│   │   ├── mqttService.ts        # MQTT communication
│   │   └── notificationService.ts # Push notifications
│   │
│   ├── types/                    # TypeScript type definitions
│   │   └── index.ts              # All type definitions
│   │
│   └── utils/                    # Utility functions
│       ├── formatters.ts         # Data formatting utilities
│       └── storage.ts            # AsyncStorage wrapper
│
├── App.tsx                       # Root component
├── index.js                      # App entry point
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript config
├── babel.config.js               # Babel configuration
├── metro.config.js               # Metro bundler config
└── README.md                     # This file
```

### Key Files Description

| File | Purpose | Lines |
|------|---------|-------|
| `App.tsx` | App entry point with navigation setup | ~150 |
| `mqttService.ts` | MQTT client & message handling | ~400 |
| `discoveryService.ts` | mDNS device discovery logic | ~200 |
| `notificationService.ts` | Push notification handling | ~200 |
| `storage.ts` | Local data persistence wrapper | ~300 |
| `config.ts` | Centralized app configuration | ~200 |
| `colors.ts` | Color theme definitions | ~150 |
| `types/index.ts` | TypeScript type definitions | ~150 |
| `ConnectionScreen.tsx` | Device connection UI | ~350 |
| `HomeScreen.tsx` | Main recommendation display | ~250 |
| `SensorScreen.tsx` | Sensor data visualization | ~300 |
| `HistoryScreen.tsx` | Recommendation history | ~250 |
| `SettingsScreen.tsx` | App settings UI | ~300 |

---

## 📡 MQTT Topics

### Topic 1: `health/recommendation`

**QoS Level**: 1 (At least once delivery)  
**Update Frequency**: Every 5 minutes  
**Purpose**: Main health recommendations with priority and advice

**Message Format**:
```json
{
  "timestamp": "2024-12-07 15:30:45",
  "message": "You are currently walking in a hot environment. Move to a cooler location, stay hydrated, and avoid strenuous activity.",
  "summary": "Walking in hot environment",
  "advice": "Move to cooler location, stay hydrated",
  "priority": "caution",
  "active_labels": ["Walking", "Hot environment", "Moderate activity"]
}
```

**Priority Levels**:
- `"critical"` 🔴 - Immediate action required
- `"warning"` 🟠 - Take action soon
- `"caution"` 🟡 - Be aware
- `"normal"` 🟢 - All good

---

### Topic 2: `health/sensors`

**QoS Level**: 0 (Fire and forget)  
**Update Frequency**: Every 5 seconds  
**Purpose**: Raw sensor data for real-time visualization

**Message Format**:
```json
{
  "timestamp": "2024-12-07 15:30:45",
  "sensors": {
    "body_temp": 37.5,
    "ambient_temp": 28.0,
    "pressure_hpa": 1013.0,
    "humidity_pct": 65.0,
    "accel_x": 0.8,
    "accel_y": 0.5,
    "accel_z": 1.0,
    "gyro_x": 20.0,
    "gyro_y": 15.0,
    "gyro_z": 10.0,
    "heart_rate_bpm": 95.0,
    "spo2_pct": 96.0
  }
}
```

---

### Topic 3: `health/status`

**QoS Level**: 1 (At least once)  
**Update Frequency**: Every 5 minutes  
**Purpose**: Quick health status overview

**Message Format**:
```json
{
  "timestamp": "2024-12-07 15:30:45",
  "priority": "caution"
}
```

---

### Topic 4: `health/alerts`

**QoS Level**: 2 (Exactly once delivery)  
**Update Frequency**: On-demand (only when critical/warning)  
**Purpose**: Critical health alerts requiring immediate attention

**Message Format**:
```json
{
  "timestamp": "2024-12-07 15:30:45",
  "level": "critical",
  "message": "Your oxygen levels are low. Move to a well-ventilated area immediately.",
  "labels": ["Low oxygen state", "Overexertion", "High heart rate"]
}
```

**Alert Levels**:
- `"critical"` - Severe health risk, immediate action
- `"warning"` - Moderate health risk, take action soon

---

## 🔧 API Documentation

### MQTT Service API

```typescript
import { getMQTTService } from './services/mqttService';

const mqttService = getMQTTService();

// Connect to MQTT broker
await mqttService.connect(
  ipAddress: string,  // e.g., "192.168.1.105"
  port: number        // e.g., 1883
);

// Subscribe to recommendation messages
mqttService.onRecommendation((data: HealthRecommendation) => {
  console.log('Recommendation:', data.message);
  console.log('Priority:', data.priority);
});

// Subscribe to sensor data
mqttService.onSensorData((data: SensorData) => {
  console.log('Body Temp:', data.sensors.body_temp);
  console.log('Heart Rate:', data.sensors.heart_rate_bpm);
});

// Subscribe to alerts
mqttService.onAlert((data: HealthAlert) => {
  console.log('ALERT:', data.level);
  console.log('Message:', data.message);
});

// Subscribe to status updates
mqttService.onStatus((data: HealthStatus) => {
  console.log('Status:', data.priority);
});

// Subscribe to connection state changes
mqttService.onConnectionState((state: ConnectionState) => {
  console.log('Connection:', state);
});

// Get current connection state
const state = mqttService.getConnectionState();
// Returns: { isConnected, isConnecting, error, lastConnected }

// Check if connected
const isConnected = mqttService.isConnected();

// Disconnect from broker
await mqttService.disconnect();
```

---

### Storage Service API

```typescript
import { StorageService } from './utils/storage';

// ===== Connection Info =====
await StorageService.saveLastConnectedIp(ip: string);
const ip = await StorageService.getLastConnectedIp();

// ===== App Settings =====
await StorageService.saveSettings(settings: AppSettings);
const settings = await StorageService.getSettings();
await StorageService.updateSettings(partialSettings: Partial<AppSettings>);

// ===== Recommendation History =====
await StorageService.saveRecommendationToHistory(recommendation: HealthRecommendation);
const history = await StorageService.getHistory();
await StorageService.clearHistory();
await StorageService.deleteHistoryItem(id: string);

// ===== Last Recommendation (Offline Mode) =====
await StorageService.saveLastRecommendation(recommendation: HealthRecommendation);
const lastRec = await StorageService.getLastRecommendation();

// ===== Clear All Data =====
await StorageService.clearAll();

// ===== Debug =====
const keys = await StorageService.getAllKeys();
const size = await StorageService.getStorageSize();
```

---

### Discovery Service API

```typescript
import { getDiscoveryService } from './services/discoveryService';

const discoveryService = getDiscoveryService();

// Start device discovery
discoveryService.startScan(
  onDeviceFound: (device: DiscoveredDevice) => {
    console.log('Found:', device.name);
    console.log('IP:', device.addresses[0]);
    console.log('Port:', device.port);
  },
  onError: (error: Error) => {
    console.error('Discovery error:', error);
  }
);

// Stop scanning
discoveryService.stopScan();

// Get all discovered devices
const devices = discoveryService.getDiscoveredDevices();

// Get first discovered device
const device = discoveryService.getFirstDevice();

// Check if any devices found
const hasDevices = discoveryService.hasDevices();

// Clear discovered devices
discoveryService.clearDiscoveredDevices();

// Cleanup
discoveryService.destroy();
```

---

### Notification Service API

```typescript
import NotificationService from './services/notificationService';

// Initialize (called automatically in App.tsx)
await NotificationService.initialize();

// Request permissions
const granted = await NotificationService.requestPermissions();

// Show health alert notification
await NotificationService.showHealthAlert(alert: HealthAlert);

// Show recommendation notification
await NotificationService.showRecommendation(
  message: string,
  priority: string
);

// Enable/disable notifications
NotificationService.setNotificationsEnabled(enabled: boolean);

// Cancel all notifications
await NotificationService.cancelAllNotifications();

// Badge management (iOS)
const count = await NotificationService.getBadgeCount();
await NotificationService.setBadgeCount(count: number);
await NotificationService.clearBadgeCount();
```

---

## 📸 Screenshots

### Connection Screen
> Auto-discovery of Raspberry Pi device with manual connection option

### Home Screen
> Real-time health recommendations with priority-based alerts

### Sensors Screen
> Interactive charts showing body temperature, heart rate, SpO2, and more

### History Screen
> Complete history of recommendations with priority filtering

### Settings Screen
> App configuration, notification preferences, and connection settings

---

## 🐛 Troubleshooting

### Common Issues and Solutions

#### 1. 🔍 Cannot Find Device

**Problem**: Auto-discovery doesn't find the Raspberry Pi

**Solutions**:
- ✅ Ensure phone and Pi are on the **same WiFi network**
- ✅ Check mDNS service on Pi: `sudo service avahi-daemon status`
- ✅ Restart mDNS scan in the app
- ✅ Try **manual connection** with Pi's IP address
- ✅ Check Pi firewall: `sudo ufw status`
- ✅ Verify service name is "VitaBand"

**Command to check mDNS**:
```bash
# On Raspberry Pi
sudo service
