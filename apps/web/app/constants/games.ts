import { ZkNoidGameFeature, ZkNoidGameGenre } from '@/lib/platform/game_tags';


export enum LogoMode {
  CENTER = 0,
  FULL_WIDTH = 1,
  BOTTOM_RIGHT = 2
}
export interface IGame {
  id: string;
  logo: string;
  logoMode: number;
  name: string;
  description: string;
  genre: ZkNoidGameGenre;
  features: ZkNoidGameFeature[];
  defaultPage: string;
  active: boolean;
  isReleased: boolean;
  releaseDate: Date;
  popularity: number;
  rating: number;
  author: string;
}

export const announcedGames: IGame[] = [
  {
    id: 'znake',
    logo: '/image/games/soon.svg',
    logoMode: LogoMode.CENTER,
    rating: 0,
    name: 'Znake game',
    description: 'Collect all the points and try not to bite your tail',
    genre: ZkNoidGameGenre.Arcade,
    features: [ZkNoidGameFeature.SinglePlayer],
    defaultPage: 'global',
    active: false,
    isReleased: false,
    releaseDate: new Date(2024, 5, 1),
    popularity: 0,
    author: 'ZkNoid Team',
  },
 
];

export const defaultGames: IGame[] = [
  {
    id: 'arkanoid',
    logo: '/image/games/arkanoid.svg',
    logoMode: LogoMode.FULL_WIDTH,
    name: 'Arkanoid game',
    description:
      'Old but gold game. Beat all the bricks and protect the ball from falling',
    genre: ZkNoidGameGenre.Arcade,
    features: [ZkNoidGameFeature.SinglePlayer],
    defaultPage: 'competitions-list',
    active: true,
    isReleased: true,
    releaseDate: new Date(2023, 11, 1),
    popularity: 60,
    author: 'ZkNoid Team',
    rating: 0,
  },
  {
    id: 'randzu',
    logo: '/image/games/randzu.svg',
    logoMode: LogoMode.CENTER,
    name: 'Randzu game',
    description:
      'Two players take turns placing pieces on the board attempting to create lines of 5 of their own color',
    genre: ZkNoidGameGenre.BoardGames,
    features: [ZkNoidGameFeature.Multiplayer],
    defaultPage: 'lobby/undefined',
    active: true,
    isReleased: true,
    releaseDate: new Date(2024, 0, 1),
    popularity: 50,
    author: 'ZkNoid Team',
    rating: 0,
  },
];
