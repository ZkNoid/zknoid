import { ZkNoidGameFeature, ZkNoidGameGenre } from '@/lib/platform/game_tags';

export interface IGame {
  id: string;
  logo: string;
  rating: number;
  name: string;
  description: string;
  genre: ZkNoidGameGenre;
  features: ZkNoidGameFeature[];
  defaultPage: string;
  active: boolean;
}

export const announcedGames: IGame[] = [
  {
    id: 'checkers',
    logo: '/image/games/soon.svg',
    rating: 5,
    name: 'Checkers game',
    description: 'Compete other players in the classic board game',
    genre: ZkNoidGameGenre.ComingSoon,
    features: [ZkNoidGameFeature.Multiplayer],
    defaultPage: 'global',
    active: false,
  },
];

export const defaultGames: IGame[] = [
  {
    id: 'arkanoid',
    logo: '/image/games/arkanoid.svg',
    rating: 4.5,
    name: 'Arkanoid game',
    description:
      'Old but gold game. Beat all the bricks and protect the ball from falling',
    genre: ZkNoidGameGenre.Arcade,
    features: [ZkNoidGameFeature.SinglePlayer],
    defaultPage: 'competitions-list',
    active: true,
  },
  {
    id: 'randzu',
    logo: '/image/games/randzu.svg',
    rating: 2.2,
    name: 'Randzu game',
    description:
      'Two players take turns placing pieces on the board attempting to create lines of 5 of their own color',
    genre: ZkNoidGameGenre.BoardGames,
    features: [ZkNoidGameFeature.Multiplayer],
    defaultPage: 'global',
    active: true,
  },
];
