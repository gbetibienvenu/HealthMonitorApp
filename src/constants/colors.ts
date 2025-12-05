/**
 * Color Constants for Health Monitor App
 * Defines all colors used throughout the application
 */

export const Theme = {
  // Priority Colors - Used for health status indicators
  critical: '#F44336',      // Red - Immediate action required
  warning: '#FF9800',       // Orange - Take action soon
  caution: '#FFC107',       // Yellow - Be aware
  normal: '#4CAF50',        // Green - All good

  // Primary Colors - Main app branding
  primary: '#2196F3',       // Blue
  primaryDark: '#1976D2',   // Darker blue
  primaryLight: '#BBDEFB',  // Light blue

  // Background Colors
  background: '#FFFFFF',         // White background
  backgroundDark: '#121212',     // Dark mode background
  backgroundGray: '#F5F5F5',    // Light gray background


  //Sensor Colors
  chartAcceleration: '#d6d6ceff',
  chartGyro: '#919ebeff',
  chartAmbientTemp: '#baba16ff',
  chartSpO2: '#c01899ff',
  chartBodyTemp: '#155e7aff',
  chartHeartRate:'#062632ff',
  chartPressure:'#28b223ff',
  chatHumidity:'#3124efff',


  // Text Colors
  textPrimary: '#212121',        // Primary text (dark)
  textSecondary: '#757575',      // Secondary text (gray)
  textLight: '#FFFFFF',          // Light text (white)

  // Status Colors
  success: '#4CAF50',       // Green - Success state
  error: '#F44336',         // Red - Error state
  info: '#2196F3',          // Blue - Info state

  // Border Colors
  border: '#E0E0E0',        // Light gray border
  borderDark: '#424242',    // Dark gray border

  // Chart Colors - For sensor data visualization
  chartLine1: '#2196F3',    // Blue - Body temperature
  chartLine2: '#F44336',    // Red - Heart rate
  chartLine3: '#4CAF50',    // Green - SpO2
  chartLine4: '#FF9800',    // Orange - Ambient temperature
};

/**
 * Get color for priority level
 * @param priority - Priority level (critical, warning, caution, normal)
 * @returns Hex color code
 */
export const getPriorityColor = (priority: string): string => {
  switch (priority.toLowerCase()) {
    case 'critical':
      return Theme.critical;
    case 'warning':
      return Theme.warning;
    case 'caution':
      return Theme.caution;
    case 'normal':
      return Theme.normal;
    default:
      return Theme.info;
  }
};

/**
 * Get emoji for priority level
 */
export const getPriorityEmoji = (priority: string): string => {
  switch (priority.toLowerCase()) {
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
};

/**
 * Get priority label text
 */
export const getPriorityLabel = (priority: string): string => {
  return priority.toUpperCase();
};

/**
 * Add transparency to a hex color
 */
export const addAlpha = (color: string, opacity: number): string => {
  const alpha = Math.round((opacity / 100) * 255)
    .toString(16)
    .padStart(2, '0');
  return `${color}${alpha}`;
};