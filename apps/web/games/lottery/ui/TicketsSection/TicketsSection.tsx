import { cn } from '@/lib/helpers';
import TicketCard from './ui/TicketCard';
import BuyInfoCard from './ui/BuyInfoCard';
import { useState } from 'react';
import GetMoreTicketsButton from './ui/GetMoreTicketsButton';
import OwnedTickets from './OwnedTickets';
import PreviousRound from './PreviousRound';
import { useLotteryStore } from '@/lib/stores/lotteryStore';

export default function TicketsSection() {
  const [ticketNumberInput, setTicketNumber] = useState('');
  const [ticketAmount, setTicketsAmount] = useState(0);
  const lotteryStore = useLotteryStore();
  const previousRounds = lotteryStore.getPreviousRounds();
  return (
    <div
      className={cn(
        'relative rounded-[0.67vw] border border-left-accent',
        'flex flex-col gap-[6vw] px-[2vw] py-[2.67vw]'
      )}
    >
      <div className="">
        <div className="flex flex-row justify-between">
          <OwnedTickets />
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
                  numberOfTickets={ticketAmount}
                  cost={ticketAmount}
                  buttonActive={ticketAmount > 0}
                />
                <GetMoreTicketsButton />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="">
        <div className="mb-[1.33vw] text-[2.13vw]">Previous Lotteries</div>
        <div className={'flex w-full flex-row gap-4'}>
          <button
            className={
              'flex h-[4vw] w-[9vw] items-center justify-center rounded-[0.521vw] border border-left-accent hover:opacity-80 disabled:opacity-60'
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
          {previousRounds.map((item, index) => (
            <PreviousRound key={index} round={item} />
          ))}
          <button
            className={
              'flex h-[4vw] w-[9vw] items-center justify-center rounded-[0.521vw] border border-left-accent hover:opacity-80 disabled:opacity-60'
            }
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
