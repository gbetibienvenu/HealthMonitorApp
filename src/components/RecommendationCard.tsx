
// ===== src/components/RecommendationCard.tsx =====
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { HealthRecommendation } from '../types';
import { Theme, PriorityBackgrounds } from '../constants/colors';
import { Formatters } from '../utils/formatters';
import { PriorityBadge } from './PriorityBadge';

interface RecommendationCardProps {
  recommendation: HealthRecommendation;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  recommendation,
}) => {
  const backgroundColor = PriorityBackgrounds[recommendation.priority];

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <PriorityBadge priority={recommendation.priority} size="large" />
      
      <Text style={styles.timestamp}>
        🕐 {Formatters.formatTimestamp(recommendation.timestamp)}
      </Text>

      <ScrollView style={styles.contentScroll}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Summary</Text>
          <Text style={styles.summaryText}>{recommendation.summary}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Advice</Text>
          <Text style={styles.adviceText}>{recommendation.advice}</Text>
        </View>

        {recommendation.active_labels && recommendation.active_labels.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Active States</Text>
            <View style={styles.labelsContainer}>
              {recommendation.active_labels.map((label, index) => (
                <View key={index} style={styles.labelChip}>
                  <Text style={styles.labelText}>{label}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginVertical: 16,
    minHeight: 300,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  timestamp: {
    fontSize: 14,
    color: Theme.textSecondary,
    marginTop: 12,
    marginBottom: 16,
  },
  contentScroll: {
    flex: 1,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: Theme.textSecondary,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  summaryText: {
    fontSize: 18,
    fontWeight: '600',
    color: Theme.text,
    lineHeight: 26,
  },
  adviceText: {
    fontSize: 16,
    color: Theme.text,
    lineHeight: 24,
  },
  labelsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  labelChip: {
    backgroundColor: Theme.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  labelText: {
    color: Theme.textLight,
    fontSize: 12,
    fontWeight: '500',
  },
});















// // src/components/RecommendationCard.tsx

// import React from 'react';
// import { View, Text, StyleSheet, ScrollView } from 'react-native';
// import { HealthRecommendation } from '../types';
// import { PriorityBadge } from './PriorityBadge';
// import { Colors } from '../constants/colors';

// interface RecommendationCardProps {
//   recommendation: HealthRecommendation;
// }

// export const RecommendationCard: React.FC<RecommendationCardProps> = ({ 
//   recommendation 
// }) => {
//   return (
//     <View style={styles.card}>
//       <View style={styles.header}>
//         <PriorityBadge priority={recommendation.priority} size="large" />
//         <Text style={styles.timestamp}>{formatTime(recommendation.timestamp)}</Text>
//       </View>

//       <View style={styles.content}>
//         <Text style={styles.summary}>{recommendation.summary}</Text>
//         <Text style={styles.advice}>{recommendation.advice}</Text>
//       </View>

//       {recommendation.active_labels && recommendation.active_labels.length > 0 && (
//         <View style={styles.labelsContainer}>
//           {recommendation.active_labels.map((label, index) => (
//             <View key={index} style={styles.label}>
//               <Text style={styles.labelText}>{label}</Text>
//             </View>
//           ))}
//         </View>
//       )}
//     </View>
//   );
// };

// const formatTime = (timestamp: string): string => {
//   try {
//     const date = new Date(timestamp);
//     return date.toLocaleTimeString('en-US', { 
//       hour: '2-digit', 
//       minute: '2-digit',
//       second: '2-digit'
//     });
//   } catch {
//     return timestamp;
//   }
// };

// const styles = StyleSheet.create({
//   card: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 16,
//     padding: 20,
//     marginHorizontal: 16,
//     marginVertical: 8,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 4,
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   timestamp: {
//     fontSize: 14,
//     color: Theme.textSecondary,
//     fontWeight: '500',
//   },
//   content: {
//     marginBottom: 16,
//   },
//   summary: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: Colors.textPrimary,
//     marginBottom: 12,
//     lineHeight: 24,
//   },
//   advice: {
//     fontSize: 16,
//     color: Theme.textSecondary,
//     lineHeight: 22,
//   },
//   labelsContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     marginTop: 8,
//   },
//   label: {
//     backgroundColor: Colors.primaryLight,
//     borderRadius: 12,
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     marginRight: 8,
//     marginBottom: 8,
//   },
//   labelText: {
//     fontSize: 12,
//     color: Colors.primary,
//     fontWeight: '600',
//   },
// });