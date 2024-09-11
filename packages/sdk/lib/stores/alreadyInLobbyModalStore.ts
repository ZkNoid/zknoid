import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AlreadyInLobbyModalStore {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  close: () => void;
}

export const useAlreadyInLobbyModalStore = create<
  AlreadyInLobbyModalStore,
  [['zustand/persist', never]]
>(
  persist(
    (set, get) => ({
      isOpen: false,
      setIsOpen: (isOpen) => {
        set((state) => ({
          isOpen: isOpen,
        }));
      },
      close: () => {
        set((state) => ({
          isOpen: false,
        }));
      },
    }),
    {
      name: 'alreadyInLobbyModalStore',
    }
  )
);
