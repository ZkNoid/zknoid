import { ReactNode, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';

export default function Tab({
  title,
  link,
  items,
}: {
  title: string;
  link: string;
  items?: { icon?: ReactNode; text: string; link: string }[];
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <div
      className={'group relative flex flex-col px-[1.823vw]'}
      onMouseEnter={() => !!items && !isOpen && setIsOpen(true)}
      onMouseLeave={() => !!items && setIsOpen(false)}
    >
      <Link
        href={link}
        className={
          'cursor-pointer font-museo text-[0.833vw] font-medium uppercase text-foreground group-hover:text-left-accent'
        }
      >
        {title}
      </Link>
      <AnimatePresence>
        {!!items && isOpen && (
          <motion.div
            variants={{
              open: { height: 'auto' },
              closed: { height: 0 },
            }}
            transition={{ type: 'spring', duration: 0.25, bounce: 0 }}
            initial={'closed'}
            animate={'open'}
            exit={'closed'}
            className={
              'absolute left-0 top-full z-30 w-[24vw] overflow-hidden rounded-b-[0.521vw] bg-bg-dark'
            }
          >
            <div className={'grid grid-cols-3 px-[1.823vw] py-[1.354vw]'}>
              {items.map((item, index) => (
                <Link
                  key={index}
                  href={item.link}
                  className={
                    'flex h-full w-full cursor-pointer flex-row items-center justify-start gap-[0.521vw] py-[0.5vw] hover:opacity-80'
                  }
                >
                  {item.icon}
                  <span className={'font-plexsans text-[0.833vw]'}>
                    {item.text}
                  </span>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
