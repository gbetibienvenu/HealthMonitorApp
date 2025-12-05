// src/services/notificationService.ts - FIXED FOR REACT NATIVE

import PushNotification, { Importance } from 'react-native-push-notification';
import { Platform } from 'react-native';
import { HealthAlert } from '../types';
import { Config } from '../constants/config';

/**
 * Notification Service - React Native Compatible
 */
class NotificationService {
  private isInitialized: boolean = false;

  /**
   * Initialize notification service
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
      // Configure push notifications
      PushNotification.configure({
        onNotification: function (notification) {
          console.log('📬 Notification received:', notification);
        },
        requestPermissions: Platform.OS === 'ios',
        permissions: {
          alert: true,
          badge: true,
          sound: true,
        },
        popInitialNotification: true,
      });

      // Create notification channel for Android
      if (Platform.OS === 'android') {
        PushNotification.createChannel(
          {
            channelId: Config.app.notificationChannelId,
            channelName: Config.app.notificationChannelName,
            channelDescription: Config.app.notificationChannelDescription,
            playSound: true,
            soundName: 'default',
            importance: Importance.HIGH,
            vibrate: true,
          },
          (created) => {
            console.log(`✅ Android notification channel created: ${created}`);
          }
        );
      }

      this.isInitialized = true;
      console.log('✅ Notification service initialized');
    } catch (error) {
      console.error('❌ Error initializing notification service:', error);
    }
  }

  /**
   * Request notification permissions
   */
  async requestPermissions(): Promise<boolean> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      if (Platform.OS === 'android') {
        // Android permissions are granted at install time
        return true;
      }

      // iOS requires runtime permission
      PushNotification.requestPermissions();
      console.log('✅ Notification permissions requested');
      return true;
    } catch (error) {
      console.error('❌ Error requesting notification permissions:', error);
      return false;
    }
  }

  /**
   * Show health alert notification
   */
  async showHealthAlert(alert: HealthAlert): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      const { emoji, title } = this.getAlertEmojiAndTitle(alert.level);

      PushNotification.localNotification({
        channelId: Config.app.notificationChannelId,
        title: `${emoji} ${title}`,
        message: alert.message,
        playSound: true,
        soundName: 'default',
        importance: 'high',
        priority: 'high',
        vibrate: true,
        vibration: 1000,
        userInfo: {
          type: 'health_alert',
          level: alert.level,
          timestamp: alert.timestamp,
          labels: alert.labels,
        },
      });

      console.log(`✅ Health alert notification shown for ${alert.level}`);
    } catch (error) {
      console.error('❌ Error showing health alert:', error);
    }
  }

  /**
   * Show recommendation notification
   */
  async showRecommendation(message: string, priority: string): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      // Only show for warning or critical
      if (priority !== 'warning' && priority !== 'critical') {
        console.log(`ℹ️ Skipping notification for ${priority} priority`);
        return;
      }

      const { emoji, title } = this.getRecommendationEmojiAndTitle(priority);

      PushNotification.localNotification({
        channelId: Config.app.notificationChannelId,
        title: `${emoji} ${title}`,
        message: message,
        playSound: true,
        soundName: 'default',
        importance: priority === 'critical' ? 'high' : 'default',
        priority: priority === 'critical' ? 'high' : 'default',
        vibrate: true,
        vibration: priority === 'critical' ? 1000 : 300,
        userInfo: {
          type: 'health_recommendation',
          priority: priority,
        },
      });

      console.log(`✅ Recommendation notification shown for ${priority}`);
    } catch (error) {
      console.error('❌ Error showing recommendation:', error);
    }
  }

  /**
   * Get emoji and title for alert level
   */
  private getAlertEmojiAndTitle(level: string): { emoji: string; title: string } {
    switch (level) {
      case 'critical':
        return { emoji: '🔴', title: 'Critical Health Alert' };
      case 'warning':
        return { emoji: '🟠', title: 'Health Warning' };
      default:
        return { emoji: '⚠️', title: 'Health Alert' };
    }
  }

  /**
   * Get emoji and title for recommendation priority
   */
  private getRecommendationEmojiAndTitle(priority: string): { emoji: string; title: string } {
    switch (priority) {
      case 'critical':
        return { emoji: '🔴', title: 'Critical Alert' };
      case 'warning':
        return { emoji: '🟠', title: 'Warning' };
      case 'caution':
        return { emoji: '🟡', title: 'Caution' };
      default:
        return { emoji: '💡', title: 'Health Recommendation' };
    }
  }

  /**
   * Cancel all notifications
   */
  async cancelAllNotifications(): Promise<void> {
    try {
      PushNotification.cancelAllLocalNotifications();
      console.log('✅ All notifications cancelled');
    } catch (error) {
      console.error('❌ Error cancelling notifications:', error);
    }
  }

  /**
   * Get badge count (iOS only)
   */
  async getBadgeCount(): Promise<number> {
    return new Promise((resolve) => {
      PushNotification.getApplicationIconBadgeNumber((count) => {
        resolve(count);
      });
    });
  }

  /**
   * Set badge count (iOS only)
   */
  async setBadgeCount(count: number): Promise<void> {
    PushNotification.setApplicationIconBadgeNumber(count);
    console.log(`✅ Badge count set to ${count}`);
  }

  /**
   * Clear badge count (iOS only)
   */
  async clearBadgeCount(): Promise<void> {
    await this.setBadgeCount(0);
  }
}

// Export singleton instance
export default new NotificationService();




// // src/services/notificationService.ts

// import * as Notifications from 'expo-notifications';
// import { Platform } from 'react-native';
// import { HealthAlert } from '../types';
// import { Config } from '../constants/config';

// /**
//  * Notification Service - Expo Compatible
//  * Handles push notifications for health alerts using expo-notifications
//  */
// class NotificationService {
//   private isInitialized: boolean = false;

//   /**
//    * Initialize notification service
//    */
//   async initialize(): Promise<void> {
//     if (this.isInitialized) {
//       return;
//     }

//     try {
//       // Configure how notifications should be handled when app is in foreground
//       Notifications.setNotificationHandler({
//         handleNotification: async () => ({
//           shouldShowAlert: true,
//           shouldPlaySound: true,
//           shouldSetBadge: false,
//         }),
//       });

//       // Create notification channel for Android
//       if (Platform.OS === 'android') {
//         await Notifications.setNotificationChannelAsync(
//           Config.app.notificationChannelId,
//           {
//             name: Config.app.notificationChannelName,
//             importance: Notifications.AndroidImportance.HIGH,
//             vibrationPattern: [0, 250, 250, 250],
//             sound: 'default',
//             description: Config.app.notificationChannelDescription,
//           }
//         );
//         console.log('✅ Android notification channel created');
//       }

//       this.isInitialized = true;
//       console.log('✅ Notification service initialized');
//     } catch (error) {
//       console.error('❌ Error initializing notification service:', error);
//     }
//   }

//   /**
//    * Request notification permissions
//    */
//   async requestPermissions(): Promise<boolean> {
//     try {
//       const { status: existingStatus } = await Notifications.getPermissionsAsync();
//       let finalStatus = existingStatus;

//       // If permission not already granted, request it
//       if (existingStatus !== 'granted') {
//         const { status } = await Notifications.requestPermissionsAsync();
//         finalStatus = status;
//       }

//       if (finalStatus !== 'granted') {
//         console.log('⚠️ Notification permission not granted');
//         return false;
//       }

//       console.log('✅ Notification permissions granted');
//       return true;
//     } catch (error) {
//       console.error('❌ Error requesting notification permissions:', error);
//       return false;
//     }
//   }

//   /**
//    * Show health alert notification
//    */
//   async showHealthAlert(alert: HealthAlert): Promise<void> {
//     if (!this.isInitialized) {
//       console.warn('⚠️ Notification service not initialized');
//       await this.initialize();
//     }

//     try {
//       const { emoji, title } = this.getAlertEmojiAndTitle(alert.level);

//       await Notifications.scheduleNotificationAsync({
//         content: {
//           title: `${emoji} ${title}`,
//           body: alert.message,
//           sound: 'default',
//           priority: Notifications.AndroidNotificationPriority.HIGH,
//           data: {
//             type: 'health_alert',
//             level: alert.level,
//             timestamp: alert.timestamp,
//             labels: alert.labels,
//           },
//         },
//         trigger: null, // Show immediately
//       });

//       console.log(`✅ Health alert notification shown for ${alert.level}`);
//     } catch (error) {
//       console.error('❌ Error showing health alert:', error);
//     }
//   }

//   /**
//    * Show recommendation notification
//    */
//   async showRecommendation(message: string, priority: string): Promise<void> {
//     if (!this.isInitialized) {
//       console.warn('⚠️ Notification service not initialized');
//       await this.initialize();
//     }

//     try {
//       // Only show for warning or critical
//       if (priority !== 'warning' && priority !== 'critical') {
//         console.log(`ℹ️ Skipping notification for ${priority} priority`);
//         return;
//       }

//       const { emoji, title } = this.getRecommendationEmojiAndTitle(priority);

//       await Notifications.scheduleNotificationAsync({
//         content: {
//           title: `${emoji} ${title}`,
//           body: message,
//           sound: 'default',
//           priority: 
//             priority === 'critical' 
//               ? Notifications.AndroidNotificationPriority.HIGH 
//               : Notifications.AndroidNotificationPriority.DEFAULT,
//           data: {
//             type: 'health_recommendation',
//             priority: priority,
//           },
//         },
//         trigger: null,
//       });

//       console.log(`✅ Recommendation notification shown for ${priority}`);
//     } catch (error) {
//       console.error('❌ Error showing recommendation:', error);
//     }
//   }

//   /**
//    * Get emoji and title for alert level
//    */
//   private getAlertEmojiAndTitle(level: string): { emoji: string; title: string } {
//     switch (level) {
//       case 'critical':
//         return { emoji: '🔴', title: 'Critical Health Alert' };
//       case 'warning':
//         return { emoji: '🟠', title: 'Health Warning' };
//       default:
//         return { emoji: '⚠️', title: 'Health Alert' };
//     }
//   }

//   /**
//    * Get emoji and title for recommendation priority
//    */
//   private getRecommendationEmojiAndTitle(priority: string): { emoji: string; title: string } {
//     switch (priority) {
//       case 'critical':
//         return { emoji: '🔴', title: 'Critical Alert' };
//       case 'warning':
//         return { emoji: '🟠', title: 'Warning' };
//       case 'caution':
//         return { emoji: '🟡', title: 'Caution' };
//       default:
//         return { emoji: '💡', title: 'Health Recommendation' };
//     }
//   }

//   /**
//    * Cancel all notifications
//    */
//   async cancelAllNotifications(): Promise<void> {
//     try {
//       await Notifications.cancelAllScheduledNotificationsAsync();
//       console.log('✅ All notifications cancelled');
//     } catch (error) {
//       console.error('❌ Error cancelling notifications:', error);
//     }
//   }

//   /**
//    * Get badge count (iOS only)
//    */
//   async getBadgeCount(): Promise<number> {
//     try {
//       const count = await Notifications.getBadgeCountAsync();
//       return count;
//     } catch (error) {
//       console.error('❌ Error getting badge count:', error);
//       return 0;
//     }
//   }

//   /**
//    * Set badge count (iOS only)
//    */
//   async setBadgeCount(count: number): Promise<void> {
//     try {
//       await Notifications.setBadgeCountAsync(count);
//       console.log(`✅ Badge count set to ${count}`);
//     } catch (error) {
//       console.error('❌ Error setting badge count:', error);
//     }
//   }

//   /**
//    * Clear badge count (iOS only)
//    */
//   async clearBadgeCount(): Promise<void> {
//     await this.setBadgeCount(0);
//   }
// }

// // Export singleton instance
// export default new NotificationService();