import { ICompetition } from '@/lib/types';

export const Competition = ({
  startGame,
  competition,
}: {
  startGame: () => void;
  competition: ICompetition;
}) => {
  return (
    <div className={'flex h-full w-full flex-col gap-10'}>
      <span className={'w-full text-headline-2 font-bold'}>Competition</span>
      <div className={'flex w-full flex-col gap-2'}>
        <div
          className={
            'grid grid-cols-4 grid-rows-1 gap-8 font-plexsans text-buttons-menu'
          }
        >
          <span className={'uppercase text-left-accent'}>Name</span>
          <span className={'font-normal'}>{competition.title}</span>
        </div>
        <div
          className={
            'grid grid-cols-4 grid-rows-1 gap-8 font-plexsans text-buttons-menu'
          }
        >
          <span className={'uppercase text-left-accent'}>Funds</span>
          <span className={'font-normal'}>
            {competition.reward} {competition.currency}
          </span>
        </div>
      </div>
      <div className={'flex flex-col gap-2 font-plexsans text-buttons-menu'}>
        <span className={'uppercase text-left-accent'}>
          Preregistration dates
        </span>
        <span className={'font-normal'}>
          {competition.preRegDate.start.toLocaleDateString('en-US', {
            dateStyle: 'long',
          })}{' '}
          -{' '}
          {competition.preRegDate.end.toLocaleDateString('en-US', {
            dateStyle: 'long',
          })}
        </span>
        <span className={'uppercase text-left-accent'}>Competitions dates</span>
        <span className={'font-normal'}>
          {competition.competitionDate.start.toLocaleDateString('en-US', {
            dateStyle: 'long',
          })}{' '}
          -{' '}
          {competition.competitionDate.end.toLocaleDateString('en-US', {
            dateStyle: 'long',
          })}
        </span>
      </div>
      <div className={'flex flex-col gap-4'}>
        <span className={'w-full text-headline-2 font-bold'}>Rules</span>
        <span className={'font-plexsans text-buttons-menu font-normal'}>
          In Ankanoid, your objective is to break all the bricks on the screen
          using a bouncing ball and a platform. You can control the game by
          using the left and right arrow keys on your keyboard to move the
          platform. You need to bounce the ball and prevent it from falling off
          the bottom of the screen.
        </span>
      </div>
      <button
        className={
          'w-full rounded-[5px] border border-bg-dark bg-left-accent py-2 text-center text-[20px]/[20px] font-medium text-dark-buttons-text hover:border-left-accent hover:bg-bg-dark hover:text-left-accent'
        }
        onClick={startGame}
      >
        Restart game
      </button>
    </div>
  );
};
