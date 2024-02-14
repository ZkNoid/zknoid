import { PrivateKey, UInt64 } from 'o1js';

import { getDefaultCompetitions } from '../src';
import { client } from '../src';

console.log("BBBB")

const setDefaultGames = async () => {
    console.log("AAAA")
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

        console.log(tx)

        tx.transaction!.nonce = UInt64.from(i);

        tx.transaction = tx.transaction?.sign(alicePrivateKey);

        await tx.send();
    }
};
    
await setDefaultGames();
