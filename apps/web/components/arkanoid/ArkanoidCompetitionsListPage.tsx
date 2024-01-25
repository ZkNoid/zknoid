'use client';

import { ClientState, useClientStore } from '@/lib/stores/client';
import Link from 'next/link';
import { UInt64 } from 'o1js';
import { useEffect, useRef, useState } from 'react';
import { client } from 'zknoid-chain-dev';

interface ICompetition {
  competitionId: number;
  name: string;
  seed: number;
  prereg: boolean;
  preregBefore: number;
  preregAfter: number;
  competitionStartTime: number;
  competitionEndTime: number;
  funds: number;
  participationFee: number;
}

const testList: ICompetition[] = [
  {
    competitionId: 0,
    name: 'global',
    seed: 0,
    prereg: false,
    preregBefore: 0,
    preregAfter: 0,
    competitionStartTime: 0,
    competitionEndTime: 0,
    funds: 0,
    participationFee: 0,
  },
];

export default function ArkanoidCompetitionsListPage() {
  let [competitions, setCompetitions] = useState(testList);

  useEffect(() => {
    client.start().then(getListOfCompetitions);
  }, []);

  const getListOfCompetitions = async () => {
    let result: ICompetition[] = [];

    let lastId =
      (await client.query.runtime.GameHub.lastCompetitonId.get())?.toBigInt() ||
      0;

    for (let i = 0; i < lastId; i++) {
      let curGame = await client.query.runtime.GameHub.competitions.get(
        UInt64.from(i),
      );
      result.push({
        competitionId: i,
        name: curGame!.name.toString(),
        seed: 0,
        prereg: false,
        preregBefore: 0,
        preregAfter: 0,
        competitionStartTime: 0,
        competitionEndTime: 0,
        funds: 0,
        participationFee: 0,
      });
    }

    setCompetitions(competitions.concat(...result));
  };

  return (
    <>
      <div className="flex min-h-screen w-screen flex-col items-center py-10">
        <Link href={`/games/arkanoid/new-competition`} className="p-5">
          <div className="h-50 w-100 rounded border-solid bg-white p-5">
            Create competition{' '}
          </div>
        </Link>
        <table className="min-w-max text-left">
          <thead className="bg-gray-300 font-semibold">
            <tr>
              <th className="px-6 py-3"> Name </th>
              <th className="px-6 py-3"> Seed </th>
              <th className="px-6 py-3"> Prereg </th>
              <th className="px-6 py-3"> PreregBefore </th>
              <th className="px-6 py-3"> PreregAfter </th>
              <th className="px-6 py-3"> CompetitionStart </th>
              <th className="px-6 py-3"> CompetitionEnd </th>
              <th className="px-6 py-3"> Funds </th>
              <th className="px-6 py-3"> ParticipationFee </th>
              <th> </th>
            </tr>
          </thead>
          <tbody>
            {competitions.map((c) => (
              <tr className="border-b bg-white">
                {/* <Link
                  className="flex w-1/5 flex-col"
                  href={`/games/arkanoid/${c.competitionId}`}
                > */}
                <td className="px-6 py-4">{c.name}</td>
                <td className="px-6 py-4">{c.seed}</td>
                <td className="px-6 py-4">{c.prereg.toString()}</td>
                <td className="px-6 py-4">{c.preregBefore}</td>
                <td className="px-6 py-4">{c.preregAfter}</td>
                <td className="px-6 py-4">{c.competitionStartTime}</td>
                <td className="px-6 py-4">{c.competitionEndTime}</td>
                <td className="px-6 py-4">{c.funds}</td>
                <td className="px-6 py-4">{c.participationFee}</td>
                <td>
                  <Link href={`/games/arkanoid/${c.competitionId}`}>
                    <div className="flex content-center items-center justify-center rounded border-solid bg-blue-500 px-6 py-4 font-bold text-white">
                      Play
                    </div>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
