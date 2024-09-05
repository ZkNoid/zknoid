import { createZkNoidGameConfig } from '@sdk/lib/createConfig';
import { ZkNoidGameType } from '@sdk/lib/platform/game_types';
import { GuessGame } from 'zknoid-chain-dev';
import { ZkNoidGameFeature, ZkNoidGameGenre } from '@sdk/lib/platform/game_tags';
import { LogoMode } from '@sdk/constants/games';
import NumberGuessing from './NumberGuessing';

export const numberGuessingConfig = createZkNoidGameConfig({
  id: 'number-guessing',
  type: ZkNoidGameType.PVP,
  name: 'Number guessing [single]',
  description: 'Player hides a number. Other player tries to guess it',
  image: '/image/games/soon.svg',
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
