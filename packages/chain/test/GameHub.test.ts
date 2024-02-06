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
    ArkanoidGameHub,
    GameRecordProof,
    GameRecordPublicOutput,
    checkGameRecord,
    GameInputs,
    Tick,
    GameRecordKey,
    defaultLevel,
    getDefaultCompetitions,
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
} from '../src/ArkanoidGameHub';
import { GameContext } from '../src/GameContext';
import { cases } from './test-user-input';
import { Balances } from '../src/balances';

log.setLevel('ERROR');

const chunkenize = (arr: any[], size: number) =>
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
                ArkanoidGameHub,
                Balances,
            },
        });

        appChain.configurePartial({
            Runtime: {
                ArkanoidGameHub: {},
                Balances: {},
            },
        });

        const alicePrivateKey = PrivateKey.random();
        const alice = alicePrivateKey.toPublicKey();
        await appChain.start();
        appChain.setSigner(alicePrivateKey);
        const gameHub = appChain.runtime.resolve('ArkanoidGameHub');

        /// Set defaultcompetitions
        let defaultCompetitions = getDefaultCompetitions();
        for (let competition of defaultCompetitions) {
            const tx = await appChain.transaction(alice, () => {
                gameHub.createCompetition(competition);
            });
            await tx.sign();
            await tx.send();
            await appChain.produceBlock();
        }

        let uiUserInput = cases['seed-0'];

        let chunks = chunkenize(uiUserInput, 10);
        let userInputs = chunks
            .filter((chunk) => chunk.length > 0)
            .map(
                (chunk) =>
                    new GameInputs({
                        ticks: chunk.map((elem) => {
                            return new Tick({
                                action: Int64.from(elem.action),
                                momentum: Int64.from(elem.momentum),
                            });
                        }),
                    })
            );

        let cuttentCompetition = defaultCompetitions[0];

        // Generate map generation proof
        let gameContext = checkMapGeneration(
            Field.from(cuttentCompetition.seed)
        );
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
            gameHub.addGameResult(UInt64.from(0), gameRecordProof);
        });
        await tx1.sign();
        await tx1.send();
        const block = await appChain.produceBlock();
        const lastSeed =
            (await appChain.query.runtime.ArkanoidGameHub.lastSeed.get()) ??
            UInt64.from(0);
        console.log(lastSeed);
        const gameRecordKey: GameRecordKey = new GameRecordKey({
            competitionId: lastSeed,
            player: alice,
        });
        console.log(gameRecordKey);
        const userScore =
            await appChain.query.runtime.ArkanoidGameHub.gameRecords.get(
                gameRecordKey
            );
        console.log(userScore?.toBigInt());
    });
});
