import { clsx } from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import {
  COMPETITIONS_SORT_METHODS,
  CompetitionsSortBy,
} from '@/constants/sortBy';
import { useState } from 'react';
import { ALL_GAME_GENRES, ZkNoidGameGenre } from '@/lib/platform/game_tags';
import { FiltrationBox } from '@/components/ui/games-store/widgets/GameStore/FiltrationBox';
import {
  ALL_GAME_EVENT_TYPES,
  ZkNoidEventType,
} from '@/lib/platform/game_events';
import { ProgressBar } from '@/components/ui/games-store/shared/ProgressBar';

const CompetitionItem = ({
  title,
  index,
  preRegDate,
  competitionsDate,
  participantsFee,
  currency,
  reward,
}: {
  title: string;
  index: number;
  preRegDate: string;
  competitionsDate: string;
  participantsFee: number;
  currency: string;
  reward: number;
}) => {
  return (
    <div
      className={
        'flex flex-row justify-between border-t border-left-accent pt-4 text-left-accent last:border-b last:pb-4'
      }
    >
      <div className={'flex w-2/6 flex-col justify-between gap-4'}>
        <div
          className={
            'flex flex-row gap-2 text-headline-2 font-medium uppercase'
          }
        >
          <span>[{index}]</span>
          <span>{title}</span>
        </div>
        <button
          className={
            'w-full max-w-[50%] rounded-[5px] border border-bg-dark bg-left-accent py-2 text-headline-2 font-medium text-dark-buttons-text hover:border-left-accent hover:bg-bg-dark hover:text-left-accent'
          }
        >
          Play
        </button>
      </div>
      <div className={'flex w-2/6 flex-col gap-2'}>
        <div className={'flex flex-col gap-1'}>
          <span
            className={'font-plexsans text-[20px]/[20px] font-medium uppercase'}
          >
            Preregistration dates
          </span>
          <span
            className={
              'font-plexsans text-[16px]/[16px] font-light text-foreground'
            }
          >
            {preRegDate}
          </span>
        </div>
        <div className={'flex flex-col gap-1'}>
          <span
            className={'font-plexsans text-[20px]/[20px] font-medium uppercase'}
          >
            Competitions dates
          </span>
          <span
            className={
              'font-plexsans text-[16px]/[16px] font-light text-foreground'
            }
          >
            {competitionsDate}
          </span>
        </div>
      </div>
      <div
        className={
          'flex w-2/6 flex-col gap-4 font-plexsans text-[20px]/[20px] font-medium'
        }
      >
        <div
          className={
            'w-full max-w-fit rounded-2xl border border-left-accent p-1 px-2 text-center'
          }
        >
          {participantsFee} {currency} Participants fee
        </div>
        <div
          className={
            'w-full max-w-fit rounded-2xl border border-left-accent bg-left-accent p-1 px-2 text-center text-dark-buttons-text'
          }
        >
          {reward} {currency} REWARDS
        </div>
      </div>
    </div>
  );
};

export const Competitions = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pagesAmount, _setPagesAmount] = useState<number>(3);

  const [isSortByOpen, setIsSortByOpen] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<CompetitionsSortBy>(
    CompetitionsSortBy.LowFunds
  );

  const [genresSelected, setGenresSelected] = useState<ZkNoidGameGenre[]>([]);
  const [eventsSelected, setEventsSelected] = useState<ZkNoidEventType[]>([]);

  return (
    <>
      <div className={'mt-40 flex flex-row gap-5'}>
        <div className={'flex min-w-[350px] flex-col gap-4'}>
          <div className={'text-headline-3'}>Filtration</div>
          <FiltrationBox
            key={0}
            expanded={true}
            title="Genre"
            items={ALL_GAME_GENRES}
            itemsSelected={genresSelected}
            setItemsSelected={setGenresSelected}
          />
          <FiltrationBox
            key={1}
            expanded={true}
            title="Timeline"
            items={ALL_GAME_EVENT_TYPES}
            itemsSelected={eventsSelected}
            setItemsSelected={setEventsSelected}
          />
          <div className="relative flex min-h-[80px] w-full flex-col gap-2 p-5">
            <div className="text-headline-3 font-bold">Funds and Fee</div>

            <ProgressBar title={'Funds'} min={0} max={100} handleSize={30} />
            <ProgressBar
              title={'Participants fee'}
              min={0}
              max={100}
              handleSize={30}
            />

            <div className="absolute left-0 top-0 -z-10 flex h-full w-full flex-col">
              <svg
                viewBox="0 0 351 60"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 17.5234V111.731V174.523C1 182.808 7.71573 189.523 16 189.523H335C343.284 189.523 350 182.808 350 174.523V58.1101C350 54.1286 348.417 50.3105 345.6 47.4969L304.963 6.91027C302.151 4.10124 298.338 2.52344 294.363 2.52344H16C7.71573 2.52344 1 9.23917 1 17.5234Z"
                  stroke="#D2FF00"
                  strokeWidth="2"
                />
                <path
                  d="M348 2.52344H312.912C311.118 2.52344 310.231 4.7018 311.515 5.95459L346.603 40.2072C347.87 41.4438 350 40.5463 350 38.7761V4.52344C350 3.41887 349.105 2.52344 348 2.52344Z"
                  // fill={expanded ? '#D2FF00' : ''}
                  stroke="#D2FF00"
                  strokeWidth="2"
                />
                <rect
                  x="331.775"
                  y="6.89062"
                  width="20"
                  height="2"
                  transform="rotate(45 331.775 6.89062)"
                  // fill={expanded ? '#252525' : '#D2FF00'}
                  fill={'#D2FF00'}
                />
                <rect
                  x="345.924"
                  y="8.30469"
                  width="20"
                  height="2"
                  transform="rotate(135 345.924 8.30469)"
                  // fill={expanded ? '#252525' : '#D2FF00'}
                  fill={'#D2FF00'}
                />
              </svg>
              <div className="flex w-full flex-grow rounded-b-2xl border-x-2 border-b-2 border-left-accent"></div>
            </div>
          </div>
          <div
            className="flex h-[40px] cursor-pointer items-center justify-center rounded-[5px] border-2 border-left-accent bg-left-accent text-buttons text-dark-buttons-text hover:bg-bg-dark hover:text-left-accent"
            onClick={() => {
              setGenresSelected([]);
              setEventsSelected([]);
            }}
          >
            Reset filters
          </div>
        </div>
        <div className={'flex w-full flex-col gap-4'}>
          <div className={'flex flex-row justify-between'}>
            <div className={'text-headline-1'}>Competition list</div>
            <div
              className={
                'group flex flex-row gap-2 rounded-[5px] border bg-bg-dark p-2 hover:border-left-accent'
              }
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_3050_924)">
                  <path
                    d="M23.7068 22.2938L17.7378 16.3248C19.3644 14.3354 20.1642 11.7969 19.9716 9.23432C19.7791 6.67179 18.609 4.28129 16.7034 2.55728C14.7977 0.833269 12.3024 -0.0923492 9.73342 -0.0281174C7.16447 0.0361144 4.71849 1.08528 2.9014 2.90237C1.08431 4.71946 0.0351379 7.16545 -0.029094 9.7344C-0.0933258 12.3034 0.832293 14.7987 2.5563 16.7043C4.28031 18.61 6.67081 19.7801 9.23334 19.9726C11.7959 20.1651 14.3344 19.3654 16.3238 17.7388L22.2928 23.7078C22.4814 23.8899 22.734 23.9907 22.9962 23.9884C23.2584 23.9862 23.5092 23.881 23.6946 23.6956C23.88 23.5102 23.9852 23.2594 23.9875 22.9972C23.9897 22.735 23.8889 22.4824 23.7068 22.2938ZM9.99978 18.0008C8.41753 18.0008 6.87081 17.5316 5.55522 16.6525C4.23963 15.7735 3.21425 14.524 2.60875 13.0622C2.00324 11.6004 1.84482 9.99189 2.1535 8.44004C2.46218 6.88819 3.22411 5.46272 4.34293 4.3439C5.46175 3.22508 6.88721 2.46316 8.43906 2.15448C9.99091 1.84579 11.5994 2.00422 13.0613 2.60972C14.5231 3.21522 15.7725 4.2406 16.6515 5.5562C17.5306 6.87179 17.9998 8.41851 17.9998 10.0008C17.9974 12.1218 17.1538 14.1552 15.654 15.655C14.1542 17.1548 12.1208 17.9984 9.99978 18.0008Z"
                    fill="#F9F8F4"
                    className={'group-hover:fill-left-accent'}
                  />
                  <path
                    d="M13 8.99999H11V7C11 6.73478 10.8946 6.48043 10.7071 6.29289C10.5196 6.10536 10.2652 6 9.99999 6C9.73478 6 9.48042 6.10536 9.29289 6.29289C9.10535 6.48043 8.99999 6.73478 8.99999 7V8.99999H7C6.73478 8.99999 6.48043 9.10535 6.29289 9.29289C6.10536 9.48042 6 9.73478 6 9.99999C6 10.2652 6.10536 10.5196 6.29289 10.7071C6.48043 10.8946 6.73478 11 7 11H8.99999V13C8.99999 13.2652 9.10535 13.5196 9.29289 13.7071C9.48042 13.8946 9.73478 14 9.99999 14C10.2652 14 10.5196 13.8946 10.7071 13.7071C10.8946 13.5196 11 13.2652 11 13V11H13C13.2652 11 13.5196 10.8946 13.7071 10.7071C13.8946 10.5196 14 10.2652 14 9.99999C14 9.73478 13.8946 9.48042 13.7071 9.29289C13.5196 9.10535 13.2652 8.99999 13 8.99999Z"
                    fill="#F9F8F4"
                    className={'group-hover:fill-left-accent'}
                  />
                </g>
                <defs>
                  <clipPath id="clip0_3050_924">
                    <rect width="24" height="24" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              <input
                type="search"
                placeholder={'Enter competition or game name...'}
                className={
                  'min-w-[350px] bg-bg-dark placeholder:font-plexsans placeholder:text-main focus:border-none focus:outline-none group-hover:placeholder:text-left-accent/80'
                }
              />
            </div>
          </div>
          <div className={'flex flex-row justify-between'}>
            <div className={'max-w-[50%] font-plexsans text-main'}>
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
                    {COMPETITIONS_SORT_METHODS.map((value, index) => (
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
          {[...Array(6)].map((_value, index) => (
            <CompetitionItem
              key={index}
              title={'Arcanoid'}
              index={index + 1}
              preRegDate={'15/04/2024-17/04/2024'}
              competitionsDate={'15/04/2024-17/04/2024'}
              participantsFee={5}
              currency={'$MINA'}
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
