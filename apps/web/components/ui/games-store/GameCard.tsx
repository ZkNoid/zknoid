import Link from 'next/link';
import Image from 'next/image';
import { IGame } from '@/app/constants/games';

export const GameCard = ({ game }: { game: IGame }) => {
  return (
    <div className="min-h-[500px] rounded-xl bg-[#252525]">
      <Link
        href={game.active ? `/games/${game.id}/${game.defaultPage}` : '#'}
        className="m-5 flex h-full flex-col gap-5"
      >
        <Image
          src={game.logo}
          alt="Game logo"
          width={220}
          height={251}
          className="w-full"
        />
        <div className="text-headline-1">{game.name}</div>
        <div className="font-plexsans text-main font-normal">
          {game.description}
        </div>
      </Link>
    </div>
  );
};
