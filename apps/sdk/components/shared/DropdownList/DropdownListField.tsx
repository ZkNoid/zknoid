import { ReactNode, useEffect, useState } from 'react';
import { Field, useField } from 'formik';
import { clsx } from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';

export function DropdownListField({
  name,
  title,
  items,
  defaultOpen = false,
  required,
  startContent,
  endContent,
}: {
  name: string;
  title?: string;
  items: string[];
  defaultOpen?: boolean;
  required?: boolean;
  startContent?: ReactNode;
  endContent?: ReactNode;
}) {
  const [isOpen, setIsOpen] = useState<boolean>(defaultOpen);
  const [field, meta, helpers] = useField(name);
  const [prevValue, setPrevValue] = useState<string>(field.value);

  useEffect(() => {
    if (prevValue != field.value) {
      setIsOpen(!isOpen);
      setPrevValue(field.value);
    }
  }, [field.value]);

  return (
    <div className={'relative flex flex-col gap-2'}>
      {title && (
        <span
          className={
            'font-plexsans text-main font-medium uppercase text-left-accent'
          }
        >
          {title}
          {required && '*'}
        </span>
      )}
      <span
        className={clsx(
          'group flex h-full min-w-[300px] cursor-pointer flex-row items-center justify-between gap-2 rounded-[5px] border border-foreground p-2 hover:border-b hover:border-left-accent hover:text-left-accent',
          {
            'rounded-b-none border-white border-b-bg-dark duration-75 ease-out':
              isOpen,
          }
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        {startContent}
        <span className={'font-plexsans text-main'}>{field.value}</span>
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
          animate={isOpen ? 'open' : 'closed'}
        >
          <path
            d="M15 1.5L8 8.5L1 1.5"
            stroke="#252525"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={'stroke-white group-hover:stroke-left-accent'}
          />
        </motion.svg>
        {endContent}
      </span>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            className={
              'absolute top-full z-10 flex w-full min-w-[300px] flex-col items-center justify-start overflow-hidden rounded-[5px] rounded-t-none border border-t-0 bg-bg-dark'
            }
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: 'spring', duration: 0.8, bounce: 0 }}
          >
            {items.map((value, index) => (
              <div
                key={index}
                className={clsx(
                  'relative h-full w-full p-2 hover:bg-[#252525] hover:text-left-accent',
                  {
                    'last:pb-4': items.length > 1,
                  }
                )}
              >
                <span className={'h-full w-full font-plexsans text-main'}>
                  {value}
                  <Field
                    {...field}
                    name={name}
                    type={'radio'}
                    value={value}
                    className={
                      'absolute -top-0.5 left-0 h-full w-full cursor-pointer opacity-0'
                    }
                  />
                </span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
