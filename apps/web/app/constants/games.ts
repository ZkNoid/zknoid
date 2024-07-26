import { ZkNoidGameFeature, ZkNoidGameGenre } from '@/lib/platform/game_tags';

export enum LogoMode {
  CENTER = 0,
  FULL_WIDTH = 1,
  BOTTOM_RIGHT = 2,
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
  externalUrl?: string;
}

export const announcedGames: IGame[] = [
  // {
  //   id: 'znake',
  //   logo: '/image/games/soon.svg',
  //   logoMode: LogoMode.CENTER,
  //   rating: 0,
  //   name: 'Znake game',
  //   description: 'Collect all the points and try not to bite your tail',
  //   genre: ZkNoidGameGenre.Arcade,
  //   features: [ZkNoidGameFeature.SinglePlayer],
  //   defaultPage: 'global',
  //   active: false,
  //   isReleased: false,
  //   releaseDate: new Date(2024, 5, 1),
  //   popularity: 0,
  //   author: 'ZkNoid Team',
  // },
];

export const defaultGames: IGame[] = [
  {
    id: 'lottery',
    logo: '/image/games/lottery.svg',
    logoMode: LogoMode.FULL_WIDTH,
    name: 'Lottery game',
    description:
      'Ticket based lottery game. Choose lucky numbers, buy tickets, win rewards',
    genre: ZkNoidGameGenre.Lucky,
    features: [ZkNoidGameFeature.SinglePlayer],
    defaultPage: 'global',
    active: true,
    isReleased: true,
    releaseDate: new Date(2023, 11, 1),
    popularity: 60,
    author: 'ZkNoid Team',
    rating: 0,
  },
  {
    id: 'tileville',
    name: 'Tileville game',
    description:
      'TileVille is a strategic city-building game on the Mina blockchain, where players construct and manage their own cities on the island of Nicobar using hexagonal tiles.',
    logo: '/image/games/tileville.png',
    logoMode: LogoMode.CENTER,
    genre: ZkNoidGameGenre.Arcade,
    features: [ZkNoidGameFeature.SinglePlayer],
    isReleased: true,
    active: true,
    releaseDate: new Date(2024, 2, 25),
    popularity: 0,
    author: 'Satyam Bansal',
    externalUrl: 'https://www.tileville.xyz/',
    defaultPage: '',
    rating: 0,
  },
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
    externalUrl: 'https://proto.zknoid.io/games/arkanoid/global',
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
    externalUrl: 'https://proto.zknoid.io/games/randzu/global',
  },
  {
    id: 'thimblerig',
    name: 'Thimblerig game',
    description:
      'One player hides a ball behind a thimbler and second player needs to guess which thimbler it was',
    logo: '/image/games/thimblerig.svg',
    logoMode: LogoMode.CENTER,
    genre: ZkNoidGameGenre.Lucky,
    features: [ZkNoidGameFeature.P2P],
    defaultPage: 'lobby/undefined',
    isReleased: true,
    active: true,
    releaseDate: new Date(2024, 2, 25),
    popularity: 0,
    author: 'ZkNoid Team',
    rating: 0,
    externalUrl: 'https://proto.zknoid.io/games/thimblerig/global',
  },
  {
    id: 'checkers',
    name: 'Checkers game',
    description:
      "Checkers is a two-player game played on an 8x8 board. The objective is to capture all of your opponent's pieces jumping diagonally over them",
    logo: '/image/games/checkers.svg',
    logoMode: LogoMode.BOTTOM_RIGHT,
    genre: ZkNoidGameGenre.BoardGames,
    features: [ZkNoidGameFeature.Multiplayer],
    defaultPage: 'lobby/undefined',
    isReleased: true,
    active: true,
    releaseDate: new Date(2024, 0, 1),
    popularity: 50,
    author: 'ZkNoid Team',
    rating: 0,
    externalUrl: 'https://proto.zknoid.io/games/checkers/global',
  },
];
