import { api } from '@/trpc/react';
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

export const GameWidget = ({
  children,
  ticks,
  score,
  gameRating,
  author,
  gameId
}: {
  children: ReactNode;
  ticks: number;
  score: number;
  gameRating: number;
  author: string;
  gameId: string;
}) => {
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
      className={'h-full min-h-[75vh] w-full'}
    >
      <div
        className={
          'relative h-full w-full rounded-[5px] border-2 border-left-accent'
        }
      >
        {children}
      </div>
      <div className={'flex w-full flex-row justify-between pt-4'}>
        <div className={'flex flex-row gap-4'}>
          <span
            className={
              'font-plexsans text-buttons-menu uppercase text-left-accent'
            }
          >
            Game rating:
          </span>
          <span className={'flex flex-row gap-2'}>
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
            <span className={'font-plexsans text-buttons-menu font-normal'}>
              {(getRatingQuery.data?.rating || 0).toFixed(1)}
            </span>
          </span>
          <span
            className={
              'font-plexsans text-buttons-menu uppercase text-left-accent'
            }
          >
            Author:
          </span>
          <span className={'font-plexsans text-buttons-menu font-normal'}>
            {author}
          </span>
        </div>
        <div
          className={
            'flex flex-row gap-4 font-plexsans text-[20px]/[20px] text-left-accent'
          }
        >
          <span className={'uppercase'}>Ticks: {ticks}</span>
          <span className={'uppercase'}>Score: {score}</span>
        </div>
      </div>
    </motion.div>
  );
};
