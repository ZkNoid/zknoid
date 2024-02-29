import { ALL_GAME_TAGS, ZkNoidGameGenre } from '@/lib/platform/game_tags';
import { GameCard } from '@/components/ui/games-store/GameCard';
import { IGame } from '@/app/constants/games';
import { useState } from 'react';

export const FavoriteGames = ({ games }: { games: IGame[] }) => {
  const [genresSelected, setGenresSelected] = useState<ZkNoidGameGenre[]>([]);

  return (
    <div className="top-0 flex h-full w-full flex-col gap-20 p-10">
      <div className={'flex max-w-[40%] flex-col gap-3'}>
        <div className="text-headline-1">Favorite Games</div>
        <div className="font-plexsans text-main">
          If you have any questions or notice any issues with the operation of
          our application, please do not hesitate to contact us. We will be more
          than happy to answer any questions you may have and try our best to
          solve any problems as soon as possible.
        </div>
      </div>

      <div className="flex min-h-[40vh] flex-col justify-between gap-2">
        <div className="flex flex-row gap-3">
          {ALL_GAME_TAGS.map((x) => (
            <div
              key={x.name}
              className={`cursor-pointer rounded border p-1 font-plexsans text-filtration-buttons ${
                genresSelected == x.genres
                  ? 'border-left-accent bg-left-accent text-bg-dark'
                  : 'border-[#F9F8F4]'
              }`}
              onClick={() => {
                setGenresSelected(x.genres);
              }}
            >
              {x.name}
            </div>
          ))}
        </div>
        <div>
          <div className="grid grid-cols-3 gap-5">
            {games
              .filter(
                (x) =>
                  genresSelected.includes(x.genre) || genresSelected.length == 0
              )
              .map((game) => (
                <GameCard game={game} key={game.id} />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};
