import { LocalhostAppChain } from '@proto-kit/cli';
import runtime from './runtime';

const appChain = LocalhostAppChain.fromRuntime(runtime.modules);

appChain.configurePartial({
  ...appChain.config,

  Runtime: {
    ThimblerigLogic: {},
    Balances: {},
    ArkanoidGameHub: {},
    RandzuLogic: {},
  },
});

export default appChain as any;
