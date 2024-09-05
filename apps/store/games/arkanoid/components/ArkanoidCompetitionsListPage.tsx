'use client';

import { PublicKey, UInt64 } from 'o1js';
import { useContext } from 'react';
import { useNetworkStore } from '@/lib/stores/network';
import {
  useArkanoidCompetitionsStore,
  useObserveArkanoidCompetitions,
} from '@/games/arkanoid/stores/arkanoidCompetitions';
import ZkNoidGameContext from '@/lib/contexts/ZkNoidGameContext';
import GamePage from '@/components/framework/GamePage';
import { arkanoidConfig } from '../config';
import CompetitionWidget from '@/components/framework/CompetitionWidget';
import { ICompetition } from '@/lib/types';
import ArkanoidCoverSVG from '../assets/game-cover.svg';
import ArkanoidCoverMobileSVG from '../assets/game-cover-mobile.svg';

export default function ArkanoidCompetitionsListPage() {
  const networkStore = useNetworkStore();
  const compStore = useArkanoidCompetitionsStore();

  useObserveArkanoidCompetitions();

  const { client } = useContext(ZkNoidGameContext);

  if (!client) {
    throw Error('Context app chain client is not set');
  }

  const register = async (competitionId: number) => {
    const gameHub = client.runtime.resolve('ArkanoidGameHub');

    const tx = await client.transaction(
      PublicKey.fromBase58(networkStore.address!),
      async () => {
        gameHub.register(UInt64.from(competitionId));
      }
    );

    await tx.sign();
    await tx.send();
  };

  const getReward = async (competitionId: number) => {
    const gameHub = client.runtime.resolve('ArkanoidGameHub');

    const tx = await client.transaction(
      PublicKey.fromBase58(networkStore.address!),
      async () => {
        gameHub.getReward(UInt64.from(competitionId));
      }
    );

    await tx.sign();
    await tx.send();
  };

  // const competitionButton = (c: ICompetition): ReactElement => {
  //   let defaultButton = (
  //     <div className="flex content-center items-center justify-center rounded border-solid bg-gray-500 px-6 py-4 font-bold text-white">
  //       I am not a button
  //     </div>
  //   );
  //
  //   let playButton = (
  //     <Link
  //       href={`/games/arkanoid/[competitionId]`}
  //       as={`/games/arkanoid/${c.competitionId}`}
  //     >
  //       <div className="flex content-center items-center justify-center rounded border-solid bg-blue-500 px-6 py-4 font-bold text-white">
  //         Play
  //       </div>
  //     </Link>
  //   );
  //
  //   let registerButton = (
  //     <div
  //       className="flex content-center items-center justify-center rounded border-solid bg-blue-500 px-6 py-4 font-bold text-white"
  //       onClick={() => register(c.competitionId)}
  //     >
  //       Register
  //     </div>
  //   );
  //
  //   const info = (text: string) => {
  //     return (
  //       <div className="flex content-center items-center justify-center rounded border-solid bg-gray-500 px-6 py-4 font-bold text-white">
  //         {text}
  //       </div>
  //     );
  //   };
  //   let curTime = Date.now();
  //
  //   if (c.competitionEndTime < curTime) {
  //     return info('Competition ended');
  //   }
  //
  //   if (c.prereg && !c.registered) {
  //     if (c.preregStartTime < curTime && c.preregEndTime > curTime) {
  //       return registerButton;
  //     } else if (c.preregEndTime < curTime) {
  //       return info('Registration ended');
  //     } else {
  //       return info('Wait for registration');
  //     }
  //   }
  //
  //   if (c.competitionStartTime > curTime) {
  //     return info('Wait for game start');
  //   }
  //
  //   return playButton;
  // };

  const competitionBlocks: ICompetition[] = compStore.competitions.slice(0, 3);

  return (
    <GamePage
      gameConfig={arkanoidConfig}
      image={ArkanoidCoverSVG}
      mobileImage={ArkanoidCoverMobileSVG}
      defaultPage={'Competitions List'}
    >
      <CompetitionWidget
        gameId={arkanoidConfig.id}
        competitionBlocks={competitionBlocks}
        competitionList={compStore.competitions}
        register={register}
      />
    </GamePage>
  );
}
