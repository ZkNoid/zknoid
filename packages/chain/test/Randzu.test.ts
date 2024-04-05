import { AppChain, TestingAppChain } from '@proto-kit/sdk';
import { Field, Int64, PrivateKey, PublicKey, UInt64 } from 'o1js';
import { log } from '@proto-kit/common';
import { Pickles } from 'o1js/dist/node/snarky';
import { dummyBase64Proof } from 'o1js/dist/node/lib/proof_system';
import { Balances, RandzuLogic } from '../src';

log.setLevel('ERROR');

export async function mockProof<I, O, P>(
  publicOutput: O,
  ProofType: new ({
    proof,
    publicInput,
    publicOutput,
    maxProofsVerified,
  }: {
    proof: unknown;
    publicInput: I;
    publicOutput: any;
    maxProofsVerified: 0 | 2 | 1;
  }) => P,
  publicInput: I,
): Promise<P> {
  const [, proof] = Pickles.proofOfBase64(await dummyBase64Proof(), 2);
  return new ProofType({
    proof: proof,
    maxProofsVerified: 2,
    publicInput,
    publicOutput,
  });
}

describe('game hub', () => {
  it.skip('Log proof', async () => {
    console.log(await dummyBase64Proof());
  });
  it('Two players basic case', async () => {
    const appChain = TestingAppChain.fromRuntime({
      RandzuLogic,
      Balances,
    });

    appChain.configurePartial({
      Runtime: {
        RandzuLogic: {},
        Balances: {
          totalSupply: UInt64.from(10000),
        },
      },
    });

    const alicePrivateKey = PrivateKey.random();
    const alice = alicePrivateKey.toPublicKey();

    const bobPrivateKey = PrivateKey.random();
    const bob = bobPrivateKey.toPublicKey();

    await appChain.start();

    const randzu = appChain.runtime.resolve('RandzuLogic');

    console.log('Finding match');
    // Find match
    {
      appChain.setSigner(alicePrivateKey);
      const tx1 = await appChain.transaction(alice, () => {
        randzu.register(alice, UInt64.zero);
      });
      await tx1.sign();
      await tx1.send();

      let block = await appChain.produceBlock();
      expect(block?.transactions[0].status.toBoolean()).toBeTruthy();

      appChain.setSigner(bobPrivateKey);
      const tx2 = await appChain.transaction(bob, () => {
        randzu.register(bob, UInt64.zero);
      });
      await tx2.sign();
      await tx2.send();

      block = await appChain.produceBlock();
      expect(block?.transactions[0].status.toBoolean()).toBeTruthy();

      let aliceGameId =
        await appChain.query.runtime.RandzuLogic.activeGameId.get(alice);
      let bobGameId =
        await appChain.query.runtime.RandzuLogic.activeGameId.get(bob);

      console.log(aliceGameId?.toString());
      expect(aliceGameId!.equals(bobGameId!)).toBeTruthy();
    }
  }, 100000);
});
