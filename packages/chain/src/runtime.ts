import { UInt64 } from 'o1js';
import { GameHub } from './GameHub';
import { Balances } from "./balances";

export default {
    modules: {
        GameHub,
        Balances
    },
    config: {
        GameHub: {},
        Balances: {},
    },
};
