'use client';

import Link from 'next/link';
import Image from 'next/image';
import { IGame } from '@/app/constants/games';
import { useEffect, useState } from 'react';
import heartImg from '@/public/image/misc/heart.svg';
import heartFilledImg from '@/public/image/misc/heart-filled.svg';
import { ZkNoidGameGenre } from '@/lib/platform/game_tags';
import { clsx } from 'clsx';

const StarSVG = ({
  fill = 'white',
  className,
}: {
  fill: string;
  className?: string;
}) => {
  return (
    <svg
      width="19"
      height="18"
      viewBox="0 0 19 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={clsx('h-[25px] w-[25px]', className && className)}
    >
      <path
        d="M9.5 0.523438L11.6329 7.08778H18.535L12.9511 11.1448L15.084 17.7091L9.5 13.6521L3.91604 17.7091L6.04892 11.1448L0.464963 7.08778H7.36712L9.5 0.523438Z"
        fill={fill}
      />
    </svg>
  );
};

export const GameCard = ({
  game,
  fullImageW,
  fullImageH,
  color,
}: {
  game: IGame;
  fullImageW?: boolean;
  fullImageH?: boolean;
  color: 1 | 2 | 3;
}) => {
  const [isFavorite, setIsFavorite] = useState<boolean>(false);

  const fillColor =
    color === 1
      ? 'bg-left-accent'
      : color === 2
        ? 'bg-middle-accent'
        : 'bg-gradient-to-r from-left-accent to-middle-accent';

  return (
    <div className="group relative flex flex-col rounded-xl border border-bg-dark bg-[#252525] hover:border-left-accent">
      <Image
        src={isFavorite ? heartFilledImg : heartImg}
        alt={'Favorite'}
        className={'absolute right-7 top-7 h-[36px] w-[36px] cursor-pointer'}
        onClick={() => setIsFavorite(!isFavorite)}
      />
      <Link
        href={game.active ? `/games/${game.id}/${game.defaultPage}` : '#'}
        className="m-5 flex h-full flex-col gap-5"
      >
        <div
          className={
            'flex items-center justify-center rounded-[5px] border group-hover:border-left-accent max-[2000px]:h-[300px] min-[2000px]:h-[400px]'
          }
        >
          <Image
            src={game.logo}
            alt="Game logo"
            width={300}
            height={300}
            className={clsx(
              'h-full max-h-[70%] w-full object-contain object-center',
              {
                'max-w-full': fullImageW,
                'max-h-full': fullImageH,
                'max-[2000px]:w-[300px] min-[2000px]:w-[400px]': !fullImageW,
              }
            )}
          />
        </div>
        <div className={'flex flex-row justify-between'}>
          <div className="text-headline-1">{game.name}</div>
          <span
            className={
              'flex flex-row items-center justify-between gap-2 text-center'
            }
          >
            <StarSVG
              fill={color === 1 ? '#D2FF00' : '#97FF00'}
              className={'mb-1.5'}
            />
            {Number.isInteger(game.rating) ? game.rating + '.0' : game.rating}
          </span>
        </div>
        <div className="font-plexsans text-main font-normal">
          {game.description}
        </div>
        <div className={'flex-grow max-[2000px]:hidden'} />
        <div
          className={
            'mt-auto flex w-full flex-row items-center justify-start gap-2'
          }
        >
          {[...game.features, game.genre].map((value, i) => (
            <span
              key={i}
              className={clsx(
                'rounded p-1 text-filtration-buttons text-dark-buttons-text',
                fillColor
              )}
            >
              {value}
            </span>
          ))}
        </div>
      </Link>
    </div>
  );
};
