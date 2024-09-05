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
  PLottery,
  TicketReduceProgram,
  DistibutionProgram,
  PStateManager,
  NumberPacked,
  getNullifierId,
  DistributionProof,
  DistributionProofPublicInput,
  MerkleMap20Witness,
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
  Lottery: null as null | typeof PLottery,
  lotteryGame: null as null | PLottery,
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
  downloadLotteryCache: async () => {
    state.lotteryCache = await fetchCache(LOTTERY_CACHE);
  },
  compileContracts: async (args: {}) => {},
  compileReduceProof: async (args: {}) => {
    console.log('[Worker] compiling reduce proof contracts');
    console.log('Cache info', LOTTERY_CACHE);

    await TicketReduceProgram.compile({
      cache: WebFileSystem(state.lotteryCache!),
    });

    console.log('[Worker] compiling reduce contracts ended');
  },
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

    await PLottery.compile({
      cache: WebFileSystem(state.lotteryCache!),
    });
    console.log('[Worker] compiling contracts ended');
  },
  initLotteryInstance: async (args: {
    lotteryPublicKey58: string;
    networkId: NetworkId;
  }) => {
    const publicKey = PublicKey.fromBase58(args.lotteryPublicKey58);
    state.lotteryGame = new PLottery(publicKey);
    console.log('[Worker] lottery instance init');
    const Network = Mina.Network({
      mina: NETWORKS[args.networkId.toString()].graphql,
      archive: NETWORKS[args.networkId.toString()].archive,
    });
    console.log('Devnet network instance configured.');
    Mina.setActiveInstance(Network);

    console.log('Fetching account');

    await functions.fetchOnchainState();
  },
  async fetchOnchainState() {
    const account = await fetchAccount({
      publicKey: state.lotteryGame!.address,
    });
    console.log(
      'Fetched account',
      account.account?.zkapp?.appState.map((x) => x.toString())
    );
  },
  buyTicket: async (args: {
    senderAccount: string;
    startBlock: number;
    roundId: number;
    ticketNums: number[];
    amount: number;
  }) => {
    const senderAccount = PublicKey.fromBase58(args.senderAccount);

    console.log(args.ticketNums, senderAccount, args.roundId);
    const ticket = Ticket.from(args.ticketNums, senderAccount, args.amount);

    let tx = await Mina.transaction(senderAccount, async () => {
      await state.lotteryGame!.buyTicket(ticket, Field014.from(args.roundId));
    });

    console.log('BUY TX', tx);

    state.buyTicketTransaction = tx;
  },
  getReward: async (args: {
    networkId: string;
    senderAccount: string;
    startBlock: number;
    roundId: number;
    ticketNums: number[];
    amount: number;
  }) => {
    const senderAccount = PublicKey.fromBase58(args.senderAccount);

    const claimData = await fetch(
      'https://api2.zknoid.io/claim-api/get-claim-data',
      {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          roundId: args.roundId,
          networkID: args.networkId,
          ticketNums: args.ticketNums,
          senderAccount,
          amount: args.amount,
        }),
      }
    );

    console.log('Got claim data', claimData);

    const { rp } = await claimData.json();

    console.log('Received rp', rp);

    const ticket = Ticket.from(args.ticketNums, senderAccount, args.amount);
    
    let tx = await Mina.transaction(senderAccount, async () => {
      await state.lotteryGame!.getReward(
        ticket,
        MerkleMap20Witness.fromJSON(rp.roundWitness) as MerkleMap20Witness,
        MerkleMap20Witness.fromJSON(rp.roundTicketWitness) as MerkleMap20Witness,
        //@ts-ignore
        await DistributionProof.fromJSON(rp.dp),
        Field.fromJSON(rp.winningNumbers),
        MerkleMap20Witness.fromJSON(rp.resultWitness) as MerkleMap20Witness,
        Field.fromJSON(rp.bankValue),
        MerkleMap20Witness.fromJSON(rp.bankWitness) as MerkleMap20Witness,
        MerkleMapWitness.fromJSON(rp.nullifierWitness) as MerkleMapWitness
      );
    });

    console.log('GET REWARD TX', tx);

    state.getRewardTransaction = tx;
  },
  proveBuyTicketTransaction: async () => {
    const provingStartTime = Date.now() / 1000;
    await state.buyTicketTransaction!.prove();
    const provingEnd = Date.now() / 1000;

    console.log('Buy proving time', (provingEnd - provingStartTime).toFixed(2));

    return state.buyTicketTransaction!.toJSON();
  },
  proveGetRewardTransaction: async () => {
    const provingStartTime = Date.now() / 1000;

    await state.getRewardTransaction!.prove();

    const provingEnd = Date.now() / 1000;

    console.log(
      'Claim proving time',
      (provingEnd - provingStartTime).toFixed(2)
    );

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
