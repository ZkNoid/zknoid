import { NETWORKS, NetworkIds } from './networks';

export const LOTTERY_ADDRESS: {
  readonly [networkId: string]: string | 'not-deployed';
} = {
  [NetworkIds.MINA_DEVNET]: 'B62qkfLEoeoWd4SUpkUVv7kRurcHiarxzsQkQihqVK9fB8zferqvYqc',
  [NetworkIds.ZEKO_TESTNET]: 'not-deployed',
};
