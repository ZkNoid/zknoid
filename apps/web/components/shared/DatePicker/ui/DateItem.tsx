import { useEffect, useState } from 'react';
import { clsx } from 'clsx';

export default function DateItem({
  date,
  activeDateTime,
  pickedDateTime,
  possibleDateTime,
  activeDate,
  pickedDate,
  setDateTo,
  setDateFrom,
  setActiveDate,
  setPickedDate,
  setPossibleDate,
}: {
  date: Date;
  activeDateTime: number | undefined;
  pickedDateTime: number | undefined;
  possibleDateTime: number | undefined;
  activeDate: Date | undefined;
  pickedDate: Date | undefined;
  setDateTo: (date: string) => void;
  setDateFrom: (date: string) => void;
  setActiveDate: (date: Date | undefined) => void;
  setPickedDate: (date: Date | undefined) => void;
  setPossibleDate: (date: Date | undefined) => void;
}) {
  const [dateTime, setDateTime] = useState<number>(date.getTime());
  const [dateDay, setDateDay] = useState<number>(date.getDay());

  useEffect(() => {
    setDateTime(date.getTime());
    setDateDay(date.getDay());
  }, [date]);

  return (
    <button
      type={'button'}
      className={clsx(
        'cursor-pointer rounded-[5px] border border-bg-dark p-4 text-center font-plexsans text-main font-medium',
        {
          'cursor-not-allowed text-[#424242] opacity-50':
            date.getTime() < Date.now(),
          'hover:opacity-80': date.getTime() >= Date.now(),
          'border-left-accent text-left-accent':
            dateTime === activeDateTime || dateTime === pickedDateTime,
          'opacity:80 border-left-accent text-left-accent':
            dateTime === possibleDateTime,
          'rounded-none border-left-accent bg-left-accent text-dark-buttons-text':
            (activeDateTime &&
              dateTime < activeDateTime &&
              possibleDateTime &&
              dateTime > possibleDateTime) ||
            (activeDateTime &&
              dateTime > activeDateTime &&
              possibleDateTime &&
              dateTime < possibleDateTime) ||
            (activeDateTime &&
              dateTime < activeDateTime &&
              pickedDateTime &&
              dateTime > pickedDateTime) ||
            (activeDateTime &&
              dateTime > activeDateTime &&
              pickedDateTime &&
              dateTime < pickedDateTime),
          'rounded-r-none':
            (activeDateTime &&
              dateTime === activeDateTime &&
              possibleDateTime &&
              activeDateTime &&
              activeDateTime < possibleDateTime) ||
            (activeDateTime &&
              dateTime === activeDateTime &&
              pickedDateTime &&
              activeDateTime < pickedDateTime) ||
            (pickedDateTime &&
              dateTime === pickedDateTime &&
              activeDateTime &&
              pickedDateTime < activeDateTime) ||
            (possibleDateTime &&
              dateTime === possibleDateTime &&
              activeDateTime &&
              possibleDateTime < activeDateTime),
          'rounded-l-none':
            (activeDateTime &&
              dateTime === activeDateTime &&
              activeDateTime &&
              possibleDateTime &&
              activeDateTime > possibleDateTime) ||
            (activeDateTime &&
              dateTime === activeDateTime &&
              activeDateTime &&
              pickedDateTime &&
              activeDateTime > pickedDateTime) ||
            (pickedDateTime &&
              dateTime === pickedDateTime &&
              activeDateTime &&
              pickedDateTime > activeDateTime) ||
            (possibleDateTime &&
              dateTime === possibleDateTime &&
              activeDateTime &&
              possibleDateTime > activeDateTime),
          'col-start-1 col-end-1': dateDay == 0,
          'col-start-2 col-end-2': dateDay == 1,
          'col-start-3 col-end-3': dateDay == 2,
          'col-start-4 col-end-4': dateDay == 3,
          'col-start-5 col-end-5': dateDay == 4,
          'col-start-6 col-end-6': dateDay == 5,
          'col-start-7 col-end-7': dateDay == 6,
        }
      )}
      onMouseOver={
        date.getTime() >= Date.now()
          ? () => {
              if (!pickedDate) if (activeDate) setPossibleDate(date);
            }
          : undefined
      }
      onClick={
        date.getTime() >= Date.now()
          ? () => {
              if (!pickedDate) {
                if (!activeDate) {
                  setActiveDate(date);
                }
                if (activeDate) {
                  if (date === activeDate) setActiveDate(undefined);
                  else {
                    setPickedDate(date);
                    if (activeDate < date) {
                      setDateFrom(
                        activeDate.toLocaleDateString('en-US', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        })
                      );
                      setDateTo(
                        date.toLocaleDateString('en-US', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        })
                      );
                    }
                    if (activeDate > date) {
                      setDateFrom(
                        date.toLocaleDateString('en-US', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        })
                      );
                      setDateTo(
                        activeDate.toLocaleDateString('en-US', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        })
                      );
                    }
                  }
                }
              } else {
                setPickedDate(undefined);
                setActiveDate(date);
              }
            }
          : undefined
      }
    >
      {date.getDate()}
    </button>
  );
}
