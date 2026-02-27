import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance, EventType } from '@notifee/react-native';
import { Platform } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

/**
 * Request notification permissions
 */
export const requestNotificationPermission = async (): Promise<boolean> => {
  try {
    if (Platform.OS === 'ios') {
      const authStatus = await messaging().requestPermission();
      return (
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL
      );
    }
    
    // Android 13+ requires permission
    await notifee.requestPermission();
    return true;
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return false;
  }
};

/**
 * Get FCM token and save to Firestore
 */
export const getFCMToken = async (): Promise<string | null> => {
  try {
    const token = await messaging().getToken();
    
    // Save token to user's Firestore profile
    const user = auth().currentUser;
    if (user && token) {
      await firestore().collection('users').doc(user.uid).update({
        fcmToken: token,
        fcmTokenUpdatedAt: firestore.FieldValue.serverTimestamp(),
      });
    }
    
    return token;
  } catch (error) {
    console.error('Error getting FCM token:', error);
    return null;
  }
};

/**
 * Send notification to a specific user
 * This would typically be called from a backend/cloud function
 * For now, we'll store notifications in Firestore
 */
export const sendNotificationToUser = async (
  userId: string,
  title: string,
  body: string,
  data?: any
) => {
  try {
    await firestore().collection('notifications').add({
      userId,
      title,
      body,
      data: data ?? {},
      read: false,
      createdAt: firestore.FieldValue.serverTimestamp(),
    });
  } catch (error) {
    console.error('Error sending notification:', error);
  }
};

/**
 * Display local notification using Notifee
 */
export const displayLocalNotification = async (
  title: string,
  body: string,
  data?: any
) => {
  try {
    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
      importance: AndroidImportance.HIGH,
    });

    // Display notification
    await notifee.displayNotification({
      title,
      body,
      data,
      android: {
        channelId,
        importance: AndroidImportance.HIGH,
        pressAction: {
          id: 'default',
        },
      },
      ios: {
        foregroundPresentationOptions: {
          alert: true,
          badge: true,
          sound: true,
        },
      },
    });
  } catch (error) {
    console.error('Error displaying notification:', error);
  }
};

/**
 * Listen for referral notifications
 */
export const setupReferralNotifications = async () => {
  const user = auth().currentUser;
  if (!user) return;

  // Listen to user's referral updates
  const unsubscribe = firestore()
    .collection('users')
    .doc(user.uid)
    .onSnapshot((snapshot) => {
      const data = snapshot.data();
      const previousCount = snapshot.metadata.hasPendingWrites ? 0 : data?.referralCount ?? 0;
      
      // Check if referral count increased
      if (data?.referralCount && data.referralCount > previousCount) {
        displayLocalNotification(
          '🎉 New Referral!',
          `You earned ${data.referralPointsPerReferral ?? 100} points! Someone used your referral code.`,
          { type: 'referral' }
        );
      }
    });

  return unsubscribe;
};

/**
 * Handle foreground messages
 */
export const setupForegroundMessageHandler = () => {
  return messaging().onMessage(async (remoteMessage) => {
    console.log('Foreground message:', remoteMessage);
    
    if (remoteMessage.notification) {
      await displayLocalNotification(
        remoteMessage.notification.title || 'Notification',
        remoteMessage.notification.body || '',
        remoteMessage.data
      );
    }
  });
};

/**
 * Handle background messages
 */
export const setupBackgroundMessageHandler = () => {
  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    console.log('Background message:', remoteMessage);
  });
};

/**
 * Handle notification tap/press
 */
export const setupNotificationPressHandler = () => {
  return notifee.onForegroundEvent(({ type, detail }) => {
    if (type === EventType.PRESS) {
      console.log('Notification pressed:', detail.notification);
      // Handle navigation based on notification data
      const data = detail.notification?.data;
      if (data?.type === 'referral') {
        // Navigate to referral/rewards screen
      }
    }
  });
};

/**
 * Initialize notification services
 */
export const initializeNotifications = async () => {
  try {
    // Request permission
    const hasPermission = await requestNotificationPermission();
    if (!hasPermission) {
      console.log('Notification permission denied');
      return;
    }

    // Get FCM token
    await getFCMToken();

    // Setup handlers
    setupBackgroundMessageHandler();
    setupForegroundMessageHandler();
    setupNotificationPressHandler();
    
    // Setup referral notifications
    await setupReferralNotifications();

    // Listen for token refresh
    messaging().onTokenRefresh(async (token) => {
      const user = auth().currentUser;
      if (user) {
        await firestore().collection('users').doc(user.uid).update({
          fcmToken: token,
          fcmTokenUpdatedAt: firestore.FieldValue.serverTimestamp(),
        });
      }
    });
  } catch (error) {
    console.error('Error initializing notifications:', error);
  }
};
