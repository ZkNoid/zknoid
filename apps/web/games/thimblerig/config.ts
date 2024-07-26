import { createZkNoidGameConfig } from '@/lib/createConfig';
import { ZkNoidGameType } from '@/lib/platform/game_types';
import { ThimblerigLogic } from 'zknoid-chain-dev';
import Thimblerig from './Thimblerig';
import { ZkNoidGameFeature, ZkNoidGameGenre } from '@/lib/platform/game_tags';
import ThimblerigLobby from './components/ThimblerigLobby';
import { LogoMode } from '@/app/constants/games';

export const thimblerigConfig = createZkNoidGameConfig({
  id: 'thimblerig',
  type: ZkNoidGameType.PVP,
  name: 'Thimblerig game',
  description:
    'One player hides a ball behind a thimbler and second player needs to guess which thimbler it was',
  image: '/image/games/thimblerig.svg',
  logoMode: LogoMode.CENTER,
  genre: ZkNoidGameGenre.Lucky,
  features: [ZkNoidGameFeature.P2P],
  isReleased: true,
  releaseDate: new Date(2024, 2, 25),
  popularity: 0,
  author: 'ZkNoid Team',
  rules:
    '1. Two players participate in each round of the game. One player hides a ball under one of three thimbles, and the other player attempts to guess the location of the ball.\n\n2. The hiding player places ball under one of three thimbles trying to confuse the guessing player.\n\n3. The guessing player selects one of the thimbles, trying to guess which thimble conceals the ball.\n\n4.The hiding player then reveals whether the ball is under the chosen',
  runtimeModules: {
    ThimblerigLogic,
  },
  page: Thimblerig,
  lobby: ThimblerigLobby,
});

export const thimblerigRedirectConfig = createZkNoidGameConfig({
  id: 'thimblerig',
  type: ZkNoidGameType.PVP,
  name: 'Thimblerig game',
  description:
    'One player hides a ball behind a thimbler and second player needs to guess which thimbler it was',
  image: '/image/games/thimblerig.svg',
  logoMode: LogoMode.CENTER,
  genre: ZkNoidGameGenre.Lucky,
  features: [ZkNoidGameFeature.P2P],
  isReleased: true,
  releaseDate: new Date(2024, 2, 25),
  popularity: 0,
  author: 'ZkNoid Team',
  rules:
    '1. Two players participate in each round of the game. One player hides a ball under one of three thimbles, and the other player attempts to guess the location of the ball.\n\n2. The hiding player places ball under one of three thimbles trying to confuse the guessing player.\n\n3. The guessing player selects one of the thimbles, trying to guess which thimble conceals the ball.\n\n4.The hiding player then reveals whether the ball is under the chosen',
  runtimeModules: {},
  page: undefined as any,
  lobby: undefined as any,
  externalUrl: 'https://proto.zknoid.io/games/thimblerig/global'
});
