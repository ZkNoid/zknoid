import { ZkNoidGameGenre } from '@/lib/platform/game_tags';
import { useState, useRef } from 'react';

import Lottie from 'react-lottie';

export const GenreCard = ({
  animation,
  genre,
  genresSelected,
  setGenresSelected,
  className,
  height = 500,
}: {
  animation: object;
  genre: ZkNoidGameGenre;
  genresSelected: ZkNoidGameGenre[];
  setGenresSelected: (genres: ZkNoidGameGenre[]) => void;
  className?: string;
  height?: number;
}) => {
  const [visible, setVisible] = useState(false);
  const nodeRef = useRef(null);

  return (
    <div
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      ref={nodeRef}
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
      <div className="h-full w-full">
        <Lottie
          options={{
            animationData: animation,
            rendererSettings: {
              className: `z-0 h-full ${className}`,
            },
          }}
          height={height}
          isStopped={!visible && false}
          isClickToPauseDisabled={true}
        ></Lottie>
      </div>

      <div className="z-0 text-main lg:text-headline-3">{genre}</div>
    </div>
  );
};
