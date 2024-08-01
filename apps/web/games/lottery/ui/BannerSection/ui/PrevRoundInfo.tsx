import Image from 'next/image';
import minaImg from '@/public/image/tokens/mina.svg';
import Skeleton from '@/components/shared/Skeleton';
import { formatUnits } from '@/lib/unit';
import { TICKET_PRICE } from 'l1-lottery-contracts';
import { Currency } from '@/constants/currency';

export default function PrevRoundInfo({
  ticketsNum,
  winningCombination,
}: {
  ticketsNum: bigint | undefined;
  winningCombination: number[] | undefined;
}) {
  const bank = Number((ticketsNum || 0n) * TICKET_PRICE.toBigInt());
  return (
    <div
      className={
        'absolute left-0 top-0 ml-[9.5vw] mt-[4.688vw] flex flex-col gap-[0.781vw] rounded-[0.521vw] border border-left-accent bg-bg-dark p-[0.469vw] pr-[4vw]'
      }
    >
      <div className={'flex flex-col gap-[0.677vw]'}>
        <span
          className={
            'font-museo text-[1.25vw] font-bold uppercase text-left-accent'
          }
        >
          Win combination
        </span>
        <div className={'flex flex-row gap-[0.26vw]'}>
          {winningCombination
            ? winningCombination.map((item, index) => (
                <div
                  key={index}
                  className={
                    'flex h-[2.083vw] w-[2.083vw] items-center justify-center rounded-[0.26vw] bg-left-accent font-museo text-[1.667vw] font-bold text-bg-dark'
                  }
                >
                  {item}
                </div>
              ))
            : [...Array(6)].map((_, index) => (
                <div
                  key={index}
                  className={
                    'flex h-[2.083vw] w-[2.083vw] items-center justify-center rounded-[0.26vw] bg-left-accent font-museo text-[1.667vw] font-bold text-bg-dark'
                  }
                >
                  _
                </div>
              ))}
        </div>
      </div>
      <div className={'flex flex-row items-center justify-between'}>
        <div className={'flex flex-col gap-[0.677vw]'}>
          <span
            className={
              'font-museo text-[1.25vw] font-bold uppercase text-left-accent'
            }
          >
            Bank
          </span>
          <div className={'flex flex-row items-center gap-[0.521vw]'}>
            <Image
              src={minaImg}
              alt={'mina'}
              className={'h-[1.146vw] w-[1.146vw]'}
            />
            <Skeleton
              isLoading={!ticketsNum && !winningCombination}
              className={'h-[0.833vw] w-full rounded-[0.33vw]'}
            >
              <span
                className={
                  'font-museo text-[0.833vw] font-bold text-foreground'
                }
              >
                {formatUnits(bank - (bank / 100) * 3)} {Currency.MINA}
              </span>
            </Skeleton>
          </div>
        </div>
        <div className={'flex flex-col gap-[0.677vw]'}>
          <span
            className={
              'font-museo text-[1.25vw] font-bold uppercase text-left-accent'
            }
          >
            Tickets
          </span>
          <div className={'flex flex-row items-center gap-[0.521vw]'}>
            <svg
              width="30"
              height="17"
              viewBox="0 0 30 17"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={'h-[1.146vw] w-[1.146vw]'}
            >
              <path
                d="M29.9985 0.00246533L24.5558 0L24.5568 1.60693L23.2961 1.60496L23.2995 0.00345153L0.00147949 0.00246533L0 4.49921C2.12581 5.18479 3.34999 6.69505 3.34999 8.30297C3.34999 9.91089 2.12679 11.4202 0.000986945 12.1057L0.000985464 16.604H23.2911L23.2961 15.001L24.5587 15.001L24.5637 16.604H29.999L29.999 12.1057C27.8732 11.4202 26.65 9.91089 26.65 8.30297C26.65 6.69505 27.8742 5.18479 30 4.49921L29.9985 0.00246533ZM24.5637 3.83927L24.5587 7.18828L23.2961 7.18828L23.301 3.83927L24.5637 3.83927ZM21.2048 2.09818V14.5078L5.44621 14.5127L5.44423 2.09128L20.5784 2.09325L21.2048 2.09818ZM19.952 3.35098L6.699 3.34605V13.2599L19.952 13.255V3.35098ZM24.5587 9.41766L24.5637 12.7667L23.301 12.7667L23.2961 9.41766L24.5587 9.41766Z"
                fill="#D2FF00"
              />
            </svg>
            <Skeleton
              isLoading={!ticketsNum && !winningCombination}
              className={'h-[0.833vw] w-full rounded-[0.33vw]'}
            >
              <span
                className={
                  'font-museo text-[0.833vw] font-bold text-foreground'
                }
              >
                {ticketsNum || 0}
              </span>
            </Skeleton>
          </div>
        </div>
      </div>
    </div>
  );
}
