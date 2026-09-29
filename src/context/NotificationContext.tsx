import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { NotificationItem } from '../types';
import { notificationService } from '../services/notification.service';

interface NotificationContextType {
  notifications: NotificationItem[];
  unreadCount: number;
  loading: boolean;
  refreshNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  clearAll: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  unreadCount: 0,
  loading: true,
  refreshNotifications: async () => {},
  markAsRead: async () => {},
  markAllAsRead: async () => {},
  clearAll: async () => {},
});

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const refreshNotifications = useCallback(async () => {
    setLoading(true);
    const list = await notificationService.getNotifications();
    setNotifications(list);
    setLoading(false);
  }, []);

  useEffect(() => {
    refreshNotifications();
  }, [refreshNotifications]);

  const markAsRead = async (id: string) => {
    await notificationService.markAsRead(id);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllAsRead = async () => {
    await notificationService.markAllAsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearAll = async () => {
    await notificationService.clearAll();
    setNotifications([]);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        refreshNotifications,
        markAsRead,
        markAllAsRead,
        clearAll,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
