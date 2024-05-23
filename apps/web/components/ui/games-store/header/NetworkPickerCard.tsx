import Image from 'next/image';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';
import { cn } from '@/lib/helpers';

export default function NetworkPickerCard({
  text,
  toggle,
  expanded,
  onClick,
  className,
}: {
  text: string;
  toggle?: boolean;
  expanded?: boolean;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'group flex cursor-pointer items-center justify-center gap-[10px] rounded border ',
        'border-bg-dark p-1 px-2 text-header-menu text-bg-dark transition duration-75 ease-in',
        'hover:border-left-accent hover:bg-bg-dark hover:text-left-accent lg:justify-normal',
        expanded
          ? 'rounded-b-none border-left-accent bg-bg-dark text-left-accent hover:bg-right-accent/20'
          : 'bg-left-accent',
        className
      )}
      onClick={() => onClick?.()}
    >
      <Image src={'/image/cards/mina.png'} alt="" width={24} height={24} />
      {text}
      {toggle && (
        <motion.svg
          width="16"
          height="10"
          viewBox="0 0 16 10"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          variants={{
            open: { rotate: 180 },
            closed: { rotate: 0 },
          }}
          transition={{ type: 'spring', duration: 0.4, bounce: 0 }}
          animate={expanded ? 'open' : 'closed'}
        >
          <path
            d="M15 1.5L8 8.5L1 1.5"
            stroke="#252525"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={clsx({
              'group-hover:stroke-left-accent': !expanded,
              'stroke-left-accent': expanded,
            })}
          />
        </motion.svg>
      )}
    </div>
  );
}
