'use client';

import Link from 'next/link';
import { PublicKey, UInt64 } from 'o1js';
import { ReactElement, useContext } from 'react';
import { useNetworkStore } from '@/lib/stores/network';
import { ICompetition } from '@/lib/types';
import {
  useArkanoidCompetitionsStore,
  useObserveArkanoidCompetitions,
} from '@/games/arkanoid/stores/arkanoidCompetitions';
import AppChainClientContext from '@/lib/contexts/AppChainClientContext';
import GamePage from '@/components/framework/GamePage';
import { arkanoidConfig } from '../config';
import { formatDecimals } from '@/lib/utils';

const timeStampToStringDate = (timeStamp: number): string => {
  var date = new Date(timeStamp);
  return (
    date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear()
  );
};

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

  const competitionButton = (c: ICompetition): ReactElement => {
    let defaultButton = (
      <div className="flex content-center items-center justify-center rounded border-solid bg-gray-500 px-6 py-4 font-bold text-white">
        I am not a button
      </div>
    );

    let playButton = (
      <Link
        href={`/games/arkanoid/[competitionId]`}
        as={`/games/arkanoid/${c.competitionId}`}
      >
        <div className="flex cursor-pointer content-center items-center justify-center rounded border-solid bg-blue-500 px-6 py-4 font-bold text-white">
          Play
        </div>
      </Link>
    );

    let registerButton = (
      <div
        className="flex cursor-pointer content-center items-center justify-center rounded border-solid bg-blue-500 px-6 py-4 font-bold text-white"
        onClick={() => register(c.competitionId)}
      >
        Register
      </div>
    );

    const info = (text: string) => {
      return (
        <div className="flex cursor-pointer content-center items-center justify-center rounded border-solid bg-gray-500 px-6 py-4 font-bold text-white">
          {text}
        </div>
      );
    };

    let getRewardButton = (
      <div
        className="flex cursor-pointer content-center items-center justify-center rounded border-solid bg-blue-500 px-6 py-4 font-bold text-white"
        onClick={() => getReward(c.competitionId)}
      >
        Get Reward
      </div>
    );

    let curTime = Date.now();

    if (c.competitionEndTime < curTime) {
      return getRewardButton;
    }

    if (c.prereg && !c.registered) {
      if (c.preregStartTime < curTime && c.preregEndTime > curTime) {
        return registerButton;
      } else if (c.preregEndTime < curTime) {
        return info('Registration ended');
      } else {
        return info('Wait for registration');
      }
    }

    if (c.competitionStartTime > curTime) {
      return info('Wait for game start');
    }

    return playButton;
  };

  return (
    <GamePage gameConfig={arkanoidConfig}>
      <div className="flex min-h-screen w-screen flex-col items-center py-10">
        <Link href={`/games/arkanoid/new-competition`} className="p-5">
          <div className="h-50 w-100 rounded border-2 border-solid border-left-accent bg-bg-dark p-5 hover:bg-left-accent hover:text-bg-dark">
            Create competition{' '}
          </div>
        </Link>
        <h1> Arkanoid competitions list </h1>
        <table className="min-w-max border border-left-accent text-left">
          <thead className="bg-[#252525] font-semibold">
            <tr>
              <th className="px-6 py-3"> Name </th>
              <th className="px-6 py-3"> Seed </th>
              <th className="px-6 py-3"> Prereg </th>
              <th className="px-6 py-3"> Registered </th>
              <th className="px-6 py-3"> PreregStart </th>
              <th className="px-6 py-3"> PreregEnd </th>
              <th className="px-6 py-3"> CompetitionStart </th>
              <th className="px-6 py-3"> CompetitionEnd </th>
              <th className="px-6 py-3"> Funds </th>
              <th className="px-6 py-3"> ParticipationFee </th>
              <th> </th>
            </tr>
          </thead>
          <tbody>
            {compStore.competitions.map((c) => (
              <tr
                className={
                  'border-y border-left-accent ' +
                  (c.funds > 0 ? 'bg-[#252525]' : 'bg-[#252525]')
                }
                key={c.competitionId}
              >
                <td className="px-6 py-4">{c.name}</td>
                <td className="px-6 py-4">{c.seed}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center">
                    <input type="checkbox" checked={c.prereg} readOnly></input>
                  </div>
                </td>
                <td className="flex items-center justify-center px-3 py-6">
                  <div className="flex items-center justify-center">
                    <input
                      type="checkbox"
                      checked={c.registered}
                      readOnly
                    ></input>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {c.prereg ? timeStampToStringDate(c.preregStartTime) : ''}
                </td>
                <td className="px-6 py-4">
                  {c.prereg ? timeStampToStringDate(c.preregEndTime) : ''}
                </td>
                <td className="px-6 py-4">
                  {timeStampToStringDate(c.competitionStartTime)}
                </td>
                <td className="px-6 py-4">
                  {timeStampToStringDate(c.competitionEndTime)}
                </td>
                <td className="px-6 py-4">{formatDecimals(c.funds)}</td>
                <td className="px-6 py-4">
                  {formatDecimals(c.participationFee)}
                </td>
                <td>
                  {competitionButton(c)}
                  {/* <Link href={`/games/arkanoid/${c.competitionId}`}>
                    <div className="flex content-center items-center justify-center rounded border-solid bg-blue-500 px-6 py-4 font-bold text-white">
                      Play
                    </div>
                  </Link> */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </GamePage>
  );
}
