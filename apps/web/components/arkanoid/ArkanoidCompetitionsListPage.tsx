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
    <div className="flex flex-col items-center justify-center gap-5 py-10">
      {competitions.map((c) => (
        <div className="w-1/5 rounded border-2 border-solid border-blue-500">
          <Link
            className="m-5 flex h-full flex-col gap-5"
            href={`/games/arkanoid/${c.competitionId}`}
          >
            {c.name}
          </Link>
        </div>
      ))}
    </div>
  );
}
