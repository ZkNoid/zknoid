import Image from 'next/image';
import { DateTime } from 'luxon';
import { useRoundTimer } from '../../features/useRoundTimer';
import { cn } from '@/lib/helpers';
import znakesImg from '@/public/image/tokens/znakes.svg';
import { Currency } from '@/constants/currency';
import { useEffect, useState } from 'react';
import { useWorkerClientStore } from '@/lib/stores/workerClient';
import { TICKET_PRICE } from 'l1-lottery-contracts';
import { formatUnits } from '@/lib/unit';
import Rules from './ui/Rules';
import BannerButton from './ui/BannerButton';
import Skeleton from '@/components/shared/Skeleton';

export default function BannerSection({
  roundEndsIn,
}: {
  roundId: number;
  roundEndsIn: DateTime;
}) {
  const roundTimer = useRoundTimer(roundEndsIn);
  const lotteryStore = useWorkerClientStore();
  const [roundToShow, setRoundToShow] = useState(0);
  const [roundInfo, setRoundInfo] = useState<
    | {
        id: number;
        bank: bigint;
        tickets: {
          amount: bigint;
          numbers: number[];
          owner: string;
        }[];
        winningCombination: number[] | undefined;
      }
    | undefined
  >(undefined);

  useEffect(() => {
    if (!lotteryStore.stateM) return;
    (async () => {
      const roundInfos = await lotteryStore.getRoundsInfo([roundToShow]);
      console.log('Fetched round infos', roundInfos);
      setRoundInfo(roundInfos[roundToShow]);
    })();
  }, [roundToShow, lotteryStore.offchainStateUpdateBlock]);

  useEffect(() => {
    setRoundToShow(lotteryStore.lotteryRoundId);
  }, [lotteryStore.lotteryRoundId]);

  const ticketsNum = roundInfo?.tickets
    .map((x) => x.amount)
    .reduce((x, y) => x + y, 0n);

  return (
    <div
      className={cn(
        'relative mb-[2.67vw] h-[28.8vw] items-center justify-center rounded-[0.67vw] border border-left-accent',
        {
          "bg-[url('/image/games/lottery/TopBanner-1.svg')] bg-cover bg-center bg-no-repeat":
            roundToShow == lotteryStore.lotteryRoundId,
          "bg-[url('/image/games/lottery/TopBanner-2.svg')] bg-cover bg-center bg-no-repeat":
            roundToShow != lotteryStore.lotteryRoundId,
        }
      )}
    >
      <div className="absolute m-[2vw] flex h-[3.13vw] gap-[0.33vw]">
        <BannerButton
          onClick={() => setRoundToShow(roundToShow - 1)}
          disabled={roundToShow < 1}
          className="flex w-[3.13vw] items-center justify-center border-left-accent bg-bg-grey text-left-accent"
        >
          <svg
            width="1.042vw"
            height="1.823vw"
            viewBox="0 0 20 35"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="mx-auto my-auto block w-[1vw]"
          >
            <path d="M18 2L3 17.5L18 33" stroke="#D2FF00" strokeWidth="3" />
          </svg>
        </BannerButton>
        <BannerButton
          onClick={() => setRoundToShow(roundToShow + 1)}
          disabled={roundToShow >= lotteryStore.lotteryRoundId}
          className="flex w-[3.13vw] items-center justify-center border-left-accent bg-bg-grey text-left-accent"
        >
          <svg
            width="1.042vw"
            height="1.823vw"
            viewBox="0 0 20 35"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="mx-auto my-auto block w-[1vw] rotate-180"
          >
            <path d="M18 2L3 17.5L18 33" stroke="#D2FF00" strokeWidth="3" />
          </svg>
        </BannerButton>
      </div>
      {roundToShow != lotteryStore.lotteryRoundId && (
        <div
          className={
            'absolute left-0 top-0 ml-[5.573vw] mt-[8vw] flex w-[18vw] flex-col gap-[0.781vw] rounded-[0.521vw] bg-bg-dark p-[0.469vw]'
          }
        >
          <div className={'flex flex-col gap-[0.677vw]'}>
            <span
              className={'font-museo text-[1.25vw] font-bold text-left-accent'}
            >
              Win combination
            </span>
            <div className={'flex flex-row gap-[0.26vw]'}>
              {roundInfo?.winningCombination
                ? roundInfo.winningCombination.map((item, index) => (
                    <div
                      key={index}
                      className={
                        'flex h-[2.083vw] w-[2.083vw] items-center justify-center rounded-[0.26vw] bg-left-accent font-museo text-[1.667vw] font-bold text-bg-dark'
                      }
                    >
                      {item}
                    </div>
                  ))
                : [...Array(6)].map((_, index) => (
                    <div
                      key={index}
                      className={
                        'flex h-[2.083vw] w-[2.083vw] items-center justify-center rounded-[0.26vw] bg-left-accent font-museo text-[1.667vw] font-bold text-bg-dark'
                      }
                    >
                      _
                    </div>
                  ))}
            </div>
          </div>
          <div className={'flex flex-col gap-[0.677vw]'}>
            <span
              className={'font-museo text-[1.979vw] font-bold text-left-accent'}
            >
              Bank
            </span>
            <div className={'flex flex-row items-center gap-[0.521vw]'}>
              <Image
                src={znakesImg}
                alt={'Znakes token'}
                className={'h-[1.563vw] w-[1.563vw]'}
              />
              <Skeleton
                isLoading={!ticketsNum}
                className={'h-[1.25vw] w-[30%] rounded-[0.33vw]'}
              >
                <span
                  className={
                    'font-museo text-[1.25vw] font-bold text-foreground'
                  }
                >
                  {formatUnits((ticketsNum || 0n) * TICKET_PRICE.toBigInt())}{' '}
                  {Currency.ZNAKES}
                </span>
              </Skeleton>
            </div>
          </div>
          <div className={'flex flex-col gap-[0.677vw]'}>
            <span
              className={'font-museo text-[1.979vw] font-bold text-left-accent'}
            >
              Tickets
            </span>
            <div className={'flex flex-row items-center gap-[0.521vw]'}>
              <svg
                width="30"
                height="17"
                viewBox="0 0 30 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={'h-[1.563vw] w-[1.563vw]'}
              >
                <path
                  d="M29.9985 0.00246533L24.5558 0L24.5568 1.60693L23.2961 1.60496L23.2995 0.00345153L0.00147949 0.00246533L0 4.49921C2.12581 5.18479 3.34999 6.69505 3.34999 8.30297C3.34999 9.91089 2.12679 11.4202 0.000986945 12.1057L0.000985464 16.604H23.2911L23.2961 15.001L24.5587 15.001L24.5637 16.604H29.999L29.999 12.1057C27.8732 11.4202 26.65 9.91089 26.65 8.30297C26.65 6.69505 27.8742 5.18479 30 4.49921L29.9985 0.00246533ZM24.5637 3.83927L24.5587 7.18828L23.2961 7.18828L23.301 3.83927L24.5637 3.83927ZM21.2048 2.09818V14.5078L5.44621 14.5127L5.44423 2.09128L20.5784 2.09325L21.2048 2.09818ZM19.952 3.35098L6.699 3.34605V13.2599L19.952 13.255V3.35098ZM24.5587 9.41766L24.5637 12.7667L23.301 12.7667L23.2961 9.41766L24.5587 9.41766Z"
                  fill="#D2FF00"
                />
              </svg>
              <Skeleton
                isLoading={!ticketsNum}
                className={'h-[1.25vw] w-[20%] rounded-[0.33vw]'}
              >
                <span
                  className={
                    'font-museo text-[1.25vw] font-bold text-foreground'
                  }
                >
                  {ticketsNum}
                </span>
              </Skeleton>
            </div>
          </div>
        </div>
      )}
      <div className="absolute bottom-0 left-0 right-0 top-0 mx-auto h-full w-[25.13vw]">
        <div
          className={cn(
            'flex w-[25.13vw] flex-col items-center justify-center',
            {
              'mt-[3vw]': roundToShow == lotteryStore.lotteryRoundId,
              'mt-[2vw]': roundToShow != lotteryStore.lotteryRoundId,
            }
          )}
        >
          <div
            className={cn(
              'w-full font-museo text-[2.5vw] font-bold uppercase',
              {
                'text-[2.3vw]': roundToShow >= 10,
                'text-center': roundToShow == lotteryStore.lotteryRoundId,
                'text-left leading-[1]':
                  roundToShow != lotteryStore.lotteryRoundId,
              }
            )}
          >
            {roundToShow != lotteryStore.lotteryRoundId && 'Finished'} Lottery
            Round {roundToShow}
          </div>
          <div className="flex flex-row gap-[1.07vw]">
            <div className="h-[7.67vw] w-[7.67vw] items-center justify-center rounded-[0.67vw] bg-white text-center font-museo text-[5vw] font-bold text-bg-dark">
              {roundToShow == lotteryStore.lotteryRoundId
                ? roundTimer.startsIn.hours || 0
                : '00'}
            </div>
            <div className="h-[7.67vw] w-[7.67vw] items-center justify-center rounded-[0.67vw] bg-white text-center font-museo text-[5vw] font-bold text-bg-dark">
              {roundToShow == lotteryStore.lotteryRoundId
                ? roundTimer.startsIn.minutes || 0
                : '00'}
            </div>
            <div className="h-[7.67vw] w-[7.67vw] items-center justify-center rounded-[0.67vw] bg-white text-center font-museo text-[5vw] font-bold text-bg-dark">
              {roundToShow == lotteryStore.lotteryRoundId
                ? Math.trunc(roundTimer.startsIn.seconds! || 0)
                : '00'}
            </div>
          </div>
          <button
            className={cn(
              'mt-[2.8vw] flex w-full cursor-pointer items-center justify-center rounded-[0.67vw] border-bg-dark px-[1vw] font-museo text-[1.6vw] font-bold uppercase text-bg-dark hover:opacity-80',
              {
                'bg-right-accent': roundToShow == lotteryStore.lotteryRoundId,
                'bg-left-accent': roundToShow != lotteryStore.lotteryRoundId,
              }
            )}
            onClick={() => {
              const element = document.getElementById(
                roundToShow != lotteryStore.lotteryRoundId
                  ? 'previousLotteries'
                  : 'ticketsToBuy'
              );
              if (element) {
                const offset = element.offsetTop + element.offsetHeight;
                window.scrollTo({ top: offset, left: 0, behavior: 'smooth' });
              }
            }}
          >
            {roundToShow != lotteryStore.lotteryRoundId
              ? 'Claim rewards'
              : 'Buy Tickets'}
          </button>
        </div>
      </div>
      {roundToShow != lotteryStore.lotteryRoundId && (
        <BannerButton
          onClick={() => setRoundToShow(lotteryStore.lotteryRoundId)}
          disabled={roundToShow == lotteryStore.lotteryRoundId}
          className="absolute right-0 z-[1] m-[2vw] flex h-[3.13vw] items-center justify-center gap-[0.33vw] border-right-accent px-[1vw] text-[1.6vw] text-right-accent"
        >
          To Ongoing round
        </BannerButton>
      )}

      {roundToShow == lotteryStore.lotteryRoundId && (
        <div
          className={
            'absolute bottom-0 right-0 ml-[4vw] mr-[6vw]  flex h-full w-[20vw] flex-col gap-[1vw] pt-[8vw] font-museo font-bold'
          }
        >
          <div
            className={
              'gap flex w-full flex-col rounded-[0.67vw] border border-left-accent bg-[#252525] p-[0.5vw]'
            }
          >
            <span className={'text-[2.53vw] uppercase text-left-accent '}>
              Bank
            </span>
            <div className={'flex flex-row items-center gap-2 text-[1.6vw]'}>
              <Image
                src={znakesImg}
                alt={'znakes'}
                className={'mb-1 h-[30px] w-[30px]'}
              />
              <span>
                {formatUnits((ticketsNum || 0n) * TICKET_PRICE.toBigInt())}
              </span>
              <span>{Currency.ZNAKES}</span>
            </div>
          </div>
          <div
            className={
              'gap flex w-full flex-col rounded-[0.67vw] border border-left-accent bg-[#252525] p-[0.5vw]'
            }
          >
            <span className={'text-[2.53vw] uppercase text-left-accent '}>
              Tickets
            </span>
            <div className={'flex flex-row items-center gap-2 text-[1.6vw]'}>
              <svg
                width="30"
                height="17"
                viewBox="0 0 30 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={'mb-1 h-[30px] w-[30px]'}
              >
                <path
                  d="M29.9985 0.00246533L24.5558 0L24.5568 1.60693L23.2961 1.60496L23.2995 0.00345153L0.00147949 0.00246533L0 4.49921C2.12581 5.18479 3.34999 6.69505 3.34999 8.30297C3.34999 9.91089 2.12679 11.4202 0.000986945 12.1057L0.000985464 16.604H23.2911L23.2961 15.001L24.5587 15.001L24.5637 16.604H29.999L29.999 12.1057C27.8732 11.4202 26.65 9.91089 26.65 8.30297C26.65 6.69505 27.8742 5.18479 30 4.49921L29.9985 0.00246533ZM24.5637 3.83927L24.5587 7.18828L23.2961 7.18828L23.301 3.83927L24.5637 3.83927ZM21.2048 2.09818V14.5078L5.44621 14.5127L5.44423 2.09128L20.5784 2.09325L21.2048 2.09818ZM19.952 3.35098L6.699 3.34605V13.2599L19.952 13.255V3.35098ZM24.5587 9.41766L24.5637 12.7667L23.301 12.7667L23.2961 9.41766L24.5587 9.41766Z"
                  fill="#D2FF00"
                />
              </svg>
              <span>{ticketsNum || 0}</span>
            </div>
          </div>
        </div>
      )}
      <Rules />
    </div>
  );
}
