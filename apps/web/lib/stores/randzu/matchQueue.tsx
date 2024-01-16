import { create } from "zustand";
import { Client, useClientStore } from "../client";
import { immer } from "zustand/middleware/immer";
import { PendingTransaction, UnsignedTransaction } from "@proto-kit/sequencer";
import { PublicKey, UInt64 } from "o1js";
import { useEffect } from "react";
import { useProtokitChainStore } from "../protokitChain";
import { useNetworkStore } from "../network";


export interface MatchQueueState {
    loading: boolean;
    queueLength: number;
    getQueueLength: () => number;
    loadMatchQueue: (client: Client, blockHeight: number) => Promise<void>;
}

function isPendingTransaction(
    transaction: PendingTransaction | UnsignedTransaction | undefined,
): asserts transaction is PendingTransaction {
    if (!(transaction instanceof PendingTransaction))
        throw new Error("Transaction is not a PendingTransaction");
}

const PENDING_BLOCKS_NUM = UInt64.from(5);

export const useRandzuMatchQueueStore = create<
    MatchQueueState,
    [["zustand/immer", never]]
>(
    immer((set) => ({
        loading: Boolean(false),
        leaderboard: {},
        queueLength: 0,
        getQueueLength() {
            return this.queueLength;
        },
        async loadMatchQueue(client: Client, blockHeight: number) {
            set((state) => {
                state.loading = true;
            });

            const queueLength = await client.query.runtime.MatchMaker.queueLength.get(
                UInt64.from(blockHeight).div(PENDING_BLOCKS_NUM)
            );

            set((state) => {
                // @ts-ignore
                state.queueLength = Number(queueLength?.toBigInt() || 0);
                state.loading = false;
            });
        },
        
    })),
);

export const useObserveRandzuMatchQueue = () => {
    const client = useClientStore();
    const chain = useProtokitChainStore();
    const network = useNetworkStore();
    const matchQueue = useRandzuMatchQueueStore();

    useEffect(() => {
        if (!client.client || !network.address) return;

        matchQueue.loadMatchQueue(client.client, parseInt(chain.block?.height ?? "0"));
    }, [client.client, chain.block?.height, network.address]);
};
