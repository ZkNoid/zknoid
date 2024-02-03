import { ArkanoidGameHub } from './ArkanoidGameHub';
import { Balances } from "./balances";
import { RandzuLogic } from './RandzuLogic';

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
