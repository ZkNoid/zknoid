'use client';

import { useContext, useEffect, useRef, useState } from 'react';
import { Field, Int64, PublicKey, UInt64 } from 'o1js';
import {
  BRICK_HALF_WIDTH,
  IntPoint,
  createBricksBySeed,
  FIELD_WIDTH,
  Competition,
} from 'zknoid-chain-dev';
import { useNetworkStore } from '@/lib/stores/network';
import { useMinaBalancesStore } from '@/lib/stores/minaBalances';
import { useProtokitBalancesStore } from '@/lib/stores/protokitBalances';
import AppChainClientContext from '@/lib/contexts/AppChainClientContext';
import { arkanoidConfig } from '../config';
import GamePage from '@/components/framework/GamePage';

interface IBrick {
  pos: [number, number];
  value: number;
}

interface IContractBrick {
  pos: IntPoint;
  value: UInt64;
}

const getDate = (daysOffset: number) => {
  let curr = new Date();
  curr.setDate(curr.getDate() + 3);
  let date = curr.toISOString().substring(0, 10);
  return date;
};

export default function NewArkanoidCompetitionPage() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [seed, setSeed] = useState(0);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [ctx, setContext] = useState<
    CanvasRenderingContext2D | null | undefined
  >(null);
  const [preregistrationEnabled, setPreregistrationEnabled] = useState(true);
  const [preregistrationFrom, setPreregistrationFrom] = useState(getDate(0));
  const [preregistrationTo, setPreregistrationTo] = useState(getDate(1));

  const [competitionFrom, setCompetitionFrom] = useState(getDate(2));
  const [competitionTo, setCompetitionTo] = useState(getDate(5));
  const [funding, setFunding] = useState(0);
  const [participationFee, setPerticipationFee] = useState(0);

  const [bricks, setBricks] = useState<IBrick[]>([]);

  const networkStore = useNetworkStore();
  const minaBalances = useMinaBalancesStore();
  const protokitBalances = useProtokitBalancesStore();

  const client = useContext(AppChainClientContext);

  if (!client) {
    throw Error('Context app chain client is not set');
  }

  useEffect(() => {
    const ctx = canvas!.current?.getContext('2d');
    setContext(ctx);
  }, [canvas]);

  useEffect(() => {
    let contractBricks = createBricksBySeed(Field.from(seed)).bricks;
    setBricks(
      contractBricks.map((brick: IContractBrick) => {
        return {
          pos: [brick.pos.x ^ 1, brick.pos.y ^ 1],
          value: +brick.value.toString(),
        } as IBrick;
      })
    );
  }, [seed]);

  useEffect(() => {
    clearCanvas();
    drawBricks();
  }, [bricks]);

  const clearCanvas = () => {
    if (!ctx) {
      return;
    }
    ctx!.rect(0, 0, 300, 300);
    ctx!.fillStyle = 'white';
    ctx!.fill();
  };

  const drawBricks = () => {
    for (let brick of bricks.filter((brick) => +brick.value.toString() > 1)) {
      ctx!.beginPath();
      ctx!.rect(
        resizeToConvasSize(brick.pos[0]),
        resizeToConvasSize(brick.pos[1]),
        resizeToConvasSize(BRICK_HALF_WIDTH * 2),
        resizeToConvasSize(BRICK_HALF_WIDTH * 2)
      );

      ctx!.stroke();
      ctx!.closePath();

      if (brick.value > 1) {
        ctx!.fillStyle = 'black';
        ctx!.font = '24px serif';
        ctx!.fillText(
          (brick.value - 1).toString(),
          resizeToConvasSize(brick.pos[0]) +
            resizeToConvasSize(BRICK_HALF_WIDTH / 2),
          resizeToConvasSize(brick.pos[1]) +
            resizeToConvasSize((3 * BRICK_HALF_WIDTH) / 2)
        );
      }
    }
  };

  const resizeToConvasSize = (x: number) => {
    return (x * (canvas.current?.width || FIELD_WIDTH)) / FIELD_WIDTH;
  };

  const createCompetition = async () => {
    const gameHub = client.runtime.resolve('ArkanoidGameHub');

    const tx = await client.transaction(
      PublicKey.fromBase58(networkStore.address!),
      () => {
        /*
        Competition({
          name: CircuitString,
          description: CircuitString,
          seed: Field,
          prereg: Bool,
          preregStartTime: UInt64,
          preregEndTime: UInt64,
          competitionStartTime: UInt64,
          competitionEndTime: UInt64,
          funds: UInt64,
          entranceFee: UInt64,
        });
        */

        let competition = Competition.from(
          name,
          // description,
          seed,
          preregistrationEnabled,
          new Date(preregistrationFrom).getTime(), // preregStartTime
          new Date(preregistrationTo).getTime(), // preregEndTime
          new Date(competitionFrom).getTime(), // competitionStartTime
          new Date(competitionTo).getTime(), // competitionEndTime
          funding,
          participationFee
        );

        gameHub.createCompetition(competition);
      }
    );

    await tx.sign();
    await tx.send();
  };

  return (
    <GamePage gameConfig={arkanoidConfig}>
      <div className="flex flex-col items-center justify-center gap-5 py-10">
        <div className="py-3">Create competition</div>
        <div className="flex flex-col items-center">
          <a>Name</a>
          <input
            className="w-50 text-bg-dark"
            value={name}
            onChange={(e) => setName(e.target.value)}
          ></input>
        </div>
        <div className="flex flex-col items-center">
          <a>Description</a>
          <textarea
            className="w-50 text-bg-dark"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>
        <div className="flex flex-col items-center">
          <a>Map seed</a>
          <a className="text-xs">(do not share until competition started)</a>
          <input
            className="w-20 text-bg-dark"
            type="number"
            value={seed}
            onChange={(e) => setSeed(parseInt(e.target.value) || 0)}
          ></input>
          <canvas
            width="300"
            height="300"
            style={{ width: 300, height: 300 }}
            className="py-5"
            ref={canvas}
          ></canvas>
        </div>
        <div className="flex flex-col items-center">
          <a>Competition preregistration</a>
          <input
            type="checkbox"
            checked={preregistrationEnabled}
            onChange={(e) => setPreregistrationEnabled(e.target.checked)}
          ></input>
        </div>
        {preregistrationEnabled && (
          <div className="flex flex-col items-center">
            <a>Competition preregistration</a>
            <div className="flex gap-5">
              <input
                type="date"
                className="text-bg-dark"
                value={preregistrationFrom}
                onChange={(e) => setPreregistrationFrom(e.target.value)}
              ></input>{' '}
              -
              <input
                type="date"
                className="text-bg-dark"
                value={preregistrationTo}
                onChange={(e) => setPreregistrationTo(e.target.value)}
              ></input>
            </div>
          </div>
        )}
        <div className="flex flex-col items-center">
          <a>Competition dates</a>
          <div className="flex gap-5">
            <input
              type="date"
              className="text-bg-dark"
              value={competitionFrom}
              onChange={(e) => setCompetitionFrom(e.target.value)}
            ></input>{' '}
            -
            <input
              type="date"
              className="text-bg-dark"
              value={competitionTo}
              onChange={(e) => setCompetitionTo(e.target.value)}
            ></input>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <a>Funding</a>
          <div className="flex">
            <input
              className="w-20 text-bg-dark"
              type="number"
              value={funding}
              onChange={(e) => setFunding(parseInt(e.target.value))}
            ></input>{' '}
            🪙
          </div>
        </div>
        <div className="flex flex-col items-center">
          <a>Participation fee</a>
          <div className="flex">
            <input
              className="w-20 text-bg-dark"
              type="number"
              value={participationFee}
              onChange={(e) => setPerticipationFee(parseInt(e.target.value))}
            ></input>{' '}
            🪙
          </div>
        </div>

        <div
          className="cursor-pointer rounded-xl border-2 border-left-accent bg-bg-dark p-5 hover:bg-left-accent hover:text-bg-dark"
          onClick={() => createCompetition()}
        >
          Create
        </div>
      </div>
    </GamePage>
  );
}
