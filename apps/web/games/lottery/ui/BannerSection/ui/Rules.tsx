import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';

export default function Rules() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <AnimatePresence>
      {isOpen ? (
        <div
          className={
            'absolute right-0 top-0 h-full w-[30vw] rounded-[0.67vw] bg-right-accent'
          }
        >
          <div
            className={'flex flex-col gap-[0.521vw] p-[1.042vw] text-bg-dark'}
          >
            <span className={'font-museo text-[1.25vw] font-bold'}>
              Lottery Rules
            </span>
            <div className={'flex flex-col gap-[0.521vw]'}>
              <div className={'flex flex-col gap-[0.26vw]'}>
                <span
                  className={
                    'font-plexsans text-[0.833vw] font-medium uppercase'
                  }
                >
                  Round Duration
                </span>
                <span className={'font-plexsans text-[0.729vw]'}>
                  Each round lasts approximately 24 hours
                </span>
                <span
                  className={
                    'font-plexsans text-[0.833vw] font-medium uppercase'
                  }
                >
                  Ticket Purchase
                </span>
                <div
                  className={'flex flex-col gap-1 font-plexsans text-[0.729vw]'}
                >
                  <span>Each ticket costs 1 $MINA</span>
                  <span>Ticket consist of 6 numbers (1-9) and quantity</span>
                  <span>Duplicates tickets are allowed</span>
                </div>
                <span
                  className={
                    'font-plexsans text-[0.833vw] font-medium uppercase'
                  }
                >
                  Winning Ticket reveal
                </span>
                <span className={'font-plexsans text-[0.729vw]'}>
                  Winning ticket revealed within 2 days after round ends
                </span>
                <span
                  className={
                    'font-plexsans text-[0.833vw] font-medium uppercase'
                  }
                >
                  Claiming Rewards
                </span>
                <div
                  className={'flex flex-col gap-1 font-plexsans text-[0.729vw]'}
                >
                  <span>
                    Each ticket earns points: 0, 90, 324, 2187, 26244, 590490,
                    or 31886460 for 0, 1, 2, 3, 4, 5, or 6 correct numbers
                  </span>
                  <span>
                    The reward is a share of the total bank based on points,
                    order of numbers matters
                  </span>
                </div>
                <span
                  className={
                    'font-plexsans text-[0.833vw] font-medium uppercase'
                  }
                >
                  Refunds
                </span>
                <span className={'font-plexsans text-[0.729vw]'}>
                  If the winning ticket is not revealed within 2 days, you can
                  get a refund for your ticket
                </span>
                <span
                  className={
                    'font-plexsans text-[0.833vw] font-medium uppercase'
                  }
                >
                  Platform Fees
                </span>
                <span className={'font-plexsans text-[0.729vw]'}>
                  A 3% fee is deducted from each ticket purchase.
                </span>
              </div>
            </div>
          </div>
          <button
            className={
              'absolute bottom-[1.042vw] right-[1.042vw] flex h-[3.125vw] w-[3.125vw] items-center justify-center rounded-[0.26vw] bg-bg-dark hover:opacity-80'
            }
            onClick={() => setIsOpen(false)}
          >
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
          </button>
        </div>
      ) : (
        <button
          className={
            'absolute bottom-[1.042vw] right-[1.042vw] flex h-[3.125vw] w-[3.125vw] items-center justify-center rounded-[0.26vw] border border-left-accent hover:bg-left-accent/10'
          }
          onClick={() => setIsOpen(true)}
        >
          <div
            className={'font-museo text-[1.823vw] font-bold text-left-accent'}
          >
            ?
          </div>
        </button>
      )}
    </AnimatePresence>
  );
}
