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
import {
  useMinaBridge,
  useProtokitBalancesStore,
} from '@/lib/stores/protokitBalances';
import AppChainClientContext from '@/lib/contexts/AppChainClientContext';
import { arkanoidConfig } from '../config';
import GamePage from '@/components/framework/GamePage';
import { Input } from '@/components/ui/games-store/shared/Input';
import { Textarea } from '@/components/ui/games-store/shared/Textarea';
import { Button } from '@/components/ui/games-store/shared/Button';
import { DropdownList } from '@/components/ui/games-store/shared/DropdownList';
import { Checkbox } from '@/components/ui/games-store/shared/Checkbox';
import { Popover } from '@/components/ui/games-store/shared/Popover';
import { DatePicker } from '@/components/ui/games-store/shared/DatePicker';

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
  const bridge = useMinaBridge();

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
    if (await bridge(BigInt(funding) * 10n ** 9n)) return;

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

  const [isSeedPopoverOpen, setIsSeedPopoverOpen] = useState<boolean>(false);
  const [isRandomSeed, setIsRandomSeed] = useState<boolean>(false);

  useEffect(() => {
    if (!isRandomSeed && seed.toString().length > 13)
      setIsSeedPopoverOpen(true);
  }, [seed]);

  const getRandomSeed = () => {
    return Math.floor(Math.random() * Math.pow(2, 252));
  };

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
            <div className={'flex h-full w-full flex-col gap-2'}>
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
                className={'h-full'}
              />
            </div>
            {/*<div className={'flex w-full flex-col gap-2'}>*/}
            {/*  <span*/}
            {/*    className={*/}
            {/*      'font-plexsans text-main font-medium uppercase text-left-accent'*/}
            {/*    }*/}
            {/*  >*/}
            {/*    Choose or upload cover for competition*/}
            {/*  </span>*/}
            {/*  <div className={'flex flex-row gap-4'}>*/}
            {/*    <Button label={'Upload image'} />*/}
            {/*    <DropdownList*/}
            {/*      label={'Select image'}*/}
            {/*      items={[*/}
            {/*        'Default 1',*/}
            {/*        'Default 2',*/}
            {/*        'Default 3',*/}
            {/*        'Default 4',*/}
            {/*        'Default 5',*/}
            {/*      ]}*/}
            {/*      selectedItem={image}*/}
            {/*      setSelectedItem={setImage}*/}
            {/*    />*/}
            {/*  </div>*/}
            {/*</div>*/}
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
                  <Button
                    label={'Randomize'}
                    onClick={() => {
                      if (!isRandomSeed) setIsRandomSeed(true);
                      setSeed(getRandomSeed());
                    }}
                  />
                </div>
                <div className={'flex w-[260px] flex-col gap-2'}>
                  <span
                    className={
                      'font-plexsans text-main font-medium uppercase text-left-accent'
                    }
                  >
                    Map seed:
                  </span>
                  {seed.toString().length > 13 ? (
                    <Popover
                      isOpen={isSeedPopoverOpen}
                      setIsOpen={setIsSeedPopoverOpen}
                      trigger={
                        <div
                          className={
                            'group flex h-full w-full flex-row gap-2 rounded-[5px] border bg-bg-dark p-2 hover:border-left-accent'
                          }
                        >
                          <div
                            className={
                              'w-full appearance-none bg-bg-dark placeholder:font-plexsans placeholder:text-main placeholder:opacity-50 focus:border-none focus:outline-none group-hover:focus:text-left-accent group-hover:focus:placeholder:text-left-accent/80'
                            }
                          >
                            {seed}
                          </div>
                        </div>
                      }
                    >
                      <div
                        className={
                          'flex max-h-[200px] min-w-[500px] flex-col gap-4'
                        }
                      >
                        <Input
                          type={'number'}
                          value={seed}
                          setValue={setSeed}
                          placeholder={'777'}
                          isBordered={false}
                          inputMode={'numeric'}
                        />
                      </div>
                    </Popover>
                  ) : (
                    <Input
                      type={'number'}
                      value={seed}
                      setValue={setSeed}
                      placeholder={'777'}
                      inputMode={'numeric'}
                    />
                  )}
                </div>
              </div>
            </div>
            <div className={'flex w-full flex-row justify-between gap-2'}>
              <div className={'flex flex-row gap-4'}>
                <span
                  className={
                    'font-plexsans text-main font-medium uppercase text-left-accent'
                  }
                >
                  Preregiatration
                </span>
                <Popover
                  trigger={
                    <svg
                      width="21"
                      height="21"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className={'hover:opacity-80'}
                    >
                      <g opacity="0.5">
                        <circle
                          cx="8"
                          cy="8"
                          r="7"
                          fill="#F9F8F4"
                          stroke="#F9F8F4"
                          strokeWidth="0.500035"
                        />
                        <path
                          d="M7.2446 9.95291V7.68144C8.03117 7.64451 8.64508 7.45983 9.08633 7.12742C9.53717 6.79501 9.76259 6.33795 9.76259 5.75623V5.56233C9.76259 5.09141 9.60911 4.71745 9.30216 4.44044C8.9952 4.1542 8.58273 4.01108 8.06475 4.01108C7.50839 4.01108 7.06235 4.16343 6.72662 4.46814C6.40048 4.77285 6.17986 5.16066 6.06475 5.63158L5 5.24377C5.08633 4.94829 5.21103 4.66667 5.3741 4.39889C5.54676 4.12188 5.75779 3.88181 6.00719 3.67867C6.26619 3.4663 6.56835 3.30009 6.91367 3.18006C7.25899 3.06002 7.65707 3 8.10791 3C9 3 9.70504 3.23546 10.223 3.70637C10.741 4.17729 11 4.8144 11 5.61773C11 6.06094 10.9185 6.44875 10.7554 6.78116C10.6019 7.10434 10.4005 7.38135 10.1511 7.61219C9.90168 7.84303 9.61871 8.0277 9.30216 8.1662C8.98561 8.30471 8.66906 8.40166 8.35252 8.45706V9.95291H7.2446ZM7.80576 13C7.4988 13 7.27338 12.9261 7.1295 12.7784C6.9952 12.6307 6.92806 12.4367 6.92806 12.1967V12.0166C6.92806 11.7765 6.9952 11.5826 7.1295 11.4349C7.27338 11.2872 7.4988 11.2133 7.80576 11.2133C8.11271 11.2133 8.33333 11.2872 8.46763 11.4349C8.61151 11.5826 8.68345 11.7765 8.68345 12.0166V12.1967C8.68345 12.4367 8.61151 12.6307 8.46763 12.7784C8.33333 12.9261 8.11271 13 7.80576 13Z"
                          fill="#252525"
                        />
                      </g>
                    </svg>
                  }
                >
                  <div
                    className={
                      'flex min-w-[250px] flex-col items-center justify-center gap-2 font-plexsans'
                    }
                  >
                    <span className={'w-full self-start text-[14px]/[14px]'}>
                      Preregistration
                    </span>
                    <div
                      className={
                        'w-full text-[12px]/[12px] font-light opacity-70'
                      }
                    >
                      Preregistration allows to enable dates when users need to
                      pre-register and pay the competition fee
                    </div>
                  </div>
                </Popover>
              </div>
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
                  <DatePicker
                    setDateTo={setPreregistrationTo}
                    setDateFrom={setPreregistrationFrom}
                    trigger={
                      <div
                        className={
                          'group rounded-[5px] border p-2 hover:border-left-accent'
                        }
                      >
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
                            className={'group-active:fill-left-accent'}
                          />
                        </svg>
                      </div>
                    }
                  />
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
                  <DatePicker
                    setDateFrom={setCompetitionFrom}
                    setDateTo={setCompetitionTo}
                    trigger={
                      <div
                        className={
                          'group rounded-[5px] border p-2 hover:border-left-accent'
                        }
                      >
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
                            className={'group-active:fill-left-accent'}
                          />
                        </svg>
                      </div>
                    }
                  />
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
                    type={'number'}
                    inputMode={'numeric'}
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
                  <Input
                    type={'number'}
                    inputMode={'numeric'}
                    value={funding}
                    setValue={setFunding}
                  />
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
                <Button
                  label={'Create competition'}
                  onClick={createCompetition}
                />
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
    </GamePage>
  );
}
