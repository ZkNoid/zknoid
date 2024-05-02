import { createZkNoidGameConfig } from '@/lib/createConfig';
import { ZkNoidGameType } from '@/lib/platform/game_types';
import { ThimblerigLogic } from 'zknoid-chain-dev';
import Thimblerig from './components/Thimblerig';
import { ZkNoidGameFeature, ZkNoidGameGenre } from '@/lib/platform/game_tags';
import ThimblerigLobby from './components/ThimblerigLobby';

export const thimblerigConfig = createZkNoidGameConfig({
  id: 'thimblerig',
  type: ZkNoidGameType.PVP,
  name: 'Thimblerig game',
  description:
    'One player hides a ball behind a thimbler and second player needs to guess which thimbler it was',
  image: '/image/games/thimblerig.svg',
  genre: ZkNoidGameGenre.Lucky,
  features: [ZkNoidGameFeature.P2P],
  isReleased: true,
  releaseDate: new Date(2024, 2, 25),
  popularity: 0,
  author: 'ZkNoid Team',
  rules:
    'A luck game where one player hides ball behind one of three thimbles and second player guesses under which one',
  runtimeModules: {
    ThimblerigLogic,
  },
  page: Thimblerig,
  lobby: ThimblerigLobby,
});
