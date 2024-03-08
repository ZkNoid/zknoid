import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

export function FiltrationBox<T extends string>({
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
  const [isExpanded, setIsExpanded] = useState<boolean>(defaultExpanded);

  return (
    <div className="relative flex min-h-[80px] w-full flex-col gap-2 p-5">
      <div className="text-headline-3 font-bold">{title}</div>
      <AnimatePresence initial={false} mode={'wait'}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ type: 'spring', duration: 0.4, bounce: 0 }}
            className={'z-10 overflow-hidden'}
          >
            {items.map((item) => (
              <div
                key={item}
                className={`cursor-pointer font-plexsans text-filter ${
                  itemsSelected.includes(item)
                    ? 'text-left-accent underline'
                    : 'hover:text-left-accent'
                } decoration-left-accent underline-offset-[5px]`}
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

      <div className="absolute left-0 top-0 z-0 flex h-full w-full flex-col">
        <svg
          viewBox="0 0 351 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={'cursor-pointer'}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <path
            d="M1 17.5234V111.731V174.523C1 182.808 7.71573 189.523 16 189.523H335C343.284 189.523 350 182.808 350 174.523V58.1101C350 54.1286 348.417 50.3105 345.6 47.4969L304.963 6.91027C302.151 4.10124 298.338 2.52344 294.363 2.52344H16C7.71573 2.52344 1 9.23917 1 17.5234Z"
            stroke="#D2FF00"
            strokeWidth="2"
          />
          <path
            d="M348 2.52344H312.912C311.118 2.52344 310.231 4.7018 311.515 5.95459L346.603 40.2072C347.87 41.4438 350 40.5463 350 38.7761V4.52344C350 3.41887 349.105 2.52344 348 2.52344Z"
            fill={isExpanded ? '#D2FF00' : ''}
            stroke="#D2FF00"
            strokeWidth="2"
          />

          {isExpanded ? (
            <>
              <rect
                x="331.775"
                y="6.89062"
                width="20"
                height="2"
                transform="rotate(45 331.775 6.89062)"
                fill="#252525"
              />
              <rect
                x="345.924"
                y="8.30469"
                width="20"
                height="2"
                transform="rotate(135 345.924 8.30469)"
                fill="#252525"
              />
            </>
          ) : (
            <>
              <rect
                x="330.775"
                y="-0.5"
                width="17"
                height="2"
                transform="rotate(90 331.775 6.89062)"
                fill="#D2FF00"
              />
              <rect
                x="345.924"
                y="1.30469"
                width="17"
                height="2"
                transform="rotate(-180 345.924 8.30469)"
                fill="#D2FF00"
              />
            </>
          )}
        </svg>
        <div className="flex w-full flex-grow rounded-b-2xl border-x-2 border-b-2 border-left-accent"></div>
      </div>
    </div>
  );
}
