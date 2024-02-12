import {
    RuntimeModulesRecord,
  } from "@proto-kit/module";
import { ClientAppChain } from '@proto-kit/sdk';

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
  const client =  ClientAppChain.fromRuntime({
    modules: zknoidGame.runtimeModules
  });

  client.configure({
    Runtime: {
      RandzuLogic: {},
      Balances: {},
      ArkanoidGameHub: {}
    }
  });
  return client;
}
