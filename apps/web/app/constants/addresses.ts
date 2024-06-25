import { NETWORKS, NetworkIds } from './networks';

export const LOTTERY_ADDRESS: {
  readonly [networkId: string]: string | 'not-deployed';
} = {
  [NetworkIds.MINA_DEVNET]: 'B62qrJg2tAuviSsTXUaAZLWFE5Uw4n4Gp2eubC11qY9u9rq8ZXiNAwW',
  [NetworkIds.ZEKO_TESTNET]: 'not-deployed',
};
