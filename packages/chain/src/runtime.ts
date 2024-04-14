import { UInt64 } from '@proto-kit/library';
import { ArkanoidGameHub } from './arkanoid/ArkanoidGameHub';
import { RandzuLogic } from './randzu/RandzuLogic';
import { ThimblerigLogic } from './thimblerig/ThimblerigLogic';
import { Balances } from './framework';
import { ModulesConfig } from '@proto-kit/common';
import { CheckersLogic } from './checkers';

const modules = {
  ArkanoidGameHub,
  ThimblerigLogic,
  Balances,
  RandzuLogic,
  CheckersLogic
};

const config: ModulesConfig<typeof modules> = {
  ArkanoidGameHub: {},
  ThimblerigLogic: {},
  Balances: {
    totalSupply: UInt64.from(10000),
  },
  RandzuLogic: {},
  CheckersLogic: {}
};

export default {
  modules,
  config,
};
