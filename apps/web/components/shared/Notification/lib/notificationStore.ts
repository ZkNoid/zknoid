import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { NotificationType } from '../types/notificationType';
import { INotification } from '../types/INotification';

export interface NotificationStore {
  notifications: INotification[];
  getById: (id: string) => INotification | undefined;
  create: (notification: {
    id?: string;
    type: NotificationType;
    message: string;
    isDismissible: boolean;
    dismissAfterDelay?: boolean;
    dismissDelay?: number;
  }) => string;
  remove: (id: string) => void;
  clear: () => void;
}

export const useNotificationStore = create<
  NotificationStore,
  [['zustand/immer', never]]
>(
  immer((set, get) => ({
    notifications: [],
    getById: (id: string) => {
      return get().notifications.find((notification) => notification.id === id);
    },
    create: (notification: {
      id?: string;
      type: NotificationType;
      message: string;
      isDismissible: boolean;
      dismissAfterDelay?: boolean;
      dismissDelay?: number;
    }) => {
      if (!notification.id) {
        notification.id = `${notification.type}-${Date.now()}`;
      }
      if (notification.dismissAfterDelay && !notification.dismissDelay) {
        notification.dismissDelay = 5000;
      }
      set((state) => ({
        notifications: [...state.notifications, notification],
      }));
      return notification.id;
    },
    remove: (id: string) => {
      set((state) => ({
        notifications: state.notifications.filter(
          (notification) => notification.id !== id
        ),
      }));
    },
    clear: () => {
      set(() => ({ notifications: [] }));
    },
  }))
);
