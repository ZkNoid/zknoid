import { ReactNode, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/ui/games-store/shared/Button';
import { clsx } from 'clsx';

export const DatePicker = ({
  trigger,
  setDateFrom,
  setDateTo,
}: {
  trigger: ReactNode;
  setDateFrom: (date: string) => void;
  setDateTo: (date: string) => void;
}) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [activeDate, setActiveDate] = useState<Date>();
  const [possibleDate, setPossibleDate] = useState<Date>();
  const [pickedDate, setPickedDate] = useState<Date>();
  const [_currentMonth, setCurrentMonth] = useState<number>(
    currentDate.getMonth()
  );
  const [prevDateFrom, setPrevDateFrom] = useState<Date>();
  const [prevDateTo, setPrevDateTo] = useState<Date>();

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month, 0).getDate();
  };

  const getLastDayOfMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const clearDates = () => {
    setDateTo('');
    setDateFrom('');
    setActiveDate(undefined);
    setPossibleDate(undefined);
    setPickedDate(undefined);
  };

  const DateItem = ({ date }: { date: Date }) => {
    return (
      <span
        className={clsx(
          'cursor-pointer rounded-[5px] border border-bg-dark p-4 text-center font-plexsans text-main font-medium hover:opacity-80',
          {
            'border-left-accent text-left-accent':
              date.getTime() === activeDate?.getTime() ||
              date.getTime() === pickedDate?.getTime(),
            'opacity:80 border-left-accent text-left-accent':
              date.getTime() === possibleDate?.getTime(),
            'rounded-none border-left-accent bg-left-accent text-dark-buttons-text':
              (activeDate &&
                date.getTime() < activeDate.getTime() &&
                possibleDate &&
                date.getTime() > possibleDate.getTime()) ||
              (activeDate &&
                date.getTime() > activeDate.getTime() &&
                possibleDate &&
                date.getTime() < possibleDate.getTime()) ||
              (activeDate &&
                date.getTime() < activeDate.getTime() &&
                pickedDate &&
                date.getTime() > pickedDate.getTime()) ||
              (activeDate &&
                date.getTime() > activeDate.getTime() &&
                pickedDate &&
                date.getTime() < pickedDate.getTime()),
            'rounded-r-none':
              (activeDate &&
                date.getTime() === activeDate.getTime() &&
                possibleDate &&
                activeDate &&
                activeDate.getTime() < possibleDate.getTime()) ||
              (activeDate &&
                date.getTime() === activeDate.getTime() &&
                pickedDate &&
                activeDate.getTime() < pickedDate.getTime()) ||
              (pickedDate &&
                date.getTime() === pickedDate.getTime() &&
                activeDate &&
                pickedDate.getTime() < activeDate.getTime()) ||
              (possibleDate &&
                date.getTime() === possibleDate.getTime() &&
                activeDate &&
                possibleDate.getTime() < activeDate.getTime()),
            'rounded-l-none':
              (activeDate &&
                date.getTime() === activeDate.getTime() &&
                activeDate &&
                possibleDate &&
                activeDate.getTime() > possibleDate.getTime()) ||
              (activeDate &&
                date.getTime() === activeDate.getTime() &&
                activeDate &&
                pickedDate &&
                activeDate.getTime() > pickedDate.getTime()) ||
              (pickedDate &&
                date.getTime() === pickedDate.getTime() &&
                activeDate &&
                pickedDate.getTime() > activeDate.getTime()) ||
              (possibleDate &&
                date.getTime() === possibleDate.getTime() &&
                activeDate &&
                possibleDate.getTime() > activeDate.getTime()),
            'col-start-1 col-end-1': date.getDay() == 0,
            'col-start-2 col-end-2': date.getDay() == 1,
            'col-start-3 col-end-3': date.getDay() == 2,
            'col-start-4 col-end-4': date.getDay() == 3,
            'col-start-5 col-end-5': date.getDay() == 4,
            'col-start-6 col-end-6': date.getDay() == 5,
            'col-start-7 col-end-7': date.getDay() == 6,
          }
        )}
        onMouseOver={() => {
          if (!pickedDate) if (activeDate) setPossibleDate(date);
        }}
        onClick={() => {
          if (!pickedDate) {
            if (!activeDate) setActiveDate(date);
            if (activeDate) {
              if (date === activeDate) setActiveDate(undefined);
              else {
                setPickedDate(date);
                if (activeDate < date) {
                  setPrevDateFrom(activeDate);
                  setPrevDateTo(date);
                }
                if (activeDate > date) {
                  setPrevDateFrom(date);
                  setPrevDateTo(activeDate);
                }
              }
            }
          } else {
            setPickedDate(undefined);
            setActiveDate(date);
          }
        }}
      >
        {date.getDate()}
      </span>
    );
  };

  return (
    <div className={'relative flex flex-col'}>
      <div className={'cursor-pointer'} onClick={() => setIsOpen(true)}>
        {trigger}
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'spring', duration: 0.4, bounce: 0 }}
            className={
              'fixed left-0 top-0 z-10 flex h-full w-full items-center justify-center backdrop-blur-sm'
            }
            onClick={() => setIsOpen(false)}
          >
            <div
              className={
                'flex flex-col gap-8 rounded-[5px] border border-left-accent bg-bg-dark p-12'
              }
              onClick={(e) => e.stopPropagation()}
            >
              <div className={'flex w-full flex-row justify-between'}>
                <div
                  className={
                    'flex w-full max-w-[30%] cursor-pointer  items-center justify-start hover:opacity-80'
                  }
                  onClick={() => {
                    clearDates();
                    setCurrentMonth(
                      currentDate.setMonth(currentDate.getMonth() - 1)
                    );
                  }}
                >
                  <svg
                    width="9"
                    height="18"
                    viewBox="0 0 6 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5 11L1 6L5 1"
                      stroke="#D2FF00"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div
                  className={
                    'w-full text-center text-[18px]/[18px] font-medium'
                  }
                >
                  {currentDate
                    .toLocaleDateString('en-US', {
                      dateStyle: 'long',
                    })
                    .split(' ')
                    .map((item, index) => (index === 1 ? ' ' : item))}
                </div>
                <div
                  className={
                    'flex w-full max-w-[30%] cursor-pointer items-center justify-end hover:opacity-80'
                  }
                  onClick={() => {
                    clearDates();
                    setCurrentMonth(
                      currentDate.setMonth(currentDate.getMonth() + 1)
                    );
                  }}
                >
                  <svg
                    width="9"
                    height="18"
                    viewBox="0 0 6 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1 11L5 6L1 1"
                      stroke="#D2FF00"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
              <div
                className={'grid h-full w-full grid-cols-7 grid-rows-5 gap-y-1'}
              >
                <span className="rounded-[5px] p-4 text-center font-plexsans text-main font-medium text-left-accent">
                  S
                </span>
                <span className="rounded-[5px] p-4 text-center font-plexsans text-main font-medium text-left-accent">
                  M
                </span>
                <span className="rounded-[5px] p-4 text-center font-plexsans text-main font-medium text-left-accent">
                  T
                </span>
                <span className="rounded-[5px] p-4 text-center font-plexsans text-main font-medium text-left-accent">
                  W
                </span>
                <span className="rounded-[5px] p-4 text-center font-plexsans text-main font-medium text-left-accent">
                  T
                </span>
                <span className="rounded-[5px] p-4 text-center font-plexsans text-main font-medium text-left-accent">
                  F
                </span>
                <span className="rounded-[5px] p-4 text-center font-plexsans text-main font-medium text-left-accent">
                  S
                </span>
                {[
                  ...Array(
                    getDaysInMonth(
                      currentDate.getFullYear(),
                      currentDate.getMonth() + 1
                    )
                  ),
                ].map((_, index) => (
                  <DateItem
                    key={index}
                    date={
                      new Date(
                        currentDate.getFullYear(),
                        currentDate.getMonth(),
                        index + 1
                      )
                    }
                  />
                ))}
              </div>
              <div className={'flex w-full flex-row justify-between'}>
                <Button
                  label={'Cancel'}
                  onClick={() => setIsOpen(false)}
                  isFilled={false}
                  isBordered={false}
                />
                <div className={'w-full'} />
                <Button
                  label={'Done'}
                  onClick={() => {
                    const formatDate = (item: string | undefined) => {
                      // @ts-ignore
                      if (item.length < 2) return '0' + item;
                      else return item;
                    };
                    const formatMonth = (item: number | undefined) => {
                      // @ts-ignore
                      item += 1;
                      // @ts-ignore
                      if (item.toString().length < 2) return '0' + item;
                      else return item;
                    };
                    setDateTo(
                      `${prevDateTo?.getFullYear().toString()}-${formatMonth(
                        prevDateTo?.getMonth()
                      )}-${formatDate(prevDateTo?.getDate().toString())}`
                    );
                    setDateFrom(
                      `${prevDateFrom?.getFullYear().toString()}-${formatMonth(
                        prevDateFrom?.getMonth()
                      )}-${formatDate(prevDateFrom?.getDate().toString())}`
                    );
                    setIsOpen(false);
                  }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
