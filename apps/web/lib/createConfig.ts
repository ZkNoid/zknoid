import {
  InMemoryStateService,
  Runtime,
  RuntimeModulesRecord,
} from "@proto-kit/module";
import { AuroSigner, ClientAppChain, GraphqlClient, GraphqlQueryTransportModule, GraphqlTransactionSender } from '@proto-kit/sdk';
import { Sequencer } from "@proto-kit/sequencer";
import { ArkanoidGameHub } from 'zknoid-chain-dev';
import { createStore } from "zustand";
import {
  AccountStateModule,
  BlockProver,
  Protocol,
  ProtocolModulesRecord,
  StateServiceProvider,
  StateTransitionProver,
  VanillaProtocol,
} from "@proto-kit/protocol";
import { GraphqlNetworkStateTransportModule } from "@proto-kit/sdk/dist/graphql/GraphqlNetworkStateTransportModule";


export type ZkNoidGameConfig<RuntimeModules extends RuntimeModulesRecord = RuntimeModulesRecord
> = {
  id: string,
  name: string,
  description: string,
  image: string,
  runtimeModules: RuntimeModules
}

export function createZkNoidGameConfig<RuntimeModules extends RuntimeModulesRecord>(params: {
  id: string,
  name: string,
  description: string,
  image: string,
  runtimeModules: RuntimeModules
}) {
  return params
}
export type Evaluate<type> = { [key in keyof type]: type[key] } & unknown;

export type ZkNoidConfig<
  games extends readonly [ZkNoidGameConfig, ...ZkNoidGameConfig[]] = readonly [ZkNoidGameConfig, ...ZkNoidGameConfig[]],
> = {
  readonly games: games;
  getClient(): ClientAppChain<games[number]['runtimeModules']>
}

export type CreateConfigParameters<games extends readonly [ZkNoidGameConfig, ...ZkNoidGameConfig[]]> = Evaluate<{
  games: games
}>;

export function createConfig<
  const games extends readonly [ZkNoidGameConfig, ...ZkNoidGameConfig[]]
>(parameters: CreateConfigParameters<games>): ZkNoidConfig<games> {
  const games = createStore(() => parameters.games);

  return {
    get games() {
      return games.getState();
    },
    getClient() {
      const gameModules = games.getState().map(x => x.runtimeModules);
      const modules = Object.assign({}, ...gameModules);

      console.log('Loaded modules', modules);

      const runtime = Runtime.from({
        ...{modules},
      });
  
      const sequencer = Sequencer.from({
        modules: {},
      });
  
      const appChain = new ClientAppChain({
        runtime,
        sequencer,
        protocol: VanillaProtocol.from({}),
  
        modules: {
          GraphqlClient,
          Signer: AuroSigner,
          TransactionSender: GraphqlTransactionSender,
          QueryTransportModule: GraphqlQueryTransportModule,
          NetworkStateTransportModule: GraphqlNetworkStateTransportModule,
        },
      });
  
      appChain.configure({
        Protocol: {
          BlockProver: {},
          StateTransitionProver: {},
          AccountState: {},
          BlockHeight: {},
        },
  
        Signer: {},
        TransactionSender: {},
        QueryTransportModule: {},
        NetworkStateTransportModule: {},
  
        GraphqlClient: {
          url: "http://127.0.0.1:8080/graphql",
        },
      });
  
      /**
       * Register state service provider globally,
       * to avoid providing an entire sequencer.
       *
       * Alternatively we could register the state service provider
       * in runtime's container, but i think the event emitter proxy
       * instantiates runtime/runtime modules before we can register
       * the mock state service provider.
       */
      const stateServiceProvider = new StateServiceProvider();
      stateServiceProvider.setCurrentStateService(new InMemoryStateService());
      // container.registerInstance("StateServiceProvider", stateServiceProvider);
      const client = appChain;

      client.configure({
        Runtime: {
          ArkanoidGameHub: {},
          Balances: {},
          RandzuLogic: {}
        }
      });

      client.configurePartial({
        GraphqlClient: {
          url: process.env.NEXT_PUBLIC_PROTOKIT_URL || "http://127.0.0.1:8080/graphql",
        },
      })

      return client;
    },
  }
}
