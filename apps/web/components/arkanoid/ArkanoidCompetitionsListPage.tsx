'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

const testList = ['global', 'global', 'global', '1', '2'];

export default function ArkanoidCompetitionsListPage() {
  let [competitions, setCompetitions] = useState(testList);

  return (
    <div className="flex flex-col items-center justify-center gap-5 py-10">
      {competitions.map((c) => (
        <div className="w-1/5 rounded border-2 border-solid border-blue-500">
          <Link
            className="m-5 flex h-full flex-col gap-5"
            href={`/games/arkanoid/${c}`}
          >
            {c}
          </Link>
        </div>
      ))}
    </div>
  );
}
