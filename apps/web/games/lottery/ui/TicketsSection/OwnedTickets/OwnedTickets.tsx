import MyTicket from './ui/MyTicket';
import { useState } from 'react';

interface ITicket {
  id: string;
  combination: number[];
  amount: number;
}

const tickets: ITicket[] = [
  {
    id: '1',
    combination: [1, 2, 3, 4, 5, 6],
    amount: 2,
  },
  {
    id: '2',
    combination: [1, 2, 3, 4, 5, 6],
    amount: 2,
  },
  {
    id: '3',
    combination: [1, 2, 3, 4, 5, 6],
    amount: 2,
  },
  {
    id: '4',
    combination: [1, 2, 3, 4, 5, 6],
    amount: 2,
  },
  {
    id: '5',
    combination: [1, 2, 3, 4, 5, 6],
    amount: 2,
  },
];

export default function OwnedTickets() {
  const [currentTicket, setCurrentTicket] = useState<ITicket>(tickets[2]);

  return (
    <div className={'flex flex-col'}>
      <div className={'flex flex-row justify-between'}>
        <div className="mb-[1.33vw] text-[2.13vw]">Your tickets</div>
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
            isOpen={item.id == currentTicket.id}
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
