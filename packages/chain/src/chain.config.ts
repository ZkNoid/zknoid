import { LocalhostAppChain } from '@proto-kit/cli';
import runtime from './runtime';
import { PrivateKey } from 'o1js';
import { IntegrationTestDBConfig, createPrismaAppchain } from './utils';

const PERSISTENT = true;
let appChain;

if (!PERSISTENT) {
  appChain = LocalhostAppChain.fromRuntime(runtime.modules);

  appChain.configurePartial({
    ...appChain.config,

    Runtime: runtime.config,
    Sequencer: {
      LocalTaskWorkerModule: {
        StateTransitionTask: {},
        RuntimeProvingTask: {},
        StateTransitionReductionTask: {},
        BlockReductionTask: {},
        BlockProvingTask: {},
        BlockBuildingTask: {},
      },
    }
  });
} else {
  const sender = PrivateKey.random();
  const { prismaConfig, redisConfig } = IntegrationTestDBConfig;
  appChain = createPrismaAppchain(prismaConfig, redisConfig);
  
  appChain.configurePartial({
    Signer: {
      signer: sender,
    },
  });
}

export default appChain as any;
