import { ReactNode, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/ui/games-store/shared/Button';
import { clsx } from 'clsx';

export const DatePicker = ({ trigger }: { trigger: ReactNode }) => {
  // const currentDate = new Date();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [dateFrom, setDateFrom] = useState<number>(0);
  const [dateTo, setDateTo] = useState<number>(0);
  const [activeDate, setActiveDate] = useState<number | undefined>(undefined);
  const [possibleDate, setPossibleDate] = useState<number | undefined>(
    undefined
  );
  const [pickedDate, setPickedDate] = useState<number | undefined>(undefined);
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
                <div className={'text-left-accent'}> {'<'} </div>
                <div>Date</div>
                <div className={'text-left-accent'}> {'>'} </div>
              </div>
              <div
                className={'grid h-full w-full grid-cols-7 grid-rows-5 gap-y-1'}
              >
                {[...Array(31)].map((_, index) => (
                  <span
                    className={clsx(
                      'cursor-pointer rounded-[5px] p-4 text-center font-plexsans text-main font-medium hover:opacity-80',
                      {
                        'border border-left-accent text-left-accent':
                          index + 1 === activeDate || index + 1 === pickedDate,
                        'opacity:80 border-left-accent text-left-accent':
                          index + 1 === possibleDate,
                        'rounded-none bg-left-accent text-dark-buttons-text':
                          (index + 1 < activeDate &&
                            index + 1 > possibleDate) ||
                          (index + 1 > activeDate &&
                            index + 1 < possibleDate) ||
                          (index + 1 < activeDate && index + 1 > pickedDate) ||
                          (index + 1 > activeDate && index + 1 < pickedDate),
                        'rounded-r-[5px]':
                          index + 2 === possibleDate ||
                          index + 2 === pickedDate,
                        'rounded-l-[5px]':
                          index === possibleDate || index === pickedDate,
                        'rounded-r-none':
                          (index + 1 === activeDate &&
                            activeDate < possibleDate) ||
                          (index + 1 === activeDate && activeDate < pickedDate),
                        'rounded-l-none':
                          (index + 1 === activeDate &&
                            activeDate > possibleDate) ||
                          (index + 1 === activeDate && activeDate > pickedDate),
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
                            if (activeDate < currentPickedDate) {
                              setDateFrom(activeDate);
                              setDateTo(currentPickedDate);
                            }
                            if (activeDate > currentPickedDate) {
                              setDateFrom(currentPickedDate);
                              setDateTo(activeDate);
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
