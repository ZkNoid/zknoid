import { NETWORKS, NetworkIds } from './networks';

export const LOTTERY_ADDRESS: {
  readonly [networkId: string]: string | 'not-deployed';
} = {
  [NetworkIds.MINA_DEVNET]:
    'B62qqieAv9AQCsLHfinPESXB9exSJBpTVLpgkjqWT9cSGBc67pBkNxs',
  [NetworkIds.ZEKO_TESTNET]: 'not-deployed',
};
