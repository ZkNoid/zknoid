import { LocalhostAppChain } from '@proto-kit/cli';
import { Runtime } from '@proto-kit/module';
import { VanillaProtocol } from '@proto-kit/protocol';
import {
  BlockProducerModule,
  InMemoryDatabase,
  LocalTaskQueue,
  LocalTaskWorkerModule,
  ManualBlockTrigger,
  NoopBaseLayer,
  PrivateMempool,
  Sequencer,
  SequencerModule,
  UnprovenProducerModule,
  sequencerModule,
} from '@proto-kit/sequencer';
import {
  BlockStorageResolver,
  GraphqlSequencerModule,
  GraphqlServer,
  MempoolResolver,
  NodeStatusResolver,
  QueryGraphqlModule,
  UnprovenBlockResolver,
  MerkleWitnessResolver,
} from '@proto-kit/api';
import {
  StateServiceQueryModule,
  BlockStorageNetworkStateModule,
} from '@proto-kit/sdk';
import runtime from './runtime';

@sequencerModule()
class StartupScripts extends SequencerModule {
  constructor() {
    super();
  }
  async start(): Promise<void> {}
}

const appChain = LocalhostAppChain.fromRuntime(runtime);

// appChain.configure({
//   ...appChain.config,

//   Protocol: {
//     BlockProver: {},
//     StateTransitionProver: {},
//     AccountState: {},
//     BlockHeight: {},
//     LastStateRoot: {},
//   },

//   Sequencer: {
//     Database: {},
//     UnprovenProducerModule: {},

//     GraphqlServer: {
//       port: 8080,
//       host: "0.0.0.0",
//       graphiql: true,
//     },

//     Graphql: {
//       QueryGraphqlModule: {},
//       MempoolResolver: {},
//       BlockStorageResolver: {},
//       NodeStatusResolver: {},
//       MerkleWitnessResolver: {},
//       UnprovenBlockResolver: {},
//     },

//     Mempool: {},
//     BlockProducerModule: {},
//     LocalTaskWorkerModule: {},
//     BaseLayer: {},
//     TaskQueue: {},
//     BlockTrigger: {},
//   },

//   QueryTransportModule: {},
//   NetworkStateTransportModule: {},
// });

appChain.configure({
  ...appChain.config,

  Runtime: {
    ThimblerigLogic: {},
    Balances: {},
    ArkanoidGameHub: {},
    RandzuLogic: {},
  },
});

export default appChain as any;
