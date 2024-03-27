import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { clsx } from 'clsx';
import Link from 'next/link';
import { ICompetition } from '@/lib/types';
import { useSwitchWidgetStorage } from '@/lib/stores/switchWidgetStorage';
import { formatUnits } from '@/lib/unit';

export const CompetitionListItem = ({
  competition,
}: {
  competition: ICompetition;
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isPreReg, setIsPreReg] = useState<boolean>(competition.preReg);
  const [isRegistered, setIsRegistered] = useState<boolean>(
    !!competition.registered
  );

  const switchStore = useSwitchWidgetStorage();

  return (
    <div
      className={
        'w-full border-t border-left-accent pl-4 pt-4 last:border-b last:pb-4'
      }
    >
      <div className={'flex flex-row items-center justify-between gap-8'}>
        <div
          className={
            'flex min-w-[400px] flex-row items-center gap-4 text-headline-2 font-medium uppercase text-left-accent'
          }
          onClick={() => setIsOpen(!isOpen)}
        >
          <div
            className={'flex cursor-pointer flex-row gap-4 hover:opacity-80'}
          >
            <span>[{competition.id}]</span>
            <span>{competition.title}</span>
          </div>
        </div>
        <div
          className={
            'flex w-full flex-row gap-10 font-plexsans text-[20px]/[20px] font-medium'
          }
        >
          <div
            className={
              'flex w-full max-w-fit items-center justify-center rounded-2xl border border-left-accent bg-left-accent p-1 px-2 text-center text-dark-buttons-text'
            }
          >
            {Number(competition.reward)} {competition.currency} REWARDS
          </div>
          <div
            className={
              'w-full max-w-fit items-center justify-center rounded-2xl border border-left-accent p-1 px-2 text-center'
            }
          >
            {formatUnits(competition.participationFee)} {competition.currency}{' '}
            Participants fee
          </div>
        </div>
        <Link
          className={
            'w-full rounded-[5px] border border-bg-dark bg-left-accent py-2 text-center text-headline-2 font-medium text-dark-buttons-text hover:border-left-accent hover:bg-bg-dark hover:text-left-accent max-[2000px]:max-w-[250px] min-[2000px]:max-w-[350px]'
          }
          href={`/games/${competition.game.id}/${competition.id}`}
          onClick={() => switchStore.setCompetitionId(competition.id)}
        >
          Play
        </Link>
        <div
          className={
            'flex w-full max-w-[200px] flex-col items-end justify-center'
          }
        >
          <div
            className={
              'flex h-[24px] w-[24px] cursor-pointer flex-col items-center justify-center border-2 border-left-accent hover:opacity-80'
            }
            onClick={() => setIsOpen(!isOpen)}
          >
            <div className={'h-[2px] w-4 bg-left-accent'} />
            <motion.div
              animate={isOpen ? 'open' : 'close'}
              variants={{ open: { opacity: 0 }, close: { opacity: 1 } }}
              className={'h-[2px] w-4 rotate-90 bg-left-accent'}
            />
          </div>
        </div>
      </div>
      <AnimatePresence initial={false} mode={'wait'}>
        {isOpen && (
          <motion.div
            className={'flex w-full flex-row gap-8 overflow-hidden pt-4'}
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ type: 'spring', duration: 0.4, bounce: 0 }}
          >
            <div className={'flex flex-col gap-4'}>
              <div className={'flex w-full flex-row justify-between gap-10'}>
                <span
                  className={'text-buttons-menu uppercase text-left-accent'}
                >
                  Preregiatration
                </span>
                <div
                  className={clsx('rounded-[5px] border bg-bg-dark p-1', {
                    'border-left-accent bg-left-accent': isPreReg,
                  })}
                  // onClick={() => setIsPreReg(!isPreReg)}
                >
                  <svg
                    aria-hidden="true"
                    role="presentation"
                    viewBox="0 0 17 18"
                    className={'h-3.5 w-3.5'}
                  >
                    <polyline
                      fill="none"
                      points="1 9 7 14 15 4"
                      stroke="#252525"
                      strokeDasharray="22"
                      strokeDashoffset="44"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className={isPreReg ? 'opacity-100' : 'opacity-0'}
                    ></polyline>
                  </svg>
                </div>
              </div>
              <div className={'flex w-full flex-row justify-between gap-10'}>
                <span
                  className={'text-buttons-menu uppercase text-left-accent'}
                >
                  Registered
                </span>
                <div
                  className={clsx('rounded-[5px] border bg-bg-dark p-1', {
                    'border-left-accent bg-left-accent': isRegistered,
                  })}
                  // onClick={() => setIsRegistered(!isRegistered)}
                >
                  <svg
                    aria-hidden="true"
                    role="presentation"
                    viewBox="0 0 17 18"
                    className={'h-3.5 w-3.5'}
                  >
                    <polyline
                      fill="none"
                      points="1 9 7 14 15 4"
                      stroke="#252525"
                      strokeDasharray="22"
                      strokeDashoffset="44"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className={isRegistered ? 'opacity-100' : 'opacity-0'}
                    ></polyline>
                  </svg>
                </div>
              </div>
            </div>
            <div className={'flex flex-row gap-[84px] pl-28'}>
              <div className={'flex flex-col gap-2'}>
                <span
                  className={
                    'font-plexsans text-[16px]/[16px] font-semibold uppercase text-left-accent'
                  }
                >
                  Preregistration dates
                </span>
                <div className={'flex flex-col gap-2'}>
                  <div
                    className={
                      'flex flex-row items-center gap-4 font-plexsans text-[16px]/[16px]'
                    }
                  >
                    <span className={'font-extralight'}>Start</span>
                    <span className={'font-normal text-foreground opacity-80'}>
                      {competition.preRegDate.start.toLocaleDateString(
                        'en-US',
                        {
                          dateStyle: 'long',
                        }
                      )}
                    </span>
                  </div>
                  <div
                    className={
                      'flex flex-row items-center gap-4 font-plexsans text-[16px]/[16px]'
                    }
                  >
                    <span className={'font-extralight'}>Finish</span>
                    <span className={'font-normal text-foreground opacity-80'}>
                      {competition.preRegDate.end.toLocaleDateString('en-US', {
                        dateStyle: 'long',
                      })}
                    </span>
                  </div>
                </div>
              </div>
              <div className={'flex flex-col gap-2'}>
                <span
                  className={
                    'font-plexsans text-[16px]/[16px] font-semibold uppercase text-left-accent'
                  }
                >
                  Competitions dates
                </span>
                <div className={'flex flex-col gap-2'}>
                  <div
                    className={
                      'flex flex-row items-center gap-4 font-plexsans text-[16px]/[16px]'
                    }
                  >
                    <span className={'font-extralight'}>Start</span>
                    <span className={'font-normal text-foreground opacity-80'}>
                      {competition.competitionDate.start.toLocaleDateString(
                        'en-US',
                        {
                          dateStyle: 'long',
                        }
                      )}
                    </span>
                  </div>
                  <div
                    className={
                      'flex flex-row items-center gap-4 font-plexsans text-[16px]/[16px]'
                    }
                  >
                    <span className={'font-extralight'}>Finish</span>
                    <span className={'font-normal text-foreground opacity-80'}>
                      {competition.competitionDate.end.toLocaleDateString(
                        'en-US',
                        {
                          dateStyle: 'long',
                        }
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
