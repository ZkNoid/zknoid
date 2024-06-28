import Image from 'next/image';
import znakesImg from '@/public/image/tokens/znakes.svg';
import { Currency } from '@/constants/currency';
import { TicketItem } from './ui/TicketItem';
import { IRound } from '@/lib/stores/lotteryStore';
import { formatUnits } from '@/lib/unit';

export default function PreviousRound({ round }: { round: IRound }) {
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
        <span>Lottery round {round.id}</span>
        <span>
          {round.date.start.toLocaleString('en-US', { dateStyle: 'medium' })} -{' '}
          {round.date.end.toLocaleString('en-US', { dateStyle: 'medium' })}
        </span>
      </div>
      <div className={'flex flex-col gap-[1.5vw]'}>
        <span
          className={'font-plexsans text-[0.833vw] font-medium text-foreground'}
        >
          Win combination
        </span>
        <div className={'flex flex-row gap-[0.5vw]'}>
          {round.combination
            ? round.combination.map((item, index) => (
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
          className={
            'flex flex-col gap-[0.5vw] font-plexsans text-[0.7vw] font-medium text-foreground'
          }
        >
          <div
            className={
              'flex w-[18.52vw] flex-row items-center justify-between font-plexsans text-[0.833vw] font-medium'
            }
          >
            <div
              className={
                'flex w-full flex-row items-center justify-start gap-[0.5vw]'
              }
            >
              <Image
                src={znakesImg}
                alt={'znakes'}
                className={'mb-0.5 h-[20px] w-[20px]'}
              />
              <span>Bank</span>
            </div>
            <div
              className={
                'flex w-full flex-row items-center justify-end gap-[0.5vw]'
              }
            >
              <span>{formatUnits(round.bank)}</span>
              <span>{Currency.ZNAKES}</span>
            </div>
          </div>
          <div
            className={
              'flex w-[18.52vw] flex-row items-center justify-between font-plexsans text-[0.833vw] font-medium'
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
                className={'h-[20px] w-[20px]'}
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
              <span>{round.ticketsAmount}</span>
            </div>
          </div>
        </div>
        <div className={'flex flex-col gap-[1vw]'}>
          <span
            className={
              'font-plexsans text-[1.25vw] font-medium uppercase text-foreground'
            }
          >
            Your tickets
          </span>
          <div
            className={
              'grid w-full grid-cols-3 font-plexsans text-[0.833vw] font-medium'
            }
          >
            <span>Ticket Number</span>
            <span>Funds</span>
          </div>
          <div className={'flex flex-col'}>
            <TicketItem
              numbers={[
                { number: 1, win: false },
                { number: 2, win: false },
                { number: 3, win: true },
                { number: 4, win: false },
                { number: 5, win: true },
                { number: 6, win: false },
              ]}
              funds={500}
            />
            <TicketItem
              numbers={[
                { number: 1, win: false },
                { number: 2, win: false },
                { number: 3, win: true },
                { number: 4, win: false },
                { number: 5, win: true },
                { number: 6, win: false },
              ]}
              funds={500}
            />
            <TicketItem
              numbers={[
                { number: 1, win: false },
                { number: 2, win: false },
                { number: 3, win: true },
                { number: 4, win: false },
                { number: 5, win: true },
                { number: 6, win: false },
              ]}
              funds={500}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
