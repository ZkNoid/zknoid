import { createConfig } from '@/lib/createConfig';
import { arkanoidConfig } from './arkanoid/config';
import { randzuConfig } from './randzu/config';
import { checkersConfig } from './checkers/config';
import { thimblerigConfig } from './thimblerig/config';

export const zkNoidConfig = createConfig({
  games: [arkanoidConfig, randzuConfig, thimblerigConfig, checkersConfig],
});
