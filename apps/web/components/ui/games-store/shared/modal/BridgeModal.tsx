import { AnimatePresence, motion } from 'framer-motion';
import { ReactNode, useState } from 'react';

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
            className="fixed left-0 top-0 z-10 flex h-full w-full items-center justify-center backdrop-blur-sm"
            onClick={() => onClose?.()}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="flex w-96 flex-col items-center gap-5 rounded-xl border border-right-accent bg-right-accent p-7 text-xs"
              onClick={(e) => e.stopPropagation()}
            >
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
  );
}
