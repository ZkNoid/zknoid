import { NETWORKS, NetworkIds } from './networks';

export const LOTTERY_ADDRESS: {
  readonly [networkId: string]: string | 'not-deployed';
} = {
  [NetworkIds.MINA_DEVNET]:
    'B62qjX889KQovNztwZzNbDh9tamijYL135GEPdt1cCtqggU51v1EPoJ',
  [NetworkIds.ZEKO_TESTNET]: 'not-deployed',
};
