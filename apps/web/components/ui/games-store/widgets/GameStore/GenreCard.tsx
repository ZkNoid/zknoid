import { GameStoreSortBy } from '@/constants/sortBy';
import { ZkNoidGameGenre } from '@/lib/platform/game_tags';
import { useState, useRef } from 'react';

import Lottie from 'react-lottie';

export const GenreCard = ({
  animation,
  sortBy,
  setSortBy,
  genre,
  genresSelected,
  setGenresSelected,
  className,
}: {
  animation: object;
  genre?: ZkNoidGameGenre;
  sortBy?: GameStoreSortBy;
  genresSelected: ZkNoidGameGenre[];
  setGenresSelected?: (genres: ZkNoidGameGenre[]) => void;
  setSortBy: (sortBy: GameStoreSortBy) => void;
  className?: string;
}) => {
  const [visible, setVisible] = useState(false);
  const nodeRef = useRef(null);

  return (
    <div
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      ref={nodeRef}
      className="relative flex h-full w-full flex-col items-center justify-center gap-1 p-5"
      onClick={() => {
        if (genre) {
          setGenresSelected!(
            genresSelected.includes(genre!)
              ? genresSelected.filter((x) => x != genre!)
              : [...genresSelected, genre!]
          );
          setSortBy(GameStoreSortBy.RatingLow);
        } else {
          setSortBy!(sortBy!);
        }
      }}
    >
      <div className="z-1 absolute bottom-0 left-0 -z-10 h-[60%] w-full rounded bg-[#252525]"></div>
      <div className="bottom-5 left-0 flex h-[15.595vw] w-full flex-col items-end justify-end">
        <Lottie
          options={{
            animationData: animation,
            rendererSettings: {
              className: `z-0 h-full ${className}`,
            },
          }}
          height={'80%'}
          isStopped={!visible && false}
          isClickToPauseDisabled={true}
        ></Lottie>
      </div>

      <div className="z-0 text-main lg:text-headline-3">{genre || sortBy}</div>
    </div>
  );
};
