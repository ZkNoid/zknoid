import { dummyProofBase64 } from '@/app/constants/dummyProofBase64';
import { mockProof } from '@/lib/utils';
import {
  Field,
  Bool,
  Mina,
  PublicKey,
  UInt64,
  fetchAccount,
  Int64,
  JsonProof,
  Proof,
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
} from 'zknoid-chain-dev';
import { DummyBridge } from 'zknoidcontractsl1';

type Transaction = Awaited<ReturnType<typeof Mina.transaction>>;

// ---------------------------------------------------------------------------------------

const state = {
  gameRecord: null as null | typeof GameRecord,
  dummyBridge: null as null | typeof DummyBridge,
  dummyBridgeApp: null as null | DummyBridge,
  transaction: null as null | Transaction,
};

// ---------------------------------------------------------------------------------------

const functions = {
  loadContracts: async (args: {}) => {
    console.log('[Worker] loading contracts');
    state.gameRecord = GameRecord;
    state.dummyBridge = DummyBridge;
  },
  compileContracts: async (args: {}) => {
    console.log('[Worker] compiling contracts');
    await DummyBridge.compile();
    console.log('[Worker] compiling contracts ended');
  },
  initZkappInstance: async (args: { bridgePublicKey58: string }) => {
    const publicKey = PublicKey.fromBase58(args.bridgePublicKey58);
    state.dummyBridgeApp = new state.dummyBridge!(publicKey);
  },
  bridge: async (amount: UInt64) => {
    const transaction = await Mina.transaction(() => {
      state.dummyBridgeApp!.bridge(amount);
    });

    state.transaction = transaction;
  },
  proveGameRecord: async (args: { bricks: any; inputs: any; debug: any }) => {
    let bricks = Bricks.fromJSON(args.bricks);
    let userInputs = (<string[]>JSON.parse(args.inputs)).map((elem) =>
      GameInputs.fromJSON(elem),
    );
    console.log('[Worker] proof checking');
    console.log('args', bricks, userInputs, Bool.fromJSON(args.debug));

    console.log('Generating map proof');
    let gameContext = checkMapGeneration(Field.from(0), bricks);
    const mapGenerationProof = await mockProof(gameContext, MapGenerationProof);

    console.log('Generating gameProcess proof');
    let currentGameState = initGameProcess(gameContext);
    let currentGameStateProof = await mockProof(
      currentGameState,
      GameProcessProof,
    );

    for (let i = 0; i < userInputs.length; i++) {
      currentGameState = processTicks(
        currentGameStateProof,
        userInputs[i] as GameInputs,
      );
      currentGameStateProof = await mockProof(
        currentGameState,
        GameProcessProof,
      );
    }

    console.log('Generating game proof');

    const gameProof =  await mockProof(
      checkGameRecord(mapGenerationProof, currentGameStateProof),
      GameRecordProof,
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
    },
  );
}

console.log('Web Worker Successfully Initialized.');
