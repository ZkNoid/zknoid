'use client';

import Link from 'next/link';
import Image from 'next/image';
import { IGame } from '@/app/constants/games';
import { useEffect, useState } from 'react';
import heart_1 from '@/public/image/misc/heart-1.svg';
import heart_2 from '@/public/image/misc/heart-2.svg';
import heart_3 from '@/public/image/misc/heart-3.svg';
import heart_1_filled from '@/public/image/misc/heart-1-filled.svg';
import heart_2_filled from '@/public/image/misc/heart-2-filled.svg';
import heart_3_filled from '@/public/image/misc/heart-3-filled.svg';
import { clsx } from 'clsx';
import { api } from '@/trpc/react';
import { useNetworkStore } from '@/lib/stores/network';

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
  color: 1 | 2 | 3 | 4;
}) => {
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const networkStore = useNetworkStore();

  const setFavoriteMutation = api.favorites.setFavoriteGameStatus.useMutation({
    onSuccess: async () => {},
  });

  const getFavoritesQuery = api.favorites.getFavoriteGames.useQuery({
    userAddress: networkStore.address ?? '',
  });

  const getRatingQuery = api.ratings.getGameRating.useQuery({
    gameId: game.id,
  });

  useEffect(() => {
    if (getFavoritesQuery.data) {
      if (
        getFavoritesQuery.data.favorites.some(
          (x) => x.status && x.gameId == game.id
        )
      ) {
        console.log(getFavoritesQuery.data.favorites, game.id);
        setIsFavorite(true);
      }
    }
  }, [getFavoritesQuery.data]);

  const fillColor =
    color === 1
      ? 'bg-left-accent'
      : color === 2
        ? 'bg-middle-accent'
        : color === 3
          ? 'bg-right-accent'
          : 'bg-gradient-to-r from-left-accent via-middle-accent via-30% to-right-accent';

  const heart = color === 1 ? heart_1 : color === 2 ? heart_2 : heart_3;
  const heartActive =
    color === 1
      ? heart_1_filled
      : color === 2
        ? heart_2_filled
        : heart_3_filled;

  const hoverColor =
    color === 1
      ? 'hover:border-left-accent group-hover:border-left-accent'
      : color === 2
        ? 'hover:border-middle-accent group-hover:border-middle-accent'
        : color === 3
          ? 'hover:border-right-accent group-hover:border-right-accent'
          : 'hover:border-middle-accent group-hover:border-middle-accent';

  return (
    <div
      className={clsx(
        'group relative flex flex-col rounded-xl border border-bg-dark bg-[#252525]',
        hoverColor
      )}
    >
      {game.isReleased && (
        <Image
          src={isFavorite ? heartActive : heart}
          alt={'Favorite'}
          className={
            'absolute right-9 top-9 hidden h-[36px] w-[36px] cursor-pointer lg:block'
          }
          onClick={() => {
            if (!networkStore.address) return;
            setFavoriteMutation.mutate({
              gameId: game.id,
              userAddress: networkStore.address,
              status: !isFavorite,
            });
            setIsFavorite(!isFavorite);
          }}
        />
      )}
      <Link
        href={game.active ? `/games/${game.id}/${game.defaultPage}` : '#'}
        className="flex h-full flex-col gap-5 p-2 lg:m-5"
      >
        <div
          className={clsx(
            'flex items-center justify-center rounded-[5px] border max-[2000px]:h-[300px] min-[2000px]:h-[400px]',
            hoverColor
          )}
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
          <div className="text-headline-2 lg:text-headline-1">{game.name}</div>
          {game.isReleased && (
            <span
              className={
                'flex flex-row items-center justify-between gap-2 text-center'
              }
            >
              <StarSVG
                fill={
                  color === 1
                    ? '#D2FF00'
                    : color === 2
                      ? '#97FF00'
                      : color === 3
                        ? '#56EBFF'
                        : '#D2FF00'
                }
                className={'mb-1.5'}
              />
              {(getRatingQuery.data?.rating || 0).toFixed(1)}
            </span>
          )}
        </div>
        <div className="font-plexsans text-[14px]/[18px] font-normal lg:text-main">
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
                'rounded p-1 text-[12px]/[18px] text-dark-buttons-text lg:text-filtration-buttons',
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
