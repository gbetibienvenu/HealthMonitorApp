// src/components/SensorChart.tsx

import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Theme } from '../constants/colors';
import { SensorChartData } from '../types';
import { Formatters } from '../utils/formatters';

interface SensorChartProps {
  title: string;
  data: SensorChartData[];
  color: string;
  unit: string;
  currentValue?: number;
}

const screenWidth = Dimensions.get('window').width;

export const SensorChart: React.FC<SensorChartProps> = ({
  title,
  data,
  color,
  unit,
  currentValue,
}) => {
  // Calculate min and max for scaling
  const values = data.map(d => d.value);
  const minValue = Math.min(...values, 0);
  const maxValue = Math.max(...values, 0);
  const range = maxValue - minValue || 1;

  // Chart dimensions
  const chartHeight = 150;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {currentValue !== undefined && (
          <Text style={[styles.currentValue, { color }]}>
            {Formatters.formatSensorValue(currentValue, unit)}
          </Text>
        )}
      </View>

      {/* Chart visualization */}
      <View style={styles.chartContainer}>
        {data.length > 0 ? (
          <>
            {/* Y-axis labels */}
            <View style={styles.yAxisLabels}>
              <Text style={styles.axisLabel}>{maxValue.toFixed(1)}</Text>
              <Text style={styles.axisLabel}>{((maxValue + minValue) / 2).toFixed(1)}</Text>
              <Text style={styles.axisLabel}>{minValue.toFixed(1)}</Text>
            </View>

            {/* Chart area */}
            <View style={styles.chartArea}>
              <View style={[styles.chartGrid, { height: chartHeight }]}>
                {/* Grid lines */}
                <View style={styles.gridLine} />
                <View style={styles.gridLine} />
                <View style={styles.gridLine} />

                {/* Data bars */}
                <View style={styles.barsContainer}>
                  {data.map((point, index) => {
                    const normalizedValue = (point.value - minValue) / range;
                    const barHeight = normalizedValue * (chartHeight - 20);

                    return (
                      <View
                        key={index}
                        style={styles.barWrapper}
                      >
                        <View
                          style={[
                            styles.bar,
                            {
                              height: Math.max(barHeight, 2),
                              backgroundColor: color,
                              opacity: 0.7,
                            },
                          ]}
                        />
                        {/* Point indicator */}
                        <View
                          style={[
                            styles.point,
                            {
                              backgroundColor: color,
                              bottom: Math.max(barHeight - 3, 0),
                            },
                          ]}
                        />
                      </View>
                    );
                  })}
                </View>
              </View>

              {/* X-axis labels */}
              <View style={styles.xAxisLabels}>
                {data.map((point, index) => {
                  // Show label for every 3rd point
                  if (index % 3 === 0 || index === data.length - 1) {
                    return (
                      <Text key={index} style={styles.xAxisLabel}>
                        {Formatters.formatTimestamp(point.timestamp).substring(0, 5)}
                      </Text>
                    );
                  }
                  return <View key={index} style={styles.xAxisLabelSpacer} />;
                })}
              </View>
            </View>
          </>
        ) : (
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}>No data available</Text>
          </View>
        )}
      </View>

      {/* Statistics */}
      {data.length > 0 && (
        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Min</Text>
            <Text style={[styles.statValue, { color }]}>
              {minValue.toFixed(1)}{unit}
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Avg</Text>
            <Text style={[styles.statValue, { color }]}>
              {(values.reduce((a, b) => a + b, 0) / values.length).toFixed(1)}{unit}
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Max</Text>
            <Text style={[styles.statValue, { color }]}>
              {maxValue.toFixed(1)}{unit}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Theme.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: Theme.text,
  },
  currentValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  chartContainer: {
    marginVertical: 8,
  },
  yAxisLabels: {
    position: 'absolute',
    left: 0,
    top: 0,
    height: 150,
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  axisLabel: {
    fontSize: 10,
    color: Theme.textSecondary,
  },
  chartArea: {
    marginLeft: 40,
  },
  chartGrid: {
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  gridLine: {
    height: 1,
    backgroundColor: Theme.border,
    opacity: 0.3,
  },
  barsContainer: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    height: 130,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  barWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginHorizontal: 1,
    position: 'relative',
  },
  bar: {
    width: '80%',
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
  },
  point: {
    width: 6,
    height: 6,
    borderRadius: 3,
    position: 'absolute',
  },
  xAxisLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingHorizontal: 4,
  },
  xAxisLabel: {
    fontSize: 9,
    color: Theme.textSecondary,
    flex: 1,
  },
  xAxisLabelSpacer: {
    flex: 1,
  },
  noDataContainer: {
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    fontSize: 14,
    color: Theme.textSecondary,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Theme.border,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: Theme.textSecondary,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
  },
});