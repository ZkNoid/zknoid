import { AnimatePresence, motion } from 'framer-motion';
import { ReactNode, useState } from 'react';

export const Modal = ({
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
          setIsOpen ? () => setIsOpen(true) : () => setIsOpenUncontrolled(true)
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
              'fixed left-0 top-0 z-50 flex h-full w-full flex-col items-center justify-center backdrop-blur-md'
            }
            onClick={
              setIsOpen
                ? () => setIsOpen(false)
                : () => setIsOpenUncontrolled(false)
            }
          >
            <div
              className={
                'flex flex-col rounded-[5px] border border-left-accent bg-bg-dark p-4'
              }
              onClick={(e) => e.stopPropagation()}
            >
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
