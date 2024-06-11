import { AnimatePresence, motion } from 'framer-motion';
import {
  COMPETITIONS_SORT_METHODS,
  CompetitionsSortBy,
  sortByFilter,
} from './lib/sortBy';
import { useEffect, useState } from 'react';
import { ALL_GAME_GENRES, ZkNoidGameGenre } from '@/lib/platform/game_tags';
import FiltrationBox from '../../entities/FiltrationBox';
import {
  ALL_GAME_EVENT_TYPES,
  ZkNoidEventType,
} from '@/lib/platform/game_events';
import ProgressBar from '@/components/shared/ProgressBar';
import CompetitionItem from './ui/CompetitionsItem';
import Pagination from '@/components/shared/Pagination';
import { SortByFilter } from '@/components/widgets/GameStore/Storefront/ui/SortByFilter';
import { clsx } from 'clsx';
import { ICompetition } from '@/lib/types';
import { timelineFilter } from './lib/filters';
import { searchFilter } from './lib/filters';

export default function Competitions({
  competitions,
}: {
  competitions: ICompetition[];
}) {
  const PAGINATION_LIMIT = 5;
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sortBy, setSortBy] = useState<CompetitionsSortBy>(
    CompetitionsSortBy.LowFunds
  );
  const [genresSelected, setGenresSelected] = useState<ZkNoidGameGenre[]>([]);
  const [eventsSelected, setEventsSelected] = useState<ZkNoidEventType[]>([]);
  const [isFundsAndFeesExpanded, setIsFundsAndFeesExpanded] =
    useState<boolean>(true);
  const [fundsAbsoluteMaximum, setFundsAbsoluteMaximum] = useState<number>(0);
  const [fundsMaxValue, setFundsMaxValue] = useState<number>(0);
  const [fundsMinValue, setFundsMinValue] = useState<number>(0);
  const [feesAbsoluteMaximum, setFeesAbsoluteMaximum] = useState<number>(0);
  const [feesMaxValue, setFeesMaxValue] = useState<number>(0);
  const [feesMinValue, setFeesMinValue] = useState<number>(0);
  const [searchValue, setSearchValue] = useState<string>('');

  const filteredCompetitions = competitions.filter((item) => {
    if (
      genresSelected.length == 0 &&
      eventsSelected.length == 0 &&
      feesMinValue == 0 &&
      feesMaxValue == 0 &&
      fundsMinValue == 0 &&
      fundsMaxValue == 0
    )
      return true;

    if (genresSelected.includes(item.game.genre)) return true;

    if (timelineFilter(item, eventsSelected)) return true;

    if (
      item.participationFee >= feesMinValue * 10 ** 9 &&
      item.participationFee <= feesMaxValue * 10 ** 9
    )
      return true;

    if (item.reward >= fundsMinValue && item.reward <= fundsMaxValue * 10 ** 9)
      return true;
  });

  const renderCompetitions = filteredCompetitions.slice(
    (currentPage - 1) * PAGINATION_LIMIT,
    currentPage * PAGINATION_LIMIT
  );

  useEffect(() => {
    const fundsMaximum = competitions.reduce((max, competition) => {
      return Math.max(max, Number(competition.reward / 10n ** 9n));
    }, -Infinity);
    setFundsAbsoluteMaximum(fundsMaximum);

    const feesMaximum = competitions.reduce((max, competition) => {
      return Math.max(max, Number(competition.participationFee / 10n ** 9n));
    }, -Infinity);
    setFeesAbsoluteMaximum(feesMaximum);
  }, [competitions]);

  return (
    <>
      <div className={'mt-20 flex flex-row gap-5 lg:mt-40'}>
        <div
          className={
            'hidden min-w-[350px] flex-col gap-4 max-[2000px]:min-w-[280px] lg:flex'
          }
        >
          <div className={'text-headline-3'}>Filtration</div>
          <FiltrationBox
            key={0}
            defaultExpanded={true}
            title="Genre"
            items={ALL_GAME_GENRES}
            itemsSelected={genresSelected}
            setItemsSelected={setGenresSelected}
          />
          <FiltrationBox
            key={1}
            defaultExpanded={true}
            title="Timeline"
            items={ALL_GAME_EVENT_TYPES}
            itemsSelected={eventsSelected}
            setItemsSelected={setEventsSelected}
          />
          <div className="relative flex min-h-[80px] w-full flex-col gap-2 p-5">
            <div className="text-headline-3 font-bold">Funds and Fee</div>
            <AnimatePresence initial={false} mode={'wait'}>
              {isFundsAndFeesExpanded && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                  transition={{ type: 'spring', duration: 0.4, bounce: 0 }}
                  className={'z-10 overflow-hidden'}
                >
                  <ProgressBar
                    title={'Funds'}
                    min={0}
                    max={fundsAbsoluteMaximum}
                    minValue={fundsMinValue}
                    maxValue={fundsMaxValue}
                    setMinValue={setFundsMinValue}
                    setMaxValue={setFundsMaxValue}
                  />
                  <ProgressBar
                    title={'Participants fee'}
                    min={0}
                    max={feesAbsoluteMaximum}
                    minValue={feesMinValue}
                    maxValue={feesMaxValue}
                    setMinValue={setFeesMinValue}
                    setMaxValue={setFeesMaxValue}
                  />
                </motion.div>
              )}
            </AnimatePresence>
            <div className="absolute left-0 top-0 z-0 flex h-full w-full flex-col">
              <svg
                viewBox="0 0 351 60"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={'cursor-pointer'}
                onClick={() =>
                  setIsFundsAndFeesExpanded(!isFundsAndFeesExpanded)
                }
              >
                <path
                  d="M1 17.5234V111.731V174.523C1 182.808 7.71573 189.523 16 189.523H335C343.284 189.523 350 182.808 350 174.523V58.1101C350 54.1286 348.417 50.3105 345.6 47.4969L304.963 6.91027C302.151 4.10124 298.338 2.52344 294.363 2.52344H16C7.71573 2.52344 1 9.23917 1 17.5234Z"
                  stroke="#D2FF00"
                  strokeWidth="2"
                />
                <path
                  d="M348 2.52344H312.912C311.118 2.52344 310.231 4.7018 311.515 5.95459L346.603 40.2072C347.87 41.4438 350 40.5463 350 38.7761V4.52344C350 3.41887 349.105 2.52344 348 2.52344Z"
                  fill={isFundsAndFeesExpanded ? '#D2FF00' : ''}
                  stroke="#D2FF00"
                  strokeWidth="2"
                />
              </svg>
              <div
                className={
                  'pointer-events-none absolute mx-auto flex h-[20px] w-[20px] flex-col items-center justify-center max-[2000px]:right-0 max-[2000px]:top-0 min-[2000px]:right-0.5 min-[2000px]:top-1'
                }
              >
                <motion.div
                  className={clsx(
                    'bg-bg-dark max-[2000px]:h-[1.5px] max-[2000px]:w-3 min-[2000px]:h-[2px] min-[2000px]:w-4',
                    {
                      'bg-bg-dark': isFundsAndFeesExpanded,
                      'bg-left-accent': !isFundsAndFeesExpanded,
                    }
                  )}
                  animate={
                    isFundsAndFeesExpanded
                      ? { rotate: 45 }
                      : { rotate: 0, x: -1, y: 1 }
                  }
                />
                <motion.div
                  className={clsx(
                    'bg-bg-dark max-[2000px]:h-[1.5px] max-[2000px]:w-3 min-[2000px]:h-[2px] min-[2000px]:w-4',
                    {
                      'bg-bg-dark': isFundsAndFeesExpanded,
                      'bg-left-accent': !isFundsAndFeesExpanded,
                    }
                  )}
                  animate={
                    isFundsAndFeesExpanded
                      ? { rotate: -45, y: -1 }
                      : { rotate: -90, x: -1 }
                  }
                />
              </div>
              <div className="flex w-full flex-grow rounded-b-2xl border-x-2 border-b-2 border-left-accent"></div>
            </div>
          </div>
          <AnimatePresence initial={false} mode={'wait'}>
            {genresSelected.length != 0 ||
            eventsSelected.length != 0 ||
            feesMaxValue != 0 ||
            feesMinValue != 0 ||
            fundsMaxValue != 0 ||
            fundsMinValue != 0 ? (
              <motion.div
                className="flex h-[40px] cursor-pointer items-center justify-center rounded-[5px] border-2 border-left-accent bg-left-accent text-buttons text-dark-buttons-text hover:bg-bg-dark hover:text-left-accent"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => {
                  setGenresSelected([]);
                  setEventsSelected([]);
                  setFeesMaxValue(0);
                  setFeesMinValue(0);
                  setFundsMaxValue(0);
                  setFundsMinValue(0);
                }}
              >
                Reset filters
              </motion.div>
            ) : undefined}
          </AnimatePresence>
        </div>
        <div className={'flex w-full flex-col gap-4'}>
          <div className={'flex flex-col justify-between lg:flex-row'}>
            <div className={'text-headline-2 lg:text-headline-1'}>
              Competition list
            </div>
            <div
              className={
                'group hidden flex-row gap-2 rounded-[5px] border bg-bg-dark p-2 hover:border-left-accent lg:flex'
              }
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={'min-h-[24px] min-w-[24px] lg:h-auto lg:w-auto'}
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
                  'w-full appearance-none bg-bg-dark placeholder:font-plexsans placeholder:text-main placeholder:opacity-50 focus:border-none focus:outline-none group-hover:focus:text-left-accent group-hover:focus:placeholder:text-left-accent/80 lg:min-w-[300px]'
                }
                value={searchValue}
                onChange={(event) => {
                  setSearchValue(event.target.value);
                }}
              />
              <div
                className={clsx('flex items-center justify-center', {
                  'visible cursor-pointer opacity-60 transition-opacity ease-in-out hover:opacity-100':
                    searchValue.length !== 0,
                  invisible: searchValue.length === 0,
                })}
                onClick={() => setSearchValue('')}
              >
                <svg
                  aria-hidden="true"
                  focusable="false"
                  role="presentation"
                  viewBox="0 0 24 24"
                  width={24}
                  height={24}
                >
                  <path
                    d="M12 2a10 10 0 1010 10A10.016 10.016 0 0012 2zm3.36 12.3a.754.754 0 010 1.06.748.748 0 01-1.06 0l-2.3-2.3-2.3 2.3a.748.748 0 01-1.06 0 .754.754 0 010-1.06l2.3-2.3-2.3-2.3A.75.75 0 019.7 8.64l2.3 2.3 2.3-2.3a.75.75 0 011.06 1.06l-2.3 2.3z"
                    fill="#F9F8F4"
                    className={'group-hover:fill-left-accent'}
                  ></path>
                </svg>
              </div>
            </div>
          </div>
          <div
            className={
              'flex flex-col justify-between gap-4 lg:flex-row lg:gap-0'
            }
          >
            <div className={'font-plexsans text-main lg:max-w-[50%]'}>
              In this list you can see all the current and upcoming
              competitions. Choose a game, the reward and the date of the
              competition and have some fun!
            </div>
            <SortByFilter
              sortMethods={COMPETITIONS_SORT_METHODS}
              sortBy={sortBy}
              setSortBy={setSortBy}
              className={'hidden lg:block'}
            />
            <div
              className={
                'group flex flex-row gap-2 rounded-[5px] border bg-bg-dark p-1 hover:border-left-accent lg:hidden lg:p-2'
              }
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={'min-h-[24px] min-w-[24px] lg:h-auto lg:w-auto'}
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
                  'w-full appearance-none bg-bg-dark placeholder:font-plexsans placeholder:text-[11px]/[18px] placeholder:opacity-50 focus:border-none focus:outline-none group-hover:focus:text-left-accent group-hover:focus:placeholder:text-left-accent/80 lg:min-w-[300px] lg:placeholder:text-main'
                }
                value={searchValue}
                onChange={(event) => {
                  setSearchValue(event.target.value);
                }}
              />
              <div
                className={clsx('flex items-center justify-center', {
                  'visible cursor-pointer opacity-60 transition-opacity ease-in-out hover:opacity-100':
                    searchValue.length !== 0,
                  invisible: searchValue.length === 0,
                })}
                onClick={() => setSearchValue('')}
              >
                <svg
                  aria-hidden="true"
                  focusable="false"
                  role="presentation"
                  viewBox="0 0 24 24"
                  width={24}
                  height={24}
                >
                  <path
                    d="M12 2a10 10 0 1010 10A10.016 10.016 0 0012 2zm3.36 12.3a.754.754 0 010 1.06.748.748 0 01-1.06 0l-2.3-2.3-2.3 2.3a.748.748 0 01-1.06 0 .754.754 0 010-1.06l2.3-2.3-2.3-2.3A.75.75 0 019.7 8.64l2.3 2.3 2.3-2.3a.75.75 0 011.06 1.06l-2.3 2.3z"
                    fill="#F9F8F4"
                    className={'group-hover:fill-left-accent'}
                  ></path>
                </svg>
              </div>
            </div>
          </div>

          <div>
            {renderCompetitions
              .filter((value) => searchFilter(value, searchValue))
              .sort((a, b) => sortByFilter(a, b, sortBy))
              .map((competition, index) => (
                <CompetitionItem
                  key={index}
                  game={competition.game}
                  title={competition.title}
                  id={competition.id}
                  preReg={competition.preReg}
                  preRegDate={competition.preRegDate}
                  competitionDate={competition.competitionDate}
                  participationFee={competition.participationFee}
                  currency={competition.currency}
                  reward={competition.reward}
                  seed={competition.seed}
                  registered={competition.registered}
                />
              ))}
          </div>
        </div>
      </div>
      <AnimatePresence initial={false} mode={'wait'}>
        {filteredCompetitions.length > PAGINATION_LIMIT ? (
          <motion.div
            className={'flex w-full items-center justify-center py-4'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Pagination
              pagesAmount={Math.ceil(
                filteredCompetitions.length / PAGINATION_LIMIT
              )}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          </motion.div>
        ) : undefined}
      </AnimatePresence>
    </>
  );
}
