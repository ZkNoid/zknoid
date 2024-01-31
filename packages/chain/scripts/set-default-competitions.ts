import { PrivateKey, PublicKey, UInt64 } from 'o1js';

import { getDefaultCompetitions } from '../src/levels';
import { client } from 'dist/client.config';

function timeout(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

const setDefaultGames = async () => {
    await timeout(5000);

    const alicePrivateKey = PrivateKey.random();
    const alice = alicePrivateKey.toPublicKey();
    await client.start();
    const gameHub = client.runtime.resolve('GameHub');
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

setDefaultGames();
