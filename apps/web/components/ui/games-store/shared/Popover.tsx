import { ReactNode, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export const Popover = ({
  children,
  trigger,
  isOpen,
  setIsOpen,
}: {
  children: ReactNode;
  trigger: ReactNode;
  isOpen?: boolean;
  setIsOpen?: (isOpen: boolean) => void;
}) => {
  const [isOpenUncontrolled, setIsOpenUncontrolled] = useState<boolean>(false);

  return (
    <div className={'relative flex flex-col items-center justify-center'}>
      <div
        className={'h-full w-full cursor-pointer'}
        onClick={
          setIsOpen
            ? () => setIsOpen(!isOpen)
            : () => setIsOpenUncontrolled(!isOpenUncontrolled)
        }
      >
        {trigger}
      </div>
      <AnimatePresence>
        {(isOpen ? isOpen : isOpenUncontrolled) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'spring', duration: 0.4, bounce: 0 }}
            className={
              'absolute top-[110%] z-10 rounded-[5px] border border-white bg-bg-dark p-2'
            }
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
