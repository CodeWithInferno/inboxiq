// requestNotification.js
import { messaging } from './firebase';

export const requestNotificationPermission = async () => {
  try {
    // Request permission
    await Notification.requestPermission();
    // Get token
    const token = await messaging.getToken();
    console.log('FCM Token:', token);
    // You may want to send this token to your server
  } catch (error) {
    console.error('Permission denied or error in token retrieval:', error);
  }
};
