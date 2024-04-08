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
  let getGameId: (user: IUser) => Promise<UInt64>;

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

    getGameId = async (user: IUser): Promise<UInt64> => {
      return (await appChain.query.runtime.MatchMakerHelper.activeGameId.get(
        user.publicKey,
      ))!;
    };
  });

  it('Simple matchmaking', async () => {
    // matchmake simple game
    await register(alice);
    await register(bob);

    let aliceGameId = await getGameId(alice);
    let bobGameId = await getGameId(bob);

    expect(aliceGameId.toString()).toEqual(bobGameId.toString());

    // alice win
    await claimWin(alice);

    // check alice win
    let gameInfo =
      await appChain.query.runtime.MatchMakerHelper.games.get(aliceGameId);
    expect(gameInfo!.winner.toBase58()).toEqual(alice.publicKey.toBase58());

    // Register again
    await register(alice);
    await register(bob);
    await register(user3);
    await register(user4);

    aliceGameId = await getGameId(alice);
    bobGameId = await getGameId(bob);
    let user3GameId = await getGameId(user3);
    let user4GameId = await getGameId(user4);

    expect(aliceGameId.toString()).toEqual(bobGameId.toString());
    expect(user3GameId.toString()).toEqual(user4GameId.toString());
    expect(aliceGameId.toString()).not.toEqual(user3GameId.toString());

    // Cliam win
    await claimWin(bob);
    await claimWin(user3);

    let gameInfo1 =
      await appChain.query.runtime.MatchMakerHelper.games.get(aliceGameId);

    expect(gameInfo1!.winner.toBase58()).toEqual(bob.publicKey.toBase58());

    let gameInfo2 =
      await appChain.query.runtime.MatchMakerHelper.games.get(user4GameId);

    expect(gameInfo2!.winner.toBase58()).toEqual(user3.publicKey.toBase58());
  });
});
