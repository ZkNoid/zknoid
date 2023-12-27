import { TestingAppChain } from '@proto-kit/sdk';
import { PrivateKey, Provable, UInt64, Int64, Field, Bool } from 'o1js';
import {
    GameHub,
    GameRecordProof,
    GameRecordPublicOutput,
    checkGameRecord,
    GameInputs,
    Tick,
    GameRecordKey,
    defaultLevel
} from '../src/index';
import { log } from '@proto-kit/common';
import { Pickles } from 'o1js/dist/node/snarky';
import { dummyBase64Proof } from 'o1js/dist/node/lib/proof_system';

log.setLevel('ERROR');

async function mockProof(
    publicOutput: GameRecordPublicOutput
): Promise<GameRecordProof> {
    const [, proof] = Pickles.proofOfBase64(await dummyBase64Proof(), 2);
    return new GameRecordProof({
        proof: proof,
        maxProofsVerified: 2,
        publicInput: undefined,
        publicOutput,
    });
}

describe('game hub', () => {
    it('Check if cheet codes works', async () => {
        const appChain = TestingAppChain.fromRuntime({
            modules: {
                GameHub,
            },
            config: {
                GameHub: {},
            },
        });

        const alicePrivateKey = PrivateKey.random();
        const alice = alicePrivateKey.toPublicKey();

        await appChain.start();

        appChain.setSigner(alicePrivateKey);

        const gameHub = appChain.runtime.resolve('GameHub');

        const bricks = defaultLevel();

        let uiUserInput = [
            1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2,
            2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
            2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2,
            0, 0, 0, 0, 0, 0, 0, 0,
        ];

        let userInput = new GameInputs({
            tiks: uiUserInput.map(
                (elem) => new Tick({ action: Int64.from(elem) })
            ),
        });

        const gameProof = await mockProof(
            checkGameRecord(bricks, userInput, new Bool(true))
        );

        const tx1 = await appChain.transaction(alice, () => {
            gameHub.addGameResult(gameProof);
        });

        await tx1.sign();
        await tx1.send();

        const block = await appChain.produceBlock();

        const lastSeed =
            (await appChain.query.runtime.GameHub.lastSeed.get()) ??
            UInt64.from(0);
        console.log(lastSeed);

        const gameRecordKey: GameRecordKey = new GameRecordKey({
            seed: lastSeed,
            player: alice,
        });

        console.log(gameRecordKey);

        const userScore =
            await appChain.query.runtime.GameHub.gameRecords.get(gameRecordKey);

        console.log(userScore?.toBigInt());
    });
});
