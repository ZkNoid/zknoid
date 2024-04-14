import { ZkNoidGameFeature, ZkNoidGameGenre } from '@/lib/platform/game_tags';

export interface IGame {
  id: string;
  logo: string;
  name: string;
  description: string;
  genre: ZkNoidGameGenre;
  features: ZkNoidGameFeature[];
  defaultPage: string;
  active: boolean;
  isReleased: boolean;
  releaseDate: Date;
  popularity: number;
  author: string;
}

export const announcedGames: IGame[] = [
  
];

export const defaultGames: IGame[] = [
  {
    id: 'arkanoid',
    logo: '/image/games/arkanoid.svg',
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
  },
  {
    id: 'randzu',
    logo: '/image/games/randzu.svg',
    name: 'Randzu game',
    description:
      'Two players take turns placing pieces on the board attempting to create lines of 5 of their own color',
    genre: ZkNoidGameGenre.BoardGames,
    features: [ZkNoidGameFeature.Multiplayer],
    defaultPage: 'global',
    active: true,
    isReleased: true,
    releaseDate: new Date(2024, 0, 1),
    popularity: 50,
    author: 'ZkNoid Team',
  },
  {
    id: 'checkers',
    logo: '/image/games/soon.svg',
    name: 'Checkers game',
    description: 'Compete other players in the classic board game',
    genre: ZkNoidGameGenre.BoardGames,
    features: [ZkNoidGameFeature.Multiplayer],
    defaultPage: 'global',
    active: false,
    isReleased: false,
    releaseDate: new Date(2024, 2, 25),
    popularity: 0,
    author: 'ZkNoid Team',
  },
];
