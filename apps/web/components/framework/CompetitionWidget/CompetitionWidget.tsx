import { CompetitionBlock } from '@/components/framework/CompetitionWidget/CompetitionBlock';
import { SortByFilter } from '@/components/ui/games-store/SortByFilter';
import {
  COMPETITIONS_SORT_METHODS,
  CompetitionsSortBy,
} from '@/constants/sortBy';
import { CompetitionListItem } from '@/components/framework/CompetitionWidget/CompetitionListItem';
import Link from 'next/link';
import { ICompetition } from '@/lib/types';
import { useState } from 'react';

export const CompetitionWidget = ({
  competitionBlocks,
  competitionList,
  gameId,
}: {
  gameId: string;
  competitionBlocks: ICompetition[];
  competitionList: ICompetition[];
}) => {
  const [sortBy, setSortBy] = useState<CompetitionsSortBy>(
    CompetitionsSortBy.LowFunds
  );

  const sortByFilter = (a: ICompetition, b: ICompetition): number => {
    console.log(a, b);
    switch (sortBy) {
      case CompetitionsSortBy.HighFees:
        return Number(a.participationFee - b.participationFee);

      case CompetitionsSortBy.LowFees:
        return Number(b.participationFee - a.participationFee);

      case CompetitionsSortBy.HighFunds:
        return Number(a.reward - b.reward);

      case CompetitionsSortBy.LowFunds:
        return Number(b.reward - a.reward);

      case CompetitionsSortBy.Latest:
        return (
          a.competitionDate.start.getDate() - b.competitionDate.start.getDate()
        );

      case CompetitionsSortBy.Nearest:
        return (
          b.competitionDate.start.getDate() - a.competitionDate.start.getDate()
        );
    }
  };
  return (
    <>
      <div className={'mb-4 flex flex-col gap-8'}>
        <div className={'w-full text-left text-headline-1'}>
          The most interesting competitions
        </div>
        <div className={'flex flex-row gap-4'}>
          {competitionBlocks.map((item, index) => (
            <CompetitionBlock
              key={index}
              competition={item}
              variant={index == 0 ? 1 : index == 1 ? 2 : 3}
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
        <div
          className={
            'flex max-h-[400px] flex-col gap-4 overflow-y-scroll scrollbar-custom'
          }
        >
          {competitionList
            .toSorted((a, b) => sortByFilter(a, b))
            .map((item, index) => (
              <CompetitionListItem key={index} competition={item} />
            ))}
        </div>
        <Link
          className={
            'w-full rounded-[5px] border border-bg-dark bg-left-accent py-2 text-center text-headline-2 font-medium text-dark-buttons-text hover:border-left-accent hover:bg-bg-dark hover:text-left-accent max-[2000px]:max-w-[40%] min-[2000px]:max-w-[30%]'
          }
          href={`/games/${gameId}/new-competition`}
        >
          Create new competition
        </Link>
      </div>
    </>
  );
};
