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
import { Input } from '@/components/ui/games-store/shared/Input';
import { Textarea } from '@/components/ui/games-store/shared/Textarea';
import { Button } from '@/components/ui/games-store/shared/Button';
import { DropdownList } from '@/components/ui/games-store/shared/DropdownList';
import { Checkbox } from '@/components/ui/games-store/shared/Checkbox';

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

  const [game, setGame] = useState<string>('');
  const [image, setImage] = useState<string>('Default 1');
  const [isPolicyAccepted, setIsPolicyAccepted] = useState<boolean>(false);

  return (
    <GamePage
      gameConfig={arkanoidConfig}
      image={'/image/game-page/game-title-template.svg'}
      defaultPage={'New Competition'}
    >
      <div className={'flex w-full flex-col gap-8'}>
        <div className={'w-full text-left text-headline-1'}>
          Create competition
        </div>
        <div className={'grid grid-cols-3 gap-5'}>
          <div className={'flex w-full flex-col gap-4'}>
            <div className={'text-[20px]/[20px] font-bold'}>
              Description information
            </div>
            <div className={'flex w-full flex-col gap-2'}>
              <span
                className={
                  'font-plexsans text-main font-medium uppercase text-left-accent'
                }
              >
                Enter the name of the competition*
              </span>
              <Input
                value={name}
                setValue={setName}
                placeholder={'Type competition name here...'}
              />
            </div>
            <div className={'flex w-full flex-col gap-2'}>
              <span
                className={
                  'font-plexsans text-main font-medium uppercase text-left-accent'
                }
              >
                Select the game*
              </span>
              <Input
                value={game}
                setValue={setGame}
                placeholder={'Type game name here...'}
              />
            </div>
            <div className={'flex w-full flex-col gap-2'}>
              <span
                className={
                  'font-plexsans text-main font-medium uppercase text-left-accent'
                }
              >
                Enter the description of the competition*
              </span>
              <Textarea
                value={description}
                setValue={setDescription}
                placeholder={'Type description here...'}
              />
            </div>
            <div className={'flex w-full flex-col gap-2'}>
              <span
                className={
                  'font-plexsans text-main font-medium uppercase text-left-accent'
                }
              >
                Choose or upload cover for competition
              </span>
              <div className={'flex flex-row gap-4'}>
                <Button label={'Upload image'} />
                <DropdownList
                  label={'Select image'}
                  items={[
                    'Default 1',
                    'Default 2',
                    'Default 3',
                    'Default 4',
                    'Default 5',
                  ]}
                  selectedItem={image}
                  setSelectedItem={setImage}
                />
              </div>
            </div>
          </div>
          <div className={'flex w-full flex-col gap-4'}>
            <div className={'text-[20px]/[20px] font-bold'}>
              Competition parameters
            </div>
            <div className={'flex w-full flex-col gap-2'}>
              <div className={'flex flex-row justify-between'}>
                <div className={'flex min-w-[40%] flex-col gap-2'}>
                  <span
                    className={
                      'font-plexsans text-main font-medium uppercase text-left-accent'
                    }
                  >
                    Map seed Generation*
                  </span>
                  <Button label={'Randomize'} />
                </div>
                <div className={'flex max-w-[200px] flex-col gap-2'}>
                  <span
                    className={
                      'font-plexsans text-main font-medium uppercase text-left-accent'
                    }
                  >
                    Map seed:
                  </span>
                  <Input value={seed} setValue={setSeed} placeholder={'777'} />
                </div>
              </div>
            </div>
            <div className={'flex w-full flex-row justify-between gap-2'}>
              <span
                className={
                  'font-plexsans text-main font-medium uppercase text-left-accent'
                }
              >
                Preregiatration
              </span>
              <Checkbox
                isSelected={preregistrationEnabled}
                setIsSelected={setPreregistrationEnabled}
              />
            </div>
            <div className={'flex w-full flex-col gap-2'}>
              <span
                className={
                  'font-plexsans text-main font-medium uppercase text-left-accent'
                }
              >
                Preregiatration dates
              </span>
              <div className={'flex flex-row justify-between gap-8'}>
                <div className={'flex flex-col items-end justify-end'}>
                  <div />
                  <div className={'rounded-[5px] border p-2'}>
                    <svg
                      width="29"
                      height="29"
                      viewBox="0 0 18 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M16 18H2V7H16M13 0V2H5V0H3V2H2C0.89 2 0 2.89 0 4V18C0 18.5304 0.210714 19.0391 0.585786 19.4142C0.960859 19.7893 1.46957 20 2 20H16C16.5304 20 17.0391 19.7893 17.4142 19.4142C17.7893 19.0391 18 18.5304 18 18V4C18 3.46957 17.7893 2.96086 17.4142 2.58579C17.0391 2.21071 16.5304 2 16 2H15V0M14 11H9V16H14V11Z"
                        fill="#F9F8F4"
                      />
                    </svg>
                  </div>
                </div>
                <div className={'flex flex-col'}>
                  <span>From</span>
                  <Input
                    value={preregistrationFrom}
                    setValue={setPreregistrationFrom}
                    placeholder={'00.00.0000'}
                  />
                </div>
                <div className={'flex flex-col'}>
                  <span>To</span>
                  <Input
                    value={preregistrationTo}
                    setValue={setPreregistrationTo}
                    placeholder={'00.00.0000'}
                  />
                </div>
              </div>
            </div>
            <div className={'flex w-full flex-col gap-2'}>
              <span
                className={
                  'font-plexsans text-main font-medium uppercase text-left-accent'
                }
              >
                Competitions date*
              </span>
              <div className={'flex flex-row justify-between gap-8'}>
                <div className={'flex flex-col items-end justify-end'}>
                  <div />
                  <div className={'rounded-[5px] border p-2'}>
                    <svg
                      width="29"
                      height="29"
                      viewBox="0 0 18 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M16 18H2V7H16M13 0V2H5V0H3V2H2C0.89 2 0 2.89 0 4V18C0 18.5304 0.210714 19.0391 0.585786 19.4142C0.960859 19.7893 1.46957 20 2 20H16C16.5304 20 17.0391 19.7893 17.4142 19.4142C17.7893 19.0391 18 18.5304 18 18V4C18 3.46957 17.7893 2.96086 17.4142 2.58579C17.0391 2.21071 16.5304 2 16 2H15V0M14 11H9V16H14V11Z"
                        fill="#F9F8F4"
                      />
                    </svg>
                  </div>
                </div>
                <div className={'flex flex-col'}>
                  <span>From</span>
                  <Input
                    value={competitionFrom}
                    setValue={setCompetitionFrom}
                    placeholder={'00.00.0000'}
                  />
                </div>
                <div className={'flex flex-col'}>
                  <span>To</span>
                  <Input
                    value={competitionTo}
                    setValue={setCompetitionTo}
                    placeholder={'00.00.0000'}
                  />
                </div>
              </div>
            </div>
            <div className={'flex w-full flex-col gap-1'}>
              <div className={'flex w-full flex-row gap-4'}>
                <div className={'flex w-full flex-col gap-2'}>
                  <span
                    className={
                      'font-plexsans text-main font-medium uppercase text-left-accent'
                    }
                  >
                    Participant fee*
                  </span>
                  <Input
                    value={participationFee}
                    setValue={setPerticipationFee}
                  />
                </div>
                <div className={'flex w-full flex-col gap-2'}>
                  <span
                    className={
                      'font-plexsans text-main font-medium uppercase text-left-accent'
                    }
                  >
                    Funds*
                  </span>
                  <Input value={funding} setValue={setFunding} />
                </div>
              </div>
              <div className={'flex w-full flex-col gap-2'}>
                <span className={'text-left-accent'}>Balance: 100 $znakes</span>
                <div className={'flex flex-row items-center justify-between'}>
                  <span className={'font-plexsans text-[12px]/[12px]'}>
                    I understand that this amount will be deducted from my
                    account for hosting the competition.
                  </span>
                  <Checkbox
                    isSelected={isPolicyAccepted}
                    setIsSelected={setIsPolicyAccepted}
                  />
                </div>
                <Button label={'Create competition'} />
              </div>
            </div>
          </div>
          <div
            className={
              'flex h-full w-full items-center justify-center rounded-[5px] border border-left-accent'
            }
          >
            <canvas
              width="300"
              height="300"
              style={{ width: 300, height: 300 }}
              className="p-5"
              ref={canvas}
            />
          </div>
        </div>
      </div>

      <div className="mt-[500px] flex flex-col items-center justify-center gap-5 py-10">
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
          {/*<canvas*/}
          {/*  width="300"*/}
          {/*  height="300"*/}
          {/*  style={{ width: 300, height: 300 }}*/}
          {/*  className="py-5"*/}
          {/*  ref={canvas}*/}
          {/*></canvas>*/}
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
