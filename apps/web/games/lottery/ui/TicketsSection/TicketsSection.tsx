import { cn } from '@/lib/helpers';
import TicketCard from './ui/TicketCard';
import BuyInfoCard from './ui/BuyInfoCard';
import { useState } from 'react';
import GetMoreTicketsButton from './ui/GetMoreTicketsButton';
import OwnedTickets from './OwnedTickets';
import PreviousRound from './PreviousRound';

export default function TicketsSection({}: {}) {
  const [ticketNumberInput, setTicketNumber] = useState('');
  const [ticketAmount, setTicketsAmount] = useState(0);

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
          <PreviousRound
            roundId={3}
            date={{ start: new Date(2024, 4, 1), end: new Date(2024, 4, 24) }}
            combination={[1, 2, 3, 4, 5, 1]}
          />
          <PreviousRound
            roundId={2}
            date={{ start: new Date(2024, 4, 1), end: new Date(2024, 4, 10) }}
            combination={[7, 8, 1, 9, 0, 3]}
          />
        </div>
      </div>
    </div>
  );
}
