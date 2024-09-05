import Image from 'next/image';
import minaImg from '@/public/image/tokens/mina.svg';
import { formatUnits } from '@/lib/unit';
import { TICKET_PRICE } from 'l1-lottery-contracts';
import { Currency } from '@/constants/currency';

export default function CurrentRoundInfo({
  ticketsNum,
}: {
  ticketsNum: bigint | undefined;
}) {
  const bank = Number((ticketsNum || 0n) * TICKET_PRICE.toBigInt());
  return (
    <div
      className={
        'absolute bottom-0 right-0 mr-[18vw]  flex h-full w-[15vw] flex-col gap-[0.521vw] pt-[1vw] font-museo font-bold'
      }
    >
      <div
        className={
          'flex w-full flex-col gap-[0.26vw] rounded-[0.67vw] border border-left-accent bg-[#252525] p-[0.5vw]'
        }
      >
        <span className={'text-[1.25vw] uppercase text-left-accent '}>
          Bank
        </span>
        <div className={'flex flex-row items-center gap-2 text-[0.833vw]'}>
          <Image
            src={minaImg}
            alt={'mina'}
            className={'mb-1 h-[1.146vw] w-[1.146vw]'}
          />
          <span>{formatUnits(bank - (bank / 100) * 3)}</span>
          <span>{Currency.MINA}</span>
        </div>
      </div>
      <div
        className={
          'flex w-full flex-col gap-[0.26vw] rounded-[0.67vw] border border-left-accent bg-[#252525] p-[0.5vw]'
        }
      >
        <span className={'text-[1.25vw] uppercase text-left-accent '}>
          Tickets
        </span>
        <div className={'flex flex-row items-center gap-2 text-[0.833vw]'}>
          <svg
            width="1.146vw"
            height="1.146vw"
            viewBox="0 0 30 17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={'mb-1 h-[1.146vw] w-[1.146vw]'}
          >
            <path
              d="M29.9985 0.00246533L24.5558 0L24.5568 1.60693L23.2961 1.60496L23.2995 0.00345153L0.00147949 0.00246533L0 4.49921C2.12581 5.18479 3.34999 6.69505 3.34999 8.30297C3.34999 9.91089 2.12679 11.4202 0.000986945 12.1057L0.000985464 16.604H23.2911L23.2961 15.001L24.5587 15.001L24.5637 16.604H29.999L29.999 12.1057C27.8732 11.4202 26.65 9.91089 26.65 8.30297C26.65 6.69505 27.8742 5.18479 30 4.49921L29.9985 0.00246533ZM24.5637 3.83927L24.5587 7.18828L23.2961 7.18828L23.301 3.83927L24.5637 3.83927ZM21.2048 2.09818V14.5078L5.44621 14.5127L5.44423 2.09128L20.5784 2.09325L21.2048 2.09818ZM19.952 3.35098L6.699 3.34605V13.2599L19.952 13.255V3.35098ZM24.5587 9.41766L24.5637 12.7667L23.301 12.7667L23.2961 9.41766L24.5587 9.41766Z"
              fill="#D2FF00"
            />
          </svg>
          <span>{ticketsNum || 0}</span>
        </div>
      </div>
    </div>
  );
}
