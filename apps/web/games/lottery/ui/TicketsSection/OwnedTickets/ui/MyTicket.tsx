import { cn } from '@/lib/helpers';
import Image from 'next/image';
import TicketBG1 from '@/public/image/ticket-bg-1.svg';

export default function MyTicket({
  combination,
  amount,
  index,
}: {
  combination: number[];
  amount: number;
  index: number;
}) {
  return (
    <div className={'flex flex-row'}>
      <div className="relative h-[13.53vw] w-[24vw] rounded-[1.33vw] rounded-r-none bg-middle-accent p-[0.33vw]">
        <div className="pointer-events-none absolute h-[12.87vw] w-[23.33vw] rounded-[1vw] border"></div>
        <div className="relative z-0 flex h-full w-full flex-col p-[1.33vw]">
          <div className="flex flex-row">
            <div className="text-[1.6vw] uppercase text-foreground">
              Ticket {index}
            </div>
          </div>
          <div className="flex flex-row gap-[0.33vw]">
            {combination.map((fieldId) => (
              <div
                key={fieldId}
                className={cn(
                  'h-[2.67vw] w-[2.67vw] rounded-[0.33vw] border-[0.07vw] border-foreground shadow-[inset_5px_5px_5px_#CF3500,inset_-5px_-5px_5px_rgba(255,91,35,0.5)]',
                  'z-[1] flex items-center justify-center bg-middle-accent font-museo text-[2.13vw] font-bold text-foreground'
                )}
              >
                {fieldId}
              </div>
            ))}
          </div>
          <div className={'mt-auto flex flex-row gap-[0.33vw]'}>
            <div
              className={
                'flex items-center justify-center rounded-[0.33vw]  border-[0.07vw] bg-middle-accent px-[0.3vw] py-[0.15vw] font-plexsans text-[0.8vw] font-medium'
              }
            >
              {amount} Tickets
            </div>
            <div
              className={
                'flex items-center justify-center rounded-[0.33vw]  border-[0.07vw] bg-middle-accent px-[0.3vw] py-[0.15vw] font-plexsans text-[0.8vw] font-medium'
              }
            >
              200 Bees
            </div>
            <div
              className={
                'flex items-center justify-center rounded-[0.33vw]  border-[0.07vw] bg-middle-accent px-[0.3vw] py-[0.15vw] font-plexsans text-[0.8vw] font-medium'
              }
            >
              2000 Frogs
            </div>
          </div>
          <Image
            src={TicketBG1}
            alt={'Lottery Ticket'}
            className={
              'absolute left-0 top-0 -z-[1] h-full w-full rounded-[1vw] rounded-bl-[0.9vw]'
            }
          />
        </div>
      </div>
      <div className={'flex flex-row rounded-r-[1.33vw] bg-middle-accent'}>
        <div className={'flex flex-col items-center justify-between'}>
          <div
            className={
              '-mt-[0.57vw] h-[1.15vw] w-[1.15vw] rounded-full bg-bg-dark'
            }
          />
          {[...Array(16)].map((_, index) => (
            <div
              key={index}
              className={'h-[0.31vw] w-[0.31vw] rounded-full bg-bg-dark'}
            />
          ))}
          <div
            className={
              '-mb-[0.57vw] h-[1.15vw] w-[1.15vw] rounded-full bg-bg-dark'
            }
          />
        </div>

        <div className={'relative flex flex-row rounded-r-[1.33vw] p-[0.33vw]'}>
          <div
            className={
              'flex flex-col justify-between rounded-[1.04vw] border bg-middle-accent p-1'
            }
          >
            <div
              className={
                'my-auto flex h-[5.73vw] w-full flex-row items-center justify-center gap-1'
              }
            >
              <div
                className={'flex h-full w-1/2 flex-col-reverse justify-evenly'}
              >
                {combination.map((item, index) => (
                  <span
                    key={index}
                    className={
                      'rotate-180 text-[0.83vw] [writing-mode:vertical-rl]'
                    }
                  >
                    {item}
                  </span>
                ))}
              </div>
              <span className={'h-full w-1/2'}>
                <svg
                  width="100%"
                  height="100%"
                  viewBox="0 0 8 109"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className={'rotate-180'}
                >
                  <rect y="106" width="8" height="3" fill="#F9F8F4" />
                  <rect y="95" width="8" height="3" fill="#F9F8F4" />
                  <rect y="8" width="8" height="3" fill="#F9F8F4" />
                  <rect y="40" width="8" height="3" fill="#F9F8F4" />
                  <rect y="68" width="8" height="3" fill="#F9F8F4" />
                  <rect y="82" width="8" height="4" fill="#F9F8F4" />
                  <rect y="17" width="8" height="4" fill="#F9F8F4" />
                  <rect y="63" width="8" height="4" fill="#F9F8F4" />
                  <rect y="104" width="8" height="0.999999" fill="#F9F8F4" />
                  <rect y="54" width="8" height="0.999999" fill="#F9F8F4" />
                  <rect y="25" width="8" height="0.999999" fill="#F9F8F4" />
                  <rect y="101" width="8" height="2" fill="#F9F8F4" />
                  <rect y="14" width="8" height="2" fill="#F9F8F4" />
                  <rect y="46" width="8" height="2" fill="#F9F8F4" />
                  <rect y="51" width="8" height="2" fill="#F9F8F4" />
                  <rect y="22" width="8" height="2" fill="#F9F8F4" />
                  <rect y="92" width="8" height="2" fill="#F9F8F4" />
                  <rect y="5" width="8" height="2" fill="#F9F8F4" />
                  <rect y="2" width="8" height="2" fill="#F9F8F4" />
                  <rect y="37" width="8" height="2" fill="#F9F8F4" />
                  <rect y="89" width="8" height="2" fill="#F9F8F4" />
                  <rect y="34" width="8" height="2" fill="#F9F8F4" />
                  <rect y="79" width="8" height="2" fill="#F9F8F4" />
                  <rect y="76" width="8" height="2" fill="#F9F8F4" />
                  <rect y="58" width="8" height="2" fill="#F9F8F4" />
                  <rect y="29" width="8" height="2" fill="#F9F8F4" />
                  <rect y="99" width="8" height="0.999999" fill="#F9F8F4" />
                  <rect y="12" width="8" height="0.999999" fill="#F9F8F4" />
                  <rect width="8" height="0.999999" fill="#F9F8F4" />
                  <rect y="44" width="8" height="0.999999" fill="#F9F8F4" />
                  <rect y="49" width="8" height="0.999999" fill="#F9F8F4" />
                  <rect y="61" width="8" height="0.999999" fill="#F9F8F4" />
                  <rect y="87" width="8" height="0.999999" fill="#F9F8F4" />
                  <rect y="32" width="8" height="0.999999" fill="#F9F8F4" />
                  <rect y="74" width="8" height="0.999999" fill="#F9F8F4" />
                  <rect y="56" width="8" height="0.999999" fill="#F9F8F4" />
                  <rect y="27" width="8" height="0.999999" fill="#F9F8F4" />
                  <rect y="72" width="8" height="0.999999" fill="#F9F8F4" />
                </svg>
              </span>
            </div>
            <div className={'flex w-full items-center justify-center p-1'}>
              <div
                className={
                  'flex min-h-[1.41vw] min-w-[1.41vw] items-center justify-center rounded-full bg-[#F9F8F4] text-black'
                }
              >
                {index.toString().length == 1 ? '0' + index : index}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
