import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { INotification } from '../types/INotification';
import { ReactNode } from 'react';

export interface NotificationStore {
  notifications: INotification[];
  getById: (id: string) => INotification | undefined;
  create: (notification: {
    id?: string;
    type: 'message' | 'loader' | 'success' | 'error';
    message: string;
    customIcon?: any;
    isDismissible?: boolean;
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
    create: ({
      id,
      type = 'message',
      message,
      customIcon,
      isDismissible = true,
      dismissAfterDelay = true,
      dismissDelay = 5000,
    }: {
      id?: string;
      type?: 'message' | 'loader' | 'success' | 'error';
      message: string;
      customIcon?: any;
      isDismissible?: boolean;
      dismissAfterDelay?: boolean;
      dismissDelay?: number;
    }) => {
      if (!id) {
        id = `${type}-${Date.now()}`;
      }
      // if (!notification.dismissDelay) {
      //   notification.dismissDelay = 5000;
      // }
      set((state) => ({
        notifications: [
          ...state.notifications,
          {
            id,
            type,
            message,
            customIcon,
            isDismissible,
            dismissAfterDelay,
            dismissDelay,
          },
        ],
      }));
      return id;
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
