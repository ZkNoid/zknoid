import { ICompetition } from '@/lib/types';
import { formatUnits } from '@/lib/unit';
import { AnimatePresence, motion } from 'framer-motion';

export const Competition = ({
  startGame,
  competition,
  isRestartBtn,
}: {
  startGame: () => void;
  competition: ICompetition | undefined;
  isRestartBtn: boolean;
}) => {
  return (
    <motion.div
      variants={{
        fullscreen: {
          gridColumnStart: 3,
          gridColumnEnd: 5,
          gridRowStart: 2,
          flexDirection: 'row',
        },
        windowed: {
          gridColumnStart: 4,
          gridColumnEnd: 5,
          gridRowStart: 1,
          display: 'flex',
          flexDirection: 'column',
        },
      }}
      className={'flex h-full w-full gap-10'}
    >
      <div className={'flex w-full flex-col gap-10'}>
        <span className={'w-full text-headline-2 font-bold'}>Competition</span>
        <div className={'flex w-full flex-col gap-2'}>
          <div
            className={
              'grid grid-cols-4 grid-rows-1 gap-8 font-plexsans text-buttons-menu'
            }
          >
            <span className={'uppercase text-left-accent'}>Name</span>
            <motion.span
              variants={{
                fullscreen: { gridColumnStart: 2, gridColumnEnd: 4 },
              }}
              className={'font-normal'}
            >
              {!competition ? ' - ' : competition.title}
            </motion.span>
          </div>
          <div
            className={
              'grid grid-cols-4 grid-rows-1 gap-8 font-plexsans text-buttons-menu'
            }
          >
            <span className={'uppercase text-left-accent'}>Funds</span>
            <motion.span
              variants={{
                fullscreen: { gridColumnStart: 2, gridColumnEnd: 4 },
              }}
              className={'font-normal'}
            >
              {!competition ? (
                ' - '
              ) : (
                <>
                  {formatUnits(competition.reward)} {competition.currency}
                </>
              )}
            </motion.span>
          </div>
        </div>
        <div className={'flex flex-col gap-2 font-plexsans text-buttons-menu'}>
          <span className={'uppercase text-left-accent'}>
            Preregistration dates
          </span>
          <span className={'font-normal'}>
            {!competition ? (
              ' - '
            ) : (
              <>
                {competition.preRegDate.start.toLocaleDateString('en-US', {
                  dateStyle: 'long',
                })}{' '}
                -{' '}
                {competition.preRegDate.end.toLocaleDateString('en-US', {
                  dateStyle: 'long',
                })}
              </>
            )}
          </span>
          <span className={'uppercase text-left-accent'}>
            Competitions dates
          </span>
          <span className={'font-normal'}>
            {!competition ? (
              ' - '
            ) : (
              <>
                {competition.competitionDate.start.toLocaleDateString('en-US', {
                  dateStyle: 'long',
                })}{' '}
                -{' '}
                {competition.competitionDate.end.toLocaleDateString('en-US', {
                  dateStyle: 'long',
                })}
              </>
            )}
          </span>
        </div>
      </div>
      <div className={'flex w-full flex-col gap-10'}>
        <div className={'flex flex-col gap-4'}>
          <span className={'w-full text-headline-2 font-bold'}>Rules</span>
          <span className={'font-plexsans text-buttons-menu font-normal'}>
            In Ankanoid, your objective is to break all the bricks on the screen
            using a bouncing ball and a platform. You can control the game by
            using the left and right arrow keys on your keyboard to move the
            platform. You need to bounce the ball and prevent it from falling
            off the bottom of the screen.
          </span>
        </div>
        <AnimatePresence>
          {isRestartBtn && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={
                'w-full rounded-[5px] border border-bg-dark bg-left-accent py-2 text-center text-[20px]/[20px] font-medium text-dark-buttons-text hover:border-left-accent hover:bg-bg-dark hover:text-left-accent'
              }
              onClick={startGame}
            >
              Restart game
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
