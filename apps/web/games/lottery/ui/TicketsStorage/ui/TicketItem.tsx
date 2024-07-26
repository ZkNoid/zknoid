import { useWorkerClientStore } from '@/lib/stores/workerClient';
import { useNetworkStore } from '@/lib/stores/network';
import { useNotificationStore } from '@/components/shared/Notification/lib/notificationStore';
import { cn, sendTransaction } from '@/lib/helpers';

export const TicketItem = ({
  roundId,
  winCombination,
  ticketNumbers,
  combination,
  quantity,
  hasReward,
  reward,
  // chosen,
  // setChosen,
  claimed,
}: {
  roundId: number;
  winCombination: number[];
  ticketNumbers: { number: number; win: boolean }[];
  combination: number[];
  quantity: bigint;
  hasReward: boolean;
  reward: string;
  // chosen: boolean;
  // setChosen: (chosen: boolean) => void;
  claimed: boolean;
}) => {
  const workerStore = useWorkerClientStore();
  const networkStore = useNetworkStore();
  const notificationStore = useNotificationStore();

  const claimTicket = async (numbers: number[], amount: number) => {
    let txJson = await workerStore.getReward(
      networkStore.address!,
      networkStore.minaNetwork!.networkID,
      roundId,
      numbers,
      amount
    );

    console.log('txJson', txJson);
    await sendTransaction(txJson)
      .then(() => {
        notificationStore.create({
          type: 'success',
          message: 'Transaction sent',
          isDismissible: true,
          dismissAfterDelay: true,
        });
      })
      .catch((error) => {
        console.log('Error while sending transaction', error);
        notificationStore.create({
          type: 'error',
          message: 'Error while sending transaction',
          isDismissible: true,
          dismissAfterDelay: true,
          dismissDelay: 10000,
        });
      });
  };

  return (
    <div
      className={
        'grid w-full grid-cols-7 grid-rows-1 border-t border-foreground py-[0.521vw] last:border-b hover:bg-[#464646]'
      }
    >
      <div className={'flex w-full items-center justify-center pr-[40%]'}>
        <span className={'font-plexsans text-[0.833vw] text-foreground'}>
          {roundId}
        </span>
      </div>
      <div
        className={
          'flex flex-row items-center justify-center gap-[0.781vw]  pr-[40%]'
        }
      >
        {winCombination.map((item, index) => (
          <span
            className={'font-plexsans text-[0.833vw] text-foreground'}
            key={index}
          >
            {item}
          </span>
        ))}
      </div>
      <div className={'flex flex-row items-center justify-center gap-[0.26vw]'}>
        {ticketNumbers.map((item, index) => (
          <div
            key={index}
            className={cn(
              'flex h-[1.354vw] w-[1.354vw] items-center justify-center rounded-[0.104vw] border border-foreground font-plexsans text-[0.833vw] text-foreground',
              {
                'border-left-accent bg-left-accent text-bg-dark': item.win,
              }
            )}
          >
            {item.number}
          </div>
        ))}
      </div>
      <div className={'flex w-full items-center justify-center'}>
        <span className={'font-plexsans text-[0.833vw] text-foreground'}>
          {quantity}
        </span>
      </div>
      <div className={'flex w-full items-center justify-center'}>
        <span className={'font-plexsans text-[0.833vw] text-foreground'}>
          {hasReward ? `${reward} MINA` : 'No reward'}
        </span>
      </div>
      {/*<div />*/}
      {/*<div className={'flex w-full items-center justify-center'}>*/}
      {/*  <button*/}
      {/*    className={cn(*/}
      {/*      'flex h-[0.938vw] w-[0.938vw] cursor-pointer flex-col items-center justify-center rounded-[0.104vw] border hover:opacity-80',*/}
      {/*      {*/}
      {/*        'border-foreground': !chosen,*/}
      {/*        'border-left-accent bg-left-accent': chosen,*/}
      {/*      }*/}
      {/*    )}*/}
      {/*    onClick={() => setChosen(true)}*/}
      {/*  >*/}
      {/*    <svg*/}
      {/*      width="0.625vw"*/}
      {/*      height="0.417vw"*/}
      {/*      viewBox="0 0 14 10"*/}
      {/*      fill="none"*/}
      {/*      xmlns="http://www.w3.org/2000/svg"*/}
      {/*      className={cn('h-[0.417vw] w-[0.625vw]', { 'opacity-0': !chosen })}*/}
      {/*    >*/}
      {/*      <path d="M1 4L5.5 8.5L13 1" stroke="#252525" />*/}
      {/*    </svg>*/}
      {/*  </button>*/}
      {/*</div>*/}
      {hasReward && !claimed && (
        <div className={'col-span-2 flex w-full items-center justify-center'}>
          <button
            className={
              'w-1/2 rounded-[0.26vw] bg-left-accent px-[1.51vw] py-[0.26vw] font-museo text-[0.833vw] font-medium text-bg-dark hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-60'
            }
            onClick={() => claimTicket(combination, Number(quantity))}
            disabled={claimed || !hasReward || !workerStore.lotteryCompiled}
          >
            Claim
          </button>
        </div>
      )}
    </div>
  );
};
