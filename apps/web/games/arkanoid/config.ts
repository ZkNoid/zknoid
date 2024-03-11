import { createZkNoidGameConfig } from '@/lib/createConfig';
import { ArkanoidGameHub, Balances } from 'zknoid-chain-dev';
import ArkanoidPage from './components/ArkanoidPage';
import NewArkanoidCompetitionPage from './components/NewArkanoidCompetitionPage';
import ArkanoidCompetitionsListPage from './components/ArkanoidCompetitionsListPage';
import { ZkNoidGameFeature, ZkNoidGameGenre } from '@/lib/platform/game_tags';

export const arkanoidConfig = createZkNoidGameConfig({
  id: 'arkanoid',
  name: 'Arkanoid game',
  description:
    'Old but gold game. Beat all the bricks and protect the ball from falling',
  image: '/image/games/arkanoid.svg',
  rating: 4.5,
  genre: ZkNoidGameGenre.Arcade,
  features: [ZkNoidGameFeature.SinglePlayer],
  isReleased: true,
  releaseDate: new Date(2023, 11, 1),
  popularity: 60,
  runtimeModules: {
    ArkanoidGameHub,
    Balances,
  },
  page: ArkanoidPage,
  pageCompetitionsList: ArkanoidCompetitionsListPage,
  pageNewCompetition: NewArkanoidCompetitionPage,
});
