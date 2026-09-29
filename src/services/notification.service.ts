import { NotificationItem } from '../types';
import { INITIAL_NOTIFICATIONS } from './mockData';
import { storage } from './storage.service';

const NOTIFICATIONS_STORAGE_KEY = '@volttech_notifications';

export interface INotificationService {
  getNotifications(): Promise<NotificationItem[]>;
  markAsRead(id: string): Promise<void>;
  markAllAsRead(): Promise<void>;
  addNotification(item: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>): Promise<NotificationItem>;
  clearAll(): Promise<void>;
}

class NotificationService implements INotificationService {
  async getNotifications(): Promise<NotificationItem[]> {
    const list = await storage.getItem<NotificationItem[]>(NOTIFICATIONS_STORAGE_KEY);
    if (!list || list.length === 0) {
      await storage.setItem(NOTIFICATIONS_STORAGE_KEY, INITIAL_NOTIFICATIONS);
      return INITIAL_NOTIFICATIONS;
    }
    return list;
  }

  async markAsRead(id: string): Promise<void> {
    const list = await this.getNotifications();
    const updated = list.map((n) => (n.id === id ? { ...n, read: true } : n));
    await storage.setItem(NOTIFICATIONS_STORAGE_KEY, updated);
  }

  async markAllAsRead(): Promise<void> {
    const list = await this.getNotifications();
    const updated = list.map((n) => ({ ...n, read: true }));
    await storage.setItem(NOTIFICATIONS_STORAGE_KEY, updated);
  }

  async addNotification(item: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>): Promise<NotificationItem> {
    const list = await this.getNotifications();
    const newNotif: NotificationItem = {
      ...item,
      id: `notif-${Date.now()}`,
      timestamp: 'Just now',
      read: false,
    };
    const updated = [newNotif, ...list];
    await storage.setItem(NOTIFICATIONS_STORAGE_KEY, updated);
    return newNotif;
  }

  async clearAll(): Promise<void> {
    await storage.setItem(NOTIFICATIONS_STORAGE_KEY, []);
  }
}

export const notificationService = new NotificationService();
