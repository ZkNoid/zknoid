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
  claimed,
  hash,
}: {
  roundId: number;
  winCombination: number[];
  ticketNumbers: { number: number; win: boolean }[];
  combination: number[];
  quantity: bigint;
  hasReward: boolean;
  reward: string;
  claimed: boolean;
  hash: string;
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
        'grid w-full grid-cols-6 grid-rows-1 border-t border-foreground py-[0.521vw] last:border-b hover:bg-[#464646]'
      }
    >
      <div
        className={'flex w-full items-center justify-start pl-[5%] pr-[50%]'}
      >
        <span className={'font-plexsans text-[0.833vw] text-foreground'}>
          {roundId}
        </span>
      </div>
      <div
        className={
          'flex flex-row items-center justify-center gap-[0.781vw] pr-[50%]'
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
      {claimed && (
        <div className={'flex w-full items-center justify-end'}>
          <span
            className={
              'w-1/2 rounded-[0.781vw] border border-right-accent px-[1.51vw] py-[0.26vw] text-center font-museo text-[0.833vw] font-medium text-right-accent'
            }
          >
            Claimed
          </span>
        </div>
      )}
      {hasReward && !claimed && (
        <div className={'flex w-full items-center justify-end'}>
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
