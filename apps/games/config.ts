import { createConfig } from 'sdk/lib/createConfig';
import { numberGuessingConfig } from './number_guessing/config';

export const zkNoidConfigGlobal2 = createConfig({
  games: [
    numberGuessingConfig
  ],
});
