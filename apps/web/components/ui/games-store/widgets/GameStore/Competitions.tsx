import { clsx } from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import { ALL_SORT_METHODS, SortBy } from '@/app/constants/sortBy';
import { useState } from 'react';

const CompetitionItem = ({
  title,
  index,
  preRegDate,
  competitionsDate,
  participantsFee,
  valute,
  reward,
}: {
  title: string;
  index: number;
  preRegDate: string;
  competitionsDate: string;
  participantsFee: number;
  valute: string;
  reward: number;
}) => {
  return (
    <div
      className={
        'flex flex-row justify-between border-t border-left-accent py-4 text-left-accent last:border-b'
      }
    >
      <div className={'flex w-full max-w-[30%] flex-col justify-between gap-4'}>
        <div className={'flex flex-row gap-2'}>
          <span>[{index}]</span>
          <span>{title}</span>
        </div>
        <button
          className={
            'w-full max-w-[50%] rounded-[5px] bg-left-accent py-2 text-dark-buttons-text'
          }
        >
          Play
        </button>
      </div>
      <div className={'flex w-full max-w-[30%] flex-col gap-2'}>
        <div className={'flex flex-col gap-1'}>
          <span className={'uppercase'}>Preregistration dates</span>
          <span>{preRegDate}</span>
        </div>
        <div className={'flex flex-col gap-1'}>
          <span className={'uppercase'}>Competitions dates</span>
          <span>{competitionsDate}</span>
        </div>
      </div>
      <div className={'flex w-full max-w-[30%] flex-col gap-4'}>
        <div
          className={
            'w-full max-w-[50%] rounded-2xl border border-left-accent p-1 text-center'
          }
        >
          {participantsFee} {valute} Participants fee
        </div>
        <div
          className={
            'w-full max-w-[50%] rounded-2xl border border-left-accent p-1 text-center'
          }
        >
          {reward} {valute} REWARDS
        </div>
      </div>
    </div>
  );
};

export const Competitions = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pagesAmount, _setPagesAmount] = useState<number>(3);

  const [isSortByOpen, setIsSortByOpen] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<SortBy>(SortBy.RatingLow);

  return (
    <>
      <div className={'mt-40 flex flex-row gap-4'}>
        <div className={'flex min-w-[350px] flex-col gap-4'}>
          <div>Filtration</div>
          <div className={'border border-left-accent'}>Genres</div>
          <div className={'border border-left-accent'}>Funds and Fee</div>
        </div>
        <div className={'flex w-full flex-col gap-4'}>
          <div className={'flex flex-row justify-between'}>
            <div>Competition list</div>
            <div>
              <input
                type="search"
                placeholder={'Enter competition or game name...'}
              />
            </div>
          </div>
          <div className={'flex flex-row justify-between'}>
            <div className={'max-w-[50%] font-plexsans'}>
              In this list you can see all the current and upcoming
              competitions. Choose a game, the reward and the date of the
              competition and have some fun!
            </div>
            <div className={'relative flex flex-col gap-4'}>
              <span
                className={clsx(
                  'group flex min-w-[300px] cursor-pointer flex-row items-center gap-2 rounded-[5px] border border-bg-dark px-4 py-1 hover:border-left-accent hover:text-left-accent',
                  {
                    'rounded-b-none border-white duration-75 ease-out':
                      isSortByOpen,
                  }
                )}
                onClick={() => setIsSortByOpen(!isSortByOpen)}
              >
                <span>Sort By: {sortBy}</span>
                <svg
                  width="16"
                  height="10"
                  viewBox="0 0 16 10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15 1.5L8 8.5L1 1.5"
                    stroke="#252525"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={'stroke-white group-hover:stroke-left-accent'}
                  />
                </svg>
              </span>
              <AnimatePresence initial={false} mode={'wait'}>
                {isSortByOpen && (
                  <motion.div
                    className={
                      'absolute top-full z-10 flex w-full min-w-[300px] flex-col items-center justify-start overflow-hidden rounded-[5px] rounded-t-none border border-t-0 bg-bg-dark'
                    }
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ type: 'spring', duration: 0.8, bounce: 0 }}
                  >
                    {ALL_SORT_METHODS.map((value, index) => (
                      <span
                        key={index}
                        onClick={() => {
                          setSortBy(value);
                          setIsSortByOpen(false);
                        }}
                        className={
                          'h-full w-full cursor-pointer p-4 hover:text-left-accent'
                        }
                      >
                        {value}
                      </span>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          {[...Array(6)].map((value, index) => (
            <CompetitionItem
              key={index}
              title={'Arcanoid '}
              index={1}
              preRegDate={'15/04/2024-17/04/2024'}
              competitionsDate={'15/04/2024-17/04/2024'}
              participantsFee={5}
              valute={'$MINA'}
              reward={1000}
            />
          ))}
        </div>
      </div>
      <div className={'flex w-full items-center justify-center py-4'}>
        <div className={'flex flex-row items-center justify-center gap-2'}>
          <span
            className={'cursor-pointer'}
            onClick={() =>
              setCurrentPage((prevState) =>
                prevState > 1 ? prevState - 1 : prevState
              )
            }
          >
            <svg
              width="10"
              height="16"
              viewBox="0 0 10 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8.51116 15L1 8L8.51116 1"
                stroke="#D2FF00"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>

          <span
            className={'flex flex-row items-center justify-center gap-2 pt-0.5'}
          >
            {[...Array(pagesAmount).keys()].map((value) => (
              <span
                key={value + 1}
                className={`cursor-pointer text-left-accent hover:underline ${
                  value + 1 === currentPage ? 'opacity-100' : 'opacity-40'
                }`}
                onClick={() => setCurrentPage(value + 1)}
              >
                {value + 1}
              </span>
            ))}
          </span>

          <span
            className={'cursor-pointer'}
            onClick={() =>
              setCurrentPage((prevState) =>
                prevState < pagesAmount ? prevState + 1 : prevState
              )
            }
          >
            <svg
              width="11"
              height="16"
              viewBox="0 0 11 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1.5113 15L9.02246 8L1.5113 1"
                stroke="#D2FF00"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>
      </div>
    </>
  );
};
