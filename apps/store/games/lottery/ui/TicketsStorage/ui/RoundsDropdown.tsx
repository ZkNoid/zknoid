import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/helpers';

export const RoundsDropdown = ({
  currentRoundId,
  setCurrentRoundId,
  rounds,
}: {
  currentRoundId: number | undefined;
  setCurrentRoundId: (roundId: number) => void;
  rounds: { id: number; hasClaim: boolean }[];
}) => {
  const [expanded, setIsExpanded] = useState<boolean>(false);
  return (
    <motion.div
      className={'relative flex min-w-[10.417vw] flex-col'}
      animate={expanded ? 'open' : 'closed'}
    >
      <motion.div
        className={cn(
          'group flex w-full cursor-pointer flex-row items-center justify-between rounded-[0.26vw] border border-foreground px-[0.26vw] py-[0.104vw] hover:border-left-accent hover:opacity-80',
          {
            'rounded-b-none': expanded,
          }
        )}
        onClick={() => setIsExpanded(!expanded)}
      >
        <span
          className={
            'font-plexsans text-[0.833vw] text-foreground group-hover:text-left-accent'
          }
        >
          {currentRoundId !== undefined
            ? `Lottery round ${currentRoundId}`
            : 'Choose round'}
        </span>
        <motion.svg
          width="0.833vw"
          height="0.521vw"
          viewBox="0 0 16 10"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={'h-[0.521vw] w-[0.833vw]'}
          variants={{
            open: { rotate: 180 },
            closed: { rotate: 0 },
          }}
          transition={{ type: 'spring', duration: 0.4, bounce: 0 }}
        >
          <motion.path
            d="M15 1.2447L8 8.75586L1 1.2447"
            stroke="#F9F8F4"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={'group-hover:stroke-left-accent'}
          />
        </motion.svg>
      </motion.div>
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ type: 'spring', duration: 0.4, bounce: 0 }}
            className="absolute top-full flex max-h-[15.625vw] w-full flex-col items-center overflow-hidden overflow-y-scroll rounded-b border border-t-0 border-foreground bg-bg-grey px-[0.521vw]"
          >
            {rounds.map((item, index) => (
              <div
                key={index}
                className={
                  'group flex w-full cursor-pointer flex-row justify-between border-t border-foreground py-[0.521vw] first:border-t-0'
                }
                onClick={() => {
                  if (item.id != currentRoundId) {
                    setCurrentRoundId(item.id);
                    setIsExpanded(false);
                  }
                }}
              >
                <span
                  className={
                    'font-plexsans text-[0.833vw] text-foreground group-hover:text-left-accent'
                  }
                >
                  Lottery round {item.id}
                </span>
                {item.hasClaim && (
                  <div
                    className={
                      'flex flex-col items-center justify-center rounded-[5.208vw] bg-left-accent'
                    }
                  >
                    <span
                      className={
                        'px-[0.26vw] py-[0.104vw] font-museo text-[0.625vw] font-medium text-bg-dark'
                      }
                    >
                      Claim
                    </span>
                  </div>
                )}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
