import { SortByFilter } from '@/components/widgets/GameStore/Storefront/ui/SortByFilter';
import { useEffect, useRef, useState } from 'react';
import { ILobby } from '@/lib/types';
import { LobbyItem } from '@/components/framework/Lobby/LobbyList/ui/LobbyItem';
import { LOBBYS_SORT_METHODS, LobbiesSortBy } from './lib/sortBy';
import Popover from '@/components/shared/Popover';
import { sortByFilter } from './lib/sortBy';

export default function LobbyList({ lobbies }: { lobbies: ILobby[] }) {
  const PAGINATION_LIMIT = 6;
  const [sortBy, setSortBy] = useState<LobbiesSortBy>(
    LobbiesSortBy.MorePlayers
  );
  const [currentPage, setCurrentPage] = useState<number>(1);
  const lobbyListRef = useRef<HTMLDivElement>(null);
  const filteredLobbies = lobbies.filter((lobby) => !lobby.privateLobby);
  const renderLobbies = filteredLobbies.slice(
    0,
    currentPage * PAGINATION_LIMIT
  );

  useEffect(() => {
    const refObj = lobbyListRef.current;

    const scrollHandler = () => {
      if (
        // @ts-ignore
        refObj?.scrollHeight - refObj?.scrollTop === refObj?.clientHeight &&
        renderLobbies.length < filteredLobbies.length
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
          <Popover>
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
          sortMethods={LOBBYS_SORT_METHODS}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />
      </div>
      <div
        className={'flex max-h-[500px] w-full flex-col gap-0 overflow-y-scroll'}
        ref={lobbyListRef}
      >
        {renderLobbies.length >= 1 ? (
          renderLobbies
            .toSorted((a, b) => sortByFilter(a, b, sortBy))
            .map((item, index) => (
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
            Lobbies not found
          </div>
        )}
      </div>
    </div>
  );
}
