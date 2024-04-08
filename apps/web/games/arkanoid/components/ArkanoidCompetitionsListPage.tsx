'use client';

import { PublicKey, UInt64 } from 'o1js';
import { useContext } from 'react';
import { useNetworkStore } from '@/lib/stores/network';
import {
  useArkanoidCompetitionsStore,
  useObserveArkanoidCompetitions,
} from '@/games/arkanoid/stores/arkanoidCompetitions';
import AppChainClientContext from '@/lib/contexts/AppChainClientContext';
import GamePage from '@/components/framework/GamePage';
import { arkanoidConfig } from '../config';
import { CompetitionWidget } from '@/components/framework/CompetitionWidget/CompetitionWidget';
import { ICompetition } from '@/lib/types';
import ArkanoidCoverSVG from '../assets/game-cover.svg'

// const timeStampToStringDate = (timeStamp: number): string => {
//   var date = new Date(timeStamp);
//   return (
//     date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear()
//   );
// };

export default function ArkanoidCompetitionsListPage() {
  const networkStore = useNetworkStore();
  const compStore = useArkanoidCompetitionsStore();

  useObserveArkanoidCompetitions();

  const client = useContext(AppChainClientContext);

  if (!client) {
    throw Error('Context app chain client is not set');
  }

  const register = async (competitionId: number) => {
    const gameHub = client.runtime.resolve('ArkanoidGameHub');

    const tx = await client.transaction(
      PublicKey.fromBase58(networkStore.address!),
      () => {
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
      () => {
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
  // const competitions: ICompetition[] = [
  //   {
  //     id: 0,
  //     seed: 123,
  //     game: { id: 'arkanoid', genre: ZkNoidGameGenre.Arcade },
  //     title: 'Arkanoid GAME',
  //     preReg: false,
  //     preRegDate: {
  //       start: new Date(2024, 9, 10),
  //       end: new Date(2024, 9, 20),
  //     },
  //     competitionDate: {
  //       start: new Date(2024, 9, 25),
  //       end: new Date(2024, 9, 31),
  //     },
  //     participationFee: 5,
  //     currency: Currency.MINA,
  //     reward: 5000,
  //     registered: false,
  //   },
  //   {
  //     id: 1,
  //     seed: 123,
  //     game: { id: 'arkanoid', genre: ZkNoidGameGenre.Arcade },
  //     title: 'Arkanoid GAME',
  //     preReg: false,
  //     preRegDate: {
  //       start: new Date(2024, 10, 10),
  //       end: new Date(2024, 10, 20),
  //     },
  //     competitionDate: {
  //       start: new Date(2024, 10, 25),
  //       end: new Date(2024, 10, 31),
  //     },
  //     participationFee: 4,
  //     currency: Currency.MINA,
  //     reward: 10000,
  //     registered: false,
  //   },
  //   {
  //     id: 2,
  //     seed: 123,
  //     game: { id: 'arkanoid', genre: ZkNoidGameGenre.Arcade },
  //     title: 'Arkanoid GAME',
  //     preReg: false,
  //     preRegDate: {
  //       start: new Date(2024, 11, 10),
  //       end: new Date(2024, 11, 20),
  //     },
  //     competitionDate: {
  //       start: new Date(2024, 11, 25),
  //       end: new Date(2024, 11, 31),
  //     },
  //     participationFee: 6,
  //     currency: Currency.MINA,
  //     reward: 99999,
  //     registered: false,
  //   },
  // ];

  console.log('Competitions', compStore);

  const competitionBlocks: ICompetition[] = [];
  if (competitionBlocks.length < 3)
    compStore.competitions.map((competition, index) => {
      if (index < 3) competitionBlocks.push(competition);
    });

  return (
    <GamePage
      gameConfig={arkanoidConfig}
      image={ArkanoidCoverSVG}
      defaultPage={'Competitions List'}
    >
      <CompetitionWidget
        gameId={arkanoidConfig.id}
        competitionBlocks={competitionBlocks}
        competitionList={compStore.competitions}
      />
    </GamePage>
  );
}
