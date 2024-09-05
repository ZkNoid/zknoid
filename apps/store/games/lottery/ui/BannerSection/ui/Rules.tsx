import { useState } from 'react';
import { cn } from '@/lib/helpers';

export default function Rules() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <div
      className={cn({
        'absolute bottom-0 right-0 z-0 h-full w-[35vw] rounded-l-[1.042vw] rounded-r-[0.521vw] bg-right-accent':
          isOpen,
      })}
    >
      {isOpen && (
        <div
          className={
            'flex flex-row gap-[1.042vw] px-[1.042vw] py-[0.521vw] text-bg-grey'
          }
        >
          <div className={'flex w-full flex-col gap-[0.885vw]'}>
            <div className={'flex flex-col gap-[0.26vw]'}>
              <span className={'font-plexsans text-[0.833vw] font-semibold'}>
                Round Duration
              </span>
              <span className={'font-plexsans text-[0.729vw] font-normal'}>
                Each round lasts approximately 24 hours
              </span>
            </div>
            <div className={'flex flex-col gap-[0.26vw]'}>
              <span className={'font-plexsans text-[0.833vw] font-semibold'}>
                Ticket Purchase
              </span>
              <span className={'font-plexsans text-[0.729vw] font-normal'}>
                Each ticket costs 1 $MINA
              </span>
              <span className={'font-plexsans text-[0.729vw] font-normal'}>
                Ticket consist of 6 numbers (1-9) and quantity
              </span>
              <span className={'font-plexsans text-[0.729vw] font-normal'}>
                Duplicates tickets are allowed
              </span>
            </div>
            <div className={'flex flex-col gap-[0.26vw]'}>
              <span className={'font-plexsans text-[0.833vw] font-semibold'}>
                Platform Fees
              </span>
              <span className={'font-plexsans text-[0.729vw] font-normal'}>
                A 3% fee is deducted from each ticket purchase.
              </span>
            </div>
            <div className={'flex flex-col gap-[0.26vw]'}>
              <span className={'font-plexsans text-[0.833vw] font-semibold'}>
                Winning Ticket reveal
              </span>
              <span className={'font-plexsans text-[0.729vw] font-normal'}>
                Winning ticket revealed within 2 days after round ends
              </span>
            </div>
          </div>
          <div className={'flex w-full flex-col gap-[0.885vw]'}>
            <div className={'flex flex-col gap-[0.26vw]'}>
              <span className={'font-plexsans text-[0.833vw] font-semibold'}>
                Claiming Rewards
              </span>
              <span className={'font-plexsans text-[0.729vw] font-normal'}>
                Each ticket earns points: 0, 90, 324, 2187, 26244, 590490, or
                31886460 for 0, 1, 2, 3, 4, 5, or 6 correct numbers
              </span>
              <span
                className={
                  'mt-[0.26vw] font-plexsans text-[0.729vw] font-normal'
                }
              >
                The reward is a share of the total bank based on points, order
                of numbers matters
              </span>
            </div>
            <div className={'flex flex-col gap-[0.26vw]'}>
              <span className={'font-plexsans text-[0.833vw] font-semibold'}>
                Refunds
              </span>
              <span className={'font-plexsans text-[0.729vw] font-normal'}>
                If the winning ticket is not revealed within 2 days, you can get
                a refund for your ticket
              </span>
            </div>
          </div>
        </div>
      )}
      <button
        className={cn(
          'absolute bottom-[1.042vw] right-[1.042vw] z-[1] flex h-[3.125vw] w-[3.125vw] items-center justify-center rounded-[0.26vw] border-left-accent bg-bg-dark hover:opacity-80',
          { border: !isOpen }
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <svg
            width="1.042vw"
            height="1.042vw"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12.094 9.97056L19.5186 2.54594L17.3973 0.424621L9.97266 7.84924L2.54804 0.424621L0.426715 2.54594L7.85134 9.97056L0.426714 17.3952L2.54803 19.5165L9.97266 12.0919L17.3973 19.5165L19.5186 17.3952L12.094 9.97056Z"
              fill="#DCB8FF"
            />
          </svg>
        ) : (
          <div
            className={'font-museo text-[1.823vw] font-bold text-left-accent'}
          >
            ?
          </div>
        )}
      </button>
    </div>
  );
}
