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
import { useMinaBalancesStore } from '@/lib/stores/minaBalances';

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

  const minaBalancesStore = useMinaBalancesStore();
  const balance = (
    Number(minaBalancesStore.balances[networkStore.address!] ?? 0n) /
    10 ** 9
  ).toFixed(2);

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
      {Number(balance) < Number(formatUnits(totalPrice)) && (
        <div
          className={'mt-[1vw] flex w-full flex-row items-center gap-[0.26vw]'}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={'h-[0.729vw] w-[0.729vw]'}
          >
            <circle
              cx="7"
              cy="7"
              r="6"
              fill="#FF0000"
              stroke="#FF0000"
              strokeWidth="0.500035"
            />
            <path
              d="M6.72053 8.68987L6.30053 5.10187V2.71387H7.71653V5.10187L7.32053 8.68987H6.72053ZM7.02053 11.2339C6.71653 11.2339 6.49253 11.1619 6.34853 11.0179C6.21253 10.8659 6.14453 10.6739 6.14453 10.4419V10.2379C6.14453 10.0059 6.21253 9.81787 6.34853 9.67387C6.49253 9.52187 6.71653 9.44587 7.02053 9.44587C7.32453 9.44587 7.54453 9.52187 7.68053 9.67387C7.82453 9.81787 7.89653 10.0059 7.89653 10.2379V10.4419C7.89653 10.6739 7.82453 10.8659 7.68053 11.0179C7.54453 11.1619 7.32453 11.2339 7.02053 11.2339Z"
              fill="#F9F8F4"
            />
          </svg>
          <span className={'font-plexsans text-[0.625vw] text-[#FF0000]'}>
            There are not enough funds in your wallet
          </span>
        </div>
      )}
      <VioletLotteryButton
        className={cn(
          'mb-[1vw] flex h-[2.13vw] items-center justify-center rounded-[0.33vw] px-[1vw] text-[1.07vw]',
          !(buttonActive && ticketsInfo.every((x) => x.numbers.length == 6)) &&
            'cursor-not-allowed opacity-60',
          {
            'hover:opacity-80':
              buttonActive && Number(balance) > Number(formatUnits(totalPrice)),
            'cursor-progress': loaderActive,
            'mt-[0.25vw]': Number(balance) < Number(formatUnits(totalPrice)),
            'mt-[1vw]': Number(balance) > Number(formatUnits(totalPrice)),
            'cursor-not-allowed opacity-60':
              Number(balance) < Number(formatUnits(totalPrice)),
          }
        )}
        onClick={async () => {
          if (!ticketsInfo.length) return;
          if (Number(balance) < Number(formatUnits(totalPrice))) return;
          if (!buttonActive) return;

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
          {/*<span>{Number(balance) < Number(formatUnits(totalPrice)) ? 'Add funds' : 'Pay'}</span>*/}
          <span>
            {Number(balance) < Number(formatUnits(totalPrice))
              ? 'Not enough funds'
              : 'Pay'}
          </span>
        </div>
      </VioletLotteryButton>
    </div>
  );
}
