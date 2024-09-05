import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

export default function ToastWrap({
  key,
  children,
  isClearable,
}: {
  key: number;
  children: ReactNode;
  isClearable?: boolean;
}) {
  return (
    <motion.div
      key={key}
      className={clsx(
        'flex flex-row items-center justify-center gap-4 rounded-[5px] border border-foreground bg-[#464646] py-4',
        {
          'px-6': !isClearable,
          'px-2': isClearable,
        }
      )}
      initial={{ x: 1000 }}
      animate={{ x: 0 }}
      exit={{ x: 1000 }}
    >
      {children}
    </motion.div>
  );
}
