import leftSvg from '@/public/image/game-page/1.svg';
import centerSvg from '@/public/image/game-page/2.svg';
import rightSvg from '@/public/image/game-page/3.svg';
import Image from 'next/image';
import Link from 'next/link';
import { ICompetition } from '@/lib/types';
import { useSwitchWidgetStorage } from '@/lib/stores/switchWidgetStorage';
import { formatUnits } from '@/lib/unit';
import Button from '@/components/shared/Button';

export default function CompetitionBlock({
  competition,
  variant,
  register,
}: {
  competition: ICompetition;
  variant: 1 | 2 | 3;
  register: (id: number) => Promise<void>;
}) {
  const switchStore = useSwitchWidgetStorage();

  return (
    <div
      className={
        'relative flex h-[25vw] w-full flex-col justify-between gap-4 overflow-hidden rounded-[5px] border p-3 xl:h-[18.75vw]'
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
          <span>[{competition.id}]</span>
          <span>{competition.title}</span>
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
            {Number(competition.reward)} {competition.currency} REWARDS
          </div>
          <div
            className={
              'w-full max-w-fit rounded-2xl border border-left-accent p-1 px-2 text-center'
            }
          >
            {formatUnits(competition.participationFee)} {competition.currency}{' '}
            Participants fee
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
            {competition.competitionDate.start.toLocaleDateString('en-US', {
              dateStyle: 'long',
            })}{' '}
            -{' '}
            {competition.competitionDate.end.toLocaleDateString('en-US', {
              dateStyle: 'long',
            })}
          </span>
        </div>
      </div>
      {competition.preReg && !competition.registered ? (
        <Button label={'Register'} onClick={() => register(competition.id)} />
      ) : (
        <Link
          className={
            'w-full rounded-[5px] border border-bg-dark bg-left-accent py-2 text-center text-headline-2 font-medium text-dark-buttons-text hover:border-left-accent hover:bg-bg-dark hover:text-left-accent'
          }
          href={`/games/${competition.game.id}/${competition.id}`}
          onClick={() => switchStore.setCompetitionId(competition.id)}
        >
          Play
        </Link>
      )}
    </div>
  );
}
