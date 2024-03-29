import { ArkanoidGameHub } from './arkanoid/ArkanoidGameHub';
import { RandzuLogic } from './randzu/RandzuLogic';
import { ThimblerigLogic } from './thimblerig/ThimblerigLogic';

export default {
  modules: {
    ArkanoidGameHub,
    ThimblerigLogic,

    RandzuLogic,
  },
  config: {
    ArkanoidGameHub: {},
    ThimblerigLogic: {},

    RandzuLogic: {},
  },
};
