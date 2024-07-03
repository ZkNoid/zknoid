import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

export function SortByFilter<T extends string>({
  sortMethods,
  sortBy,
  setSortBy,
  className,
}: {
  sortMethods: T[];
  sortBy: T;
  setSortBy: (value: T) => void;
  className?: string;
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <div className={`relative ${className}`} onClick={() => setIsOpen(!isOpen)}>
      <motion.span
        className={
          'group flex h-full min-w-[300px] cursor-pointer flex-row items-center justify-between gap-2 rounded-[5px] border px-4 py-1'
        }
        variants={{
          open: {
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
            borderColor: 'white',
            borderBottomColor: '#212121',
            transitionDuration: '75ms',
            animationDuration: '75ms',
            transitionTimingFunction: 'ease-out',
            msTransitionTimingFunction: 'ease-out',
          },
          closed: { borderColor: '#212121', borderBottomColor: '#212121' },
        }}
        animate={isOpen ? 'open' : 'closed'}
        whileHover={{
          borderBottomWidth: '1px',
          borderColor: '#D2FF00',
          borderBottomColor: '#D2FF00',
          color: '#D2FF00',
        }}
      >
        <span className={'font-plexsans text-main'}>Sort By: {sortBy}</span>
        <motion.svg
          width="16"
          height="10"
          viewBox="0 0 16 10"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          variants={{
            open: { rotate: 180 },
            closed: { rotate: 0 },
          }}
          transition={{ type: 'spring', duration: 0.4, bounce: 0 }}
        >
          <path
            d="M15 1.5L8 8.5L1 1.5"
            stroke="#252525"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={'stroke-white group-hover:stroke-left-accent'}
          />
        </motion.svg>
      </motion.span>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            className={
              'absolute top-full z-30 flex w-full min-w-[300px] flex-col items-center justify-start overflow-hidden rounded-[5px] rounded-t-none border border-t-0 bg-bg-dark'
            }
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: 'spring', duration: 0.8, bounce: 0 }}
          >
            {sortMethods.map((value, index) => (
              <span
                key={index}
                onClick={() => {
                  setSortBy(value);
                  setIsOpen(false);
                }}
                className={
                  'bg-bg-grey h-full w-full cursor-pointer px-4 py-2 font-plexsans text-main last:pb-4 hover:bg-[#252525] hover:text-left-accent'
                }
              >
                {value}
              </span>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
