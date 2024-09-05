import { useEffect, useState } from 'react';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export interface ComputedTransactionJSON {
  argsFields: string[];
  argsJSON: string[];
  methodId: string;
  nonce: string;
  sender: string;
  signature: {
    r: string;
    s: string;
  };
}

export interface ComputedBlockJSON {
  txs?: {
    status: boolean;
    statusMessage?: string;
    tx: ComputedTransactionJSON;
  }[];
}

export interface ChainState {
  loading: boolean;
  block?: {
    height: number;
  } & ComputedBlockJSON;
  loadBlock: () => Promise<void>;
}

export interface BlockQueryResponse {
  data: {
    network: {
      unproven?: {
        block: {
          height: string;
        };
      };
    };
    block: ComputedBlockJSON;
  };
}

export const useProtokitChainStore = create<
  ChainState,
  [['zustand/immer', never]]
>(
  immer((set) => ({
    loading: Boolean(false),
    async loadBlock() {
      set((state) => {
        state.loading = true;
      });

      const response = await fetch(
        process.env.NEXT_PUBLIC_PROTOKIT_URL || 'http://localhost:8080/graphql',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: `
          query GetBlock {
              block {
                txs {
                  tx {
                    argsFields
                    auxiliaryData
                    methodId
                    nonce
                    sender
                    signature {
                      r
                      s
                    }
                  }
                  status
                  statusMessage
                }
              }
              network {
                unproven {
                  block {
                    height
                  }
                }
              }
            }
        `,
          }),
        }
      );

      const { data } = (await response.json()) as BlockQueryResponse;

      set((state) => {
        state.loading = false;
        state.block = data.network.unproven
          ? {
              height: parseInt(data.network.unproven.block.height),
              ...data.block,
            }
          : undefined;
      });
    },
  }))
);

export const tickInterval = 5000;
export const usePollProtokitBlockHeight = () => {
  const chain = useProtokitChainStore();

  useEffect(() => {
    const intervalId = setInterval(() => {
      chain.loadBlock();
    }, tickInterval);
    chain.loadBlock();

    return () => clearInterval(intervalId);
  }, []);
};
