import { NETWORKS, NetworkIds } from './networks';

export const LOTTERY_ADDRESS: {
  readonly [networkId: string]: string | 'not-deployed';
} = {
  [NetworkIds.MINA_DEVNET]:
    'B62qopXzWcig9rrMeX8ycUPM7kpvcYKi97RcrnBw8waKsSGD6Vy9D4V',
  [NetworkIds.ZEKO_TESTNET]: 'not-deployed',
};
