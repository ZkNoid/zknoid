import Link from 'next/link';
import { arkanoidConfig } from '@/games/arkanoid/config';
import StatefulModal from '@/components/shared/Modal/StatefulModal';
import { ICompetition } from '@/lib/types';

export const PreRegModal = ({ competition }: { competition: ICompetition }) => {
  const formatDate = (item: string | undefined) => {
    // @ts-ignore
    if (item.length < 2) return '0' + item;
    else return item;
  };
  const formatMonth = (item: number | undefined) => {
    // @ts-ignore
    item += 1;
    // @ts-ignore
    if (item.toString().length < 2) return '0' + item;
    else return item;
  };

  return (
    <StatefulModal isDismissible={false} isOpen={true}>
      <div
        className={
          'flex flex-col items-center justify-center gap-4 p-2 text-center lg:p-12'
        }
      >
        <span className={'text-headline-2'}>
          This competition is not active now
        </span>
        {competition.preReg ? (
          <span className={'font-plexsans text-[14px]/[14px]'}>
            This competition in pre-registration mode, please wait until the
            competition is started
          </span>
        ) : (
          <span className={'font-plexsans text-[14px]/[14px]'}>
            Please wait until the competition is started
          </span>
        )}
        <span className={'my-2'}>
          Competition starts:{' '}
          {`${competition.competitionDate.start
            ?.getFullYear()
            .toString()}-${formatMonth(
            competition.competitionDate.start?.getMonth()
          )}-${formatDate(
            competition.competitionDate.start?.getDate().toString()
          )}`}
        </span>
        <Link
          className={
            'group mt-4 flex w-full flex-row items-center justify-center gap-4 rounded-[5px] border border-bg-dark bg-middle-accent py-2 text-center text-headline-2 font-medium text-dark-buttons-text hover:border-middle-accent hover:bg-bg-dark hover:text-middle-accent'
          }
          href={`/games/${arkanoidConfig.id}/competitions-list`}
        >
          <span
            className={'text-[14px]/[14px] font-medium lg:text-buttons-menu'}
          >
            To competitions list
          </span>
        </Link>
      </div>
    </StatefulModal>
  );
};
