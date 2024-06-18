import { ReactNode } from 'react';
import { VioletLotteryButton } from '../../buttons/VioletLotteryButton';
import { cn } from '@/lib/helpers';
import { useWorkerClientStore } from '@/lib/stores/workerClient';
import { useNetworkStore } from '@/lib/stores/network';

export default function BuyInfoCard({
  numberOfTickets,
  cost,
  buttonActive,
}: {
  numberOfTickets: number;
  cost: number;
  buttonActive: ReactNode;
}) {
  const workerStore = useWorkerClientStore();
  const networkStore = useNetworkStore();

  return (
    <div className="flex h-[13.53vw] w-[22vw] flex-col rounded-[0.67vw] bg-[#252525] p-[1.33vw] text-[1.07vw]">
      <div className="flex flex-row">
        <div className="text-nowrap">Number of tickets</div>
        <div className="mx-1 mb-[0.3vw] w-full border-spacing-6 border-b border-dotted border-[#F9F8F4] opacity-50"></div>
        <div className="">{numberOfTickets}</div>
      </div>
      <div className="flex flex-row">
        <div className="text-nowrap">Cost</div>
        <div className="mx-1 mb-[0.3vw] w-full border-spacing-6 border-b border-dotted border-[#F9F8F4] opacity-50"></div>
        <div className="">{cost}$</div>
      </div>

      <div className="mt-auto flex flex-row">
        <div className="text-nowrap">TOTAL AMOUNT</div>
        <div className="mx-1 mb-[0.3vw] w-full border-spacing-6 border-b border-dotted border-[#F9F8F4] opacity-50"></div>
        <div className="">{cost}$</div>
      </div>
      <VioletLotteryButton
        className={cn(
          'my-[1vw] flex h-[2.13vw] items-center justify-center rounded-[0.33vw] px-[1vw] text-[1.07vw]',
          !buttonActive && 'opacity-50 cursor-not-allowed'
        )}
        onClick={() => {
          workerStore.buyTicket(networkStore.address!, [1, 1, 1, 1, 1, 1]);
        }}
      >
        Pay
      </VioletLotteryButton>
    </div>
  );
}
