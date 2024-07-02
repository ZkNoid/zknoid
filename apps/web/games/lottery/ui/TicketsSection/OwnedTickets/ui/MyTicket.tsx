import { cn } from '@/lib/helpers';
import Image from 'next/image';
import TicketBG1 from '../assets/ticket-bg-1.svg';
import TicketBG2 from '../assets/ticket-bg-2.svg';
import TicketBG3 from '../assets/ticket-bg-3.svg';
import TicketBG4 from '../assets/ticket-bg-4.svg';
import TicketBG5 from '../assets/ticket-bg-5.svg';
import TicketBG6 from '../assets/ticket-bg-6.svg';
import TicketBG7 from '../assets/ticket-bg-7.svg';
import TicketBG8 from '../assets/ticket-bg-8.svg';
import TicketBG9 from '../assets/ticket-bg-9.svg';
import TicketBG10 from '../assets/ticket-bg-10.svg';
import TicketBG11 from '../assets/ticket-bg-11.svg';
import { AnimatePresence, motion } from 'framer-motion';

const ticketsImages = [
  TicketBG1,
  TicketBG2,
  TicketBG3,
  TicketBG4,
  TicketBG5,
  TicketBG6,
  TicketBG7,
  TicketBG8,
  TicketBG9,
  TicketBG10,
  TicketBG11,
];

const ClosedTicket = ({
  combination,
  index,
  rounded,
  className,
  onClick,
}: {
  combination: number[];
  index: number;
  rounded: 'full' | 'right';
  className?: string;
  onClick?: () => void;
}) => {
  return (
    <motion.div
      onClick={onClick ?? onClick}
      className={cn(
        'relative flex h-[13.53vw] flex-row bg-middle-accent p-[0.33vw]',
        {
          'rounded-r-[1.33vw]': rounded == 'right',
          'rounded-[2.604vw]': rounded == 'full',
          'cursor-pointer': onClick,
        },
        className
      )}
      whileHover={onClick && { scale: 1.05 }}
    >
      <div
        className={'flex flex-col justify-between rounded-[1.042vw] border p-1'}
      >
        <div
          className={
            'my-auto flex h-[8vw] w-full flex-row items-center justify-center gap-1'
          }
        >
          <div
            className={'flex h-[8vw] w-[65%] flex-col-reverse justify-between'}
          >
            {combination.map((item, index) => (
              <span
                key={index}
                className={
                  'rotate-180 font-plexsans text-[0.9vw] font-medium [writing-mode:vertical-rl]'
                }
              >
                {item}
              </span>
            ))}
          </div>
          <span className={'h-full w-[55%]'}>
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 10 109"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={'h-full w-full rotate-180'}
            >
              <rect y="106" width="10" height="3" fill="#F9F8F4" />
              <rect y="95" width="10" height="3" fill="#F9F8F4" />
              <rect y="8" width="10" height="3" fill="#F9F8F4" />
              <rect y="40" width="10" height="3" fill="#F9F8F4" />
              <rect y="68" width="10" height="3" fill="#F9F8F4" />
              <rect y="82" width="10" height="4" fill="#F9F8F4" />
              <rect y="17" width="10" height="4" fill="#F9F8F4" />
              <rect y="63" width="10" height="4" fill="#F9F8F4" />
              <rect y="104" width="10" height="0.999999" fill="#F9F8F4" />
              <rect y="54" width="10" height="0.999999" fill="#F9F8F4" />
              <rect y="25" width="10" height="0.999999" fill="#F9F8F4" />
              <rect y="101" width="10" height="2" fill="#F9F8F4" />
              <rect y="14" width="10" height="2" fill="#F9F8F4" />
              <rect y="46" width="10" height="2" fill="#F9F8F4" />
              <rect y="51" width="10" height="2" fill="#F9F8F4" />
              <rect y="22" width="10" height="2" fill="#F9F8F4" />
              <rect y="92" width="10" height="2" fill="#F9F8F4" />
              <rect y="5" width="10" height="2" fill="#F9F8F4" />
              <rect y="2" width="10" height="2" fill="#F9F8F4" />
              <rect y="37" width="10" height="2" fill="#F9F8F4" />
              <rect y="89" width="10" height="2" fill="#F9F8F4" />
              <rect y="34" width="10" height="2" fill="#F9F8F4" />
              <rect y="79" width="10" height="2" fill="#F9F8F4" />
              <rect y="76" width="10" height="2" fill="#F9F8F4" />
              <rect y="58" width="10" height="2" fill="#F9F8F4" />
              <rect y="29" width="10" height="2" fill="#F9F8F4" />
              <rect y="99" width="10" height="0.999999" fill="#F9F8F4" />
              <rect y="12" width="10" height="0.999999" fill="#F9F8F4" />
              <rect width="10" height="0.999999" fill="#F9F8F4" />
              <rect y="44" width="10" height="0.999999" fill="#F9F8F4" />
              <rect y="49" width="10" height="0.999999" fill="#F9F8F4" />
              <rect y="61" width="10" height="0.999999" fill="#F9F8F4" />
              <rect y="87" width="10" height="0.999999" fill="#F9F8F4" />
              <rect y="32" width="10" height="0.999999" fill="#F9F8F4" />
              <rect y="74" width="10" height="0.999999" fill="#F9F8F4" />
              <rect y="56" width="10" height="0.999999" fill="#F9F8F4" />
              <rect y="27" width="10" height="0.999999" fill="#F9F8F4" />
              <rect y="72" width="10" height="0.999999" fill="#F9F8F4" />
            </svg>
          </span>
        </div>
        <div className={'flex w-full items-center justify-center p-1'}>
          <div
            className={
              'flex min-h-[1.41vw] min-w-[1.41vw] items-center justify-center rounded-full bg-[#F9F8F4] text-[0.625vw] text-black'
            }
          >
            {index.toString().length == 1 ? '0' + index : index}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function MyTicket({
  combination,
  amount,
  index,
  isOpen,
  onClick,
  tags,
}: {
  isOpen: boolean;
  combination: number[];
  amount: number;
  index: number;
  onClick: () => void;
  tags?: string[];
}) {
  return (
    <AnimatePresence>
      {isOpen ? (
        <div className={'flex flex-row'} onClick={onClick}>
          <div className="relative h-[13.53vw] w-[24vw] rounded-[1.33vw] rounded-r-none bg-middle-accent p-[0.33vw]">
            <div className="pointer-events-none absolute h-[12.87vw] w-[23.33vw] rounded-[1vw] border"></div>
            <div className="relative z-0 flex h-full w-full flex-col p-[1.33vw]">
              <div className="flex flex-row">
                <div className="text-[1.6vw] uppercase text-foreground">
                  Ticket {index}
                </div>
              </div>
              <div className="flex flex-row gap-[0.33vw]">
                {combination.map((fieldId, index) => (
                  <div
                    key={index}
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
                  {amount} {amount > 1 ? 'Tickets' : 'Ticket'}
                </div>
                {tags &&
                  tags.map((item, index) => (
                    <div
                      key={index}
                      className={
                        'flex items-center justify-center rounded-[0.33vw]  border-[0.07vw] bg-middle-accent px-[0.3vw] py-[0.15vw] font-plexsans text-[0.8vw] font-medium'
                      }
                    >
                      {item}
                    </div>
                  ))}
              </div>
              <Image
                src={
                  ticketsImages[
                    Math.round(Math.random() * ticketsImages.length)
                  ]
                }
                alt={'Lottery Ticket'}
                className={
                  'absolute left-0 top-0 -z-[1] h-full w-full rounded-[1vw] rounded-bl-[2vw] object-cover object-center p-px'
                }
              />
            </div>
          </div>
          <div className={'flex flex-row'}>
            <div
              className={
                'flex flex-col items-center justify-between bg-middle-accent'
              }
            >
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
            <ClosedTicket
              combination={combination}
              index={index}
              rounded={'right'}
            />
          </div>
        </div>
      ) : (
        <ClosedTicket
          combination={combination}
          index={index}
          rounded={'full'}
          onClick={onClick}
        />
      )}
    </AnimatePresence>
  );
}
