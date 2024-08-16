'use client';

import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { CircuitString, PublicKey, UInt64 } from 'o1js';
import {
  BRICK_HALF_WIDTH,
  IntPoint,
  createBricksBySeed,
  FIELD_WIDTH,
  Competition,
} from 'zknoid-chain-dev';
import { useNetworkStore } from '@/lib/stores/network';
import {
  useMinaBridge,
  useProtokitBalancesStore,
} from '@/lib/stores/protokitBalances';
import ZkNoidGameContext from '@/lib/contexts/ZkNoidGameContext';
import { arkanoidConfig } from '../config';
import GamePage from '@/components/framework/GamePage';
import Input from '@/components/shared/Input';
import Textarea from '@/components/shared/Textarea';
import Button from '@/components/shared/Button';
import Checkbox from '@/components/shared/Checkbox';
import Popover from '@/components/shared/Popover';
import DatePicker from '@/components/shared/DatePicker';
import { AnimatePresence, motion } from 'framer-motion';
import znakesImg from '@/public/image/tokens/znakes.svg';
import { clsx } from 'clsx';
import { Currency } from '@/constants/currency';
import BaseModal from '@/components/shared/Modal/BaseModal';
import ArkanoidCoverSVG from '../assets/game-cover.svg';
import ArkanoidCoverMobileSVG from '../assets/game-cover-mobile.svg';
import { DropdownListField } from '@/components/shared/DropdownList';
import { default as ReactImage } from 'next/image';
import { api } from '@/trpc/react';
import { getEnvContext } from '@/lib/envContext';
import { PendingTransaction } from '@proto-kit/sequencer';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { snakeNames } from '@/constants/snakeNames';

interface IBrick {
  pos: [number, number];
  value: number;
}

interface IContractBrick {
  pos: IntPoint;
  value: UInt64;
}

let brickImages: HTMLImageElement[] = [new Image(), new Image(), new Image()];
brickImages[0].src = '/sprite/brick/1.png';
brickImages[1].src = '/sprite/brick/2.png';
brickImages[2].src = '/sprite/brick/3.png';

function useStateRef<T>(
  initialValue: T
): [T, Dispatch<SetStateAction<T>>, MutableRefObject<T>] {
  const [value, setValue] = useState(initialValue);

  const ref = useRef(value);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return [value, setValue, ref];
}

export default function NewArkanoidCompetitionPage() {
  const [seed, setSeed] = useState<string>(snakeNames[0]);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [ctx, setContext] = useState<
    CanvasRenderingContext2D | null | undefined
  >(null);

  const [bricks, setBricks, brickRef] = useStateRef<IBrick[]>([]);

  const networkStore = useNetworkStore();
  const protokitBalances = useProtokitBalancesStore();
  const bridge = useMinaBridge();

  const { client } = useContext(ZkNoidGameContext);

  const progress = api.progress.setSolvedQuests.useMutation();

  if (!client) {
    throw Error('Context app chain client is not set');
  }

  useEffect(() => {
    const ctx = canvas!.current?.getContext('2d');
    setContext(ctx);

    if (ctx) {
      const handleResize = () => {
        ctx.canvas.height = ctx.canvas.clientHeight;
        ctx.canvas.width = ctx.canvas.clientWidth;

        clearCanvas();
        drawBricks();
      };

      handleResize();
      window.addEventListener('resize', handleResize);

      return () => window.removeEventListener('resize', handleResize);
    }
  }, [canvas]);

  useEffect(() => {
    let contractBricks = createBricksBySeed(
      CircuitString.fromString(seed).hash()
    ).bricks;
    setBricks(
      contractBricks.map((brick: IContractBrick) => {
        return {
          pos: [(brick.pos.x as any) ^ 1, (brick.pos.y as any) ^ 1],
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
    ctx!.rect(0, 0, canvas.current!.width, canvas.current!.width);
    ctx!.fillStyle = '#212121';
    ctx!.fill();
  };

  const drawBricks = () => {
    let ctx = canvas.current?.getContext('2d');
    for (let brick of brickRef.current!.filter(
      (brick) => +brick.value.toString() > 1
    )) {
      const x = resizeToConvasSize(brick.pos[0]);
      const y = resizeToConvasSize(brick.pos[1]);
      const w = resizeToConvasSize(2 * BRICK_HALF_WIDTH);
      const h = resizeToConvasSize(2 * BRICK_HALF_WIDTH);
      ctx!.drawImage(brickImages[brick.value - 2], x, y, w, h);
    }
  };

  const resizeToConvasSize = (x: number) => {
    return (x * (canvas.current?.width || FIELD_WIDTH)) / FIELD_WIDTH;
  };

  const createCompetition = async (values: typeof initialValues) => {
    const gameHub = client.runtime.resolve('ArkanoidGameHub');
    if (await bridge(BigInt(values.funding) * 10n ** 9n))
      throw Error('Not enough funds');

    const tx = await client.transaction(
      PublicKey.fromBase58(networkStore.address!),
      async () => {
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
          values.name,
          // description,
          values.seed,
          values.preregistrationEnabled,
          new Date(values.preregistrationFrom).getTime() || 0, // preregStartTime
          new Date(values.preregistrationTo).getTime() || 0, // preregEndTime
          values.preregistrationEnabled
            ? new Date(values.competitionFrom).getTime()
            : 0, // competitionStartTime
          values.preregistrationEnabled
            ? new Date(values.competitionTo).getTime()
            : 0, // competitionEndTime
          values.funding,
          values.participationFee || 0
        );

        gameHub.createCompetition(competition);
      }
    );

    await tx.sign();
    await tx.send();

    if (values.funding >= 30) {
      tx.transaction?.hash;
      await progress.mutateAsync({
        userAddress: networkStore.address!,
        section: 'ARKANOID',
        id: 1,
        txHash: JSON.stringify(
          (tx.transaction! as PendingTransaction).toJSON()
        ),
        envContext: getEnvContext(),
      });
    }
  };

  const [isRandomSeed, setIsRandomSeed] = useState<boolean>(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState<boolean>(false);
  const [isPreregistrationPickerOpen, setIsPreregistrationPickerOpen] =
    useState<boolean>(false);
  const [isCompetitionPickerOpen, setIsCompetitionPickerOpen] =
    useState<boolean>(false);

  const getRandomElement = (arr: string[]) => {
    return arr[Math.floor(Math.random() * arr.length)];
  };

  const getRandomPart = (word: string) => {
    const start = Math.floor(Math.random() * word.length);
    const end = Math.floor(Math.random() * (word.length - start)) + start + 1;
    return word.slice(start, end);
  };

  const generateNewWord = () => {
    const word1 = getRandomElement(snakeNames).replace(' ', '');
    const word2 = getRandomElement(snakeNames).replace(' ', '');
    const part1 = getRandomPart(word1);
    const part2 = getRandomPart(word2);
    return part1 + part2;
  };

  const initialValues = {
    name: '',
    description: '',
    game: arkanoidConfig.name,
    seed: seed,
    preregistrationEnabled: true,
    preregistrationFrom: '',
    preregistrationTo: '',
    competitionFrom: '',
    competitionTo: '',
    funding: 0,
    participationFee: 0,
    policy: false,
  };

  const validateSchema = Yup.object().shape({
    name: Yup.string()
      .matches(/^(?![\d+_@.-]+$)[a-zA-Z0-9+_@.-]*$/, 'Invalid name')
      .required('This field required'),

    description: Yup.string()
      .matches(/^(?![\d+_@.-]+$)[a-zA-Z0-9+_@.-]*$/, 'Invalid description')
      .optional(),

    game: Yup.string()
      .required('This field required')
      .oneOf([arkanoidConfig.name]),

    seed: Yup.string()
      .matches(/^(?![\d+_@.-]+$)[a-zA-Z0-9+_@.-]*$/, 'Invalid seed')
      .typeError('Invalid seed')
      .required('This field required'),

    preregistrationEnabled: Yup.boolean(),

    preregistrationFrom: Yup.date()
      .typeError('Invalid Date')
      .when('preregistrationEnabled', {
        is: true,
        then: (schema) => schema.required('This field required'),
        otherwise: (schema) => schema.optional(),
      })
      .max(
        Yup.ref('preregistrationTo'),
        `Preregistration start can't be later than preregistration end`
      ),

    preregistrationTo: Yup.date()
      .typeError('Invalid Date')
      .when('preregistrationEnabled', {
        is: true,
        then: (schema) => schema.required('This field required'),
        otherwise: (schema) => schema.optional(),
      })
      .min(
        Yup.ref('preregistrationFrom'),
        `Preregistration end can't be earlier than preregistration start`
      )
      .max(
        Yup.ref('competitionFrom'),
        `Preregistration end can't be later than preregistration start`
      ),

    competitionFrom: Yup.date()
      .typeError('Invalid Date')
      .required('This field required')
      .max(
        Yup.ref('competitionTo'),
        `Competition start can't be later than competition end`
      )
      .when('preregistrationEnabled', {
        is: true,
        then: (schema) =>
          schema.min(
            Yup.ref('preregistrationTo'),
            `Competition start can't be earlier than competition end`
          ),
      }),

    competitionTo: Yup.date()
      .typeError('Invalid Date')
      .required('This field required')
      .min(
        Yup.ref('competitionFrom'),
        `Competition end can't be earlier than competition start`
      ),

    funding: Yup.number()
      .typeError('Invalid funding')
      .required('This field required')
      .min(0),

    participationFee: Yup.number()
      .typeError('Invalid participationFee')
      .when('preregistrationEnabled', {
        is: true,
        then: (schema) => schema.required('This field required').min(0),
        otherwise: (schema) => schema.optional(),
      }),

    policy: Yup.boolean().isTrue('Please indicate that you understood that'),
  });

  return (
    <GamePage
      gameConfig={arkanoidConfig}
      image={ArkanoidCoverSVG}
      mobileImage={ArkanoidCoverMobileSVG}
      defaultPage={'New Competition'}
    >
      <div className={'flex w-full flex-col gap-8'}>
        <div className={'w-full text-left text-headline-1'}>
          Create competition
        </div>

        <Formik
          initialValues={initialValues}
          onSubmit={(values) =>
            createCompetition(values).then(() => setIsSuccessModalOpen(true))
          }
          validationSchema={validateSchema}
        >
          {({ values, errors, touched, getFieldHelpers }) => (
            <Form>
              <div className={'grid grid-cols-3 gap-5'}>
                <div className={'flex w-full flex-col gap-4'}>
                  <div className={'text-[20px]/[20px] font-bold'}>
                    Description information
                  </div>
                  <div className={'w-full'}>
                    <Input
                      title={'Enter the name of the competition'}
                      name={'name'}
                      type={'text'}
                      placeholder={'Type competition name here...'}
                      required
                    />
                  </div>
                  <div className={'w-full'}>
                    <DropdownListField
                      name={'game'}
                      title={'Select the game'}
                      items={[arkanoidConfig.name]}
                      required
                    />
                  </div>
                  <div className={'h-full w-full'}>
                    <Textarea
                      title={'Enter the description of the competition'}
                      name={'description'}
                      placeholder={'Type description here...'}
                    />
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
                          Map seed Generation
                        </span>
                        <Button
                          label={'Randomize'}
                          onClick={() => {
                            if (!isRandomSeed) setIsRandomSeed(true);
                            const randomSeed = generateNewWord();
                            getFieldHelpers('seed').setValue(randomSeed);
                            setSeed(randomSeed);
                          }}
                        />
                      </div>
                      <div className={'flex w-[260px] flex-col gap-2'}>
                        <span
                          className={
                            'font-plexsans text-main font-medium uppercase text-left-accent'
                          }
                        >
                          Map seed*
                        </span>
                        <Input
                          name={'seed'}
                          type={'text'}
                          placeholder={'Type seed here...'}
                          onChange={() => setSeed(values.seed)}
                          isClearable={false}
                        />
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
                      <Popover>
                        <div
                          className={
                            'flex min-w-[250px] flex-col items-center justify-center gap-2 font-plexsans'
                          }
                        >
                          <span
                            className={'w-full self-start text-[14px]/[14px]'}
                          >
                            Preregistration
                          </span>
                          <div
                            className={
                              'w-full text-[12px]/[12px] font-light opacity-70'
                            }
                          >
                            Preregistration allows to enable dates when users
                            need to pre-register and pay the competition fee
                          </div>
                        </div>
                      </Popover>
                    </div>
                    <Checkbox name={'preregistrationEnabled'} />
                  </div>
                  {values.preregistrationEnabled && (
                    <div className={'flex w-full flex-col gap-2'}>
                      <span
                        className={
                          'font-plexsans text-main font-medium uppercase text-left-accent'
                        }
                      >
                        Preregiatration dates*
                      </span>
                      <div className={'flex w-full flex-col'}>
                        <DatePicker
                          isOpen={isPreregistrationPickerOpen}
                          setIsOpen={
                            !isCompetitionPickerOpen
                              ? setIsPreregistrationPickerOpen
                              : (value) => {
                                  setIsCompetitionPickerOpen(false);
                                  setIsPreregistrationPickerOpen(value);
                                }
                          }
                          setDateTo={
                            getFieldHelpers('preregistrationTo').setValue
                          }
                          setDateFrom={
                            getFieldHelpers('preregistrationFrom').setValue
                          }
                          trigger={
                            <div
                              className={
                                'flex w-full flex-row justify-between gap-8'
                              }
                            >
                              <div className={'flex w-full flex-col'}>
                                <span className={'text-start'}>From</span>
                                <Input
                                  name={'preregistrationFrom'}
                                  type={'text'}
                                  placeholder={'MM/DD/YYYY'}
                                  readOnly={true}
                                  endContent={
                                    <svg
                                      width="18"
                                      height="20"
                                      viewBox="0 0 18 20"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M16 18H2V7H16M13 0V2H5V0H3V2H2C0.89 2 0 2.89 0 4V18C0 18.5304 0.210714 19.0391 0.585786 19.4142C0.960859 19.7893 1.46957 20 2 20H16C16.5304 20 17.0391 19.7893 17.4142 19.4142C17.7893 19.0391 18 18.5304 18 18V4C18 3.46957 17.7893 2.96086 17.4142 2.58579C17.0391 2.21071 16.5304 2 16 2H15V0M14 11H9V16H14V11Z"
                                        fill="#F9F8F4"
                                        className={
                                          'group-hover:fill-[#D2FF00] group-data-[error=true]:fill-[#FF0000] group-data-[error=true]:group-hover:fill-[#FF00009C]'
                                        }
                                      />
                                    </svg>
                                  }
                                />
                              </div>
                              <div className={'flex w-full flex-col'}>
                                <span className={'text-start'}>To</span>
                                <Input
                                  name={'preregistrationTo'}
                                  type={'text'}
                                  placeholder={'MM/DD/YYYY'}
                                  readOnly={true}
                                  endContent={
                                    <svg
                                      width="18"
                                      height="20"
                                      viewBox="0 0 18 20"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M16 18H2V7H16M13 0V2H5V0H3V2H2C0.89 2 0 2.89 0 4V18C0 18.5304 0.210714 19.0391 0.585786 19.4142C0.960859 19.7893 1.46957 20 2 20H16C16.5304 20 17.0391 19.7893 17.4142 19.4142C17.7893 19.0391 18 18.5304 18 18V4C18 3.46957 17.7893 2.96086 17.4142 2.58579C17.0391 2.21071 16.5304 2 16 2H15V0M14 11H9V16H14V11Z"
                                        fill="#F9F8F4"
                                        className={
                                          'group-hover:fill-[#D2FF00] group-data-[error=true]:fill-[#FF0000] group-data-[error=true]:group-hover:fill-[#FF00009C]'
                                        }
                                      />
                                    </svg>
                                  }
                                />
                              </div>
                            </div>
                          }
                        />
                      </div>
                    </div>
                  )}
                  <div className={'flex w-full flex-col gap-2'}>
                    <span
                      className={
                        'font-plexsans text-main font-medium uppercase text-left-accent'
                      }
                    >
                      Competitions date*
                    </span>
                    <div className={'flex w-full flex-col'}>
                      <DatePicker
                        isOpen={isCompetitionPickerOpen}
                        setIsOpen={
                          !isPreregistrationPickerOpen
                            ? setIsCompetitionPickerOpen
                            : (value) => {
                                setIsPreregistrationPickerOpen(false);
                                setIsCompetitionPickerOpen(value);
                              }
                        }
                        setDateTo={getFieldHelpers('competitionTo').setValue}
                        setDateFrom={
                          getFieldHelpers('competitionFrom').setValue
                        }
                        trigger={
                          <div
                            className={
                              'flex w-full flex-row justify-between gap-8'
                            }
                          >
                            <div className={'flex w-full flex-col'}>
                              <span className={'text-start'}>From</span>
                              <Input
                                name={'competitionFrom'}
                                type={'text'}
                                placeholder={'MM/DD/YYYY'}
                                readOnly={true}
                                endContent={
                                  <svg
                                    width="18"
                                    height="20"
                                    viewBox="0 0 18 20"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M16 18H2V7H16M13 0V2H5V0H3V2H2C0.89 2 0 2.89 0 4V18C0 18.5304 0.210714 19.0391 0.585786 19.4142C0.960859 19.7893 1.46957 20 2 20H16C16.5304 20 17.0391 19.7893 17.4142 19.4142C17.7893 19.0391 18 18.5304 18 18V4C18 3.46957 17.7893 2.96086 17.4142 2.58579C17.0391 2.21071 16.5304 2 16 2H15V0M14 11H9V16H14V11Z"
                                      fill="#F9F8F4"
                                      className={
                                        'group-hover:fill-[#D2FF00] group-data-[error=true]:fill-[#FF0000] group-data-[error=true]:group-hover:fill-[#FF00009C]'
                                      }
                                    />
                                  </svg>
                                }
                              />
                            </div>
                            <div className={'flex w-full flex-col'}>
                              <span className={'text-start'}>To</span>
                              <Input
                                name={'competitionTo'}
                                type={'text'}
                                placeholder={'MM/DD/YYYY'}
                                readOnly={true}
                                endContent={
                                  <svg
                                    width="18"
                                    height="20"
                                    viewBox="0 0 18 20"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M16 18H2V7H16M13 0V2H5V0H3V2H2C0.89 2 0 2.89 0 4V18C0 18.5304 0.210714 19.0391 0.585786 19.4142C0.960859 19.7893 1.46957 20 2 20H16C16.5304 20 17.0391 19.7893 17.4142 19.4142C17.7893 19.0391 18 18.5304 18 18V4C18 3.46957 17.7893 2.96086 17.4142 2.58579C17.0391 2.21071 16.5304 2 16 2H15V0M14 11H9V16H14V11Z"
                                      fill="#F9F8F4"
                                      className={
                                        'group-hover:fill-[#D2FF00] group-data-[error=true]:fill-[#FF0000] group-data-[error=true]:group-hover:fill-[#FF00009C]'
                                      }
                                    />
                                  </svg>
                                }
                              />
                            </div>
                          </div>
                        }
                      />
                    </div>
                  </div>
                  <div className={'flex w-full flex-col gap-1'}>
                    <div className={'flex w-full flex-row gap-4'}>
                      {values.preregistrationEnabled && (
                        <div className={'w-full'}>
                          <Input
                            name={'participationFee'}
                            type={'text'}
                            title={'Participant fee'}
                            placeholder={'Type participant fee here...'}
                            endContent={
                              <div
                                className={
                                  'flex h-[28px] w-[28px] items-center justify-center rounded-full'
                                }
                              >
                                <ReactImage
                                  src={znakesImg}
                                  alt={'Znakes Tokens'}
                                />
                              </div>
                            }
                            required={values.preregistrationEnabled}
                          />
                        </div>
                      )}
                      <div className={'w-full'}>
                        <Input
                          name={'funding'}
                          type={'text'}
                          title={'Funds'}
                          placeholder={'Type funds here...'}
                          endContent={
                            <div
                              className={
                                'flex h-[28px] w-[28px] items-center justify-center rounded-full'
                              }
                            >
                              <ReactImage
                                src={znakesImg}
                                alt={'Znakes Tokens'}
                              />
                            </div>
                          }
                          required
                        />
                      </div>
                    </div>
                    <div className={'flex w-full flex-col gap-2'}>
                      <div
                        className={'flex gap-2 font-plexsans text-left-accent'}
                      >
                        <span>Balance:</span>
                        <span>
                          {(
                            Number(
                              protokitBalances.balances[
                                networkStore.address!
                              ] ?? 0n
                            ) /
                            10 ** 9
                          ).toFixed(2)}
                        </span>
                        <span>{Currency.ZNAKES}</span>
                      </div>
                      <div
                        className={'flex flex-row items-center justify-between'}
                      >
                        <span
                          className={clsx(
                            'font-plexsans text-[12px]/[12px] font-normal',
                            {
                              'underline decoration-[#FF0000] underline-offset-4':
                                errors.policy && touched.policy,
                            }
                          )}
                        >
                          I understand that this amount will be deducted from my
                          account for hosting the competition.
                        </span>
                        <Checkbox name={'policy'} />
                      </div>
                      <AnimatePresence>
                        {errors.policy && touched.policy && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{
                              type: 'spring',
                              duration: 0.8,
                              bounce: 0,
                            }}
                            className={'flex w-full flex-row gap-2'}
                          >
                            <svg
                              width="18"
                              height="18"
                              viewBox="0 0 14 14"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <circle
                                cx="7"
                                cy="7"
                                r="6"
                                fill="#FF0000"
                                stroke="#FF0000"
                                strokeWidth="0.500035"
                              />
                              <path
                                d="M6.71858 8.69036L6.29858 5.10236V2.71436H7.71458V5.10236L7.31858 8.69036H6.71858ZM7.01858 11.2344C6.71458 11.2344 6.49058 11.1624 6.34658 11.0184C6.21058 10.8664 6.14258 10.6744 6.14258 10.4424V10.2384C6.14258 10.0064 6.21058 9.81836 6.34658 9.67436C6.49058 9.52236 6.71458 9.44636 7.01858 9.44636C7.32258 9.44636 7.54258 9.52236 7.67858 9.67436C7.82258 9.81836 7.89458 10.0064 7.89458 10.2384V10.4424C7.89458 10.6744 7.82258 10.8664 7.67858 11.0184C7.54258 11.1624 7.32258 11.2344 7.01858 11.2344Z"
                                fill="#F9F8F4"
                              />
                            </svg>
                            <span
                              className={
                                'font-plexsans text-[14px]/[14px] text-[#FF0000]'
                              }
                            >
                              {errors.policy}
                            </span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                      <Button label={'Create competition'} type={'submit'} />
                      <BaseModal
                        isOpen={isSuccessModalOpen}
                        setIsOpen={setIsSuccessModalOpen}
                        border="border-left-accent"
                      >
                        <div
                          className={
                            'flex flex-col items-center justify-center gap-8 px-4 py-6'
                          }
                        >
                          <svg
                            width="161"
                            height="161"
                            viewBox="0 0 161 161"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M80.442 160.884C124.869 160.884 160.884 124.869 160.884 80.442C160.884 36.0151 124.869 0 80.442 0C36.0151 0 0 36.0151 0 80.442C0 124.869 36.0151 160.884 80.442 160.884Z"
                              fill="#212121"
                            />
                            <path
                              d="M80.442 149.22C118.427 149.22 149.22 118.427 149.22 80.442C149.22 42.457 118.427 11.6641 80.442 11.6641C42.457 11.6641 11.6641 42.457 11.6641 80.442C11.6641 118.427 42.457 149.22 80.442 149.22Z"
                              stroke="#D2FF00"
                              strokeWidth="8"
                              strokeMiterlimit="10"
                            />
                            <path
                              d="M52.8568 92.7354C56.0407 92.7354 58.6218 82.6978 58.6218 70.3157C58.6218 57.9337 56.0407 47.8961 52.8568 47.8961C49.6729 47.8961 47.0918 57.9337 47.0918 70.3157C47.0918 82.6978 49.6729 92.7354 52.8568 92.7354Z"
                              fill="#D2FF00"
                            />
                            <path
                              d="M103.461 92.7354C106.645 92.7354 109.226 82.6978 109.226 70.3157C109.226 57.9337 106.645 47.8961 103.461 47.8961C100.277 47.8961 97.6963 57.9337 97.6963 70.3157C97.6963 82.6978 100.277 92.7354 103.461 92.7354Z"
                              fill="#D2FF00"
                            />
                            <path
                              d="M135.489 76.4906H118.194V82.7178H135.489V76.4906Z"
                              fill="#D2FF00"
                            />
                            <path
                              d="M38.7647 76.4906H21.4697V82.7178H38.7647V76.4906Z"
                              fill="#D2FF00"
                            />
                            <path
                              d="M108.616 109.029C104.26 111.673 94.0101 117.095 79.8623 117.285C65.4748 117.478 54.9435 112.155 50.5391 109.598"
                              stroke="#D2FF00"
                              strokeWidth="5"
                              strokeMiterlimit="10"
                            />
                          </svg>
                          <span className={'text-headline-1'}>
                            Successfully created!
                          </span>
                          <Button
                            asLink={true}
                            href={`/games/${arkanoidConfig.id}/competitions-list`}
                            label={'To competitions page'}
                          />
                        </div>
                      </BaseModal>
                    </div>
                  </div>
                </div>
                <div
                  className={
                    'flex h-full w-full items-center justify-center rounded-[5px]'
                  }
                >
                  <canvas
                    className="m-5 aspect-square w-full flex-grow border border-left-accent"
                    ref={canvas}
                  />
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </GamePage>
  );
}
