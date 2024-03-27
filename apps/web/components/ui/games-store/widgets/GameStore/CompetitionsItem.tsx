import Link from 'next/link';
import { ICompetition } from '@/lib/types';
import { useSwitchWidgetStorage } from '@/lib/stores/switchWidgetStorage';
import { formatUnits } from '@/lib/unit';

// export interface ICompetition {
//   game: IGame;
//   title?: string;
//   id: number;
//   preRegDate: {
//     start: Date;
//     end: Date;
//   };
//   competitionsDate: {
//     start: Date;
//     end: Date;
//   };
//   participantsFee: number;
//   currency: string;
//   reward: number;
// }

export const CompetitionItem = ({
  id,
  seed,
  game,
  title,
  preReg,
  preRegDate,
  competitionDate,
  participationFee,
  currency,
  reward,
  registered,
}: ICompetition) => {
  const switchStore = useSwitchWidgetStorage();
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
          <span>[{id}]</span>
          <span>{title}</span>
        </div>
        <Link
          className={
            'w-full max-w-[50%] rounded-[5px] border border-bg-dark bg-left-accent py-2 text-center text-headline-2 font-medium text-dark-buttons-text hover:border-left-accent hover:bg-bg-dark hover:text-left-accent'
          }
          href={`/games/${game.id}/${id}`}
          onClick={() => switchStore.setCompetitionId(id)}
        >
          Play
        </Link>
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
            {preRegDate.start.toLocaleDateString('en-US', {
              dateStyle: 'long',
            })}{' '}
            -{' '}
            {preRegDate.end.toLocaleDateString('en-US', { dateStyle: 'long' })}
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
            {competitionDate.start.toLocaleDateString('en-US', {
              dateStyle: 'long',
            })}{' '}
            -{' '}
            {competitionDate.end.toLocaleDateString('en-US', {
              dateStyle: 'long',
            })}
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
          {formatUnits(participationFee)} {currency} Participants fee
        </div>
        <div
          className={
            'w-full max-w-fit rounded-2xl border border-left-accent bg-left-accent p-1 px-2 text-center text-dark-buttons-text'
          }
        >
          {formatUnits(reward)} {currency} REWARDS
        </div>
      </div>
    </div>
  );
};
