import { useContext, useEffect, useState } from 'react';
import { Field, Poseidon, PublicKey, UInt64 } from 'o1js';
import { useNetworkStore } from '@/lib/stores/network';
import { ClientAppChain } from 'zknoid-chain-dev';
import GamePage from '@/components/framework/GamePage';
import { numberGuessingConfig } from './config';
import ZkNoidGameContext from '@/lib/contexts/ZkNoidGameContext';
import { useProtokitChainStore } from '@/lib/stores/protokitChain';
import CoverSVG from './assets/game-cover.svg';
import { motion } from 'framer-motion';
import Button from '@/components/shared/Button';
import toast from '@/components/shared/Toast';
import { useToasterStore } from '@/lib/stores/toasterStore';

export default function NumberGuessing({
  params,
}: {
  params: { competitionId: string };
}) {
  const [hiddenNumberHash, setHiddenNumberHash] = useState(0n);
  const [userScore, setUserScore] = useState(0n);

  const [inputNumber, setInputNumber] = useState(1);

  const { client } = useContext(ZkNoidGameContext);

  if (!client) {
    throw Error('Context app chain client is not set');
  }

  const networkStore = useNetworkStore();
  const protokitChain = useProtokitChainStore();
  const toasterStore = useToasterStore();

  const client_ = client as ClientAppChain<
    typeof numberGuessingConfig.runtimeModules,
    any,
    any,
    any
  >;

  const query = networkStore.protokitClientStarted
    ? client_.query.runtime.GuessGame
    : undefined;

  const hideNumber = async (number: number) => {
    const guessLogic = client_.runtime.resolve('GuessGame');

    const tx = await client.transaction(
      PublicKey.fromBase58(networkStore.address!),
      async () => {
        await guessLogic.hideNumber(UInt64.from(number));
      }
    );

    await tx.sign();
    await tx.send();
  };

  const guessNumber = async (number: number) => {
    const guessLogic = client_.runtime.resolve('GuessGame');

    const hash = Poseidon.hash(UInt64.from(number).toFields());

    if (hash.equals(Field.from(hiddenNumberHash)).toBoolean()) {
      toast.success(toasterStore, `Guessed correctly!`, true);

      const tx = await client.transaction(
        PublicKey.fromBase58(networkStore.address!),
        async () => {
          await guessLogic.guessNumber(UInt64.from(number));
        }
      );

      await tx.sign();
      await tx.send();
    } else {
      toast.error(toasterStore, `Guessed incorrectly!`, true);
    }
  };

  useEffect(() => {
    query?.hiddenNumber.get().then((n) => {
      const newHiddenNumberHash = n ? n.toBigInt() : 0n;
      // Game state updated
      if (newHiddenNumberHash != hiddenNumberHash) {
        setInputNumber(0);
      }
      setHiddenNumberHash(newHiddenNumberHash);
    });

    if (networkStore.address) {
      const userWallet = PublicKey.fromBase58(networkStore.address);

      query?.scores.get(userWallet).then((n) => {
        if (n) setUserScore(n.toBigInt());
      });
    }
  }, [protokitChain.block]);

  return (
    <GamePage
      gameConfig={numberGuessingConfig}
      image={CoverSVG}
      mobileImage={CoverSVG}
      defaultPage={'Game'}
    >
      <motion.div
        className={
          'flex grid-cols-4 flex-col-reverse gap-4 pt-10 lg:grid lg:pt-0'
        }
        animate={'windowed'}
      >
        <div className={'flex flex-col gap-4 lg:hidden'}>
          <span className={'w-full text-headline-2 font-bold'}>Rules</span>
          <span className={'font-plexsans text-buttons-menu font-normal'}>
            {numberGuessingConfig.rules}
          </span>
        </div>
        <div className={'hidden h-full w-full flex-col gap-4 lg:flex'}>
          <div
            className={
              'flex w-full gap-2 font-plexsans text-[20px]/[20px] uppercase text-left-accent'
            }
          >
            <span>Game status:</span>
            <span>{hiddenNumberHash ? 'Guessing' : 'Hiding'}</span>
          </div>
          <span className="text-[20px]/[20px]">User score: {userScore}</span>

          <div
            className={
              'flex w-full gap-2 font-plexsans text-[20px]/[20px] text-foreground'
            }
          >
            <div className="flex flex-col gap-1">
              {hiddenNumberHash ? (
                <span>Guess the number:</span>
              ) : (
                <span>Enter number to hide:</span>
              )}
              <input
                type="number"
                className="text-black"
                value={inputNumber}
                onChange={(v) => setInputNumber(parseInt(v.target.value))}
              />
              <Button
                label={hiddenNumberHash ? 'Guess number' : 'Hide number'}
                onClick={() =>
                  hiddenNumberHash
                    ? guessNumber(inputNumber)
                    : hideNumber(inputNumber)
                }
              />
            </div>
          </div>
        </div>
      </motion.div>
    </GamePage>
  );
}
