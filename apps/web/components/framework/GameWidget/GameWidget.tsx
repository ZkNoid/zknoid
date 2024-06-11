import { api } from '@/trpc/react';
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

export default function GameWidget({
  children,
  ticks,
  score,
  author,
  gameId,
  isPvp = false,
  playersCount,
}: {
  children: ReactNode;
  ticks?: number;
  score?: number;
  author: string;
  gameId: string;
  isPvp?: boolean;
  playersCount?: number;
}) {
  const getRatingQuery = api.ratings.getGameRating.useQuery({
    gameId,
  });

  return (
    <motion.div
      variants={{
        fullscreen: {
          gridColumnStart: 1,
          gridColumnEnd: 5,
        },
        windowed: {
          gridColumnStart: 2,
          gridColumnEnd: 4,
        },
      }}
      className={`h-full min-h-[60vh] w-full lg:min-h-[75vh]`}
    >
      {!isPvp && (
        <div
          className={
            'flex flex-row gap-4 pb-2 font-plexsans text-[16px]/[16px] text-left-accent lg:hidden'
          }
        >
          <span className={'w-full uppercase'}>Ticks: {ticks}</span>
          <span className={'w-full text-right uppercase'}>Score: {score}</span>
        </div>
      )}
      {isPvp ? (
        <div className={'relative w-full'}>{children}</div>
      ) : (
        <div
          className={
            'relative h-full w-full rounded-[5px] border border-left-accent lg:border-2'
          }
        >
          {children}
        </div>
      )}
      <div className={'flex w-full flex-row justify-between pt-4'}>
        <div
          className={'flex flex-row items-center gap-0 lg:items-start lg:gap-4'}
        >
          <span
            className={
              'font-plexsans text-[12px]/[12px] uppercase text-left-accent lg:text-buttons-menu'
            }
          >
            Game rating:
          </span>
          <span className={'flex flex-row gap-2 pl-1 pr-6 lg:pl-0 lg:pr-0'}>
            <svg
              width="19"
              height="18"
              viewBox="0 0 19 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={'h-[20px] w-[20px]'}
            >
              <path
                d="M9.5 0.523438L11.6329 7.08778H18.535L12.9511 11.1448L15.084 17.7091L9.5 13.6521L3.91604 17.7091L6.04892 11.1448L0.464963 7.08778H7.36712L9.5 0.523438Z"
                fill="#D2FF00"
              />
            </svg>
            <span
              className={
                'pt-0.5 font-plexsans text-[12px]/[12px] font-normal lg:pt-0 lg:text-buttons-menu'
              }
            >
              {(getRatingQuery.data?.rating || 0).toFixed(1)}
            </span>
          </span>
          <span
            className={
              'font-plexsans text-[12px]/[12px] uppercase text-left-accent lg:text-buttons-menu'
            }
          >
            Author:
          </span>
          <span
            className={
              'pl-1 font-plexsans text-[12px]/[12px] font-normal lg:pl-0 lg:text-buttons-menu'
            }
          >
            {author}
          </span>
        </div>
        {isPvp ? (
          <div
            className={
              'hidden flex-row gap-4 font-plexsans text-[20px]/[20px] text-left-accent lg:flex'
            }
          >
            <span className={'uppercase'}>
              Players in queue: {playersCount}
            </span>
          </div>
        ) : (
          <div
            className={
              'hidden flex-row gap-4 font-plexsans text-[20px]/[20px] text-left-accent lg:flex'
            }
          >
            <span className={'uppercase'}>Ticks: {ticks}</span>
            <span className={'uppercase'}>Score: {score}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
