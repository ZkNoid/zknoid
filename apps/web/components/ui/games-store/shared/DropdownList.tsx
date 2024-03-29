import { clsx } from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

export const DropdownList = ({
  label,
  items,
  selectedItem,
  setSelectedItem,
  defaultOpen = false,
  className,
}: {
  label: string;
  items: string[];
  selectedItem: string;
  setSelectedItem: (item: string) => void;
  defaultOpen?: boolean;
  className?: string;
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(defaultOpen);

  return (
    <div className={`relative ${className}`}>
      <span
        className={clsx(
          'group flex h-full min-w-[300px] cursor-pointer flex-row items-center justify-between gap-2 rounded-[5px] border border-foreground px-4 py-1 hover:border-b hover:border-left-accent hover:text-left-accent',
          {
            'rounded-b-none border-white border-b-bg-dark duration-75 ease-out':
              isOpen,
          }
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={'font-plexsans text-main'}>
          {label}: {selectedItem}
        </span>
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
          animate={isOpen ? 'open' : 'closed'}
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
      </span>
      <AnimatePresence initial={false} mode={'wait'}>
        {isOpen && (
          <motion.div
            className={
              'absolute top-full z-10 flex w-full min-w-[300px] flex-col items-center justify-start overflow-hidden rounded-[5px] rounded-t-none border border-t-0 bg-bg-dark'
            }
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: 'spring', duration: 0.8, bounce: 0 }}
          >
            {items.map((value, index) => (
              <span
                key={index}
                onClick={() => {
                  setSelectedItem(value);
                  setIsOpen(false);
                }}
                className={
                  'h-full w-full cursor-pointer px-4 py-2 font-plexsans text-main last:pb-4 hover:text-left-accent'
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
};
