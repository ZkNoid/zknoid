import Link from 'next/link';
import { ICompetition } from '@/lib/types';
import { useSwitchWidgetStorage } from '@/lib/stores/switchWidgetStorage';
import { formatUnits } from '@/lib/unit';

export default function CompetitionsItem({
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
}: ICompetition) {
  const switchStore = useSwitchWidgetStorage();
  return (
    <div
      className={
        'grid grid-cols-1 flex-row justify-between gap-6 border-t border-left-accent py-4 text-left-accent last:border-b last:pb-5 hover:bg-[#252525] lg:flex'
      }
    >
      <div className={'flex w-full flex-col justify-between gap-4 lg:w-2/6'}>
        <div
          className={
            'flex flex-row gap-2 text-[20px]/[20px] font-medium uppercase lg:text-headline-2'
          }
        >
          <span>[{id}]</span>
          <span>{title}</span>
        </div>
        <Link
          className={
            'hidden w-full max-w-full rounded-[5px] border border-bg-dark bg-left-accent py-2 text-center text-headline-2 font-medium text-dark-buttons-text hover:border-left-accent hover:bg-bg-dark hover:text-left-accent lg:block lg:max-w-[50%]'
          }
          href={`/games/${game.id}/${id}`}
          onClick={() => switchStore.setCompetitionId(id)}
        >
          Play
        </Link>
      </div>
      <div
        className={'row-start-3 row-end-3 flex w-full flex-col gap-2 lg:w-2/6'}
      >
        <div className={'flex flex-col gap-1'}>
          <span
            className={
              'font-plexsans text-[16px]/[16px] font-medium uppercase lg:text-[20px]/[20px]'
            }
          >
            Preregistration dates
          </span>
          <span
            className={
              'font-plexsans text-[14px]/[14px] font-light text-foreground lg:text-[16px]/[16px]'
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
            className={
              'font-plexsans text-[16px]/[16px] font-medium uppercase lg:text-[20px]/[20px]'
            }
          >
            Competitions dates
          </span>
          <span
            className={
              'font-plexsans text-[14px]/[14px] font-light text-foreground lg:text-[16px]/[16px]'
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
        <Link
          className={
            'block w-full max-w-full rounded-[5px] border border-bg-dark bg-left-accent py-2 text-center text-main font-medium text-dark-buttons-text hover:border-left-accent hover:bg-bg-dark hover:text-left-accent lg:hidden lg:max-w-[50%] lg:text-headline-2'
          }
          href={`/games/${game.id}/${id}`}
          onClick={() => switchStore.setCompetitionId(id)}
        >
          Play
        </Link>
      </div>
      <div
        className={
          'flex w-full flex-col gap-4 font-plexsans  text-[12px]/[12px] font-medium lg:w-2/6 lg:text-[20px]/[20px]'
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
}
