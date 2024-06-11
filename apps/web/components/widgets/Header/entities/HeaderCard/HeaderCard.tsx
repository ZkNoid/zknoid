import Image from 'next/image';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';
import { AccountSVG } from './etc/AccountSVG';
import { TopUpSVG } from './etc/TopUpSVG';

export default function HeaderCard({
  svg,
  text,
  toggle,
  expanded,
  onClick,
  isMiddle,
  className,
}: {
  svg: 'account' | 'mina' | 'top-up';
  text: string;
  toggle?: boolean;
  expanded?: boolean;
  onClick?: () => void;
  isMiddle?: boolean;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        'group flex cursor-pointer items-center justify-center gap-[10px] rounded border border-bg-dark p-1 px-2 text-header-menu text-bg-dark transition duration-75 ease-in hover:border-left-accent hover:bg-bg-dark hover:text-left-accent lg:justify-normal',
        {
          'rounded-b-none border-middle-accent text-middle-accent hover:bg-middle-accent/20':
            expanded,
          'hover:border-middle-accent hover:text-middle-accent': isMiddle,
          'bg-right-accent lg:bg-middle-accent': !expanded && isMiddle,
          'bg-left-accent': !expanded && !isMiddle,
        },
        className && className
      )}
      onClick={() => onClick?.()}
    >
      {svg === 'account' && (
        <AccountSVG
          fill={'#252525'}
          className={'h-[24px] w-[24px] group-hover:fill-middle-accent'}
        />
      )}
      {svg === 'top-up' && (
        <TopUpSVG
          fill={'#252525'}
          className={'h-[24px] w-[24px] group-hover:fill-left-accent'}
        />
      )}
      {svg === 'mina' && (
        <Image src={'/image/cards/mina.png'} alt="" width={24} height={24} />
      )}

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
              'group-hover:stroke-middle-accent': !expanded,
              'stroke-middle-accent': expanded,
            })}
          />
        </motion.svg>
      )}
    </div>
  );
}
