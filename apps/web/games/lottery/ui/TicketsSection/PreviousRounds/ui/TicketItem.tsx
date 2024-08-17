import { cn, sendTransaction } from '@/lib/helpers';
import { Currency } from '@/constants/currency';
import { useWorkerClientStore } from '@/lib/stores/workerClient';
import { useNetworkStore } from '@/lib/stores/network';
import Loader from '@/components/shared/Loader';
import { formatUnits } from '@/lib/unit';
import { useState } from 'react';
import Link from 'next/link';

type Number = {
  number: number;
  win: boolean;
};

export function TicketItem({
  roundId,
  numbers,
  funds,
  amount,
  noCombination,
  claimed,
  hash,
}: {
  roundId: number;
  numbers: Number[];
  funds: number | undefined;
  amount: number;
  noCombination: boolean;
  claimed: boolean;
  hash: string;
}) {
  const workerClient = useWorkerClientStore();
  const networkStore = useNetworkStore();
  const [isLoader, setIsLoader] = useState<boolean>(false);

  return (
    <div
      className={
        'grid grid-cols-4 border-b py-[0.521vw] first:border-t hover:bg-[#464646]'
      }
    >
      <div className={'flex flex-row items-center gap-[0.25vw]'}>
        {numbers.map((item, index) => (
          <div
            key={index}
            className={cn(
              'flex h-[1.33vw] w-[1.33vw] items-center justify-center rounded-[0.15vw] border font-plexsans text-[0.833vw]',
              {
                'border-left-accent bg-left-accent': item.win,
                'border-foreground text-foreground': !item.win,
                'text-black': item.win,
              }
            )}
          >
            {item.number}
          </div>
        ))}
      </div>
      <div
        className={
          'flex flex-row items-center justify-center gap-[0.25vw] font-plexsans text-[0.833vw]'
        }
      >
        {amount}
      </div>
      <div
        className={
          'flex flex-row items-center gap-[0.25vw] font-plexsans text-[0.833vw]'
        }
      >
        {!!funds ? (
          <>
            <span>{Number(formatUnits(funds)).toFixed(2)}</span>
            <span>{Currency.MINA}</span>
          </>
        ) : noCombination ? (
          <span>No combination</span>
        ) : (
          <span>No funds</span>
        )}
      </div>
      {!!funds && !claimed && (
        <button
          className={
            'flex items-center justify-center rounded-[0.33vw] bg-left-accent px-[0.74vw] py-[0.37vw] font-museo text-[0.833vw] font-medium text-black hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:opacity-60'
          }
          disabled={!workerClient.lotteryCompiled || workerClient.isActiveTx}
          onClick={async () => {
            let txJson = await workerClient.getReward(
              networkStore.address!,
              networkStore.minaNetwork!.networkID,
              roundId,
              numbers.map((x) => x.number),
              amount
            );

            console.log('txJson', txJson);
            setIsLoader(true);
            await sendTransaction(txJson).finally(() => setIsLoader(false));
          }}
        >
          <div
            className={
              'flex flex-row items-center gap-[10%] pr-[10%] text-center'
            }
          >
            {isLoader && <Loader size={'19'} color={'#212121'} />}
            <span>Claim</span>
          </div>
        </button>
      )}
      {!!funds && claimed && (
        <Link
          href={`https://minascan.io/devnet/tx/${hash}?type=zk-tx`}
          target={'_blank'}
          rel={'noopener noreferrer'}
          className={
            'items-center rounded-[0.33vw] px-[0.74vw] py-[0.37vw] font-museo text-[0.833vw] font-medium text-foreground underline hover:cursor-pointer hover:text-left-accent'
          }
        >
          Transaction link
        </Link>
      )}
    </div>
  );
}
