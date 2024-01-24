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
import {
    GameHub,
    GameRecordProof,
    GameRecordPublicOutput,
    checkGameRecord,
    GameInputs,
    Tick,
    GameRecordKey,
    defaultLevel,
} from '../src/index';
import { log } from '@proto-kit/common';
import { Pickles } from 'o1js/dist/node/snarky';
import { dummyBase64Proof } from 'o1js/dist/node/lib/proof_system';
import {
    GameProcessProof,
    MapGenerationProof,
    checkMapGeneration,
    initGameProcess,
    processTicks,
} from '../src/GameHub';
import { GameContext } from '../src/GameContext';

log.setLevel('ERROR');

const chunkenize = (arr: number[], size: number) =>
    Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
        arr.slice(i * size, i * size + size)
    );

async function mockProof<O, P>(
    publicOutput: O,
    ProofType: new ({
        proof,
        publicInput,
        publicOutput,
        maxProofsVerified,
    }: {
        proof: unknown;
        publicInput: any;
        publicOutput: any;
        maxProofsVerified: 0 | 2 | 1;
    }) => P
): Promise<P> {
    const [, proof] = Pickles.proofOfBase64(await dummyBase64Proof(), 2);
    return new ProofType({
        proof: proof,
        maxProofsVerified: 2,
        publicInput: undefined,
        publicOutput,
    });
}

describe('game hub', () => {
    it.skip('Log proof', async () => {
        console.log(await dummyBase64Proof());
    });
    it('Check if cheet codes works', async () => {
        const appChain = TestingAppChain.fromRuntime({
            modules: {
                GameHub,
            },
        });

        appChain.configurePartial({
            Runtime: {
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
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 21, 0, 0, 48, 35,
            0, 0, 0, 0, 0, 0, 0, 0, -67, 0, 0, -99, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 51, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        ];
        let chunks = chunkenize(uiUserInput, 10);
        let userInputs = chunks.map(
            (chunk) =>
                new GameInputs({
                    ticks: chunk.map(
                        (elem) =>
                            new Tick({
                                action: Int64.from(elem),
                                momentum: Int64.from(0),
                            })
                    ),
                })
        );
        // Generate map generation proof
        let gameContext = checkMapGeneration(Field.from(0), bricks);
        const mapGenerationProof = await mockProof(
            gameContext,
            MapGenerationProof
        );
        // Generate gameProceess proof
        let currentGameState = initGameProcess(gameContext);
        let currentGameStateProof = await mockProof(
            currentGameState,
            GameProcessProof
        );
        for (let i = 0; i < userInputs.length; i++) {
            currentGameState = processTicks(
                currentGameStateProof,
                userInputs[i]
            );
            currentGameStateProof = await mockProof(
                currentGameState,
                GameProcessProof
            );
        }
        let checkGameRecordOut = checkGameRecord(
            mapGenerationProof,
            currentGameStateProof
        );
        let gameRecordProof = await mockProof(
            checkGameRecordOut,
            GameRecordProof
        );

        // Run transaction
        const tx1 = await appChain.transaction(alice, () => {
            gameHub.addGameResult(gameRecordProof);
        });
        await tx1.sign();
        await tx1.send();
        const block = await appChain.produceBlock();
        const lastSeed =
            (await appChain.query.runtime.GameHub.lastSeed.get()) ??
            UInt64.from(0);
        console.log(lastSeed);
        const gameRecordKey: GameRecordKey = new GameRecordKey({
            competitionId: lastSeed,
            player: alice,
        });
        console.log(gameRecordKey);
        const userScore =
            await appChain.query.runtime.GameHub.gameRecords.get(gameRecordKey);
        console.log(userScore?.toBigInt());
    });
});
