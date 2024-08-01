import PreviousRoundItem from './ui/PreviousRoundItem';
import { BLOCK_PER_ROUND } from 'l1-lottery-contracts';
import { useWorkerClientStore } from '@/lib/stores/workerClient';
import { useChainStore } from '@/lib/stores/minaChain';
import { useEffect, useState } from 'react';
import { ILotteryRound } from '@/games/lottery/lib/types';
import { api } from '@/trpc/react';
import Skeleton from '@/components/shared/Skeleton';

export default function PreviousRounds() {
  const ROUNDS_PER_PAGE = 2;

  const workerClientStore = useWorkerClientStore();
  const lotteryStore = useWorkerClientStore();
  const chainStore = useChainStore();

  const [page, setPage] = useState<number>(0);
  const [roundInfos, setRoundInfos] = useState<ILotteryRound[] | undefined>(
    undefined
  );

  const roundsToShow = Array.from(
    { length: ROUNDS_PER_PAGE },
    (_, i) => workerClientStore.lotteryRoundId - i - page * ROUNDS_PER_PAGE
  ).filter((x) => x >= 0);

  const getRoundQuery = api.lotteryBackend.getRoundInfos.useQuery(
    {
      roundIds: roundsToShow,
    },
    {
      refetchInterval: 5000,
    }
  );

  useEffect(() => {
    if (!getRoundQuery.data || !chainStore.block?.slotSinceGenesis) return;

    const roundInfos = getRoundQuery.data!;
    setRoundInfos(Object.values(roundInfos));
  }, [getRoundQuery.data, chainStore.block?.slotSinceGenesis]);

  return (
    <div className="">
      <div className="mb-[1.33vw] text-[2.13vw]">Previous Lotteries</div>
      <div
        className={'flex w-full flex-row gap-[1.042vw]'}
        id={'previousLotteries'}
      >
        {roundInfos !== undefined ? (
          <div className={'flex w-full flex-row gap-[1.042vw]'}>
            <button
              className={
                'flex h-[4vw] w-[4vw] items-center justify-center rounded-[0.521vw] border border-left-accent hover:opacity-80 disabled:opacity-60'
              }
              onClick={() => setPage(page + 1)}
              disabled={
                page + 1 > workerClientStore.lotteryRoundId / ROUNDS_PER_PAGE
              }
            >
              <svg
                width="1.458vw"
                height="2.552vw"
                viewBox="0 0 28 49"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M26 46L4 24L26 2" stroke="#D2FF00" strokeWidth="5" />
              </svg>
            </button>
            <div className={'grid w-full grid-cols-2 gap-[1.042vw]'}>
              {chainStore.block &&
                lotteryStore.onchainStateInitialized &&
                roundInfos.map((round, index) => (
                  <PreviousRoundItem
                    key={index}
                    round={round}
                    roundDates={{
                      start: new Date(
                        Date.now() -
                          (Number(
                            chainStore.block?.slotSinceGenesis! -
                              lotteryStore.onchainState?.startBlock!
                          ) -
                            round.id * BLOCK_PER_ROUND) *
                            3 *
                            60 *
                            1000
                      ),
                      end: new Date(
                        Date.now() -
                          (Number(
                            chainStore.block?.slotSinceGenesis! -
                              lotteryStore.onchainState?.startBlock!
                          ) -
                            (round.id + 1) * BLOCK_PER_ROUND) *
                            3 *
                            60 *
                            1000
                      ),
                    }}
                  />
                ))}
            </div>
            <button
              className={
                'flex h-[4vw] w-[4vw] items-center justify-center rounded-[0.521vw] border border-left-accent hover:opacity-80 disabled:opacity-60'
              }
              onClick={() => setPage(page - 1)}
              disabled={page - 1 < 0}
            >
              <svg
                width="1.458vw"
                height="2.552vw"
                viewBox="0 0 28 49"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1.94922 2.68262L23.9492 24.6826L1.94922 46.6826"
                  stroke="#D2FF00"
                  strokeWidth="5"
                />
              </svg>
            </button>
          </div>
        ) : (
          <div className={'grid w-full grid-cols-2 gap-[1.042vw] p-4'}>
            <Skeleton
              isLoading={true}
              className={'h-[15vw] w-full rounded-[0.67vw]'}
            >
              <div />
            </Skeleton>
            <Skeleton
              isLoading={true}
              className={'h-[15vw] w-full rounded-[0.67vw]'}
            >
              <div />
            </Skeleton>
          </div>
        )}
      </div>
    </div>
  );
}
