import { PrivateKey, UInt64 } from 'o1js';

import { getDefaultCompetitions } from '../';
import { client } from '../';

const setDefaultGames = async () => {
    const alicePrivateKey = PrivateKey.random();
    const alice = alicePrivateKey.toPublicKey();
    await client.start();
    const gameHub = client.runtime.resolve('ArkanoidGameHub');
    let defaultCompetitions = getDefaultCompetitions();
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
    
await setDefaultGames();
