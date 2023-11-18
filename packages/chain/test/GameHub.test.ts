import { TestingAppChain } from '@proto-kit/sdk';
import { PrivateKey, Provable, UInt64, Field } from 'o1js';
import {
    GameHub,
    GameRecordProof,
    GameRecordPublicOutput,
    checkGameRecord,
    FIELD_SIZE,
    GAME_LENGTH,
    GameField,
    GameCell,
    GameInputs,
    Tick,
    GameRecordKey,
} from '../src/GameHub';
import { log } from '@proto-kit/common';
import { Pickles } from 'o1js/dist/node/snarky';
import { dummyBase64Proof } from 'o1js/dist/node/lib/proof_system';
import { checkRange } from 'o1js/dist/node/provable/field-bigint';

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

        const dummieField: GameField = new GameField({
            cells: [...new Array(FIELD_SIZE)].map(
                (elem) => new GameCell({ value: UInt64.from(0) })
            ),
        });

        let cheatInput: GameInputs = new GameInputs({
            tiks: [...new Array(GAME_LENGTH)].map(
                (elem) => new Tick({ action: UInt64.from(0) })
            ),
        }); // })[... new Array(FIELD_SIZE)].map(elem => )

        cheatInput.tiks[1] = new Tick({ action: UInt64.from(1) });
        cheatInput.tiks[2] = new Tick({ action: UInt64.from(2) });
        cheatInput.tiks[3] = new Tick({ action: UInt64.from(1) });
        cheatInput.tiks[4] = new Tick({ action: UInt64.from(0) });

        const gameProof = await mockProof(
            checkGameRecord(dummieField, cheatInput)
        );

        const tx1 = await appChain.transaction(alice, () => {
            gameHub.addGameResult(alice, gameProof);
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