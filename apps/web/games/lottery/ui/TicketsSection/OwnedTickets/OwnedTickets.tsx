import { useWorkerClientStore } from '@/lib/stores/workerClient';
import MyTicket from './ui/MyTicket';
import { useEffect, useState } from 'react';

interface ITicket {
  id: string;
  combination: number[];
  amount: number;
}

export default function OwnedTickets({ roundId }: { roundId: number }) {
  const [currentTicket, setCurrentTicket] = useState<ITicket | undefined>(
    undefined
  );
  const workerStore = useWorkerClientStore();
  const [tickets, setTickets] = useState<
    { id: string; combination: number[]; amount: number }[]
  >([]);

  useEffect(() => {
    if (!workerStore.offchainStateReady) return;

    console.log('Offchain state ready', workerStore.lotteryState);

    (async () => {
      const f = await workerStore.getRoundsInfo([roundId]);
      setTickets(
        f[roundId].tickets.map((x, i) => ({
          id: `${i}`,
          combination: x.numbers,
          amount: Number(x.amount),
        }))
      );
      console.log('Effect fetching', f);
    })();
  }, [workerStore.offchainStateReady]);

  return (
    <div className={'flex w-full flex-col'}>
      <div className={'mb-[1.33vw] flex flex-row items-center justify-between'}>
        <div className="text-[2.13vw]">Your tickets</div>
        <div className={'flex flex-row gap-[0.5vw]'}>
          <button
            className={
              'flex h-[1.82vw] w-[1.82vw] items-center justify-center rounded-[0.26vw] border border-foreground hover:opacity-80 disabled:opacity-60'
            }
            onClick={() =>
              setCurrentTicket(
                tickets[
                  tickets.findIndex((ticket) => ticket === currentTicket) - 1
                ]
              )
            }
            disabled={
              tickets.findIndex((ticket) => ticket === currentTicket) == 0
            }
          >
            <svg
              width="0.729vw"
              height="1.198vw"
              viewBox="0 0 14 23"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12.75 1.58301L2.75 11.583L12.75 21.583"
                stroke="#F9F8F4"
                strokeWidth="3"
              />
            </svg>
          </button>

          <button
            className={
              'flex h-[1.82vw] w-[1.82vw] items-center justify-center rounded-[0.26vw] border border-foreground hover:opacity-80 disabled:opacity-60'
            }
            onClick={() =>
              setCurrentTicket(
                tickets[
                  tickets.findIndex((ticket) => ticket === currentTicket) + 1
                ]
              )
            }
            disabled={
              tickets.findIndex((ticket) => ticket === currentTicket) + 1 >
              tickets.length - 1
            }
          >
            <svg
              width="0.729vw"
              height="1.198vw"
              viewBox="0 0 14 23"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1.25 1.58301L11.25 11.583L1.25 21.583"
                stroke="#F9F8F4"
                strokeWidth="3"
              />
            </svg>
          </button>
        </div>
      </div>
      <div className={'flex w-full flex-row gap-[0.3vw]'}>
        {tickets.map((item, index) => (
          <MyTicket
            key={item.id}
            isOpen={item.id == currentTicket?.id}
            combination={item.combination}
            amount={item.amount}
            index={index + 1}
            onClick={() => setCurrentTicket(item)}
          />
        ))}
      </div>
    </div>
  );
}
