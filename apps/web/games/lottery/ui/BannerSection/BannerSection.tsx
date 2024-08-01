import { DateTime } from 'luxon';
import { cn } from '@/lib/helpers';
import { useEffect, useState } from 'react';
import { useWorkerClientStore } from '@/lib/stores/workerClient';
import Rules from './ui/Rules';
import BannerButton from './ui/BannerButton';
import CenterConsole from '@/games/lottery/ui/BannerSection/ui/CenterConsole';
import CurrentRoundInfo from '@/games/lottery/ui/BannerSection/ui/CurrentRoundInfo';
import PrevRoundInfo from '@/games/lottery/ui/BannerSection/ui/PrevRoundInfo';
import { Pages } from '../../Lottery';
import { api } from '@/trpc/react';
import { ILotteryRound } from '@/games/lottery/lib/types';
import { useRoundsStore } from '@/games/lottery/lib/roundsStore';

export default function BannerSection({
  roundEndsIn,
  setPage,
}: {
  roundEndsIn: DateTime;
  setPage: (page: Pages) => void;
}) {
  const lotteryStore = useWorkerClientStore();
  const [roundInfo, setRoundInfo] = useState<ILotteryRound | undefined>(
    undefined
  );
  const roundsStore = useRoundsStore();

  const getRoundQuery = api.lotteryBackend.getRoundInfo.useQuery(
    {
      roundId: roundsStore.roundToShowId,
    },
    {
      refetchInterval: 5000,
    }
  );

  useEffect(() => {
    if (!getRoundQuery.data) return undefined;
    setRoundInfo(getRoundQuery.data);
  }, [roundsStore.roundToShowId, getRoundQuery.data]);

  useEffect(() => {
    roundsStore.setRoundToShowId(lotteryStore.lotteryRoundId);
  }, [lotteryStore.lotteryRoundId]);

  const ticketsNum = roundInfo?.tickets
    .map((x) => x.amount)
    .reduce((x, y) => x + y, 0n);

  return (
    <div
      className={cn(
        'relative mb-[2.083vw] h-[17.969vw] items-center justify-center rounded-[0.67vw] border border-left-accent',
        {
          "bg-[url('/image/games/lottery/TopBanner-1.svg')] bg-contain bg-center bg-no-repeat":
            roundsStore.roundToShowId == lotteryStore.lotteryRoundId,
          "bg-[url('/image/games/lottery/TopBanner-2.svg')] bg-contain bg-center bg-no-repeat":
            roundsStore.roundToShowId != lotteryStore.lotteryRoundId,
        }
      )}
    >
      <div className="absolute m-[1vw] flex h-[3.13vw] gap-[0.33vw]">
        <BannerButton
          onClick={() =>
            roundsStore.setRoundToShowId(roundsStore.roundToShowId - 1)
          }
          disabled={roundsStore.roundToShowId < 1}
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
          onClick={() =>
            roundsStore.setRoundToShowId(roundsStore.roundToShowId + 1)
          }
          disabled={roundsStore.roundToShowId >= lotteryStore.lotteryRoundId}
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
      {roundsStore.roundToShowId != lotteryStore.lotteryRoundId && (
        <PrevRoundInfo
          ticketsNum={ticketsNum}
          winningCombination={roundInfo?.winningCombination}
        />
      )}

      <CenterConsole
        roundToShow={roundsStore.roundToShowId}
        roundEndsIn={roundEndsIn}
        roundInfo={roundInfo}
        setPage={setPage}
      />

      {roundsStore.roundToShowId != lotteryStore.lotteryRoundId && (
        <button
          onClick={() =>
            roundsStore.setRoundToShowId(lotteryStore.lotteryRoundId)
          }
          disabled={roundsStore.roundToShowId == lotteryStore.lotteryRoundId}
          className={
            'absolute right-[1vw] top-[1vw] flex cursor-pointer flex-row items-center justify-center gap-[0.26vw] hover:opacity-80 disabled:opacity-60'
          }
        >
          <div className="flex h-[2.448vw] items-center justify-center rounded-[0.33vw] border border-right-accent px-[1vw] text-center text-[1.25vw] text-right-accent">
            To Ongoing round
          </div>
          <div
            className={
              'flex h-[2.448vw] w-[2.448vw] items-center justify-center rounded-[0.33vw] border border-right-accent'
            }
          >
            <svg
              width="1.042vw"
              height="1.823vw"
              viewBox="0 0 20 35"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mx-auto my-auto block w-[1vw]"
            >
              <path d="M2 2L17 17.5L2 33" stroke="#DCB8FF" strokeWidth="3" />
            </svg>
          </div>
        </button>
      )}

      {roundsStore.roundToShowId == lotteryStore.lotteryRoundId && (
        <CurrentRoundInfo ticketsNum={ticketsNum} />
      )}

      <Rules />
    </div>
  );
}
