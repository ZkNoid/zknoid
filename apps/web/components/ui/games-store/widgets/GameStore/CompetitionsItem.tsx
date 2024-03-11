import { IGame } from '@/app/constants/games';

export interface ICompetition {
  game: IGame;
  title?: string;
  index: number;
  preRegDate: {
    start: Date;
    end: Date;
  };
  competitionsDate: {
    start: Date;
    end: Date;
  };
  participantsFee: number;
  currency: string;
  reward: number;
}

export const CompetitionItem = ({
  game,
  title = game.name,
  index,
  preRegDate,
  competitionsDate,
  participantsFee,
  currency,
  reward,
}: ICompetition) => {
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
            {competitionsDate.start.toLocaleDateString('en-US', {
              dateStyle: 'long',
            })}{' '}
            -{' '}
            {competitionsDate.end.toLocaleDateString('en-US', {
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
