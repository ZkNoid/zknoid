import { create } from "zustand";
import { useClientStore } from "./client";
import { immer } from "zustand/middleware/immer";
import { useEffect } from "react";
import { useChainStore } from "./minaChain";
import { useNetworkStore } from "./network";
import { NETWORKS } from "@/app/constants/networks";

export interface BalancesState {
  loading: boolean;
  balances: {
    // address - balance
    [key: string]: string;
  };
  loadBalance: (chainId: string, address: string) => Promise<void>;
}

export interface BalanceQueryResponse {
  data: {
    account: {
      balance: {
        total: string
      };
    } | undefined;
  };
}

export const useBalancesStore = create<
  BalancesState,
  [["zustand/immer", never]]
>(
  immer((set) => ({
    loading: Boolean(false),
    balances: {},
    async loadBalance(chainId: string, address: string) {
      set((state) => {
        state.loading = true;
      });

      const response = await fetch(NETWORKS.find(x => x.chainId == chainId)?.graphql!, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `
            query {
              account(publicKey: "${address}") {
                balance {
                  total
                }
                delegate
                nonce
              }
            }
          `,
        }),
      });

      const { data } = (await response.json()) as BalanceQueryResponse;
      const balance = data.account?.balance.total;

      set((state) => {
        state.loading = false;
        state.balances[address] = balance ?? "0";
      });
    },
  })),
);

export const useObserveBalance = () => {
  console.log('Observing')
  const client = useClientStore();
  const chain = useChainStore();
  const balances = useBalancesStore();
  const network = useNetworkStore();

  useEffect(() => {
    if (!client.client || !network.address) return;

    balances.loadBalance(network.minaNetwork?.chainId!, network.address);
  }, [client.client, chain.block?.height, network.address, network.minaNetwork?.chainId]);
};