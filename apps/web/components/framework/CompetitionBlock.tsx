import { ICompetition } from '@/components/ui/games-store/widgets/GameStore/CompetitionsItem';
import leftSvg from '@/public/image/game-page/1.svg';
import centerSvg from '@/public/image/game-page/2.svg';
import rightSvg from '@/public/image/game-page/3.svg';
import Image from 'next/image';

export const CompetitionBlock = ({
  competition,
  variant,
}: {
  competition: ICompetition;
  variant: 1 | 2 | 3;
}) => {
  return (
    <div
      className={
        'relative flex w-full flex-col justify-between gap-8 overflow-hidden rounded-[5px] border p-3 max-[2000px]:min-h-[400px] min-[2000px]:min-h-[450px]'
      }
    >
      {variant == 1 ? (
        <div
          className={
            'absolute right-16 -z-10 h-full w-full max-[2000px]:top-[23%] min-[2000px]:top-[20%]'
          }
        >
          <Image
            src={leftSvg}
            alt={'as'}
            className={
              'w-full min-w-[150%] object-fill object-center opacity-60'
            }
          />
        </div>
      ) : variant == 2 ? (
        <div className={'absolute right-16 top-[35%] -z-10 h-full w-full'}>
          <Image
            src={centerSvg}
            alt={'as'}
            className={
              'w-full min-w-[150%] object-fill object-center opacity-40'
            }
          />
        </div>
      ) : (
        <div className={'absolute right-full top-[35%] -z-10 h-full w-full'}>
          <Image
            src={rightSvg}
            alt={'as'}
            className={
              'w-full min-w-[300%] object-fill object-center opacity-90'
            }
          />
        </div>
      )}
      <div className={'flex flex-col gap-2'}>
        <div
          className={
            'flex flex-row gap-2 text-headline-2 font-medium uppercase text-left-accent'
          }
        >
          <span>[{competition.index}]</span>
          <span>
            {competition.title ? competition.title : competition.game.name}
          </span>
        </div>
        <div
          className={
            'flex w-full flex-row gap-4 font-plexsans text-[16px]/[16px] font-medium'
          }
        >
          <div
            className={
              'w-full max-w-fit rounded-2xl border border-left-accent bg-left-accent p-1 px-2 text-center text-dark-buttons-text'
            }
          >
            {competition.reward} {competition.currency} REWARDS
          </div>
          <div
            className={
              'w-full max-w-fit rounded-2xl border border-left-accent p-1 px-2 text-center'
            }
          >
            {competition.participantsFee} {competition.currency} Participants
            fee
          </div>
        </div>
      </div>
      <div className={'flex w-full flex-col gap-4'}>
        <div className={'flex flex-col gap-2'}>
          <span
            className={
              'font-plexsans text-[16px]/[16px] font-semibold uppercase'
            }
          >
            Preregistration dates
          </span>
          <span
            className={
              'font-plexsans text-[16px]/[16px] font-normal text-foreground'
            }
          >
            {competition.preRegDate.start.toLocaleDateString('en-US', {
              dateStyle: 'long',
            })}{' '}
            -{' '}
            {competition.preRegDate.end.toLocaleDateString('en-US', {
              dateStyle: 'long',
            })}
          </span>
        </div>
        <div className={'flex flex-col gap-2'}>
          <span
            className={
              'font-plexsans text-[16px]/[16px] font-semibold uppercase'
            }
          >
            Competitions dates
          </span>
          <span
            className={
              'font-plexsans text-[16px]/[16px] font-normal text-foreground'
            }
          >
            {competition.competitionsDate.start.toLocaleDateString('en-US', {
              dateStyle: 'long',
            })}{' '}
            -{' '}
            {competition.competitionsDate.end.toLocaleDateString('en-US', {
              dateStyle: 'long',
            })}
          </span>
        </div>
      </div>
      <button
        className={
          'w-full rounded-[5px] border border-bg-dark bg-left-accent py-2 text-headline-2 font-medium text-dark-buttons-text hover:border-left-accent hover:bg-bg-dark hover:text-left-accent'
        }
      >
        Play
      </button>
    </div>
  );
};
