import Image from 'next/image';
import Previous from '../assets/Previous.svg';
import { useRoundTimer } from '../features/useRoundTimer';
import { cn } from '@/lib/helpers';
import { GreenLotteryButton } from './buttons/GreenLotteryButton';
import { VioletLotteryButton } from './buttons/VioletLotteryButton';
import znakesImg from '@/public/image/tokens/znakes.svg';
import { Currency } from '@/constants/currency';

export default function BannerSection({
  roundId,
  bank,
  tickets,
}: {
  roundId: number;
  bank: number;
  tickets: number;
}) {
  const roundTimer = useRoundTimer();
  return (
    <div
      className={cn(
        'relative mb-[2.67vw] h-[28.8vw] items-center justify-center rounded-[0.67vw] border border-left-accent',
        "bg-[url('/image/games/lottery/TopBanner.svg')] bg-contain bg-center bg-no-repeat"
      )}
    >
      <div className="absolute m-[2vw] flex h-[3.13vw] gap-[0.33vw]">
        <GreenLotteryButton className=" flex w-[3.13vw] items-center justify-center">
          <Image
            src={Previous}
            alt="Previous"
            className="mx-auto my-auto block w-[1vw]"
          />
        </GreenLotteryButton>
        <GreenLotteryButton className=" flex items-center justify-center px-[1vw] text-[1.6vw]">
          Previous round
        </GreenLotteryButton>
      </div>
      <div className="absolute bottom-0 left-0 right-0 top-0 mx-auto h-full w-[25.13vw]">
        <div className="ml-[2.1vw] mt-[3vw] flex w-[25.13vw] flex-col items-center justify-center text-[2.53vw]">
          <div className="">Lottery Round {roundId}</div>
          <div className="flex flex-row gap-[1.07vw]">
            <div className="h-[7.67vw] w-[7.67vw] items-center justify-center rounded-[0.67vw] bg-white text-center text-[6vw] text-bg-dark">
              {roundTimer.startsIn.hours}
            </div>
            <div className="h-[7.67vw] w-[7.67vw] items-center justify-center rounded-[0.67vw] bg-white text-center text-[6vw] text-bg-dark">
              {roundTimer.startsIn.minutes}
            </div>
            <div className="h-[7.67vw] w-[7.67vw] items-center justify-center rounded-[0.67vw] bg-white text-center text-[6vw] text-bg-dark">
              {Math.trunc(roundTimer.startsIn.seconds!)}
            </div>
          </div>
          <VioletLotteryButton className="mt-[2.67vw] flex items-center justify-center px-[1vw] text-[1.6vw]">
            BUY TICKETS
          </VioletLotteryButton>
        </div>
      </div>
      <div
        className={
          'absolute bottom-0 right-0 ml-[4vw] mr-[6vw]  flex h-full w-[20vw] flex-col gap-[1vw] pt-[4vw] font-museo font-bold'
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
            <span>{bank}</span>
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
            <span>{tickets}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
