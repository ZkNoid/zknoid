import { PrivateKey, UInt64 } from 'o1js';
import { getDefaultCompetitions, client } from '../src';

const setDefaultGames = async () => {
  const alicePrivateKey = PrivateKey.random();
  const alice = alicePrivateKey.toPublicKey();
  await client.start();
  const gameHub = client.runtime.resolve('ArkanoidGameHub');
  const defaultCompetitions = getDefaultCompetitions();
  for (let i = 0; i < defaultCompetitions.length; i++) {
    const competition = defaultCompetitions[i];
    const tx = await client.transaction(alice, () => {
      gameHub.createCompetition(competition);
    });

    tx.transaction!.nonce = UInt64.from(i);

    tx.transaction = tx.transaction?.sign(alicePrivateKey);

    await tx.send();
  }
};

const setDefaultMatchmaking = async () => {
  const matchmakingOptions = [
    {
      participationFee: 0,
    },
    {
      participationFee: 5,
    },
  ];

  const alicePrivateKey = PrivateKey.random();
  const alice = alicePrivateKey.toPublicKey();
  await client.start();

  const games = ['RandzuLogic', 'CheckersLogic', 'ThimblerigLogic'];

  let nonce = 0;

  for (const game of games) {
    const matchmaking = client.runtime.resolve(game as any);

    for (const option of matchmakingOptions) {
      const tx = await client.transaction(alice, () => {
        matchmaking.addDefaultLobby(UInt64.from(option.participationFee));
      });

      tx.transaction!.nonce = UInt64.from(nonce++);

      tx.transaction = tx.transaction?.sign(alicePrivateKey);

      await tx.send();
    }
  }
};

await setDefaultGames();
await setDefaultMatchmaking();
