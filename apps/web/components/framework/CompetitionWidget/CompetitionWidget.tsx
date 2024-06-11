import CompetitionBlock from './ui/CompetitionBlock';
import { SortByFilter } from '@/components/widgets/GameStore/Storefront/ui/SortByFilter';
import { COMPETITIONS_SORT_METHODS, CompetitionsSortBy } from './lib/sortBy';
import CompetitionListItem from './ui/CompetitionListItem';
import { ICompetition } from '@/lib/types';
import { useEffect, useRef, useState } from 'react';
import Button from '@/components/shared/Button';
import CustomScrollbar from '@/components/shared/CustomScrollbar';
import { AnimatePresence, useScroll } from 'framer-motion';
import { sortByFilter } from './lib/sortBy';

export default function CompetitionWidget({
  competitionBlocks,
  competitionList,
  gameId,
  register,
}: {
  gameId: string;
  competitionBlocks: ICompetition[];
  competitionList: ICompetition[];
  register: (id: number) => Promise<void>;
}) {
  const PAGINATION_LIMIT = 5;
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sortBy, setSortBy] = useState<CompetitionsSortBy>(
    CompetitionsSortBy.LowFunds
  );
  const [containerHeight, setContainerHeight] = useState<number>(0);
  const competitionsListRef = useRef<HTMLDivElement | null>(null);
  const renderCompetitionsList = competitionList;

  useEffect(() => {
    const refObj = competitionsListRef.current;

    const scrollHandler = () => {
      if (
        // @ts-ignore
        refObj?.scrollHeight - refObj?.scrollTop === refObj?.clientHeight &&
        renderCompetitionsList.length < competitionList.length
      ) {
        setCurrentPage((prevState) => prevState + 1);
      }
    };
    refObj?.addEventListener('scroll', scrollHandler);
    return () => {
      refObj?.removeEventListener('scroll', scrollHandler);
    };
  });

  useEffect(() => {
    const refObj = competitionsListRef.current;
    const resizeHandler = () => {
      if (containerHeight != refObj?.clientHeight) {
        // @ts-ignore
        setContainerHeight(refObj?.clientHeight);
      }
    };
    resizeHandler();
    refObj?.addEventListener('resize', resizeHandler);
    return () => {
      refObj?.removeEventListener('resize', resizeHandler);
    };
  });
  const { scrollYProgress } = useScroll({ container: competitionsListRef });

  return (
    <>
      <div className={'mb-4 flex flex-col gap-4'}>
        <div className={'w-full text-left text-headline-1'}>
          The most interesting competitions
        </div>
        <div className={'flex flex-row gap-4'}>
          {competitionBlocks.map((item, index) => (
            <CompetitionBlock
              key={index}
              competition={item}
              variant={index == 0 ? 1 : index == 1 ? 2 : 3}
              register={register}
            />
          ))}
        </div>
      </div>
      <div className={'mb-4 flex max-w-[90%] flex-col gap-8'}>
        <div className={'flex w-full flex-row justify-between'}>
          <div className={'text-left text-headline-1'}>
            Full competition list
          </div>
          <SortByFilter
            sortMethods={COMPETITIONS_SORT_METHODS}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />
        </div>
        <div className={'flex w-full flex-row gap-4'}>
          <div
            ref={competitionsListRef}
            className={
              'flex max-h-[400px] w-full flex-col gap-4 overflow-y-scroll no-scrollbar'
            }
          >
            {renderCompetitionsList
              .toSorted((a, b) => sortByFilter(a, b, sortBy))
              .map((item, index) => (
                <CompetitionListItem
                  key={index}
                  competition={item}
                  register={register}
                  index={index + 1}
                />
              ))}
          </div>
          <AnimatePresence initial={false} mode={'wait'}>
            {containerHeight === 400 && (
              <CustomScrollbar scrollYProgress={scrollYProgress} />
            )}
          </AnimatePresence>
        </div>
        <Button
          label={'Create new competition'}
          asLink
          href={`/games/${gameId}/new-competition`}
          className={'max-[2000px]:max-w-[40%] min-[2000px]:max-w-[30%]'}
        />
      </div>
    </>
  );
}
