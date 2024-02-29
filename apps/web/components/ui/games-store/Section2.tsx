import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { IGame } from '@/app/constants/games';
import { FavoriteGames } from '@/components/ui/games-store/widgets/FavoriteGames';
import { GameStore } from '@/components/ui/games-store/widgets/GameStore/GameStore';
import { SOCIALS } from '@/constants/socials';
import { SupportAndFaq } from '@/components/ui/games-store/widgets/SupportAndFaq';
import centralBlockImg from '@/public/image/central-block.svg';
import bookImg from '@/public/image/misc/book.svg';
import webImg from '@/public/image/misc/web.svg';
import supportImg from '@/public/image/misc/support.svg';

export const Section2 = ({ games }: { games: IGame[] }) => {
  const [page, setPage] = useState<'GameStore' | 'FavoriteGames' | 'Support'>(
    'GameStore'
  );

  const CentralBlock = () => (
    <div className="relative flex w-[50%] self-end text-[24px]">
      <Image
        alt="central block"
        src={centralBlockImg}
        className="w-full"
      ></Image>
      <div className="absolute flex h-full w-full items-center justify-around">
        <div
          className="flex gap-2 text-headline-3 text-left-accent"
          onClick={() => setPage('Support')}
        >
          <Image src={supportImg} alt={'Headphones'} />
          <span className={'cursor-pointer'}>FAQ & Support</span>
        </div>
        <Link
          href={'https://docs.zknoid.io/docs'}
          className="flex gap-2 text-headline-3 text-left-accent"
        >
          <Image alt="Book" src={bookImg} />
          Docs
        </Link>
        <Link
          href={'https://zknoid.io'}
          className="flex gap-2 text-headline-3 text-left-accent"
        >
          <Image src={webImg} alt="Web" />
          About us
        </Link>
        <div className="flex gap-3">
          {SOCIALS.map((x) => (
            <Link href={x.link} key={x.id}>
              <Image alt={x.name} src={x.image} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <CentralBlock />

      <div className="relative flex flex-col">
        <div className="absolute left-0 top-0 -z-10 flex h-full w-full flex-col">
          <svg
            viewBox="0 0 1502 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full"
          >
            <path
              d="M1451 2341H51C23.3858 2341 1 2318.37 1 2290.75V107V51C1 23.3857 23.3858 1 51 1H650.474C663.726 1 676.436 6.26099 685.812 15.627L723.596 53.373C732.971 62.739 745.681 68 758.933 68H1451C1478.61 68 1501 90.3857 1501 118V182V2291C1501 2318.61 1478.61 2341 1451 2341Z"
              stroke="#D2FF00"
              strokeWidth="2"
            />
          </svg>
          <div className="flex-grow border-x-[0.160rem] border-left-accent" />
          <svg
            viewBox="0 2142 1502 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full"
          >
            <path
              d="M1451 2341H51C23.3858 2341 1 2318.37 1 2290.75V107V51C1 23.3857 23.3858 1 51 1H650.474C663.726 1 676.436 6.26099 685.812 15.627L723.596 53.373C732.971 62.739 745.681 68 758.933 68H1451C1478.61 68 1501 90.3857 1501 118V182V2291C1501 2318.61 1478.61 2341 1451 2341Z"
              stroke="#D2FF00"
              strokeWidth="2"
            />
          </svg>
        </div>
        <div
          className={
            '-mt-10 ml-10 flex flex-row items-center justify-start gap-4'
          }
        >
          <div
            className={`flex flex-row items-center justify-center gap-2 ${
              page === 'GameStore' ? 'text-left-accent' : ''
            }`}
          >
            <Image
              src={'/image/section2/game-store-icon.svg'}
              alt={'GameStore icon'}
              width={30}
              height={30}
            />
            <button
              onClick={() => setPage('GameStore')}
              className={'text-headline-3'}
            >
              Game store
            </button>
          </div>
          <div
            className={`flex flex-row items-center justify-center gap-2 ${
              page === 'FavoriteGames' ? 'text-left-accent' : ''
            }`}
          >
            <Image
              src={'/image/section2/favorite-games-icon.svg'}
              alt={'FavoriteGames icon'}
              width={30}
              height={30}
            />
            <button
              onClick={() => setPage('FavoriteGames')}
              className={'text-headline-3'}
            >
              Favorite games
            </button>
          </div>
        </div>

        {page === 'GameStore' && <GameStore games={games} />}
        {page === 'FavoriteGames' && <FavoriteGames games={games} />}
        {page === 'Support' && <SupportAndFaq />}
      </div>
    </>
  );
};
