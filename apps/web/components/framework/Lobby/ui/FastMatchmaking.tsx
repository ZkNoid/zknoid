import Image from 'next/image';
import znakesImg from '@/public/image/tokens/znakes.svg';
import { Currency } from '@/constants/currency';
import Popover from '@/components/shared/Popover';
import { IMatchamkingOption, useLobbiesStore } from '@/lib/stores/lobbiesStore';
import { MatchmakingModal } from '@/components/framework/Lobby/ui/modals/MatchmakingModal';
import { useEffect, useState } from 'react';
import { useAlreadyInLobbyModalStore } from '@/lib/stores/alreadyInLobbyModalStore';
import { api } from '@/trpc/react';
import { getEnvContext } from '@/lib/envContext';
import { useNetworkStore } from '@/lib/stores/network';
import { MatchmakingFailModal } from './modals/MatchmakingFailModal';
import { useProtokitChainStore } from '@/lib/stores/protokitChain';
import { useMinaBridge } from '@/lib/stores/protokitBalances';
import { formatUnits } from '@/lib/unit';

const OpponentItem = ({
  option,
  winCoef,
  register,
  isModalOpen,
  setIsModalOpen,
  setPay,
  setReceive,
}: {
  option: IMatchamkingOption;
  winCoef: number;
  register: (id: number) => Promise<void>;
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  setPay: (pay: number) => void;
  setReceive: (receive: number) => void;
}) => {
  const networkStore = useNetworkStore();
  const matchmakingMutation = api.logging.logMatchmakingEntered.useMutation();
  const lobbiesStore = useLobbiesStore();
  const alreadyInLobbyModalStore = useAlreadyInLobbyModalStore();

  return (
    <div
      className={
        'group flex cursor-pointer flex-col justify-between rounded-[5px] border border-left-accent bg-left-accent p-2 hover:bg-[#464646]'
      }
      onClick={async () => {
        if (lobbiesStore.currentLobby) alreadyInLobbyModalStore.setIsOpen(true);
        else {
          try {
            await register(option.id);
          } catch (e) {
            console.log('Registration error', e);
            return;
          }
          matchmakingMutation.mutate({
            gameId: 'arkanoid',
            userAddress: networkStore.address ?? '',
            type: option.id,
            envContext: getEnvContext(),
          });

          setPay(option.pay);
          setReceive(option.pay * winCoef);
        }
      }}
    >
      <span
        className={
          'text-center text-[16px]/[16px] font-medium uppercase text-bg-dark group-hover:text-left-accent'
        }
      >
        Random opponent
      </span>
      <div
        className={
          'flex flex-row gap-2 pb-2 text-left-accent group-hover:text-bg-dark'
        }
      >
        <div
          className={
            'flex w-full flex-col gap-1 rounded-[5px] bg-bg-dark p-2 group-hover:bg-left-accent'
          }
        >
          <span
            className={'font-plexsans text-[16px]/[16px] font-medium uppercase'}
          >
            You pay
          </span>
          <span
            className={
              'flex flex-row items-center gap-2 font-plexsans text-[14px]/[14px]'
            }
          >
            <Image
              src={znakesImg}
              alt={'Znakes token'}
              width={25}
              height={25}
            />
            <span>{formatUnits(option.pay)}</span>
            <span>{Currency.ZNAKES}</span>
          </span>
        </div>
        <div
          className={
            'flex w-full flex-col gap-1 rounded-[5px] bg-bg-dark p-2 group-hover:bg-left-accent'
          }
        >
          <span
            className={'font-plexsans text-[16px]/[16px] font-medium uppercase'}
          >
            You max receive
          </span>
          <span
            className={
              'flex flex-row items-center gap-2 font-plexsans text-[14px]/[14px]'
            }
          >
            <Image
              src={znakesImg}
              alt={'Znakes token'}
              width={25}
              height={25}
            />
            <span>{formatUnits(option.pay * winCoef)}</span>
            <span>{Currency.ZNAKES}</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export const FastMatchmaking = ({
  options,
  winCoef,
  register,
  leave,
}: {
  options: IMatchamkingOption[];
  winCoef: number;
  register: (id: number) => Promise<void>;
  leave: (id: number) => Promise<void>;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFailModalOpen, setIsFailModalOpen] = useState(false);
  const [pay, setPay] = useState(0);
  const [receive, setReceive] = useState(0);
  const [matchmakingStartEpoche, setMatchmakingStartEpoche] =
    useState<number>(0);
  const [curType, setCurType] = useState<number>(0);
  const chainStore = useProtokitChainStore();
  const lobbiesStore = useLobbiesStore();

  const registerAndRecord = async (id: number) => {
    if (!chainStore.block?.height) return;
    await register(id);
    setMatchmakingStartEpoche(Math.floor(chainStore.block?.height / 20));
  };
  let bridge = useMinaBridge();

  useEffect(() => {
    if (!chainStore.block?.height) return;

    for (let mmOption of lobbiesStore.matchmakingOptions) {
      if (mmOption.isPending) setIsModalOpen(true);
    }

    if (isModalOpen && matchmakingStartEpoche > 0) {
      const curEpoche = Math.floor(chainStore.block?.height / 20);
      if (curEpoche > matchmakingStartEpoche) {
        setIsModalOpen(false);
        setIsFailModalOpen(true);
        setMatchmakingStartEpoche(0);
      }
    }
  }, [chainStore.block?.height]);

  return (
    <>
      <div className={'col-start-1 col-end-4 row-start-1 flex flex-row gap-1'}>
        <div className={'text-headline-1'}>Fast Matchmaking</div>
        <Popover>
          <div
            className={
              'flex min-w-[250px] flex-col items-center justify-center gap-2 font-plexsans'
            }
          >
            <span className={'w-full self-start text-[14px]/[14px]'}>
              Fast Matchmaking
            </span>
            <div className={'w-full text-[12px]/[12px] font-light opacity-70'}>
              If you want to play with your friend and not run into random
              players during the game, check the box. After creating a lobby,
              you can invite you friend to join
            </div>
          </div>
        </Popover>
      </div>
      <div
        className={
          'col-start-1 col-end-4 row-start-2 row-end-2 grid grid-cols-3 gap-4'
        }
      >
        {options.map((option) => (
          <OpponentItem
            key={option.id}
            option={option}
            winCoef={winCoef}
            register={async (id: number) => {
              if (await bridge(BigInt(option.pay)))
                throw Error('Not enough funds');

              await registerAndRecord(id);
              setCurType(id);
            }}
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            setPay={setPay}
            setReceive={setReceive}
          />
        ))}
        <div
          className={
            'flex flex-col gap-2 rounded-[5px] border border-foreground bg-[#252525] p-2 opacity-50'
          }
        >
          <div className={'flex flex-row items-center justify-center gap-1'}>
            <span
              className={
                'text-center text-[16px]/[16px] font-medium uppercase text-left-accent'
              }
            >
              Match against platform
            </span>
            <Popover
              trigger={
                <svg
                  width="21"
                  height="21"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className={'pb-1 hover:opacity-80'}
                >
                  <g opacity="1">
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
                  Match against platform
                </span>
                <div
                  className={'w-full text-[12px]/[12px] font-light opacity-70'}
                >
                  Playing against a platform, not a live opponent
                </div>
              </div>
            </Popover>
          </div>
          <span
            className={
              'flex flex-row items-center gap-1 font-plexsans text-[14px]/[14px]'
            }
          >
            <span className={'pr-1 uppercase text-left-accent'}>You pay</span>
            <Image
              src={znakesImg}
              alt={'Znakes token'}
              width={25}
              height={25}
            />
            <span>1.00</span>
            <span>{Currency.ZNAKES}</span>
          </span>
          <span
            className={
              'flex flex-row items-center gap-1 font-plexsans text-[14px]/[14px]'
            }
          >
            <span className={'pr-1 uppercase text-left-accent'}>
              You max receive
            </span>
            <Image
              src={znakesImg}
              alt={'Znakes token'}
              width={25}
              height={25}
            />
            <span>1.99</span>
            <span>{Currency.ZNAKES}</span>
          </span>
          <span
            className={
              'flex flex-row items-center gap-1 font-plexsans text-[14px]/[14px]'
            }
          >
            <span className={'pr-1 uppercase text-left-accent'}>
              Average playing time
            </span>
            <svg
              width="25"
              height="25"
              viewBox="0 0 25 25"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12.5 22.5C15.1522 22.5 17.6957 21.4464 19.5711 19.5711C21.4464 17.6957 22.5 15.1522 22.5 12.5C22.5 9.84784 21.4464 7.3043 19.5711 5.42893C17.6957 3.55357 15.1522 2.5 12.5 2.5C9.84784 2.5 7.3043 3.55357 5.42893 5.42893C3.55357 7.3043 2.5 9.84784 2.5 12.5C2.5 15.1522 3.55357 17.6957 5.42893 19.5711C7.3043 21.4464 9.84784 22.5 12.5 22.5ZM12.5 0C14.1415 0 15.767 0.323322 17.2835 0.951506C18.8001 1.57969 20.1781 2.50043 21.3388 3.66117C22.4996 4.8219 23.4203 6.19989 24.0485 7.71646C24.6767 9.23303 25 10.8585 25 12.5C25 15.8152 23.683 18.9946 21.3388 21.3388C18.9946 23.683 15.8152 25 12.5 25C5.5875 25 0 19.375 0 12.5C0 9.18479 1.31696 6.00537 3.66117 3.66117C6.00537 1.31696 9.18479 0 12.5 0ZM13.125 6.25V12.8125L18.75 16.15L17.8125 17.6875L11.25 13.75V6.25H13.125Z"
                fill="#F9F8F4"
              />
            </svg>
            <span>3</span>
            <span>minutes</span>
          </span>
        </div>
        <MatchmakingModal
          isOpen={isModalOpen}
          setIsOpen={setIsModalOpen}
          pay={pay}
          receive={receive}
          blockNumber={chainStore.block?.height || 0}
          leave={async () => {
            await leave(curType);
          }}
        />
        <MatchmakingFailModal
          isOpen={isFailModalOpen}
          setIsOpen={setIsFailModalOpen}
          restart={async () => {
            await registerAndRecord(curType);
            setIsFailModalOpen(false);
          }}
        />
      </div>
    </>
  );
};
