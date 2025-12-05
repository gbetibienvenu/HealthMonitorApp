// src/components/PriorityBadge.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PriorityLevel } from '../types';
import { getPriorityColor, getPriorityEmoji } from '../constants/colors';

interface PriorityBadgeProps {
  priority: PriorityLevel;
  size?: 'small' | 'medium' | 'large';
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ 
  priority, 
  size = 'medium' 
}) => {
  const color = getPriorityColor(priority);
  const emoji = getPriorityEmoji(priority);
  
  const sizeStyles = {
    small: { paddingHorizontal: 8, paddingVertical: 4, fontSize: 12 },
    medium: { paddingHorizontal: 12, paddingVertical: 6, fontSize: 14 },
    large: { paddingHorizontal: 16, paddingVertical: 8, fontSize: 16 },
  };

  return (
    <View style={[styles.badge, { backgroundColor: color }, sizeStyles[size]]}>
      <Text style={[styles.text, { fontSize: sizeStyles[size].fontSize }]}>
        {emoji} {priority.toUpperCase()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  text: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});
