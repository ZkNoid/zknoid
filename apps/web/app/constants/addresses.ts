import { NETWORKS, NetworkIds } from './networks';

export const LOTTERY_ADDRESS: {
  readonly [networkId: string]: string | 'not-deployed';
} = {
  [NetworkIds.MINA_DEVNET]:
    'B62qkukYhz7mr9Rq6ucGPjGDpyxvKVQQrkxQSd2QpgHCe5gotY4JTEi',
  [NetworkIds.ZEKO_TESTNET]: 'not-deployed',
};
