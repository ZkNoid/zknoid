import Image from 'next/image';
import Previous from '../assets/Previous.svg';
import { useRoundTimer } from '../features/useRoundTimer';
import { cn } from '@/lib/helpers';
import { GreenLotteryButton } from './buttons/GreenLotteryButton';
import { VioletLotteryButton } from './buttons/VioletLotteryButton';
import { DateTime } from 'luxon';

export default function BannerSection({
  roundId,
  roundEndsIn,
}: {
  roundId: number;
  roundEndsIn: DateTime;
}) {
  const roundTimer = useRoundTimer(roundEndsIn);

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
              {roundTimer.startsIn.hours || 0}
            </div>
            <div className="h-[7.67vw] w-[7.67vw] items-center justify-center rounded-[0.67vw] bg-white text-center text-[6vw] text-bg-dark">
              {roundTimer.startsIn.minutes || 0}
            </div>
            <div className="h-[7.67vw] w-[7.67vw] items-center justify-center rounded-[0.67vw] bg-white text-center text-[6vw] text-bg-dark">
              {Math.trunc(roundTimer.startsIn.seconds || 0)}
            </div>
          </div>
          <VioletLotteryButton className="mt-[2.67vw] flex items-center justify-center px-[1vw] text-[1.6vw] ">
            BUY TICKETS
          </VioletLotteryButton>
        </div>
      </div>
    </div>
  );
}
