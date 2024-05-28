import { AnimatePresence, motion } from 'framer-motion';
import { ReactNode, useState } from 'react';

export default function BridgeModal({
  children,
  isOpen,
  setIsOpen,
  isDismissible = true,
  cross = true,
  defaultOpen = false,
  onClose,
}: {
  children: ReactNode;
  isOpen?: boolean;
  setIsOpen?: (isOpen: boolean) => void;
  isDismissible?: boolean;
  cross?: boolean;
  defaultOpen?: boolean;
  onClose?: () => void;
}) {
  const [isOpenInternal, setIsOpenInternal] = useState<boolean>(defaultOpen);

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
              className="flex w-96 flex-col items-center gap-5 rounded-xl border border-left-accent bg-bg-dark p-7 text-xs"
              onClick={(e) => e.stopPropagation()}
            >
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    
  );
}
