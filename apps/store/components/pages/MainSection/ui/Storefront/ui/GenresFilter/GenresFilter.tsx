import { ZkNoidGameGenre } from '@/lib/platform/game_tags';
import { GameStoreSortBy } from '@/components/pages/MainSection/lib/sortBy';
import GamepadIllustration from './assets/Gamepad_Illustration_01_01.json';
import ChessIllustration from './assets/Chess_Illustration.json';
import CubesIllustration from './assets/Cubes_Illustration.json';
import EyesIllustration from './assets/Eyes_Illustration_01_01.json';
import { GenresItem } from './ui/GenresItem';

export default function GenresFilter({
  genresSelected,
  setGenresSelected,
  setSortBy,
}: {
  genresSelected: ZkNoidGameGenre[];
  setGenresSelected: (genresSelected: ZkNoidGameGenre[]) => void;
  setSortBy: (sortBy: GameStoreSortBy) => void;
}) {
  return (
    <div className={'flex w-full flex-col gap-[0.781vw] lg:flex-row'}>
      <GenresItem
        animation={GamepadIllustration}
        genre={ZkNoidGameGenre.Arcade}
        genresSelected={genresSelected}
        setGenresSelected={setGenresSelected}
        setSortBy={setSortBy}
      />
      <GenresItem
        animation={ChessIllustration}
        genre={ZkNoidGameGenre.BoardGames}
        genresSelected={genresSelected}
        setGenresSelected={setGenresSelected}
        setSortBy={setSortBy}
      />
      <GenresItem
        animation={CubesIllustration}
        genre={ZkNoidGameGenre.Lucky}
        genresSelected={genresSelected}
        setGenresSelected={setGenresSelected}
        setSortBy={setSortBy}
      />
      <GenresItem
        animation={EyesIllustration}
        sortBy={GameStoreSortBy.ComingSoon}
        genresSelected={[]}
        setSortBy={setSortBy}
      />
    </div>
  );
}
