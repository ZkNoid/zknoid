import { UInt64 } from '@proto-kit/library';
import { ArkanoidGameHub } from './arkanoid/ArkanoidGameHub';
import { RandzuLogic } from './randzu/RandzuLogic';
import { ThimblerigLogic } from './thimblerig/ThimblerigLogic';
import { Balances } from './framework';

export default {
  modules: {
    ArkanoidGameHub,
    ThimblerigLogic,
    Balances,
    RandzuLogic,
  },
  config: {
    ArkanoidGameHub: {},
    ThimblerigLogic: {},
    Balances: {
      totalSupply: UInt64.from(10000),
    },
    RandzuLogic: {},
  },
};
