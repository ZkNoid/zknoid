import { cn } from '@/lib/helpers';
import TicketCard from './ui/TicketCard';
import BuyInfoCard from './ui/BuyInfoCard';
import { useState } from 'react';
import GetMoreTicketsButton from './ui/GetMoreTicketsButton';

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
        <div className="mb-[1.33vw] text-[2.13vw]">Buy tickets</div>
        <div className="flex flex-row gap-[1.33vw]">
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
      <div className="">
        <div className="mb-[1.33vw] text-[2.13vw]">Previous lotteries</div>
        <div className="flex flex-row gap-[1.33vw]">
          <TicketCard
            symbols="5"
            amount={0}
            finalized={false}
            setSymbols={setTicketNumber}
            setTicketsAmount={setTicketsAmount}
          ></TicketCard>
          <BuyInfoCard
            numberOfTickets={0}
            cost={0}
            buttonActive={false}
          ></BuyInfoCard>
        </div>
      </div>
    </div>
  );
}
