import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export interface BridgeStoreState {
  open: boolean;
  amount: bigint;
  setOpen: (amount: bigint) => void;
  close: () => void;
}

export const useBridgeStore = create<
  BridgeStoreState,
  [['zustand/immer', never]]
>(
  immer((set) => ({
    open: false,
    amount: 0n,
    setOpen(amount) {
      set({
        open: true,
        amount,
      });
    },
    close() {
      set({
        open: false,
      });
    },
  }))
);
