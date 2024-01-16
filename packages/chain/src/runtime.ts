import { UInt64 } from 'o1js';
import { GameHub } from './GameHub';
import { Balances } from "./balances";
import { MatchMaker } from './MatchMaker';

export default {
    modules: {
        GameHub,
        Balances,
        MatchMaker
    },
    config: {
        GameHub: {},
        Balances: {},
        MatchMaker: {}
    },
};
