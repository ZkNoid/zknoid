import { TestingAppChain } from '@proto-kit/sdk';
import {
  PrivateKey,
  Provable,
  UInt64,
  Int64,
  Field,
  Bool,
  InferProvable,
} from 'o1js';
import { log } from '@proto-kit/common';
import { Pickles } from 'o1js/dist/node/snarky';
import { dummyBase64Proof } from 'o1js/dist/node/lib/proof_system';
import {
  GameHub,
  GameRecordProof,
  GameRecordPublicOutput,
  checkGameRecord,
  GameInputs,
  Tick,
  GameRecordKey,
  defaultLevel,
} from '../src/index';
import {
  GameProcessProof,
  MapGenerationProof,
  checkMapGeneration,
  initGameProcess,
  processTicks,
} from '../src/ArkanoidGameHub';
import { GameContext, createBricksBySeed } from '../src/GameContext';

log.setLevel('ERROR');

const chunkenize = (arr: number[], size: number) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
    arr.slice(i * size, i * size + size),
  );

async function mockProof<O, P>(
  publicOutput: O,
  ProofType: new ({
    proof,
    publicInput,
    publicOutput,
    maxProofsVerified,
  }: {
    proof: unknown;
    publicInput: any;
    publicOutput: any;
    maxProofsVerified: 0 | 2 | 1;
  }) => P,
): Promise<P> {
  const [, proof] = Pickles.proofOfBase64(await dummyBase64Proof(), 2);
  return new ProofType({
    proof,
    maxProofsVerified: 2,
    publicInput: undefined,
    publicOutput,
  });
}

describe('game hub', () => {
  it.skip('Log proof', async () => {
    console.log(await dummyBase64Proof());
  });
  it('Check if cheet codes works', async () => {
    const appChain = TestingAppChain.fromRuntime({
      modules: {
        GameHub,
      },
    });

    appChain.configurePartial({
      Runtime: {
        GameHub: {},
      },
    });

    const alicePrivateKey = PrivateKey.random();
    const alice = alicePrivateKey.toPublicKey();
    await appChain.start();
    appChain.setSigner(alicePrivateKey);
    const gameHub = appChain.runtime.resolve('GameHub');
    const bricks = createBricksBySeed(Int64.from(5));
    console.log(bricks);
  });
});
