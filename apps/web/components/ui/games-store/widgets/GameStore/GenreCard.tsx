import { ZkNoidGameGenre } from '@/lib/platform/game_tags';
import Image from 'next/image';

export const GenreCard = ({
  image,
  genre,
  genresSelected,
  setGenresSelected,
}: {
  image: string;
  genre: ZkNoidGameGenre;
  genresSelected: ZkNoidGameGenre[];
  setGenresSelected: (genres: ZkNoidGameGenre[]) => void;
}) => (
  <div
    className="relative flex h-full w-full flex-col items-center justify-center p-5"
    onClick={() => {
      setGenresSelected(
        genresSelected.includes(genre)
          ? genresSelected.filter((x) => x != genre)
          : [...genresSelected, genre]
      );
    }}
  >
    <div className="z-1 absolute bottom-0 left-0 -z-10 h-[60%] w-full rounded bg-[#252525]"></div>
    <Image src={image} className="z-0 h-full w-[80%]" alt={genre} />
    <div className="text-headline-3 z-0">{genre}</div>
  </div>
);
