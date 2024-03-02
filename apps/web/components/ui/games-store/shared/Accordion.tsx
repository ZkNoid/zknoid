import { AnimatePresence, motion } from 'framer-motion';
import { ReactNode, useState } from 'react';

export const Accordion = ({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(defaultOpen);

  return (
    <div
      className={
        'relative flex h-full min-h-[80px] w-full flex-col items-center justify-center p-4'
      }
    >
      <div
        className={'text-headline-2 cursor-pointer font-medium'}
        onClick={() => setIsOpen(!isOpen)}
      >
        {title}
      </div>
      <AnimatePresence initial={false} mode={'wait'}>
        {isOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ type: 'spring', duration: 0.4, bounce: 0 }}
            className={'text-main overflow-hidden'}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
      <div className="absolute left-0 top-0 -z-10 flex h-full w-full flex-col">
        <svg
          width="713.5"
          height="60"
          viewBox="0 0 713.5 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-auto w-full"
        >
          <path
            d="M1 59V16C1 8.26801 7.26801 2 15 2H656.863C660.573 2 664.131 3.47262 666.756 6.09437L707.393 46.681C710.023 49.307 711.5 52.8706 711.5 56.5866V59C711.5 66.732 705.232 73 697.5 73H15C7.26803 73 1 66.732 1 59Z"
            stroke="#D2FF00"
            stroke-width="2"
          />
          <path
            d="M710.5 1H675.412C673.618 1 672.731 3.17836 674.015 4.43115L709.103 38.6838C710.37 39.9204 712.5 39.0229 712.5 37.2527V3C712.5 1.89543 711.605 1 710.5 1Z"
            stroke="#D2FF00"
            stroke-width="2"
          />
          <rect
            x="701.638"
            y="3.14209"
            width="20"
            height="2"
            transform="rotate(90 701.638 3.14209)"
            fill="#D2FF00"
          />
          <rect
            x="710.643"
            y="14.1464"
            width="20"
            height="2"
            transform="rotate(-180 710.643 14.1464)"
            fill="#D2FF00"
          />
        </svg>

        <div className="mr-[1.5px] flex flex-grow rounded-b-2xl border-x-2 border-b-2 border-left-accent"></div>
      </div>
    </div>
  );
};
