import { createZkNoidGameConfig } from '@/lib/createConfig';
import { ZkNoidGameType } from '@/lib/platform/game_types';
import { ZkNoidGameFeature, ZkNoidGameGenre } from '@/lib/platform/game_tags';
import { LogoMode } from '@/app/constants/games';

export const tileVilleConfig = createZkNoidGameConfig({
  id: 'tileville',
  type: ZkNoidGameType.SinglePlayer,
  name: 'Tileville game',
  description:
    'TileVille is a strategic city-building game on the Mina blockchain, where players construct and manage their own cities on the island of Nicobar using hexagonal tiles.',
  image: '/image/games/tileville.png',
  logoMode: LogoMode.CENTER,
  genre: ZkNoidGameGenre.Arcade,
  features: [ZkNoidGameFeature.SinglePlayer],
  isReleased: true,
  releaseDate: new Date(2024, 2, 25),
  popularity: 0,
  author: 'Satyam Bansal',
  rules: '',
  runtimeModules: {},
  page: undefined as any,
  lobby: undefined as any,
  externalUrl: 'https://www.tileville.xyz/',
});
