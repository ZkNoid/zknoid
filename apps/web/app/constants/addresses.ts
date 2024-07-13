import { NETWORKS, NetworkIds } from './networks';

export const LOTTERY_ADDRESS: {
  readonly [networkId: string]: string | 'not-deployed';
} = {
  [NetworkIds.MINA_DEVNET]:
    'B62qkoEajPN6Ak23vMQVKcE6AYmLxCJRf2gKvzEmDAh1Qv2L5ibiPSo',
  [NetworkIds.ZEKO_TESTNET]: 'not-deployed',
};
