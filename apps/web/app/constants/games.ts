export enum GameType {
  Arkanoid = 'arkanoid',
  Randzu = 'randzu',
  Checkers = 'checkers',
}

export interface IGame {
  type: GameType;
  logo: string;
  name: string;
  description: string;
  tags: string[];
  defaultPage: string;
  active: boolean;
}

export const games: IGame[] = [
  {
    type: GameType.Arkanoid,
    logo: '/Arkanoid.png',
    name: 'Arkanoid game',
    description:
      'Old but gold game. Beat all the bricks and protect the ball from falling',
    tags: ['L2 game', 'singleplayer', 'retro'],
    defaultPage: 'competitions-list',
    active: true,
  },
  {
    type: GameType.Randzu,
    logo: '/randzu.jpeg',
    name: 'Randzu game',
    description:
      'Two players take turns placing pieces on the board attempting to create lines of 5 of their own color',
    tags: ['L2 game', 'multiplayer', 'board games'],
    defaultPage: 'global',
    active: true,
  },
  {
    type: GameType.Checkers,
    logo: '/checkers.webp',
    name: 'Checkers game',
    description: 'Compete other players in the classic board game',
    tags: ['L2 game', 'multiplayer', 'board games'],
    defaultPage: 'global',
    active: false,
  },
];
