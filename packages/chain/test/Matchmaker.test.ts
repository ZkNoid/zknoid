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
  GameProcessProof,
  MapGenerationProof,
  checkMapGeneration,
  initGameProcess,
  processTicks,
} from '../src/ArkanoidGameHub';
import { GameContext } from '../src/GameContext';
import { MatchMaker } from '../src/engine/MatchMaker';
import { RandzuField, RandzuLogic } from '../src/RandzuLogic';

log.setLevel('ERROR');

describe('Matchmaker', () => {
  it.only('Reproduce bug', async () => {
    const appChain = TestingAppChain.fromRuntime({
      modules: {
        RandzuLogic,
      },
    });

    appChain.configurePartial({
      Runtime: {
        RandzuField: {},
      },
    });

    const alicePrivateKey = PrivateKey.random();
    const alice = alicePrivateKey.toPublicKey();
    await appChain.start();
    appChain.setSigner(alicePrivateKey);

    console.log(
      await appChain.query.runtime.RandzuLogic.games.get(UInt64.from(0)),
    );
  });
});
