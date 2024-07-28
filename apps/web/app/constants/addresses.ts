import { NETWORKS, NetworkIds } from './networks';

export const LOTTERY_ADDRESS: {
  readonly [networkId: string]: string | 'not-deployed';
} = {
  [NetworkIds.MINA_DEVNET]:
    'B62qjH2N7qJVyMxrZSJdqfdnp97ZduUdydehjigpDN51k3cFNe8G2Dk',
  [NetworkIds.ZEKO_TESTNET]: 'not-deployed',
};
