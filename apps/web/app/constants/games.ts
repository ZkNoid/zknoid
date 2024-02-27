import { ZkNoidGameGenre } from '@/lib/platform/game_tags';

export interface IGame {
  id: string;
  logo: string;
  name: string;
  description: string;
  genre: ZkNoidGameGenre;
  tags: string[];
  defaultPage: string;
  active: boolean;
}

export const announcedGames: IGame[] = [
  {
    id: 'checkers',
    logo: '/image/games/soon.svg',
    name: 'Checkers game',
    description: 'Compete other players in the classic board game',
    genre: ZkNoidGameGenre.ComingSoon,
    tags: ['L2 game', 'multiplayer', 'board games'],
    defaultPage: 'global',
    active: false,
  },
];

export const defaultGames: IGame[] = [
  {
    id: 'arkanoid',
    logo: '/image/games/arkanoid.svg',
    name: 'Arkanoid game',
    description:
      'Old but gold game. Beat all the bricks and protect the ball from falling',
    genre: ZkNoidGameGenre.Arcade,
    tags: ['L2 game', 'singleplayer', 'retro'],
    defaultPage: 'competitions-list',
    active: true,
  },
  {
    id: 'randzu',
    logo: '/image/games/randzu.svg',
    name: 'Randzu game',
    description:
      'Two players take turns placing pieces on the board attempting to create lines of 5 of their own color',
    genre: ZkNoidGameGenre.BoardGames,
    tags: ['L2 game', 'multiplayer', 'board games'],
    defaultPage: 'global',
    active: true,
  },
];
