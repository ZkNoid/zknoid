import { cn } from '@/lib/helpers';
import TicketCard from './ui/TicketCard';
import BuyInfoCard from './ui/BuyInfoCard';

export default function TicketsSection({}: {}) {
  return (
    <div
      className={cn(
        'relative rounded-[0.67vw] border border-left-accent',
        'px-[2vw] py-[2.67vw] flex flex-col gap-[6vw]'
      )}
    >
      <div className="">
        <div className="mb-[1.33vw] text-[2.13vw]">Buy tickets</div>
        <div className="flex flex-row gap-[1.33vw]">
          <TicketCard symbols="12" amount={1} finalized={false}></TicketCard>
          <BuyInfoCard numberOfTickets={0} cost={0} buttonActive={false}></BuyInfoCard>
        </div>
      </div>
      <div className="">
        <div className="mb-[1.33vw] text-[2.13vw]">Previous lotteries</div>
        <div className="flex flex-row gap-[1.33vw]">
          <TicketCard symbols="5" amount={0} finalized={false}></TicketCard>
          <BuyInfoCard numberOfTickets={0} cost={0} buttonActive={false}></BuyInfoCard>
        </div>
      </div>
    </div>
  );
}
