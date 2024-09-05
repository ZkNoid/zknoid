import { cn } from '@/lib/helpers';
import { AnimatePresence, motion } from 'framer-motion';
import { ReactNode } from 'react';

export default function BaseModal({
  children,
  isOpen,
  setIsOpen,
  isDismissible = true,
  cross = true,
  border,
}: {
  children: ReactNode;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  isDismissible?: boolean;
  cross?: boolean;
  border?: string;
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ type: 'spring', duration: 0.4, bounce: 0 }}
          className={
            'fixed left-0 top-0 z-50 flex h-full w-full flex-col items-center justify-center backdrop-blur-md'
          }
          onClick={() => {
            if (!isDismissible) return;
            setIsOpen?.(false);
          }}
        >
          <div
            className={cn(
              'relative flex flex-col rounded-[5px] border border-right-accent bg-bg-dark p-4',
              border
            )}
            onClick={(e) => e.stopPropagation()}
          >
            {children}
            {isDismissible && (
              <div
                className={
                  'absolute right-0 top-0 z-50 cursor-pointer hover:opacity-80'
                }
                onClick={() => {
                  setIsOpen?.(false);
                }}
              >
                {cross && (
                  <svg
                    width="53"
                    height="64"
                    viewBox="0 0 53 64"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect
                      x="13.5469"
                      y="16.7344"
                      width="40"
                      height="4"
                      transform="rotate(45 13.5469 16.7344)"
                      fill="#D2FF00"
                    />
                    <rect
                      x="41.8438"
                      y="19.5625"
                      width="40"
                      height="4"
                      transform="rotate(135 41.8438 19.5625)"
                      fill="#D2FF00"
                    />
                  </svg>
                )}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
