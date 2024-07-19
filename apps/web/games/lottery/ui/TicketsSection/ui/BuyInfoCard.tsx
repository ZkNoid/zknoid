import { ReactNode } from 'react';
import { VioletLotteryButton } from '../../buttons/VioletLotteryButton';
import { cn, sendTransaction } from '@/lib/helpers';
import { useWorkerClientStore } from '@/lib/stores/workerClient';
import { useNetworkStore } from '@/lib/stores/network';
import { useChainStore } from '@/lib/stores/minaChain';
import { TICKET_PRICE } from 'l1-lottery-contracts';
import { formatUnits } from '@/lib/unit';
import Loader from '@/components/shared/Loader';
import { Currency } from '@/constants/currency';
import { useNotificationStore } from '@/components/shared/Notification/lib/notificationStore';

export default function BuyInfoCard({
  buttonActive,
  loaderActive,
  ticketsInfo,
  onFinally,
}: {
  buttonActive: ReactNode;
  loaderActive: boolean;
  ticketsInfo: {
    amount: number;
    numbers: number[];
  }[];
  onFinally: () => void;
}) {
  const workerStore = useWorkerClientStore();
  const networkStore = useNetworkStore();
  const chain = useChainStore();
  const notificationStore = useNotificationStore();

  const numberOfTickets = ticketsInfo
    .map((x) => x.amount)
    .reduce((x, y) => x + y, 0);
  const cost = +TICKET_PRICE;
  const totalPrice = numberOfTickets * cost;

  return (
    <div className="flex h-[13.53vw] w-[20vw] flex-col rounded-[0.67vw] bg-[#252525] p-[1.33vw] font-plexsans text-[0.833vw] shadow-2xl">
      <div className="flex flex-row">
        <div className="text-nowrap">Number of tickets</div>
        <div className="mx-1 mb-[0.3vw] w-full border-spacing-6 border-b border-dotted border-[#F9F8F4] opacity-50"></div>
        <div className="">{numberOfTickets}</div>
      </div>
      <div className="flex flex-row">
        <div className="text-nowrap">Cost per ticket</div>
        <div className="mx-1 mb-[0.3vw] w-full border-spacing-6 border-b border-dotted border-[#F9F8F4] opacity-50"></div>
        <div className="">
          {formatUnits(cost)}
          {Currency.MINA}
        </div>
      </div>

      <div className="mt-auto flex flex-row">
        <div className="text-nowrap font-medium">TOTAL AMOUNT</div>
        <div className="mx-1 mb-[0.3vw] w-full border-spacing-6 border-b border-dotted border-[#F9F8F4] opacity-50"></div>
        <div className="">
          {formatUnits(totalPrice)}
          {Currency.MINA}
        </div>
      </div>
      <VioletLotteryButton
        className={cn(
          'my-[1vw] flex h-[2.13vw] items-center justify-center rounded-[0.33vw] px-[1vw] text-[1.07vw]',
          !(buttonActive && ticketsInfo.every((x) => x.numbers.length == 6)) &&
            'cursor-not-allowed opacity-60',
          { 'hover:opacity-80': buttonActive }
        )}
        onClick={async () => {
          if (!ticketsInfo.length) return;

          const txJson = await workerStore.buyTicket(
            networkStore.address!,
            Number(chain.block?.slotSinceGenesis!),
            ticketsInfo[0].numbers,
            numberOfTickets
          );
          console.log('txJson', txJson);
          await sendTransaction(txJson)
            .then((transaction: string | undefined) => {
              if (transaction) {
                onFinally();
                notificationStore.create({
                  type: 'success',
                  message: 'Transaction sent',
                });
              } else {
                notificationStore.create({
                  type: 'error',
                  message: 'Transaction rejected by user',
                });
              }
            })
            .catch((error) => {
              console.log('Error while sending transaction', error);
              notificationStore.create({
                type: 'error',
                message: 'Error while sending transaction',
                dismissDelay: 10000,
              });
            });
        }}
      >
        <div className={'flex flex-row items-center gap-[10%]'}>
          {loaderActive && <Loader size={19} color={'#212121'} />}
          <span>Pay</span>
        </div>
      </VioletLotteryButton>
    </div>
  );
}
