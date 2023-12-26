import { PendingTransaction, UnsignedTransaction } from "@proto-kit/sequencer";
import { MethodIdResolver } from "@proto-kit/module";
import { useCallback, useEffect, useMemo } from "react";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
// @ts-ignore
import truncateMiddle from "truncate-middle";
import { usePrevious } from "@uidotdev/usehooks";
// import { useClientStore } from "./client";
import { Field, PublicKey, Signature, UInt64 } from "o1js";
import { walletInstalled } from "../utils";

export interface WalletState {
  wallet?: string;
  initializeWallet: () => Promise<void>;
  connectWallet: () => Promise<void>;
  observeWalletChange: () => void;

  pendingTransactions: PendingTransaction[];
  addPendingTransaction: (pendingTransaction: PendingTransaction) => void;
  removePendingTransaction: (pendingTransaction: PendingTransaction) => void;
}

export const useWalletStore = create<WalletState, [["zustand/immer", never]]>(
  immer((set) => ({
    async initializeWallet() {
      if (!walletInstalled()) {
        throw new Error("Auro wallet not installed");
      }

      const [wallet] = await mina!.getAccounts();

      set((state) => {
        state.wallet = wallet;
      });
    },
    async connectWallet() {
      if (!walletInstalled()) {
        throw new Error("Auro wallet not installed");
      }

      const [wallet] = await mina!.requestAccounts();

      set((state) => {
        state.wallet = wallet;
      });
    },
    observeWalletChange() {
      if (!walletInstalled()) {
        throw new Error("Auro wallet not installed");
      }

      mina!.on("accountsChanged", ([wallet]) => {
        set((state) => {
          state.wallet = wallet;
        });
      });
    },

    pendingTransactions: [] as PendingTransaction[],
    addPendingTransaction(pendingTransaction) {
      set((state) => {
        // @ts-ignore
        state.pendingTransactions.push(pendingTransaction);
      });
    },
    removePendingTransaction(pendingTransaction) {
      set((state) => {
        state.pendingTransactions = state.pendingTransactions.filter((tx) => {
          return tx.hash().toString() !== pendingTransaction.hash().toString();
        });
      });
    },
  })),
);

export const useNotifyTransactions = () => {
  const wallet = useWalletStore();
  // const client = useClientStore();

  const previousPendingTransactions = usePrevious(wallet.pendingTransactions);
  const newPendingTransactions = useMemo(() => {
    return wallet.pendingTransactions.filter(
      (pendingTransaction) =>
        !(previousPendingTransactions ?? []).includes(pendingTransaction),
    );
  }, [wallet.pendingTransactions, previousPendingTransactions]);

};
