import { NETWORKS, NetworkIds } from './networks';

export const LOTTERY_ADDRESS: {
  readonly [networkId: string]: string | 'not-deployed';
} = {
  [NetworkIds.MINA_DEVNET]:
    'B62qk3U9ZUZ2a21T4thqhUgBvXM3xMyA1HtQBQ79unUHrytEVpNhtqm',
  [NetworkIds.ZEKO_TESTNET]: 'not-deployed',
};
