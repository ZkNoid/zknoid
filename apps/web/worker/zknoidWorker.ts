import { Bool, Mina, PublicKey, fetchAccount } from 'o1js';

type Transaction = Awaited<ReturnType<typeof Mina.transaction>>;

// ---------------------------------------------------------------------------------------

import { Bricks, GameInputs, gameRecord as GameRecord } from 'zknoid-chain-dev';

const state = {
  gameRecord: null as null | typeof GameRecord,
};

// ---------------------------------------------------------------------------------------

const functions = {
  loadContracts: async (args: {}) => {
    console.log('[Worker] loading contracts');
    state.gameRecord = GameRecord;
  },
  compileContracts: async (args: {}) => {
    console.log('[Worker] compiling contracts');
    await state.gameRecord!.compile();
  },
  proveGameRecord: async (args: {bricks: Bricks, inputs: GameInputs, debug: Bool}) => {
    console.log('[Worker] proof checking');
    return await state.gameRecord?.checkGameRecord(args.bricks, args.inputs, args.debug);
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