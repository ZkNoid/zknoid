import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { cn } from '@/lib/helpers';

export default function Skeleton({
  isLoading,
  children,
  className,
}: {
  isLoading: boolean;
  children: ReactNode;
  className?: string;
}) {
  if (isLoading) {
    return (
      <motion.div
        className={cn('bg-[#a3a3a3]', className)}
        initial={{ opacity: 0.3 }}
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ ease: 'easeIn', repeat: Infinity, duration: 2 }}
      />
    );
  } else {
    return <>{children}</>;
  }
}
