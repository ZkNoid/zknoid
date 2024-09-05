import { createZkNoidGameConfig } from '@/lib/createConfig';
import { ZkNoidGameType } from '@/lib/platform/game_types';
import Lottery from './Lottery';
import { ZkNoidGameFeature, ZkNoidGameGenre } from '@/lib/platform/game_tags';
import { LogoMode } from '@/app/constants/games';

export const lotteryConfig = createZkNoidGameConfig({
  id: 'lottery',
  type: ZkNoidGameType.SinglePlayer,
  name: 'Lottery game',
  description:
    'Ticket based lottery game. Choose lucky numbers, buy tickets, win rewards',
  image: '/image/games/lottery.svg',
  logoMode: LogoMode.FULL_WIDTH,
  genre: ZkNoidGameGenre.Lucky,
  features: [ZkNoidGameFeature.SinglePlayer],
  isReleased: true,
  releaseDate: new Date(2024, 2, 25),
  popularity: 0,
  author: 'ZkNoid Team',
  rules: '1. Choose numbers\n2. Buy tickets\n3. Win prizes',
  runtimeModules: {},
  page: Lottery,
  lobby: undefined,
});
