import { SortByFilter } from '@/components/ui/games-store/SortByFilter';
import { useEffect, useRef, useState } from 'react';
import { Popover } from '@/components/ui/games-store/shared/Popover';
import { ILobby } from '@/lib/types';
import { LobbyItem } from '@/components/framework/Lobby/LobbyItem';

export const LobbyList = ({ lobbys }: { lobbys: ILobby[] }) => {
  const PAGINATION_LIMIT = 6;

  const [sortBy, setSortBy] = useState<string>('From high to low');
  const [currentPage, setCurrentPage] = useState<number>(1);

  const lobbyListRef = useRef<HTMLDivElement>(null);
  const filteredLobbys = lobbys.filter((lobby) => !lobby.privateLobby);
  const renderLobbys = filteredLobbys.slice(0, currentPage * PAGINATION_LIMIT);

  useEffect(() => {
    const refObj = lobbyListRef.current;

    const scrollHandler = () => {
      if (
        // @ts-ignore
        refObj?.scrollHeight - refObj?.scrollTop === refObj?.clientHeight &&
        renderLobbys.length < filteredLobbys.length
      ) {
        setCurrentPage((prevState) => prevState + 1);
      }
    };
    refObj?.addEventListener('scroll', scrollHandler);
    return () => {
      refObj?.removeEventListener('scroll', scrollHandler);
    };
  });

  return (
    <div className={'col-start-1 col-end-4 row-start-3 flex h-full flex-col'}>
      <div className={'flex w-full flex-row justify-between py-2'}>
        <div className={'flex flex-row gap-1'}>
          <div className={'text-headline-1'}>Lobby list</div>
          <Popover
            trigger={
              <svg
                width="21"
                height="21"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={'hover:opacity-80'}
              >
                <g opacity="0.5">
                  <circle
                    cx="8"
                    cy="8"
                    r="7"
                    fill="#F9F8F4"
                    stroke="#F9F8F4"
                    strokeWidth="0.500035"
                  />
                  <path
                    d="M7.2446 9.95291V7.68144C8.03117 7.64451 8.64508 7.45983 9.08633 7.12742C9.53717 6.79501 9.76259 6.33795 9.76259 5.75623V5.56233C9.76259 5.09141 9.60911 4.71745 9.30216 4.44044C8.9952 4.1542 8.58273 4.01108 8.06475 4.01108C7.50839 4.01108 7.06235 4.16343 6.72662 4.46814C6.40048 4.77285 6.17986 5.16066 6.06475 5.63158L5 5.24377C5.08633 4.94829 5.21103 4.66667 5.3741 4.39889C5.54676 4.12188 5.75779 3.88181 6.00719 3.67867C6.26619 3.4663 6.56835 3.30009 6.91367 3.18006C7.25899 3.06002 7.65707 3 8.10791 3C9 3 9.70504 3.23546 10.223 3.70637C10.741 4.17729 11 4.8144 11 5.61773C11 6.06094 10.9185 6.44875 10.7554 6.78116C10.6019 7.10434 10.4005 7.38135 10.1511 7.61219C9.90168 7.84303 9.61871 8.0277 9.30216 8.1662C8.98561 8.30471 8.66906 8.40166 8.35252 8.45706V9.95291H7.2446ZM7.80576 13C7.4988 13 7.27338 12.9261 7.1295 12.7784C6.9952 12.6307 6.92806 12.4367 6.92806 12.1967V12.0166C6.92806 11.7765 6.9952 11.5826 7.1295 11.4349C7.27338 11.2872 7.4988 11.2133 7.80576 11.2133C8.11271 11.2133 8.33333 11.2872 8.46763 11.4349C8.61151 11.5826 8.68345 11.7765 8.68345 12.0166V12.1967C8.68345 12.4367 8.61151 12.6307 8.46763 12.7784C8.33333 12.9261 8.11271 13 7.80576 13Z"
                    fill="#252525"
                  />
                </g>
              </svg>
            }
          >
            <div
              className={
                'flex min-w-[250px] flex-col items-center justify-center gap-2 font-plexsans'
              }
            >
              <span className={'w-full self-start text-[14px]/[14px]'}>
                Lobby list
              </span>
              <div
                className={'w-full text-[12px]/[12px] font-light opacity-70'}
              >
                If you want to play with certain conditions of participation and
                victory, such as fund and participants feel: choose from the
                list or create your own lobby.
              </div>
            </div>
          </Popover>
        </div>
        <SortByFilter
          sortMethods={['From high to low', 'From low to high']}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />
      </div>
      <div
        className={'flex max-h-[500px] w-full flex-col gap-0 overflow-y-scroll'}
        ref={lobbyListRef}
      >
        {renderLobbys.length >= 1 ? (
          renderLobbys.map((item, index) => (
            <LobbyItem
              key={index}
              id={item.id}
              active={item.active}
              name={item.name}
              reward={item.reward}
              fee={item.fee}
              maxPlayers={item.maxPlayers}
              players={item.players}
              currency={item.currency}
              privateLobby={item.privateLobby}
              accessKey={item.accessKey}
            />
          ))
        ) : (
          <div className="flex h-[200px] flex-col items-center justify-center border-t p-3 text-headline-2 uppercase last:border-b">
            Lobbys not found
          </div>
        )}
      </div>
    </div>
  );
};
