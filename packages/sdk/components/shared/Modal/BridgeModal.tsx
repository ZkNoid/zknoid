import { AnimatePresence, motion } from 'framer-motion';
import { ReactNode } from 'react';

export default function BridgeModal({
  children,
  isOpen,
  onClose,
}: {
  children: ReactNode;
  isOpen?: boolean;
  onClose?: () => void;
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="absolute left-0 top-0 z-[21] flex h-full w-full items-center justify-center lg:fixed lg:backdrop-blur-sm"
          onClick={() => onClose?.()}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="flex h-full w-full flex-col items-center gap-5 border border-right-accent bg-right-accent p-7 text-xs lg:h-auto lg:w-96 lg:rounded-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
