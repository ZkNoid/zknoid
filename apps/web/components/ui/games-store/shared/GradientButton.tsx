import Link from 'next/link';
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

export const GradientButton = ({
  title,
  icon,
  onClick,
  asLink,
  href,
}: {
  title: string;
  icon: ReactNode;
  onClick?: () => void;
  asLink?: boolean;
  href?: string;
}) => {
  return (
    <motion.div
      className={
        'group relative flex flex-row justify-between rounded-[5px] border border-left-accent lg:mr-[11.2%]'
      }
      variants={{
        visible: {
          background: 'linear-gradient(to right, #D2FF00 100%, #212121 100%)',
          transition: { duration: 0.5, delayChildren: 0.5 },
        },
      }}
      whileHover={'visible'}
    >
      {asLink ? (
        <Link
          className={
            'm-auto mt-1 w-full p-4 uppercase text-left-accent group-hover:text-dark-buttons-text lg:pt-5 xl:mt-0.5'
          }
          href={href ? href : '#'}
          onClick={onClick ? onClick : undefined}
        >
          {title}
        </Link>
      ) : (
        <button
          className={
            'm-auto mt-1 w-full p-4 uppercase text-left-accent group-hover:text-dark-buttons-text lg:pt-5 xl:mt-0.5'
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
    </motion.div>
  );
};
