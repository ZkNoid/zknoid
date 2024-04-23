import { LobbyWrap } from '@/components/framework/Lobby/LobbyWrap';
import GamePage from '@/components/framework/GamePage';
import { randzuConfig } from '@/games/randzu/config';
import RandzuCoverSVG from '@/games/randzu/assets/game-cover.svg';
import RandzuCoverMobileSVG from '@/games/randzu/assets/game-cover-mobile.svg';
import { FastMatchmaking } from '@/components/framework/Lobby/FastMatchmaking';
import { Lobby } from '@/components/framework/Lobby/Lobby';
import { LobbyList } from '@/components/framework/Lobby/LobbyList';

export default function RandzuLobby({
  params,
}: {
  params: { lobbyId: string };
}) {
  return (
    <GamePage
      gameConfig={randzuConfig}
      image={RandzuCoverSVG}
      mobileImage={RandzuCoverMobileSVG}
      defaultPage={'Game'}
    >
      <LobbyWrap>
        <FastMatchmaking />
        <Lobby />
        <LobbyList />
      </LobbyWrap>
    </GamePage>
  );
}
