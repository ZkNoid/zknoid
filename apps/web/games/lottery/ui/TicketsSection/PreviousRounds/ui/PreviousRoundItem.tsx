import Image from 'next/image';
import minaImg from '@/public/image/tokens/mina.svg';
import { Currency } from '@/constants/currency';
import { TicketItem } from './TicketItem';
import { formatUnits } from '@/lib/unit';
import { cn } from '@/lib/helpers';
import CustomScrollbar from '@/components/shared/CustomScrollbar';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, useScroll } from 'framer-motion';
import { ILotteryRound } from '@/games/lottery/lib/types';
import { TICKET_PRICE } from 'l1-lottery-contracts';
import { useNetworkStore } from '@/lib/stores/network';

export default function PreviousRoundItem({
  round,
  roundDates,
}: {
  round: ILotteryRound;
  roundDates: { start: Date; end: Date };
}) {
  const networkStore = useNetworkStore();
  const [containerHeight, setContainerHeight] = useState<number>(0);
  const ticketsListRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ container: ticketsListRef });

  useEffect(() => {
    const refObj = ticketsListRef.current;
    const resizeHandler = () => {
      if (containerHeight != refObj?.clientHeight) {
        // @ts-ignore
        setContainerHeight(refObj?.clientHeight);
      }
    };
    resizeHandler();
    refObj?.addEventListener('resize', resizeHandler);
    return () => {
      refObj?.removeEventListener('resize', resizeHandler);
    };
  });

  const parseNumbers = (numbers: number[]) => {
    const array: {
      number: number;
      win: boolean;
    }[] = [];
    numbers.map((item, index) => {
      array.push({
        number: item,
        win: round.winningCombination
          ? item == round.winningCombination[index]
          : false,
      });
    });
    return array;
  };

  const bank = Number(
    round.tickets
      .filter((x) => !x.numbers.every((x) => x == 0))
      .map((x) => x.amount)
      .reduce((x, y) => x + y, 0n) * TICKET_PRICE.toBigInt()
  );
  const ticketsAmount = Number(
    round.tickets.map((x) => x.amount).reduce((x, y) => x + y, 0n)
  );

  const userTickets = round.tickets.filter(
    (x) => x.owner == networkStore.address
  );

  return (
    <div
      className={
        'flex w-full flex-col gap-[1vw] rounded-[0.67vw] bg-[#252525] p-[1.33vw] text-[1.07vw] shadow-2xl'
      }
    >
      <div
        className={
          'flex w-full flex-row justify-between font-plexsans text-[1.25vw] font-medium uppercase text-foreground'
        }
      >
        <span className="text-nowrap">Lottery round {round.id}</span>
        <span>
          {roundDates.start.toLocaleString('en-US', { dateStyle: 'medium' })} -{' '}
          {roundDates.end.toLocaleString('en-US', { dateStyle: 'medium' })}
        </span>
      </div>
      <div className={'flex flex-col'}>
        <span
          className={
            'mb-[0.521vw] font-plexsans text-[0.938vw] font-medium text-foreground'
          }
        >
          Win combination
        </span>
        <div className={'mb-[1.094vw] flex flex-row gap-[0.5vw]'}>
          {round.winningCombination
            ? round.winningCombination.map((item, index) => (
                <div
                  key={index}
                  className={
                    'flex h-[2.67vw] w-[2.67vw] justify-center rounded-[0.33vw] bg-left-accent text-[2.13vw] text-black'
                  }
                >
                  {item}
                </div>
              ))
            : [...Array(6)].map((_, index) => (
                <div
                  key={index}
                  className={
                    'flex h-[2.67vw] w-[2.67vw] justify-center rounded-[0.33vw] bg-left-accent text-[2.13vw] text-black'
                  }
                >
                  _
                </div>
              ))}
        </div>
        <div
          className={cn(
            ' flex flex-col gap-[0.5vw] font-plexsans text-[0.7vw] font-medium text-foreground',
            { 'mb-[1.563vw]': userTickets?.length !== 0 }
          )}
        >
          <div
            className={
              'flex w-[18.52vw] flex-row items-center justify-between font-plexsans text-[0.938vw] font-medium'
            }
          >
            <div
              className={
                'flex w-full flex-row items-center justify-start gap-[0.5vw]'
              }
            >
              <Image
                src={minaImg}
                alt={'mina'}
                className={'h-[1.042vw] w-[1.042vw]'}
              />
              <span>Bank</span>
            </div>
            <div
              className={
                'flex w-full flex-row items-center justify-end gap-[0.5vw]'
              }
            >
              <span>
                {formatUnits(Number(bank) - (Number(bank) / 100) * 3)}
              </span>
              <span>{Currency.MINA}</span>
            </div>
          </div>
          <div
            className={
              'flex w-[18.52vw] flex-row items-center justify-between font-plexsans text-[0.938vw] font-medium'
            }
          >
            <div
              className={
                'flex w-full flex-row items-center justify-start gap-[0.5vw]'
              }
            >
              <svg
                width="20"
                height="12"
                viewBox="0 0 20 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={'h-[1.042vw] w-[1.042vw]'}
              >
                <path
                  d="M19.999 0.00164355L16.3705 0L16.3712 1.07129L15.5307 1.06997L15.533 0.00230102L0.000986328 0.00164355L0 2.99947C1.4172 3.45653 2.23333 4.46337 2.23333 5.53531C2.23333 6.60726 1.41786 7.61344 0.000657963 8.0705L0.000656976 11.0693H15.5274L15.5307 10.0007L16.3725 10.0007L16.3758 11.0693H19.9993L19.9993 8.0705C18.5821 7.61344 17.7667 6.60726 17.7667 5.53531C17.7667 4.46337 18.5828 3.45653 20 2.99947L19.999 0.00164355ZM16.3758 2.55952L16.3725 4.79219L15.5307 4.79219L15.534 2.55951L16.3758 2.55952ZM14.1365 1.39879V9.67184L3.6308 9.67513L3.62949 1.39419L13.7189 1.3955L14.1365 1.39879ZM13.3013 2.23399L4.466 2.2307V8.83993L13.3013 8.83664V2.23399ZM16.3725 6.27844L16.3758 8.51111L15.534 8.51111L15.5307 6.27844L16.3725 6.27844Z"
                  fill="#D2FF00"
                />
              </svg>
              <span className={'mb-0.5 '}>Tickets</span>
            </div>
            <div
              className={
                'mb-0.5 flex w-full flex-row items-center justify-end gap-[0.5vw] '
              }
            >
              <span>{ticketsAmount}</span>
            </div>
          </div>
        </div>
        {userTickets && userTickets.length != 0 && (
          <div className={'flex flex-col'}>
            <span
              className={
                'mb-[0.781vw] font-plexsans text-[1.25vw] font-medium uppercase text-foreground'
              }
            >
              Your tickets
            </span>
            <div
              className={
                'mb-[0.521vw] grid w-full grid-cols-4 font-plexsans text-[0.938vw] font-medium'
              }
            >
              <span>Ticket Number</span>
              <span className={'text-center'}>Amount</span>
              <span>Funds</span>
            </div>
            <div className={'flex w-full flex-row gap-[0.5vw]'}>
              <div
                className={
                  'flex max-h-[200px] w-full flex-col overflow-y-scroll no-scrollbar'
                }
                ref={ticketsListRef}
              >
                {userTickets.map((item, index) => (
                  <TicketItem
                    key={index}
                    roundId={round.id}
                    noCombination={!round.winningCombination}
                    numbers={parseNumbers(item.numbers)}
                    funds={Number(item.funds)}
                    amount={Number(item.amount)}
                    claimed={item.claimed}
                    hash={item.hash}
                  />
                ))}
              </div>
              <AnimatePresence initial={false}>
                {containerHeight === 200 && (
                  <CustomScrollbar scrollYProgress={scrollYProgress} />
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
