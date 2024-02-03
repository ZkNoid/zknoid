import { create } from "zustand";
import { Client, useClientStore } from "../client";
import { immer } from "zustand/middleware/immer";
import { PendingTransaction, UnsignedTransaction } from "@proto-kit/sequencer";
import { PrivateKey, PublicKey, UInt32, UInt64 } from "o1js";
import { useEffect } from "react";
import { useProtokitChainStore } from "../protokitChain";
import { useNetworkStore } from "../network";
import { RoundIdxUser } from "zknoid-chain-dev/dist/engine/MatchMaker";
import { RandzuField } from "zknoid-chain-dev/dist/RandzuLogic";


export interface IWinWitness {
    x: number;
    y: number;
    directionX: number;
    directionY: number;
}
export interface IGameInfo {
    player1: PublicKey;
    player2: PublicKey;
    currentMoveUser: PublicKey;
    winner: PublicKey;
    field: number[][];
    currentUserIndex: 0 | 1;
    isCurrentUserMove: boolean;
    opponent: PublicKey;
    gameId: bigint;
    winWitness: IWinWitness;
  }

export interface MatchQueueState {
    loading: boolean;
    queueLength: number;
    inQueue: boolean;
    activeGameId: bigint;
    gameInfo: IGameInfo | undefined;
    getQueueLength: () => number;
    loadMatchQueue: (client: Client, blockHeight: number) => Promise<void>;
    loadActiveGame: (client: Client, blockHeight: number, address: PublicKey) => Promise<void>;
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
        activeGameId: BigInt(0),
        inQueue: Boolean(false),
        gameInfo: undefined as IGameInfo | undefined,
        getQueueLength() {
            return this.queueLength;
        },
        async loadMatchQueue(client: Client, blockHeight: number) {
            set((state) => {
                state.loading = true;
            });

            const queueLength = await client.query.runtime.RandzuLogic.queueLength.get(
                UInt64.from(blockHeight).div(PENDING_BLOCKS_NUM)
            );

            set((state) => {
                // @ts-ignore
                state.queueLength = Number(queueLength?.toBigInt() || 0);
                state.loading = false;
            });
        },
        async loadActiveGame(client: Client, blockHeight: number, address: PublicKey) {
            set((state) => {
                state.loading = true;
            });

            const activeGameId = await client.query.runtime.RandzuLogic.activeGameId.get(
                address
            );
            console.log('Active game id', activeGameId);
            const inQueue = await client.query.runtime.RandzuLogic.queueRegisteredRoundUsers.get(
                // @ts-expect-error
                new RoundIdxUser({
                    roundId: UInt64.from(blockHeight).div(PENDING_BLOCKS_NUM),
                    userAddress: address
                })
            );

            console.log('Active game id', activeGameId?.toBigInt());
            console.log('In queue', inQueue?.toBoolean());

            if (activeGameId?.greaterThan(UInt64.from(0)).toBoolean()) {
                const gameInfo = (await client.query.runtime.RandzuLogic.games.get(activeGameId))!;
                console.log('Raw game info', gameInfo);

                const currentUserIndex = address.equals(gameInfo.player1 as PublicKey).toBoolean() ? 0 : 1;
                const player1 = gameInfo.player1 as PublicKey;
                const player2 = gameInfo.player2 as PublicKey;
                const field = (gameInfo.field as RandzuField).value.map((x: UInt32[]) => x.map(x => x.toBigint()));
                set((state) => {
                    // @ts-ignore
                    state.gameInfo = {
                        player1,
                        player2,
                        currentMoveUser: gameInfo.currentMoveUser as PublicKey,
                        field,
                        currentUserIndex,
                        isCurrentUserMove: (gameInfo.currentMoveUser as PublicKey).equals(address).toBoolean(),
                        opponent: currentUserIndex == 1 ? gameInfo.player1: gameInfo.player2,
                        gameId: activeGameId.toBigInt(),
                        winner: gameInfo.winner.equals(PublicKey.empty()).not().toBoolean() ? gameInfo.winner : undefined,
                        winWitness: {
                            x: 0,
                            y: 0,
                            directionX: 0,
                            directionY: 0
                        }
                    }
                    console.log('Parsed game info', state.gameInfo);
                })
            }

            set((state) => {
                // @ts-ignore
                state.activeGameId = activeGameId?.toBigInt() || 0n;
                state.inQueue = inQueue?.toBoolean();
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
        matchQueue.loadActiveGame(client.client, parseInt(chain.block?.height ?? "0"), PublicKey.fromBase58(network.address));
    }, [client.client, chain.block?.height, network.address]);
};
