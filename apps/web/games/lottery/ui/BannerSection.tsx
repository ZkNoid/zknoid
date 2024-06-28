import Image from 'next/image';
import { DateTime } from 'luxon';
import { useRoundTimer } from '../features/useRoundTimer';
import { cn } from '@/lib/helpers';
import { VioletLotteryButton } from './buttons/VioletLotteryButton';
import znakesImg from '@/public/image/tokens/znakes.svg';
import { Currency } from '@/constants/currency';
import { MouseEventHandler, ReactNode, useEffect, useState } from 'react';
import { useWorkerClientStore } from '@/lib/stores/workerClient';
import { TICKET_PRICE } from 'l1-lottery-contracts';
import { formatUnits } from '@/lib/unit';

function BannerButton({
  children,
  className,
  onClick = undefined,
  disabled = undefined,
}: {
  children: ReactNode;
  className: string;
  onClick?: MouseEventHandler<HTMLButtonElement> | undefined;
  disabled?: boolean | undefined;
}) {
  return (
    <button
      className={cn(
        'cursor-pointer rounded-[0.33vw] border hover:opacity-80 disabled:opacity-60',
        className
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

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
        winningCombination: number[];
      }
    | undefined
  >(undefined);

  useEffect(() => {
    if (!lotteryStore.offchainStateUpdateBlock) return;
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
    .reduce((x, y) => x + y);

  return (
    <div
      className={cn(
        'relative mb-[2.67vw] h-[28.8vw] items-center justify-center rounded-[0.67vw] border border-left-accent',
        "bg-[url('/image/games/lottery/TopBanner.svg')] bg-contain bg-center bg-no-repeat"
      )}
    >
      <div className="absolute m-[2vw] flex h-[3.13vw] gap-[0.33vw]">
        <BannerButton
          onClick={() => setRoundToShow(roundToShow - 1)}
          disabled={roundToShow < 1}
          className="flex w-[3.13vw] items-center justify-center border-left-accent text-left-accent"
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
          className="flex w-[3.13vw] items-center justify-center border-left-accent text-left-accent"
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
      <div className="absolute bottom-0 left-0 right-0 top-0 mx-auto h-full w-[25.13vw]">
        <div className="ml-[2.1vw] mt-[3vw] flex w-[25.13vw] flex-col items-center justify-center">
          <div className="w-full text-center font-museo text-[2.5vw] font-bold uppercase">
            Lottery Round {roundToShow}
          </div>
          <div className="flex flex-row gap-[1.07vw]">
            <div className="h-[7.67vw] w-[7.67vw] items-center justify-center rounded-[0.67vw] bg-white text-center font-museo text-[5vw] font-bold text-bg-dark">
              {roundTimer.startsIn.hours || 0}
            </div>
            <div className="h-[7.67vw] w-[7.67vw] items-center justify-center rounded-[0.67vw] bg-white text-center font-museo text-[5vw] font-bold text-bg-dark">
              {roundTimer.startsIn.minutes || 0}
            </div>
            <div className="h-[7.67vw] w-[7.67vw] items-center justify-center rounded-[0.67vw] bg-white text-center font-museo text-[5vw] font-bold text-bg-dark">
              {Math.trunc(roundTimer.startsIn.seconds! || 0)}
            </div>
          </div>
          <VioletLotteryButton className="mt-[2.8vw] flex w-full items-center justify-center px-[1vw] font-museo text-[1.6vw] font-bold">
            BUY TICKETS
          </VioletLotteryButton>
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
            <span>{ticketsNum}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
