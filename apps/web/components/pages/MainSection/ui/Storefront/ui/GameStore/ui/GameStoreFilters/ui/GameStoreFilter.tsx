import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/helpers';

export function GameStoreFilter<T extends string>({
  defaultExpanded,
  title,
  items,
  itemsSelected,
  setItemsSelected,
}: {
  defaultExpanded: boolean;
  title: string;
  items: T[];
  itemsSelected: T[];
  setItemsSelected: (genres: T[]) => void;
}) {
  const [isOpen, setIsOpen] = useState<boolean>(defaultExpanded);

  return (
    <motion.div
      className={
        'relative flex flex-col gap-[0.781vw] rounded-[0.781vw] border-2 border-left-accent p-[1.042vw]'
      }
    >
      <span
        className={
          'w-full cursor-pointer font-museo text-[1.25vw] font-bold hover:opacity-80'
        }
        onClick={() => setIsOpen(!isOpen)}
      >
        {title}
      </span>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ type: 'spring', duration: 0.4, bounce: 0 }}
            className={'flex flex-col gap-[0.781vw] overflow-hidden'}
          >
            {items.map((item) => (
              <div
                key={item}
                className={cn(
                  `cursor-pointer font-plexsans text-[1.042vw] underline-offset-[0.26vw]`,
                  itemsSelected.includes(item)
                    ? 'text-left-accent underline'
                    : 'hover:text-left-accent'
                )}
                onClick={() => {
                  setItemsSelected(
                    itemsSelected.includes(item)
                      ? itemsSelected.filter((x) => x != item)
                      : [...itemsSelected, item]
                  );
                }}
              >
                {item}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <div
        className={
          'absolute -right-[2px] -top-[2px] bg-bg-grey pb-[0.26vw] pl-[0.26vw]'
        }
      >
        <svg
          width="42"
          height="42"
          viewBox="0 0 42 42"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={'h-[2.188vw] w-[2.188vw]'}
        >
          <path
            d="M39 1H3.82843C2.04662 1 1.15428 3.15428 2.41421 4.41421L37.5858 39.5858C38.8457 40.8457 41 39.9534 41 38.1716V3C41 1.89543 40.1046 1 39 1Z"
            fill="#D2FF00"
            stroke="#D2FF00"
            stroke-width="2"
            className={cn({ 'fill-none': !isOpen })}
          />
        </svg>
      </div>
      <div
        className={'absolute right-[0.104vw] top-[0.104vw] cursor-pointer'}
        onClick={() => setIsOpen(!isOpen)}
      >
        <motion.svg
          width="21"
          height="21"
          viewBox="0 0 21 21"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          animate={isOpen ? { rotate: 45 } : { rotate: 0 }}
          className={'h-[1.094vw] w-[1.094vw]'}
        >
          <rect
            x="0.14209"
            y="9.14648"
            width="20"
            height="2"
            fill="#252525"
            className={cn({ 'fill-left-accent': !isOpen })}
          />
          <rect
            x="11.1465"
            y="0.142578"
            width="20"
            height="2"
            transform="rotate(90 11.1465 0.142578)"
            fill="#252525"
            className={cn({ 'fill-left-accent': !isOpen })}
          />
        </motion.svg>
      </div>
    </motion.div>
  );
}
