import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { IToast } from '@/components/ui/games-store/shared/Toast';
import { immer } from 'zustand/middleware/immer';

export interface ToasterStore {
  toasts: IToast[];
  addToast: (toast: IToast) => void;
  removeToast: (toastId: number) => void;
  clear: () => void;
}

export const useToasterStore = create<
  ToasterStore,
  [['zustand/immer', never]]
>(
  immer((set) => ({
      toasts: [],
      addToast: (toast) => {
        set((state) => ({
          toasts: [...state.toasts, toast],
        }));
      },
      removeToast: (toastId) => {
        set((state) => ({
          toasts: state.toasts.filter((toast) => toast.id != toastId),
        }));
      },
      clear: () => {
        set({ toasts: [] });
      },
    }),
  )
);
