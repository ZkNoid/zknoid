import { immer } from 'zustand/middleware/immer';
import { PublicKey, UInt64 } from 'o1js';
import { RoundIdxUser } from 'zknoid-chain-dev';
import { MatchMaker, PENDING_BLOCKS_NUM_CONST } from 'zknoid-chain-dev';
import { type ModuleQuery } from '@proto-kit/sequencer';

export interface MatchQueueState {
  loading: boolean;
  queueLength: number;
  inQueue: boolean;
  activeGameId: bigint;
  gameInfo: any | undefined;
  lastGameState: 'win' | 'lost' | undefined;
  pendingBalance: bigint;
  getQueueLength: () => number;
  loadMatchQueue(
    query: ModuleQuery<MatchMaker>,
    blockHeight: number
  ): Promise<void>;
  loadActiveGame: (
    query: ModuleQuery<MatchMaker>,
    blockHeight: number,
    address: PublicKey
  ) => Promise<void>;
  resetLastGameState: () => void;
}

const PENDING_BLOCKS_NUM = UInt64.from(PENDING_BLOCKS_NUM_CONST);

export const matchQueueInitializer = immer<MatchQueueState>((set) => ({
  loading: Boolean(false),
  queueLength: 0,
  activeGameId: BigInt(0),
  inQueue: Boolean(false),
  gameInfo: undefined as any | undefined,
  lastGameState: undefined as 'win' | 'lost' | undefined,
  pendingBalance: 0n,
  resetLastGameState() {
    set((state) => {
      state.lastGameState = undefined;
      state.gameInfo = undefined;
    });
  },
  getQueueLength() {
    return this.queueLength;
  },
  async loadMatchQueue(query: ModuleQuery<MatchMaker>, blockHeight: number) {
    set((state) => {
      state.loading = true;
    });

    console.log(
      'Frontend round',
      UInt64.from(blockHeight).div(PENDING_BLOCKS_NUM).toBigInt()
    );

    const queueLength = await query.queueLength.get(
      UInt64.from(blockHeight).div(PENDING_BLOCKS_NUM)
    );

    set((state) => {
      // @ts-ignore
      state.queueLength = Number(queueLength?.toBigInt() || 0);
      state.loading = false;
    });
  },
  async loadActiveGame(
    query: ModuleQuery<MatchMaker>,
    blockHeight: number,
    address: PublicKey
  ) {
    set((state) => {
      state.loading = true;
    });

    const activeGameId = await query.activeGameId.get(address);
    console.log('Active game idd', activeGameId);
    const inQueue = await query.queueRegisteredRoundUsers.get(
      //@ts-ignore
      new RoundIdxUser({
        roundId: UInt64.from(blockHeight).div(PENDING_BLOCKS_NUM),
        userAddress: address,
      })
    );

    console.log('Active game idd', activeGameId?.toBigInt());
    console.log('In queue', inQueue?.toBoolean());

    if (
      activeGameId?.equals(UInt64.from(0)).toBoolean() &&
      this.gameInfo?.gameId
    ) {
      console.log('Setting last game state', this.gameInfo?.gameId);
      const gameInfo = (await query.games.get(
        UInt64.from(this.gameInfo?.gameId!)
      ))!;
      console.log('Fetched last game info', gameInfo);
      console.log('Game winner', gameInfo.winner.toBase58());

      // const field = (gameInfo.field as RandzuField).value.map((x: UInt32[]) =>
      //   x.map((x) => x.toBigint())
      // );

      set((state) => {
        state.lastGameState = gameInfo.winner.equals(address).toBoolean()
          ? 'win'
          : 'lost';
        state.gameInfo!.field = gameInfo.field;
        state.gameInfo!.isCurrentUserMove = false;
      });
    }

    if (activeGameId?.greaterThan(UInt64.from(0)).toBoolean()) {
      const gameInfo = (await query.games.get(activeGameId))!;
      console.log('Raw game info', gameInfo);

      const currentUserIndex = address
        .equals(gameInfo.player1 as PublicKey)
        .toBoolean()
        ? 0
        : 1;
      const player1 = gameInfo.player1 as PublicKey;
      const player2 = gameInfo.player2 as PublicKey;
      // const field = (gameInfo.field as RandzuField).value.map((x: UInt32[]) =>
      //   x.map((x) => x.toBigint())
      // );
      const lastMoveBlockHeight = gameInfo.lastMoveBlockHeight;
      console.log('BH', lastMoveBlockHeight);
      set((state) => {
        // @ts-ignore
        state.gameInfo = {
          player1,
          player2,
          currentMoveUser: gameInfo.currentMoveUser as PublicKey,
          field: gameInfo.field ?? gameInfo.thimblerigField, // @todo temporal workaround for proto-kit bug https://github.com/ZkNoid/proto-kit,
          currentUserIndex,
          isCurrentUserMove: (gameInfo.currentMoveUser as PublicKey)
            .equals(address)
            .toBoolean(),
          opponent: currentUserIndex == 1 ? gameInfo.player1 : gameInfo.player2,
          gameId: activeGameId.toBigInt(),
          lastMoveBlockHeight: lastMoveBlockHeight?.toBigInt(),
          winner: gameInfo.winner.equals(PublicKey.empty()).not().toBoolean()
            ? gameInfo.winner
            : undefined,
        };
        console.log('Parsed game info', state.gameInfo);
      });
    }

    const pendingBalance = (
      await query.pendingBalances.get(address)
    )?.toBigInt();

    console.log('Pending balance', pendingBalance);

    set((state) => {
      // @ts-ignore
      state.activeGameId = activeGameId?.toBigInt() || 0n;
      state.inQueue = inQueue?.toBoolean();
      state.loading = false;
      state.pendingBalance = pendingBalance || 0n;
    });
  },
}));

export interface IGameInfo<GameField> {
  player1: PublicKey;
  player2: PublicKey;
  currentMoveUser: PublicKey;
  winner: PublicKey;
  field: GameField;
  currentUserIndex: 0 | 1;
  isCurrentUserMove: boolean;
  opponent: PublicKey;
  gameId: bigint;
}
