import { createZkNoidGameConfig } from '@/lib/createConfig';
import { ThimblerigLogic } from 'zknoid-chain-dev';
import Thimblerig from './components/Thimblerig';
import { ZkNoidGameFeature, ZkNoidGameGenre } from '@/lib/platform/game_tags';

export const thimblerigConfig = createZkNoidGameConfig({
  id: 'thimblerig',
  name: 'Thimblerig game',
  description:
    'One player hides a ball behind a thimbler and second player needs to guess which thimbler it was',
  image: '/image/games/thimblerig.svg',
  rating: 0,
  genre: ZkNoidGameGenre.Lucky,
  features: [ZkNoidGameFeature.P2P],
  isReleased: true,
  releaseDate: new Date(2024, 2, 25),
  popularity: 0,
  author: 'ZkNoid Team',
  runtimeModules: {
    ThimblerigLogic,
  },
  page: Thimblerig,
});
