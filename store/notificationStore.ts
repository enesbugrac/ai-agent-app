import { create } from 'zustand';
import { toast } from 'react-toastify';

export type NotificationType = 'information' | 'success' | 'error';

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  duration?: number;
}

interface NotificationStore {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
}

const toastMap: Record<NotificationType, (message: string, options: any) => void> = {
    success: toast.success,
    error: toast.error,
    information: toast.info,
  };

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],
  addNotification: (notification) => {

    const id = new Date().getTime().toString();
    const newNotification: Notification = { id, ...notification };

    set((state) => ({
      notifications: [...state.notifications, newNotification],
    }));

    const toastOptions = {
      autoClose: notification.duration ?? 3000,
      onClose: () => get().removeNotification(id),
    };

    toastMap[notification.type](notification.message, toastOptions);
  },
  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
}));