import { ZkNoidGameGenre } from '@/lib/platform/game_tags';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useEffect, useState, useRef } from 'react';

import Lottie from 'react-lottie';

export const GenreCard = ({
  animation,
  genre,
  genresSelected,
  setGenresSelected,
}: {
  animation: object;
  genre: ZkNoidGameGenre;
  genresSelected: ZkNoidGameGenre[];
  setGenresSelected: (genres: ZkNoidGameGenre[]) => void;
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
              className: 'z-0 h-full w-[80%]',
            },
          }}
          isStopped={!visible && false}
        ></Lottie>
      </div>

      <div className="text-headline-3 z-0">{genre}</div>
    </div>
  );
};
