import { ICompetition } from '@/lib/types';
import { ZkNoidEventType } from '@/lib/platform/game_events';

export const timelineFilter = (
  competition: ICompetition,
  eventsSelected: ZkNoidEventType[]
) => {
  if (
    eventsSelected.includes(ZkNoidEventType.PAST_EVENTS) &&
    competition.competitionDate.end.getTime() < Date.now()
  )
    return true;

  if (
    eventsSelected.includes(ZkNoidEventType.CURRENT_EVENTS) &&
    competition.competitionDate.end.getTime() >= Date.now()
  )
    return true;

  if (
    eventsSelected.includes(ZkNoidEventType.UPCOMING_EVENTS) &&
    competition.competitionDate.start.getTime() > Date.now()
  )
    return true;

  if (
    eventsSelected.includes(ZkNoidEventType.PREREGISTRAION) &&
    competition.preRegDate.start.getTime() <= Date.now() &&
    competition.preRegDate.end.getTime() > Date.now()
  )
    return true;
};

export const searchFilter = (
  competition: ICompetition,
  searchValue: string
) => {
  if (searchValue.length === 0) return true;

  const searchWords = searchValue.toLowerCase().split(' ');
  const titleWords = competition.title?.toLowerCase().split(' ');

  return searchWords.every((searchWord) =>
    titleWords?.some((titleWord) => titleWord.startsWith(searchWord))
  );
};
