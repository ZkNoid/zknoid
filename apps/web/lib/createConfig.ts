import {
    RuntimeModulesRecord,
  } from "@proto-kit/module";
import { ClientAppChain } from '@proto-kit/sdk';
import { client } from 'zknoid-chain-dev';

export type ZkNoidGameConfig<RuntimeModules extends RuntimeModulesRecord
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

export function getZkNoidGameClient<RuntimeModules extends RuntimeModulesRecord>(zknoidGame: ZkNoidGameConfig<RuntimeModules>) {
  // const client =  ClientAppChain.fromRuntime({
  //   modules: zknoidGame.runtimeModules
  // });

  client.configure({
    Runtime: {
      RandzuLogic: {},
      Balances: {},
      ArkanoidGameHub: {}
    }
  });

  // client.configurePartial({
  //     GraphqlClient: {
  //         url: process.env.NEXT_PUBLIC_PROTOKIT_URL || "http://127.0.0.1:8080/graphql",
  //       },
  // })
  return client;
}
