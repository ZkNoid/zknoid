import { ZkNoidGameGenre } from '@/lib/platform/game_tags';

enum GameTags {
  Multiplayer = 'Multiplayer',
  SinglePlayer = 'Single player',
  L2_Game = 'L2 game',
  BoardGames = 'Board games',
  Retro = 'Retro',
}

export interface IGame {
  id: string;
  logo: string;
  name: string;
  description: string;
  genre: ZkNoidGameGenre;
  tags: GameTags[];
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
    tags: [GameTags.L2_Game, GameTags.Multiplayer, GameTags.BoardGames],
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
    tags: [GameTags.L2_Game, GameTags.SinglePlayer, GameTags.Retro],
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
    tags: [GameTags.L2_Game, GameTags.Multiplayer, GameTags.BoardGames],
    defaultPage: 'global',
    active: true,
  },
];
