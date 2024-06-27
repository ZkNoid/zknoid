import { cn } from '@/lib/helpers';
import TicketCard from './ui/TicketCard';
import BuyInfoCard from './ui/BuyInfoCard';
import { useState } from 'react';
import GetMoreTicketsButton from './ui/GetMoreTicketsButton';
import OwnedTickets from './OwnedTickets';
import PreviousRound from './PreviousRound';
import { useLotteryStore } from '@/lib/stores/lotteryStore';
import { useWorkerClientStore } from '@/lib/stores/workerClient';
import { BLOCK_PER_ROUND } from 'l1-lottery-contracts/build/src/constants';
import { useChainStore } from '@/lib/stores/minaChain';
import { AnimatePresence } from 'framer-motion';

interface TicketInfo {
  amount: number;
  numbers: number[];
}

export default function TicketsSection() {
  const ROUNDS_LIMIT = 2;
  const lotteryStore = useLotteryStore();
  const workerClientStore = useWorkerClientStore();
  const chainStore = useChainStore();
  const previousRounds = lotteryStore.getPreviousRounds();

  const [page, setPage] = useState<number>(1);
  const pagesAmount = Math.ceil(previousRounds.length / ROUNDS_LIMIT);
  const emptyTicket: TicketInfo = { numbers: [0, 0, 0, 0, 0, 0], amount: 0 };
  const [tickets, _setTickets] = useState<TicketInfo[]>([emptyTicket]);

  const renderRounds = previousRounds.slice(
    (page - 1) * ROUNDS_LIMIT,
    page * ROUNDS_LIMIT
  );

  const roundId = workerClientStore.lotteryState
    ? Math.floor(
        Number(
          chainStore.block?.height! - workerClientStore.lotteryState.startBlock
        ) / BLOCK_PER_ROUND
      )
    : 0;

  return (
    <div
      className={cn(
        'relative rounded-[0.67vw] border border-left-accent',
        'flex flex-col gap-[6vw] px-[2vw] py-[2.67vw]'
      )}
    >
      <div className="">
        <div className="grid grid-cols-2 gap-[2vw]">
          {workerClientStore.lotteryState && <OwnedTickets roundId={roundId} />}
          <div className={'flex flex-col'}>
            <div className="mb-[1.33vw] text-[2.13vw]">Buy tickets</div>
            <div className={'flex flex-row gap-[1.33vw]'}>
              <div className={'flex flex-col gap-0'}>
                <AnimatePresence>
                  {tickets.map((_, index) => (
                    <TicketCard
                      key={index}
                      index={index}
                      ticketsAmount={tickets.length}
                      addTicket={(ticket) => {
                        tickets[index] = ticket;
                      }}
                      removeTicket={() => tickets.pop()}
                    />
                  ))}
                </AnimatePresence>
              </div>
              <div className={'flex flex-col gap-[1.33vw]'}>
                <BuyInfoCard
                  buttonActive={tickets.length > 0}
                  ticketsInfo={tickets}
                />
                <GetMoreTicketsButton
                  disabled={tickets[tickets.length - 1].amount == 0}
                  onClick={() => {
                    tickets.push(emptyTicket);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="">
        <div className="mb-[1.33vw] text-[2.13vw]">Previous Lotteries</div>
        <div className={'flex w-full flex-row gap-[1.042vw]'}>
          <button
            className={
              'flex h-[4vw] w-[4vw] items-center justify-center rounded-[0.521vw] border border-left-accent hover:opacity-80 disabled:opacity-60'
            }
            onClick={() => setPage((prevState) => prevState - 1)}
            disabled={page - 1 < 1}
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
            {renderRounds.map((item, index) => (
              <PreviousRound key={index} round={item} />
            ))}
          </div>
          <button
            className={
              'flex h-[4vw] w-[4vw] items-center justify-center rounded-[0.521vw] border border-left-accent hover:opacity-80 disabled:opacity-60'
            }
            onClick={() => setPage((prevState) => prevState + 1)}
            disabled={page + 1 > pagesAmount}
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
      </div>
    </div>
  );
}
