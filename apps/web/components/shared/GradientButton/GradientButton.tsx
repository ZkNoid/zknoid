import Link from 'next/link';
import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { clsx } from 'clsx';

export default function GradientButton({
  title,
  icon,
  onClick,
  asLink,
  href,
  className,
}: {
  title: string;
  icon: ReactNode;
  onClick?: () => void;
  asLink?: boolean;
  href?: string;
  className?: string;
}) {
  return (
    <motion.div
      className={clsx(
        'group relative flex flex-row justify-between rounded-[5px] border border-left-accent',
        className
      )}
      whileHover={'visible'}
    >
      {asLink ? (
        <Link
          className={
            'my-auto w-full p-4 uppercase text-left-accent group-hover:text-dark-buttons-text lg:pt-5'
          }
          href={href ? href : '#'}
          onClick={onClick ? onClick : undefined}
        >
          {title}
        </Link>
      ) : (
        <button
          className={
            'm-auto mt-2 w-full p-4 uppercase text-left-accent group-hover:text-dark-buttons-text lg:pt-5 xl:mt-0.5'
          }
          onClick={onClick ? onClick : undefined}
        >
          {title}
        </button>
      )}
      <div
        className={
          'flex flex-col items-center justify-center rounded-[5px] bg-left-accent p-4 group-hover:bg-bg-dark'
        }
      >
        {icon}
      </div>
      <motion.div
        className={'absolute left-0 -z-10 h-full'}
        variants={{
          visible: {
            backgroundColor: '#D2FF00',
            width: '100%',
          },
        }}
        transition={{ duration: 0.75 }}
      />
    </motion.div>
  );
}
