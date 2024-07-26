import { createZkNoidGameConfig } from '@/lib/createConfig';
import { ZkNoidGameType } from '@/lib/platform/game_types';
import { ArkanoidGameHub } from 'zknoid-chain-dev';
import Arkanoid from './Arkanoid';
import NewArkanoidCompetitionPage from './components/NewArkanoidCompetitionPage';
import ArkanoidCompetitionsListPage from './components/ArkanoidCompetitionsListPage';
import { ZkNoidGameFeature, ZkNoidGameGenre } from '@/lib/platform/game_tags';
import { LogoMode } from '@/app/constants/games';

const description =
  'Old but gold game. Beat all the bricks and protect the ball from falling';

const rules = `In Ankanoid, your objective is to break all the bricks on the screen using a bouncing ball and a platform. 
    
    You can control the game by using the left and right arrow keys on your keyboard to move the platform. 
    You need to bounce the ball and prevent it from falling off the bottom of the screen.

    Try to try to hit the ball while cart is moving to give it acceleration and control the ball's flight
    `;

export const arkanoidConfig = createZkNoidGameConfig({
  id: 'arkanoid',
  type: ZkNoidGameType.SinglePlayer,
  name: 'Arkanoid game',
  description: description,
  image: '/image/games/arkanoid.svg',
  logoMode: LogoMode.FULL_WIDTH,
  genre: ZkNoidGameGenre.Arcade,
  features: [ZkNoidGameFeature.SinglePlayer],
  isReleased: true,
  releaseDate: new Date(2023, 11, 1),
  popularity: 60,
  author: 'ZkNoid Team',
  rules: rules,
  runtimeModules: {
    ArkanoidGameHub,
  },
  page: Arkanoid,
  pageCompetitionsList: ArkanoidCompetitionsListPage,
  pageNewCompetition: NewArkanoidCompetitionPage,
});

export const arkanoidRedirectConfig = createZkNoidGameConfig({
  id: 'arkanoid',
  type: ZkNoidGameType.SinglePlayer,
  name: 'Arkanoid game',
  description: description,
  image: '/image/games/arkanoid.svg',
  logoMode: LogoMode.FULL_WIDTH,
  genre: ZkNoidGameGenre.Arcade,
  features: [ZkNoidGameFeature.SinglePlayer],
  isReleased: true,
  releaseDate: new Date(2023, 11, 1),
  popularity: 60,
  author: 'ZkNoid Team',
  rules: rules,
  runtimeModules: {},
  page: undefined as any,
  pageCompetitionsList: ArkanoidCompetitionsListPage,
  pageNewCompetition: NewArkanoidCompetitionPage,
  externalUrl: 'https://proto.zknoid.io/games/arkanoid/global'
});