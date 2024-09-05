import { createConfig } from '@/lib/createConfig';
import { checkersConfig, checkersRedirectConfig } from './checkers/config';
import { thimblerigConfig, thimblerigRedirectConfig } from './thimblerig/config';
import { pokerConfig } from '@/games/poker/config';
import { tileVilleConfig } from '@/games/tileville/config';
import { lotteryConfig } from '@/games/lottery/config';
import { numberGuessingConfig } from './number_guessing/config';
import { zkNoidConfigGlobal2 } from 'games/config';

export const zkNoidConfig = zkNoidConfigGlobal2;

//  = createConfig({
//   games: [
//     lotteryConfig,
//     tileVilleConfig,
//     randzuConfig,
//     checkersConfig,
//     thimblerigConfig,
//     pokerConfig,
//     arkanoidConfig,
//     numberGuessingConfig
//   ],
// });
