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
  const [activeDate, setActiveDate] = useState<number | undefined>(undefined);
  const [possibleDate, setPossibleDate] = useState<number | undefined>(
    undefined
  );
  const [pickedDate, setPickedDate] = useState<number | undefined>(undefined);
  const [currentMonth, setCurrentMonth] = useState<number>(
    currentDate.getMonth()
  );

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month, 0).getDate();
  };

  const clearDates = () => {
    setDateTo('');
    setDateFrom('');
    setActiveDate(undefined);
    setPossibleDate(undefined);
    setPickedDate(undefined);
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
                  <span
                    className={clsx(
                      'cursor-pointer rounded-[5px] p-4 text-center font-plexsans text-main font-medium hover:opacity-80',
                      {
                        'border border-left-accent text-left-accent':
                          index + 1 === activeDate || index + 1 === pickedDate,
                        'opacity:80 border border-left-accent text-left-accent':
                          index + 1 === possibleDate,
                        'rounded-none bg-left-accent text-dark-buttons-text':
                          (index + 1 < activeDate &&
                            index + 1 > possibleDate) ||
                          (index + 1 > activeDate &&
                            index + 1 < possibleDate) ||
                          (index + 1 < activeDate && index + 1 > pickedDate) ||
                          (index + 1 > activeDate && index + 1 < pickedDate),
                        'rounded-r-none':
                          (index + 1 === activeDate &&
                            activeDate < possibleDate) ||
                          (index + 1 === activeDate &&
                            activeDate < pickedDate) ||
                          (index + 1 === pickedDate &&
                            pickedDate < activeDate) ||
                          (index + 1 === possibleDate &&
                            possibleDate < activeDate),
                        'rounded-l-none':
                          (index + 1 === activeDate &&
                            activeDate > possibleDate) ||
                          (index + 1 === activeDate &&
                            activeDate > pickedDate) ||
                          (index + 1 === pickedDate &&
                            pickedDate > activeDate) ||
                          (index + 1 === possibleDate &&
                            possibleDate > activeDate),
                      }
                    )}
                    key={index}
                    onMouseOver={() => {
                      if (!pickedDate)
                        if (activeDate) setPossibleDate(index + 1);
                    }}
                    onClick={() => {
                      if (!pickedDate) {
                        if (!activeDate) setActiveDate(index + 1);
                        if (activeDate) {
                          if (index + 1 === activeDate)
                            setActiveDate(undefined);
                          else {
                            setPickedDate(index + 1);
                            const currentPickedDate = index + 1;
                            let month = currentDate.getUTCMonth() + 1;
                            let formattedMonth = month.toString();
                            if (formattedMonth.length < 2)
                              formattedMonth = '0' + formattedMonth;
                            const formattedActiveDate =
                              activeDate.toString().length < 2
                                ? '0' + activeDate
                                : activeDate;
                            const formattedCurrentPickedDate =
                              currentPickedDate.toString().length < 2
                                ? '0' + currentPickedDate
                                : currentPickedDate;
                            if (activeDate < currentPickedDate) {
                              setDateFrom(
                                `${currentDate
                                  .getFullYear()
                                  .toString()}-${formattedMonth}-${formattedActiveDate}`
                              );
                              setDateTo(
                                `${currentDate
                                  .getFullYear()
                                  .toString()}-${formattedMonth}-${formattedCurrentPickedDate}`
                              );
                            }
                            if (activeDate > currentPickedDate) {
                              setDateFrom(
                                `${currentDate
                                  .getFullYear()
                                  .toString()}-${formattedMonth}-${formattedCurrentPickedDate}`
                              );
                              setDateTo(
                                `${currentDate
                                  .getFullYear()
                                  .toString()}-${formattedMonth}-${formattedActiveDate}`
                              );
                            }
                          }
                        }
                      } else {
                        setPickedDate(undefined);
                        setActiveDate(index + 1);
                      }
                    }}
                  >
                    {index + 1}
                  </span>
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
                <Button label={'Done'} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
