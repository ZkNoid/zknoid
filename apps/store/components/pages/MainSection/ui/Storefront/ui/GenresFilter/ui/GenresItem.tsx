import { ZkNoidGameGenre } from '@zknoid/sdk/lib/platform/game_tags';
import { GameComparisonType } from '@zknoid/sdk/lib/comparators/gameComparator';
import { useRef, useState } from 'react';
import Lottie from 'react-lottie';

export function GenresItem({
  animation,
  sortBy,
  setSortBy,
  genre,
  genresSelected,
  setGenresSelected,
}: {
  animation: object;
  genre?: ZkNoidGameGenre;
  sortBy?: GameComparisonType;
  genresSelected: ZkNoidGameGenre[];
  setGenresSelected?: (genres: ZkNoidGameGenre[]) => void;
  setSortBy: (sortBy: GameComparisonType) => void;
}) {
  const [visible, setVisible] = useState(false);
  const nodeRef = useRef(null);
  return (
    <div
      className={
        'relative flex h-full w-full cursor-pointer flex-col items-center justify-center'
      }
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      ref={nodeRef}
      onClick={() => {
        if (genre) {
          if (genresSelected.includes(genre!)) {
            setGenresSelected?.([]);
          } else {
            setGenresSelected?.([genre]);
          }

          setSortBy(GameComparisonType.RatingLow);
        } else {
          setSortBy!(sortBy!);
        }
      }}
    >
      <div
        className={
          'z-[2] flex h-full w-full flex-col items-center justify-center lg:h-[15.625vw]'
        }
      >
        <Lottie
          options={{
            animationData: animation,
            rendererSettings: {
              className: `h-full`,
            },
          }}
          height={'80%'}
          isStopped={!visible && false}
          isClickToPauseDisabled={true}
        />
      </div>
      <div
        className={
          'absolute bottom-0 left-0 z-[1] h-[60%] w-full rounded-[0.26vw] bg-[#252525] drop-shadow-2xl'
        }
      />
      <div
        className={
          'absolute bottom-[0.729vw] left-0 z-[2] w-full text-center font-museo text-[1.25vw] font-medium text-foreground'
        }
      >
        {genre || sortBy}
      </div>
    </div>
  );
}
