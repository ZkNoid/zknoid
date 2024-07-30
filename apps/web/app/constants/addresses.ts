import { NETWORKS, NetworkIds } from './networks';

export const LOTTERY_ADDRESS: {
  readonly [networkId: string]: string | 'not-deployed';
} = {
  [NetworkIds.MINA_DEVNET]:
    'B62qmbX7xkXxLhKQpi4iabLzEtzyXi9uA5pFU1PbACoXCMt6DEC3t1g',
  [NetworkIds.ZEKO_TESTNET]: 'not-deployed',
};
