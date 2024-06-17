import { cn } from '@/lib/helpers';
import TicketCard from './ui/TicketCard';
import BuyInfoCard from './ui/BuyInfoCard';

export default function TicketsSection({}: {}) {
  return (
    <div
      className={cn(
        'relative h-[28.8vw] items-center justify-center rounded-[0.67vw] border border-left-accent',
        'px-[2vw] py-[2.67vw]'
      )}
    >
      <div className="">
        <div className="mb-[1.33vw] text-[2.13vw]">Buy tickets</div>
        <div className="flex flex-row gap-[1.33vw]">
          <TicketCard symbols="______"></TicketCard>
          <BuyInfoCard numberOfTickets={0} cost={0}></BuyInfoCard>
        </div>
      </div>
    </div>
  );
}
