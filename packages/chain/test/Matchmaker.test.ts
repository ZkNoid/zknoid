import { TestingAppChain } from '@proto-kit/sdk';
import {
  PrivateKey,
  Provable,
  UInt64,
  Int64,
  Field,
  Bool,
  InferProvable,
  PublicKey,
} from 'o1js';
import { log } from '@proto-kit/common';
import { Pickles } from 'o1js/dist/node/snarky';
import { MatchMakerHelper } from './contracts/MatchMakerHelper';

interface IUser {
  publicKey: PublicKey;
  privateKey: PrivateKey;
}

const getTestAccounts = (amount: number): IUser[] => {
  return [...Array(amount)].map(() => {
    let privateKey = PrivateKey.random();
    return {
      privateKey,
      publicKey: privateKey.toPublicKey(),
    };
  });
};

log.setLevel('ERROR');

describe('Matchmaker', () => {
  let appChain = TestingAppChain.fromRuntime({
    MatchMakerHelper,
  });

  let alice: IUser;
  let bob: IUser;
  let user3: IUser;
  let user4: IUser;

  let game: MatchMakerHelper;

  let register: (user: IUser) => Promise<any>;
  let claimWin: (user: IUser) => Promise<any>;

  beforeEach(async () => {
    appChain.configurePartial({
      Runtime: {
        MatchMakerHelper: {},
        Balances: {},
      },
    });

    [alice, bob, user3, user4] = getTestAccounts(4);

    await appChain.start();

    game = appChain.runtime.resolve('MatchMakerHelper');

    register = async (user: IUser) => {
      appChain.setSigner(user.privateKey);
      let tx = await appChain.transaction(user.publicKey, () => {
        game.register(user.publicKey, UInt64.zero);
      });

      await tx.sign();
      await tx.send();

      let block = await appChain.produceBlock();
      expect(block!.transactions[0].status.toBoolean()).toBeTruthy();
    };

    claimWin = async (user: IUser) => {
      let activeGameId =
        await appChain.query.runtime.MatchMakerHelper.activeGameId.get(
          user.publicKey,
        );

      appChain.setSigner(user.privateKey);
      let tx = await appChain.transaction(user.publicKey, () => {
        game.claimWin(activeGameId!);
      });

      await tx.sign();
      await tx.send();

      let block = await appChain.produceBlock();
      expect(block!.transactions[0].status.toBoolean()).toBeTruthy();
    };
  });

  it('Simple matchmaking', async () => {
    // matchmake simple game
    await register(alice);
    await register(bob);

    let aliceGameId =
      await appChain.query.runtime.MatchMakerHelper.activeGameId.get(
        alice.publicKey,
      );
    let bobGameId =
      await appChain.query.runtime.MatchMakerHelper.activeGameId.get(
        bob.publicKey,
      );

    expect(aliceGameId!.toString()).toEqual(bobGameId!.toString());

    // alice win
    await claimWin(alice);

    // check alice win
    let gameInfo = await appChain.query.runtime.MatchMakerHelper.games.get(
      aliceGameId!,
    );
    expect(gameInfo!.winner.toBase58()).toEqual(alice.publicKey.toBase58());
  });
});
