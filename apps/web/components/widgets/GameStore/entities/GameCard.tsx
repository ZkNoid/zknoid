'use client';

import Link from 'next/link';
import Image from 'next/image';
import { IGame, LogoMode } from '@/app/constants/games';
import { useEffect, useState } from 'react';
import heart_1 from '@/public/image/misc/heart-1.svg';
import heart_2 from '@/public/image/misc/heart-2.svg';
import heart_3 from '@/public/image/misc/heart-3.svg';
import heart_1_filled from '@/public/image/misc/heart-1-filled.svg';
import heart_2_filled from '@/public/image/misc/heart-2-filled.svg';
import heart_3_filled from '@/public/image/misc/heart-3-filled.svg';
import { api } from '@/trpc/react';
import { useNetworkStore } from '@/lib/stores/network';
import { getEnvContext } from '@/lib/envContext';
import { cn } from '@/lib/helpers';
// import { toast } from '@/components/ui/games-store/shared/Toast';
// import { useToasterStore } from '@/lib/stores/toasterStore';

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
      className={cn('h-[25px] w-[25px]', className)}
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
  color,
}: {
  game: IGame;
  color: 1 | 2 | 3 | 4;
}) => {
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const networkStore = useNetworkStore();
  // const toasterStore = useToasterStore();

  const setFavoriteMutation = api.favorites.setFavoriteGameStatus.useMutation({
    onSuccess: async () => {},
  });

  const getFavoritesQuery = api.favorites.getFavoriteGames.useQuery({
    userAddress: networkStore.address ?? '',
  });

  const getRatingQuery = api.ratings.getGameRating.useQuery({
    gameId: game.id,
  });

  const progress = api.progress.setSolvedQuests.useMutation();

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
      ? 'bg-middle-accent'
      : color === 2
        ? 'bg-left-accent'
        : color === 3
          ? 'bg-right-accent'
          : 'hidden';

  const heart = color === 1 ? heart_2 : color === 2 ? heart_1 : heart_3;
  const heartActive =
    color === 1
      ? heart_2_filled
      : color === 2
        ? heart_1_filled
        : heart_3_filled;

  const hoverColor = cn(
    'hover:outline group-hover:outline outline-[1px]',
    color === 1
      ? 'hover:outline-middle-accent group-hover:outline-middle-accent'
      : color === 2
        ? 'hover:outline-left-accent group-hover:outline-left-accent'
        : color === 3
          ? 'hover:outline-right-accent group-hover:outline-right-accent'
          : 'hover:bg-gradient-to-br from-left-accent to-right-accent group-hover:bg-gradient-to-br from-left-accent to-right-accent'
  );

  return (
    <div
      className={cn(
        'group relative flex flex-col rounded-xl outline-[#e5e7eb] ',
        hoverColor,
        'outline-[0px] lg:outline-[1px]'
      )}
    >
      {game.isReleased && (
        <Image
          src={isFavorite ? heartActive : heart}
          alt={'Favorite'}
          className={
            'absolute right-6 top-6 z-[5] h-[36px] w-[36px] cursor-pointer'
          }
          onClick={() => {
            if (!networkStore.address) return;
            setFavoriteMutation.mutate({
              gameId: game.id,
              userAddress: networkStore.address,
              status: !isFavorite,
            });

            progress.mutate({
              userAddress: networkStore.address!,
              section: 'UI_TESTS_WEB',
              id: 1,
              txHash: '',
              envContext: getEnvContext(),
            });

            setIsFavorite(!isFavorite);
            // toast.success(
            //   toasterStore,
            //   'Successfully added to favorites!',
            //   true
            // );
          }}
        />
      )}
      <Link
        href={
          game.externalUrl ||
          (game.active ? `/games/${game.id}/${game.defaultPage}` : '#')
        }
        className="m-px flex h-full flex-col rounded-xl bg-[#252525] p-2 lg:gap-5 lg:p-4"
        target={game.externalUrl && '_blank'}
        rel={game.externalUrl && 'noopener noreferrer'}
      >
        <div
          className={cn(
            'relative m-px flex items-center justify-center rounded-[5px] max-[2000px]:h-[300px] min-[2000px]:h-[400px]',
            'outline outline-[#e5e7eb]',
            hoverColor
          )}
        >
          <div
            className={
              'z-1 m-px flex h-[48.125vw] w-full items-center justify-center rounded-[5px] bg-[#252525] max-[2000px]:h-[298px] min-[2000px]:h-[398px]'
            }
          >
            {game.isReleased ? (
              <Image
                src={game.logo}
                alt="Game logo"
                width={300}
                height={300}
                className={cn(
                  'm-px h-full max-h-[70%] w-full rounded-[5px] bg-[#252525] object-contain object-center',
                  game.logoMode == LogoMode.FULL_WIDTH
                    ? 'max-h-full max-w-full'
                    : game.logoMode == LogoMode.BOTTOM_RIGHT
                      ? 'max-h-full max-w-full object-right-bottom'
                      : 'max-[2000px]:w-[298px] min-[2000px]:w-[398px]'
                )}
              />
            ) : (
              <div
                className={cn(
                  'flex items-center justify-center text-[6.25vw] lg:text-[1.5vw]',
                  color === 1
                    ? 'text-middle-accent'
                    : color === 2
                      ? 'text-left-accent'
                      : color === 3
                        ? 'text-right-accent'
                        : ''
                )}
              >
                Coming soon
              </div>
            )}
          </div>
        </div>
        <div className={'flex flex-row justify-between pb-2 pt-6 lg:py-0'}>
          <div className="text-headline-2 lg:text-headline-1">{game.name}</div>
          {game.isReleased && (
            <span
              className={
                'flex flex-row items-center justify-between gap-2 text-center'
              }
            >
              <StarSVG
                fill={''}
                className={cn(
                  'mb-1.5',
                  color === 1
                    ? 'fill-middle-accent'
                    : color === 2
                      ? 'fill-left-accent'
                      : color === 3
                        ? 'fill-right-accent'
                        : ''
                )}
              />
              {(getRatingQuery.data?.rating || 0).toFixed(1)}
            </span>
          )}
        </div>
        <div className="font-plexsans text-[16px]/[16px] font-normal lg:text-main">
          {game.description}
        </div>
        <div className={'flex-grow max-[2000px]:hidden'} />
        <div
          className={
            'mt-auto flex w-full flex-row items-center justify-start gap-2 pb-5 pt-2 lg:py-0'
          }
        >
          {[...game.features, game.genre].map((value, i) => (
            <span
              key={i}
              className={cn(
                'rounded p-1 text-[12px]/[18px] text-dark-buttons-text lg:text-filtration-buttons',
                fillColor,
                !game.isReleased && 'hidden'
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
