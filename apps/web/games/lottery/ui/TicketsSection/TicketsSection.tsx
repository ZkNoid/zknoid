import { cn } from '@/lib/helpers';
import TicketCard from './ui/TicketCard';
import BuyInfoCard from './ui/BuyInfoCard';
import { useState } from 'react';
import GetMoreTicketsButton from './ui/GetMoreTicketsButton';
import OwnedTickets from './OwnedTickets';
import PreviousRound from './PreviousRound';
import { useLotteryStore } from '@/lib/stores/lotteryStore';

interface TicketInfo {
  amount: number;
  numbers: number[];
}

export default function TicketsSection() {
  const ROUNDS_LIMIT = 2;
  const lotteryStore = useLotteryStore();
  const previousRounds = lotteryStore.getPreviousRounds();

  const [ticketNumberInput, setTicketNumber] = useState('');
  const [ticketAmount, setTicketsAmount] = useState(0);
  const [page, setPage] = useState<number>(1);

  const pagesAmount = Math.ceil(previousRounds.length / ROUNDS_LIMIT);

  const renderRounds = previousRounds.slice(
    (page - 1) * ROUNDS_LIMIT,
    page * ROUNDS_LIMIT
  );

  return (
    <div
      className={cn(
        'relative rounded-[0.67vw] border border-left-accent',
        'flex flex-col gap-[6vw] px-[2vw] py-[2.67vw]'
      )}
    >
      <div className="">
        <div className="flex flex-row justify-between">
          <OwnedTickets roundId={1} />
          <div className={'flex flex-col'}>
            <div className="mb-[1.33vw] text-[2.13vw]">Buy tickets</div>
            <div className={'flex flex-row gap-[1.33vw]'}>
              <TicketCard
                symbols={ticketNumberInput}
                amount={ticketAmount}
                finalized={false}
                setSymbols={setTicketNumber}
                setTicketsAmount={setTicketsAmount}
              />
              <div className={'flex flex-col gap-[1.33vw]'}>
                <BuyInfoCard
                  buttonActive={ticketAmount > 0}
                  ticketsInfo={[{
                    amount: ticketAmount,
                    numbers: [...ticketNumberInput].map(x => Number(x))
                  }]}
                />
                <GetMoreTicketsButton />
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
              'flex h-[4vw] w-[9vw] items-center justify-center rounded-[0.521vw] border border-left-accent hover:opacity-80 disabled:opacity-60'
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
              'flex h-[4vw] w-[9vw] items-center justify-center rounded-[0.521vw] border border-left-accent hover:opacity-80 disabled:opacity-60'
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
