import { ArkanoidGameHub } from './arkanoid/ArkanoidGameHub';
import { Balances } from "./framework/balances";
import { RandzuLogic } from './randzu/RandzuLogic';

export default {
    modules: {
        ArkanoidGameHub,
        Balances,
        RandzuLogic
    },
    config: {
        ArkanoidGameHub: {},
        Balances: {},
        RandzuLogic: {}
    },
};
