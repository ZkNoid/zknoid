import { useWorkerClientStore } from '@/lib/stores/workerClient';
import MyTicket from './ui/MyTicket';
import { useEffect, useState } from 'react';
import { useNetworkStore } from '@/lib/stores/network';
import { cn } from '@/lib/helpers';
import PageButton from './ui/PageButton';

interface ITicket {
  id: string;
  combination: number[];
  amount: number;
}

export default function OwnedTickets({ roundId }: { roundId: number }) {
  const TICKETS_PER_PAGE = 4;
  const [currentTicket, setCurrentTicket] = useState<ITicket | undefined>(
    undefined
  );
  const workerStore = useWorkerClientStore();
  const [tickets, setTickets] = useState<
    { id: string; combination: number[]; amount: number }[]
  >([]);
  const networkStore = useNetworkStore();
  const [page, setPage] = useState<number>(1);
  const pagesAmount = Math.ceil(tickets.length / TICKETS_PER_PAGE);
  const renderTickets = tickets.slice(
    (page - 1) * TICKETS_PER_PAGE,
    page * TICKETS_PER_PAGE
  );

  useEffect(() => {
    console.log(
      'Owned tickets offchain state',
      workerStore.offchainStateUpdateBlock
    );

    if (!workerStore.offchainStateUpdateBlock) return;

    console.log('Offchain state ready', workerStore.onchainState);

    (async () => {
      const f = await workerStore.getRoundsInfo([roundId]);
      setTickets(
        f[roundId].tickets
          .filter((x) => x.owner == networkStore.address)
          .map((x, i) => ({
            id: `${i}`,
            combination: x.numbers,
            amount: Number(x.amount),
          }))
      );
      console.log('Effect fetching', f);
    })();
  }, [workerStore.offchainStateUpdateBlock]);

  return (
    <div
      className={cn('flex w-full flex-col', tickets.length == 0 && 'hidden')}
    >
      <div className={'mb-[1.33vw] flex flex-row items-center justify-between'}>
        <div className="text-[2.13vw]">Your tickets</div>
      </div>

      <div className={'flex w-full flex-row gap-[0.3vw]'}>
        {tickets.length > TICKETS_PER_PAGE && page != 1 && (
          <PageButton
            text={'Previous page'}
            symbol={'←'}
            onClick={() => {
              setPage((prevState) => prevState - 1);
              setCurrentTicket(undefined);
            }}
            disabled={page - 1 < 1}
          />
        )}
        {renderTickets.map((item, index) => (
          <MyTicket
            key={index}
            isOpen={
              item.id == currentTicket?.id ||
              (currentTicket == undefined && index == 0)
            }
            combination={item.combination}
            amount={item.amount}
            index={
              page == 1
                ? index + 1
                : index + 1 + TICKETS_PER_PAGE * page - TICKETS_PER_PAGE
            }
            onClick={() => setCurrentTicket(item)}
          />
        ))}
        {tickets.length > TICKETS_PER_PAGE && (
          <PageButton
            text={'Next page'}
            symbol={'→'}
            onClick={() => {
              setPage((prevState) => prevState + 1);
              setCurrentTicket(undefined);
            }}
            disabled={page + 1 > pagesAmount}
          />
        )}
      </div>
    </div>
  );
}
