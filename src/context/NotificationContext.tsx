import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import {
  getNotifications,
  markNotificationAsRead,
} from '@/services/notificationService';
import type { Notification } from '@/services/notificationService';
import {
  connectNotificationSocket,
  disconnectNotificationSocket,
} from '@/sockets/NotificationSocket';
import { getToken } from '@/services/tokenService';
import { useSnackbar } from '@/components/common/SnackbarProvider';

interface NotificationContextValue {
  notifications: Notification[];
  markAsRead: (id: number) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextValue | null>(
  null
);

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { authenticated } = useAuth();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const showSnackbar = useSnackbar();

  useEffect(() => {
    if (!authenticated) {
      setNotifications([]);
      disconnectNotificationSocket();
      return;
    }

    async function setup() {
      const existing = await getNotifications();

      setNotifications(existing);

      const token = getToken();

      if (!token) {
        return;
      }

      const socket = connectNotificationSocket(token);

      socket.on('notification', (notification: Notification) => {
        setNotifications((current) => [notification, ...current]);
        showSnackbar({
          message: '🔔You have a new notification!🔔',
        });
      });
    }

    setup();

    return () => {
      disconnectNotificationSocket();
    };
  }, [authenticated]);

  async function markAsRead(id: number) {
    await markNotificationAsRead(id);

    setNotifications((current) =>
      current.map((notification) =>
        notification.id === id
          ? {
              ...notification,
              read: true,
            }
          : notification
      )
    );
  }

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        markAsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error(
      'useNotifications must be used inside NotificationProvider'
    );
  }

  return context;
}
