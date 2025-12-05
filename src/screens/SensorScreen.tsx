// src/screens/SensorScreen.tsx

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { SensorData, SensorChartData, ConnectionState } from '../types';
import { Theme } from '../constants/colors';
import { Config } from '../constants/config';
import MQTTService from '../services/mqttService';
import { ConnectionStatusBar } from '../components/StatusBar';
import { SensorChart } from '../components/SensorChart';

export const SensorScreen: React.FC = () => {
  const [currentSensors, setCurrentSensors] = useState<SensorData['sensors'] | null>(null);
  const [bodyTempData, setBodyTempData] = useState<SensorChartData[]>([]);
  const [heartRateData, setHeartRateData] = useState<SensorChartData[]>([]);
  const [spo2Data, setSpo2Data] = useState<SensorChartData[]>([]);
  const [ambientTempData, setAmbientTempData] = useState<SensorChartData[]>([]);
  const [connectionState, setConnectionState] = useState<ConnectionState>('connected');
  const [brokerAddress, setBrokerAddress] = useState<string>('');

  useEffect(() => {
    setupSensorListener();
    setupConnectionListener();
    loadConnectionInfo();
  }, []);

  const loadConnectionInfo = async () => {
    try {
      const { StorageService } = await import('../utils/storage');
      const lastIp = await StorageService.getLastConnectedIp();
      const settings = await StorageService.getSettings();
      if (lastIp && settings.brokerPort) {
        setBrokerAddress(`${lastIp}:${settings.brokerPort}`);
      }
    } catch (error) {
      console.error('Error loading connection info:', error);
    }
  };

  const setupConnectionListener = () => {
    MQTTService.onConnectionState((state) => {
      setConnectionState(state);
    });
  };

  const setupSensorListener = () => {
    MQTTService.onSensorData((data: SensorData) => {
      console.log('📊 Sensor data received');
      setCurrentSensors(data.sensors);

      // Create new data point
      const newDataPoint = (value: number): SensorChartData => ({
        timestamp: data.timestamp,
        value: value,
      });

      // Update chart data (keep last 15 points as per Config)
      setBodyTempData((prev) => 
        [...prev, newDataPoint(data.sensors.body_temp)].slice(-Config.app.chartDataPoints)
      );
      setHeartRateData((prev) => 
        [...prev, newDataPoint(data.sensors.heart_rate_bpm)].slice(-Config.app.chartDataPoints)
      );
      setSpo2Data((prev) => 
        [...prev, newDataPoint(data.sensors.spo2_pct)].slice(-Config.app.chartDataPoints)
      );
      setAmbientTempData((prev) => 
        [...prev, newDataPoint(data.sensors.ambient_temp)].slice(-Config.app.chartDataPoints)
      );
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ConnectionStatusBar
        connectionState={connectionState}
        brokerAddress={brokerAddress}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>📊 Sensor Data</Text>
        <Text style={styles.subtitle}>Real-time health metrics</Text>
        
        {/* Current Readings Card */}
        {currentSensors && (
          <View style={styles.currentDataCard}>
            <Text style={styles.cardTitle}>Current Readings</Text>
            <View style={styles.dataGrid}>
              <View style={styles.dataItem}>
                <Text style={styles.dataLabel}>Body Temp</Text>
                <Text style={[styles.dataValue, { color: Theme.chartLine1 }]}>
                  {currentSensors.body_temp.toFixed(1)}°C
                </Text>
              </View>
              <View style={styles.dataItem}>
                <Text style={styles.dataLabel}>Heart Rate</Text>
                <Text style={[styles.dataValue, { color: Theme.chartLine2 }]}>
                  {currentSensors.heart_rate_bpm.toFixed(0)} BPM
                </Text>
              </View>
              <View style={styles.dataItem}>
                <Text style={styles.dataLabel}>SpO2</Text>
                <Text style={[styles.dataValue, { color: Theme.chartLine3 }]}>
                  {currentSensors.spo2_pct.toFixed(0)}%
                </Text>
              </View>
              <View style={styles.dataItem}>
                <Text style={styles.dataLabel}>Ambient Temp</Text>
                <Text style={[styles.dataValue, { color: Theme.chartLine4 }]}>
                  {currentSensors.ambient_temp.toFixed(1)}°C
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Charts */}
        {bodyTempData.length > 0 ? (
          <>
            <SensorChart
              title="Body Temperature"
              data={bodyTempData}
              color={Theme.chartLine1}
              unit="°C"
              currentValue={currentSensors?.body_temp}
            />

            <SensorChart
              title="Heart Rate"
              data={heartRateData}
              color={Theme.chartLine2}
              unit=" BPM"
              currentValue={currentSensors?.heart_rate_bpm}
            />

            <SensorChart
              title="Blood Oxygen (SpO2)"
              data={spo2Data}
              color={Theme.chartLine3}
              unit="%"
              currentValue={currentSensors?.spo2_pct}
            />

            <SensorChart
              title="Ambient Temperature"
              data={ambientTempData}
              color={Theme.chartLine4}
              unit="°C"
              currentValue={currentSensors?.ambient_temp}
            />

            {/* Additional Sensors */}
            {currentSensors && (
              <View style={styles.additionalSensors}>
                <Text style={styles.cardTitle}>Additional Sensors</Text>
                <View style={styles.sensorGrid}>
                  <SensorItem
                    label="Humidity"
                    value={`${currentSensors.humidity_pct.toFixed(1)}%`}
                    color={Theme.info}
                  />
                  <SensorItem
                    label="Pressure"
                    value={`${currentSensors.pressure_hpa.toFixed(1)} hPa`}
                    color={Theme.warning}
                  />
                  <SensorItem
                    label="Accel X"
                    value={`${currentSensors.accel_x.toFixed(2)} g`}
                    color={Theme.success}
                  />
                  <SensorItem
                    label="Accel Y"
                    value={`${currentSensors.accel_y.toFixed(2)} g`}
                    color={Theme.success}
                  />
                  <SensorItem
                    label="Accel Z"
                    value={`${currentSensors.accel_z.toFixed(2)} g`}
                    color={Theme.success}
                  />
                  <SensorItem
                    label="Gyro X"
                    value={`${currentSensors.gyro_x.toFixed(1)}°/s`}
                    color={Theme.caution}
                  />
                  <SensorItem
                    label="Gyro Y"
                    value={`${currentSensors.gyro_y.toFixed(1)}°/s`}
                    color={Theme.caution}
                  />
                  <SensorItem
                    label="Gyro Z"
                    value={`${currentSensors.gyro_z.toFixed(1)}°/s`}
                    color={Theme.caution}
                  />
                </View>
              </View>
            )}
          </>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📡</Text>
            <Text style={styles.emptyText}>No sensor data yet</Text>
            <Text style={styles.emptySubtext}>
              Waiting for sensor readings from device
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

// Helper component for additional sensor items
const SensorItem: React.FC<{ label: string; value: string; color: string }> = ({ 
  label, 
  value,
  color 
}) => (
  <View style={styles.sensorItem}>
    <Text style={styles.sensorLabel}>{label}</Text>
    <Text style={[styles.sensorValue, { color }]}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.backgroundGray,
  },
  scrollContent: {
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Theme.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: Theme.textSecondary,
    marginBottom: 20,
  },
  currentDataCard: {
    backgroundColor: Theme.background,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Theme.textPrimary,
    marginBottom: 16,
  },
  dataGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  dataItem: {
    width: '48%',
    marginBottom: 16,
  },
  dataLabel: {
    fontSize: 12,
    color: Theme.textSecondary,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  dataValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  emptyState: {
    alignItems: 'center',
    padding: 48,
    marginTop: 60,
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
  additionalSensors: {
    backgroundColor: Theme.background,
    borderRadius: 16,
    padding: 20,
    marginTop: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sensorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  sensorItem: {
    width: '48%',
    backgroundColor: Theme.backgroundGray,
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  sensorLabel: {
    fontSize: 12,
    color: Theme.textSecondary,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sensorValue: {
    fontSize: 16,
    fontWeight: '600',
  },
});