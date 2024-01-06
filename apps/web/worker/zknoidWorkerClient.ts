import { fetchAccount, Field, Bool, UInt64 } from 'o1js';

import type {
  ZknoidWorkerRequest,
  ZknoidWorkerReponse,
  WorkerFunctions,
} from './zknoidWorker';
import { Bricks, GameInputs, checkGameRecord } from 'zknoid-chain-dev';
import { mockGameRecordProof } from '@/lib/utils';


export default class ZknoidWorkerClient {
  loadContracts() {
    return this._call('loadContracts', {});
  }
  compileContracts() {
    return this._call('compileContracts', {});
  }
  initZkappInstance(bridgePublicKey58: string) {
    return this._call('initZkappInstance', {bridgePublicKey58});
  }
  bridge(amount: UInt64) {
    return this._call('bridge', {amount});
  }
  async proveGameRecord({
    bricks, inputs, debug
  }: {
    bricks: Bricks, inputs: GameInputs, debug: Bool
  }) {
    const result = this._call('proveGameRecord', {
      bricks: Bricks.toJSON(bricks), inputs: GameInputs.toJSON(inputs), debug: Bool.toJSON(debug)
    });
    return result;
  }

  worker: Worker;

  promises: {
    [id: number]: { resolve: (res: any) => void; reject: (err: any) => void };
  };

  nextId: number;

  constructor() {
    this.worker = new Worker(new URL('./zknoidWorker.ts', import.meta.url));
    (window as any).workerNoid = this.worker
    this.promises = {};
    this.nextId = 0;

    this.worker.onmessage = (event: MessageEvent<ZknoidWorkerReponse>) => {
      this.promises[event.data.id].resolve(event.data.data);
      delete this.promises[event.data.id];
    };
  }

  _call(fn: WorkerFunctions, args: any) {
    return new Promise((resolve, reject) => {
      this.promises[this.nextId] = { resolve, reject };

      const message: ZknoidWorkerRequest = {
        id: this.nextId,
        fn,
        args,
      };

      this.worker.postMessage(message);

      this.nextId++;
    });
  }
}