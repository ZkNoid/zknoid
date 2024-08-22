import { createZkNoidGameConfig } from '@/lib/createConfig';
import { ZkNoidGameType } from '@/lib/platform/game_types';
import { GuessGame } from 'zknoid-chain-dev';
import Randzu from './NumberGuessing';
import { ZkNoidGameFeature, ZkNoidGameGenre } from '@/lib/platform/game_tags';

import { LogoMode } from '@/app/constants/games';
import NumberGuessing from './NumberGuessing';

export const numberGuessingConfig = createZkNoidGameConfig({
  id: 'number-guessing',
  type: ZkNoidGameType.PVP,
  name: 'Number guessing [single]',
  description: 'Player hides a number. Other player tries to guess it',
  image: '/image/games/randzu.svg',
  logoMode: LogoMode.CENTER,
  genre: ZkNoidGameGenre.BoardGames,
  features: [ZkNoidGameFeature.Multiplayer],
  isReleased: true,
  releaseDate: new Date(2024, 0, 1),
  popularity: 50,
  author: 'ZkNoid Team',
  rules:
    'Number guessing is a game where a player hides a number and gives the PC to another player. Other player tries to guess the number',
  runtimeModules: {
    GuessGame,
  },
  page: NumberGuessing,
});

export const randzuRedirectConfig = createZkNoidGameConfig({
  id: 'randzu',
  type: ZkNoidGameType.PVP,
  name: 'Randzu game',
  description:
    'Two players take turns placing pieces on the board attempting to create lines of 5 of their own color',
  image: '/image/games/randzu.svg',
  logoMode: LogoMode.CENTER,
  genre: ZkNoidGameGenre.BoardGames,
  features: [ZkNoidGameFeature.Multiplayer],
  isReleased: true,
  releaseDate: new Date(2024, 0, 1),
  popularity: 50,
  author: 'ZkNoid Team',
  rules:
    'Randzu is a game played on a 15x15 grid, similar to tic-tac-toe. Two players take turns placing their mark, using balls of different colors. The goal is to get five of your marks in a row, either horizontally, vertically or diagonally.',
  runtimeModules: {},
  page: undefined as any,
  lobby: undefined as any,
  externalUrl: 'https://proto.zknoid.io/games/randzu/global',
});
