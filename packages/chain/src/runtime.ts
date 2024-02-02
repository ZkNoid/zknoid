import { UInt64 } from 'o1js';
import { GameHub } from './GameHub';
import { Balances } from "./balances";
import { RandzuLogic } from './RandzuLogic';

export default {
    modules: {
        GameHub,
        Balances,
        RandzuLogic
    },
    config: {
        GameHub: {},
        Balances: {},
        RandzuLogic: {}
    },
};
