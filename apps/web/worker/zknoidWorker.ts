import { mockGameRecordProof } from '@/lib/utils';
import { Bool, Mina, PublicKey, UInt64, fetchAccount } from 'o1js';
import { checkGameRecord, Bricks, GameInputs, GameRecord } from 'zknoid-chain-dev';
import { DummyBridge } from 'zknoidcontractsl1';

type Transaction = Awaited<ReturnType<typeof Mina.transaction>>;

// ---------------------------------------------------------------------------------------

const state = {
  gameRecord: null as null | typeof GameRecord,
  dummyBridge: null as null | typeof DummyBridge,
  dummyBridgeApp: null as null |  DummyBridge,
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
  proveGameRecord: async (args: {bricks: any, inputs: any, debug: any}) => {
    console.log('[Worker] proof checking');
    console.log('args', Bricks.fromJSON(args.bricks), GameInputs.fromJSON(args.inputs), Bool.fromJSON(args.debug));
    
    return await mockGameRecordProof(checkGameRecord(Bricks.fromJSON(args.bricks), GameInputs.fromJSON(args.inputs), Bool.fromJSON(args.debug)));
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