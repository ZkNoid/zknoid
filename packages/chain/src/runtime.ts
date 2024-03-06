import { ArkanoidGameHub } from "./arkanoid/ArkanoidGameHub";
import { Balances } from "./framework/balances";
import { RandzuLogic } from "./randzu/RandzuLogic";
import { ThimblerigLogic } from "./thimblerig/ThimblerigLogic";

export default {
  modules: {
    ArkanoidGameHub,
    Balances,
    RandzuLogic,
    ThimblerigLogic,
  },
  config: {
    ArkanoidGameHub: {},
    Balances: {},
    RandzuLogic: {},
    ThimblerigLogic: {},
  },
};
