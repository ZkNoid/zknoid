import { cn } from '@/lib/helpers';
import TicketCard from './ui/TicketCard';
import BuyInfoCard from './ui/BuyInfoCard';
import { useEffect, useState } from 'react';
import GetMoreTicketsButton from './ui/GetMoreTicketsButton';
import OwnedTickets from './OwnedTickets';
import { useWorkerClientStore } from '@/lib/stores/workerClient';
import { AnimatePresence } from 'framer-motion';
import PreviousRounds from '@/games/lottery/ui/TicketsSection/PreviousRounds';
import Skeleton from '@/components/shared/Skeleton';

interface TicketInfo {
  amount: number;
  numbers: number[];
}

export default function TicketsSection({
  roundToShowId,
}: {
  roundToShowId: number;
}) {
  const ROUNDS_PER_PAGE = 2;
  const workerClientStore = useWorkerClientStore();
  const lotteryStore = useWorkerClientStore();

  const [page, setPage] = useState<number>(0);
  const [tickets, setTickets] = useState<TicketInfo[]>([]);
  const [roundInfos, setRoundInfos] = useState<
    | {
        id: number;
        bank: bigint;
        tickets: {
          amount: bigint;
          numbers: number[];
          owner: string;
          claimed: boolean;
          funds: bigint;
        }[];
        winningCombination: number[] | undefined;
      }[]
    | undefined
  >(undefined);

  useEffect(() => {
    if (!lotteryStore.stateM) return;

    const roundsToShow = Array.from(
      { length: ROUNDS_PER_PAGE },
      (_, i) => roundToShowId - i - page * ROUNDS_PER_PAGE
    ).filter((x) => x >= 0);

    (async () => {
      console.log('Tickets fetching');
      const roundInfos = await lotteryStore.getRoundsInfo(roundsToShow);
      console.log('Fetched round infos', roundInfos, Object.values(roundInfos));

      console.log('Round infos', Object.values(roundInfos));
      setRoundInfos(Object.values(roundInfos));
    })();
  }, [page, lotteryStore.stateM]);

  console.log('TICKETS:::', tickets); // DEBUG

  return (
    <div
      className={cn(
        'relative rounded-[0.67vw] border border-left-accent bg-bg-grey',
        'flex flex-col gap-[2.604vw] px-[2vw] py-[2.67vw]'
      )}
    >
      <div className="">
        <div
          className={cn('grid gap-[2vw]', {
            'grid-cols-2': roundToShowId == lotteryStore.lotteryRoundId,
            'grid-cols-1': roundToShowId != lotteryStore.lotteryRoundId,
          })}
        >
          <OwnedTickets roundId={roundToShowId} />
          {roundToShowId == lotteryStore.lotteryRoundId && (
            <div className={'flex flex-col'}>
              <div className="mb-[1.33vw] text-[2.13vw]">Buy tickets</div>
              <div className={'flex flex-row gap-[1.33vw]'}>
                <div className={'flex flex-col gap-0'}>
                  <AnimatePresence>
                    {[...tickets, null].map((_, index) => (
                      <TicketCard
                        key={index}
                        index={index}
                        ticketInfo={tickets?.[index] || undefined}
                        ticketsAmount={tickets.length}
                        addTicket={(ticket) => {
                          if (tickets.length == index) {
                            setTickets([...tickets, ticket]);
                          } else {
                            tickets[index] = ticket;
                          }
                        }}
                        removeTicketByIdx={(index: number) => {
                          setTickets(tickets.filter((_, i) => i != index));
                        }}
                      />
                    ))}
                  </AnimatePresence>
                </div>
                <div
                  className={'flex flex-col gap-[1.33vw]'}
                  id={'ticketsToBuy'}
                >
                  <BuyInfoCard
                    buttonActive={
                      workerClientStore.lotteryCompiled &&
                      tickets.length > 0 &&
                      tickets[0].amount != 0
                    }
                    ticketsInfo={tickets}
                    loaderActive={
                      workerClientStore.lotteryCompiled &&
                      workerClientStore.isActiveTx
                    }
                    onFinally={() => setTickets([])}
                  />
                  <GetMoreTicketsButton
                    disabled={tickets.length == 0}
                    onClick={() => {
                      setTickets([...tickets]);
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="">
        <div className="mb-[1.33vw] text-[2.13vw]">Previous Lotteries</div>
        <div
          className={'flex w-full flex-row gap-[1.042vw]'}
          id={'previousLotteries'}
        >
          {!!roundInfos ? (
            <PreviousRounds
              page={page}
              setPage={setPage}
              ROUNDS_PER_PAGE={ROUNDS_PER_PAGE}
              roundInfos={roundInfos}
              roundId={workerClientStore.lotteryRoundId}
            />
          ) : (
            <div className={'grid w-full grid-cols-2 gap-[1.042vw] p-4'}>
              <Skeleton
                isLoading={!roundInfos}
                className={'h-[15vw] w-full rounded-[0.67vw]'}
              >
                <div />
              </Skeleton>
              <Skeleton
                isLoading={!roundInfos}
                className={'h-[15vw] w-full rounded-[0.67vw]'}
              >
                <div />
              </Skeleton>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
