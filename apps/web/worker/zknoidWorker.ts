import 'reflect-metadata';

import { LOTTERY_CACHE } from '@/constants/contracts_cache';
import { FetchedCache, WebFileSystem, fetchCache } from '@/lib/cache';
import { mockProof } from '@/lib/utils';

import {
  Field as Field014,
  UInt64,
  PublicKey,
  Field,
  MerkleMapWitness,
  MerkleMap,
  UInt32,
  Mina,
  fetchAccount,
  NetworkId,
  type JsonProof,
} from 'o1js';
import {
  checkMapGeneration,
  checkGameRecord,
  Bricks,
  GameInputs,
  GameRecord,
  MapGenerationProof,
  initGameProcess,
  GameProcessProof,
  processTicks,
  GameRecordProof,
  client,
  Tick,
} from 'zknoid-chain-dev';
import {
  Ticket,
  Lottery,
  DistibutionProgram,
  StateManager,
  NumberPacked,
  getNullifierId,
  DistributionProof,
  DistributionProofPublicInput,
} from 'l1-lottery-contracts';

import {
  BuyTicketEvent,
  GetRewardEvent,
  ProduceResultEvent,
} from 'l1-lottery-contracts';
import { NETWORKS } from '@/app/constants/networks';
import { number } from 'zod';
import { lotteryBackendRouter } from '@/server/api/routers/lottery-backend';
import { api } from '@/trpc/vanilla';
// import { DummyBridge } from 'zknoidcontractsl1';

// ---------------------------------------------------------------------------------------
type Transaction = Awaited<ReturnType<typeof Mina.transaction>>;

const state = {
  gameRecord: null as null | typeof GameRecord,
  Lottery: null as null | typeof Lottery,
  lotteryGame: null as null | Lottery,
  lotteryOffchainState: null as null | StateManager,
  lotteryCache: null as null | FetchedCache,
  buyTicketTransaction: null as null | Transaction,
  getRewardTransaction: null as null | Transaction,
};

// ---------------------------------------------------------------------------------------

const functions = {
  loadContracts: async (args: {}) => {
    console.log('[Worker] loading contracts');
    state.gameRecord = GameRecord;
    // state.dummyBridge = DummyBridge;
  },
  loadLotteryContract: async () => {
    state.Lottery = Lottery;
  },
  downloadLotteryCache: async () => {
    state.lotteryCache = await fetchCache(LOTTERY_CACHE);
  },
  compileContracts: async (args: {}) => {},
  compileDistributionProof: async (args: {}) => {
    console.log('[Worker] compiling distribution contracts');
    console.log('Cache info', LOTTERY_CACHE);

    await DistibutionProgram.compile({
      cache: WebFileSystem(state.lotteryCache!),
    });

    console.log('[Worker] compiling distr contracts ended');
  },
  compileLotteryContracts: async (args: {}) => {
    console.log('[Worker] compiling lottery contracts');

    await Lottery.compile({
      cache: WebFileSystem(state.lotteryCache!),
    });
    console.log('[Worker] compiling contracts ended');
  },
  initLotteryInstance: async (args: {
    lotteryPublicKey58: string;
    networkId: NetworkId;
  }) => {
    const publicKey = PublicKey.fromBase58(args.lotteryPublicKey58);
    state.lotteryGame = new state.Lottery!(publicKey);
    console.log('[Worker] lottery instance init');
    const Network = Mina.Network({
      mina: NETWORKS[args.networkId.toString()].graphql,
      archive: NETWORKS[args.networkId.toString()].archive,
    });
    console.log('Devnet network instance configured.');
    Mina.setActiveInstance(Network);

    console.log('Fetching account');
    const account = await fetchAccount({ publicKey });
    console.log('Fetched account', account);
  },
  async fetchOffchainState(args: { startBlock: number; roundId: number }) {
    const stateM = new StateManager(
      UInt32.from(args.startBlock).toFields()[0],
      true
    );
    console.log('Args', args);
    console.log('Fetching events');

    const events = (await api.lotteryBackend.getMinaEvents.query({})).events;

    console.log('Fetched events', events);
    console.log(
      'Sync with block',
      Number(args.startBlock) + args.roundId * 480 + 1
    );

    stateM.syncWithCurBlock(Number(args.startBlock) + args.roundId * 480 + 1);
    console.log(
      'Sync with',
      args.startBlock,
      Number(args.startBlock) + args.roundId * 480 + 1,
      args.roundId
    );

    for (let i = 0; i < events.length; i++) {
      const event = events[i];
      const data = state.lotteryGame.events[event.type as any].fromJSON(
        event.event.data as undefined as any
      );

      if (event.type == 'buy-ticket') {
        console.log(
          'Adding ticket to state',
          data.ticket,
          'round' + data.round
        );

        stateM.addTicket(data.ticket, +data.round);
      }
      if (event.type == 'produce-result') {
        console.log('Produced result', data.result, 'round' + data.round);

        stateM.roundResultMap.set(data.round, data.result);
      }
      if (event.type == 'get-reward') {
        console.log('Got reward', data.ticket, 'round' + data.round);

        let ticketId = 0;
        let roundTicketWitness;

        for (; ticketId < stateM.lastTicketInRound[data.round]; ticketId++) {
          if (
            stateM.roundTicketMap[data.round]
              .get(Field(ticketId))
              .equals(data.ticket.hash())
              .toBoolean()
          ) {
            roundTicketWitness = stateM.roundTicketMap[data.round].getWitness(
              Field.from(ticketId)
            );
            break;
          }
        }

        stateM.ticketNullifierMap.set(
          getNullifierId(Field.from(data.round), Field.from(ticketId)),
          Field(1)
        );
      }
    }

    state.lotteryOffchainState = stateM;
    return events.at(-1)?.blockHeight || 0;
  },
  async getRoundsInfo(args: { roundIds: number[] }) {
    console.log('Round ids', args.roundIds);
    const stateM = state.lotteryOffchainState!;
    const data = {} as Record<
      number,
      {
        id: number;
        bank: bigint;
        tickets: {
          amount: bigint;
          numbers: number[];
          owner: string;
        }[];
        winningCombination: number[] | undefined;
      }
    >;

    for (let i = 0; i < args.roundIds.length; i++) {
      console.log('I', i);
      const roundId = args.roundIds[i];

      const winningCombination = NumberPacked.unpackToBigints(
        stateM.roundResultMap.get(Field.from(roundId))
      )
        .map((v) => Number(v))
        .slice(0, 6);

      data[roundId] = {
        id: roundId,
        bank: stateM.roundTickets[roundId]
          .map((x) => x.amount.toBigInt())
          .reduce((x, y) => x + y),
        tickets: stateM.roundTickets[roundId].map((x, i) => ({
          amount: x.amount.toBigInt(),
          numbers: x.numbers.map((x) => Number(x.toBigint())),
          owner: x.owner.toBase58(),
          claimed: stateM.ticketNullifierMap
            .get(getNullifierId(Field.from(roundId), Field.from(i)))
            .equals(Field.from(1))
            .toBoolean(),
        })),
        winningCombination: winningCombination.every((x) => x == 0)
          ? undefined
          : winningCombination,
      };
    }
    return data;
  },
  buyTicket: async (args: {
    senderAccount: string;
    startBlock: number;
    roundId: number;
    ticketNums: number[];
    amount: number;
  }) => {
    const senderAccount = PublicKey.fromBase58(args.senderAccount);

    if (!state.lotteryOffchainState) {
      await functions.fetchOffchainState({
        startBlock: args.startBlock,
        roundId: args.roundId,
      });
    }
    const stateM = state.lotteryOffchainState!;

    console.log(args.ticketNums, senderAccount, args.roundId);
    const ticket = Ticket.from(args.ticketNums, senderAccount, args.amount);
    let [roundWitness, roundTicketWitness, bankWitness, bankValue] =
      stateM.addTicket(ticket, args.roundId);

    let tx = await Mina.transaction(senderAccount, async () => {
      await state.lotteryGame!.buyTicket(
        ticket,
        roundWitness,
        roundTicketWitness,
        bankValue,
        bankWitness
      );
    });

    console.log('BUY TX', tx);

    state.buyTicketTransaction = tx;
  },
  getReward: async (args: {
    senderAccount: string;
    startBlock: number;
    roundId: number;
    ticketNums: number[];
    amount: number;
    dp: JsonProof;
  }) => {
    const senderAccount = PublicKey.fromBase58(args.senderAccount);

    if (!state.lotteryOffchainState) {
      await functions.fetchOffchainState({
        startBlock: args.startBlock,
        roundId: args.roundId,
      });
    }
    const stateM = state.lotteryOffchainState!;

    const ticket = Ticket.from(args.ticketNums, senderAccount, args.amount);
    let rp = await stateM.getReward(args.roundId, ticket);
    console.log('RP generated', args.dp);

    let tx = await Mina.transaction(senderAccount, async () => {
      await state.lotteryGame!.getReward(
        ticket,
        rp.roundWitness,
        rp.roundTicketWitness,
        //@ts-ignore
        await DistributionProof.fromJSON(args.dp),
        rp.winningNumbers,
        rp.resultWitness,
        rp.bankValue,
        rp.bankWitness,
        rp.nullifierWitness
      );
    });

    console.log('GET REWARD TX', tx);

    state.getRewardTransaction = tx;
  },
  proveBuyTicketTransaction: async () => {
    await state.buyTicketTransaction!.prove();
    return state.buyTicketTransaction!.toJSON();
  },
  proveGetRewardTransaction: async () => {
    await state.getRewardTransaction!.prove();
    return state.getRewardTransaction!.toJSON();
  },
  getLotteryState: async () => {
    return {
      ticketRoot: state.lotteryGame?.ticketRoot.get().toJSON(),
      ticketNullifier: state.lotteryGame?.ticketNullifier.get().toJSON(),
      bankRoot: state.lotteryGame?.startBlock.get().toJSON(),
      roundResultRoot: state.lotteryGame?.roundResultRoot.get().toJSON(),
      startBlock: state.lotteryGame?.startBlock.get()?.toBigint(),
    };
  },
  initZkappInstance: async (args: { bridgePublicKey58: string }) => {
    // const publicKey = PublicKey.fromBase58(args.bridgePublicKey58);
    // state.dummyBridgeApp = new state.dummyBridge!(publicKey);
  },
  bridge: async (amount: UInt64) => {
    // const transaction = await Mina.transaction(() => {
    //   state.dummyBridgeApp!.bridge(amount);
    // });
    // state.transaction = transaction;
  },
  proveBridgeTransaction: async (args: {}) => {
    // await state.transaction!.prove();
  },
  getBridgeTransactionJSON: async (args: {}) => {
    // return state.transaction!.toJSON();
  },
  proveGameRecord: async (args: { seedJson: any; inputs: any; debug: any }) => {
    let seed = Field014.fromJSON(args.seedJson);
    let userInputs = (<any[]>JSON.parse(args.inputs)).map((elem) => {
      return GameInputs.fromJSON(elem);
    });
    console.log('[Worker] proof checking');

    console.log('Generating map proof');
    let gameContext = await checkMapGeneration(seed);
    const mapGenerationProof = await mockProof(gameContext, MapGenerationProof);

    console.log('Generating gameProcess proof');
    let currentGameState = await initGameProcess(gameContext);
    let currentGameStateProof = await mockProof(
      currentGameState,
      GameProcessProof
    );

    for (let i = 0; i < userInputs.length; i++) {
      currentGameState = await processTicks(
        currentGameStateProof,
        userInputs[i] as GameInputs
      );
      currentGameStateProof = await mockProof(
        currentGameState,
        GameProcessProof
      );
    }

    console.log('Generating game proof');

    const gameProof = await mockProof(
      await checkGameRecord(mapGenerationProof, currentGameStateProof),
      GameRecordProof
    );

    console.log('Proof generated', gameProof);

    gameProof.verify();

    console.log('Proof verified');

    console.log('Proof generated json', gameProof.toJSON());

    return gameProof.toJSON();
  },
};

// ---------------------------------------------------------------------------------------

export type WorkerFunctions = keyof typeof functions;

export type ZknoidWorkerRequest = {
  id: number;
  fn: WorkerFunctions;
  args: any;
};

export type ZknoidWorkerReponse = {
  id: number;
  data: any;
};

if (typeof window !== 'undefined') {
  addEventListener(
    'message',
    async (event: MessageEvent<ZknoidWorkerRequest>) => {
      const returnData = await functions[event.data.fn](event.data.args);

      const message: ZknoidWorkerReponse = {
        id: event.data.id,
        data: returnData,
      };
      postMessage(message);
    }
  );
}

console.log('Web Worker Successfully Initialized.');

const message: ZknoidWorkerReponse = {
  id: 0,
  data: {},
};

postMessage(message);
