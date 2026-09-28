export interface InAppNotification {
  id: string;
  title: string;
  body: string;
  timestamp: string;
  type: 'booking' | 'payment' | 'info';
}

type NotificationListener = (notice: InAppNotification) => void;

class NotificationService {
  private listeners: NotificationListener[] = [];

  subscribe(listener: NotificationListener): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  async requestPermission(): Promise<NotificationPermission> {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        return await Notification.requestPermission();
      } catch (err) {
        console.warn('Notification permission request error:', err);
      }
    }
    return 'denied';
  }

  isPermissionGranted(): boolean {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission === 'granted';
    }
    return false;
  }

  notify(title: string, body: string, type: 'booking' | 'payment' | 'info' = 'info') {
    const item: InAppNotification = {
      id: 'notif-' + Date.now() + Math.random().toString(36).substring(2, 5),
      title,
      body,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type,
    };

    // 1. In-app event
    this.listeners.forEach((listener) => listener(item));

    // 2. Native Web Notification if supported & granted
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, {
          body,
          icon: '/favicon.ico',
          badge: '/favicon.ico',
        });
      } catch (e) {
        console.warn('Native notification failed:', e);
      }
    }
  }
}

export const notificationService = new NotificationService();
