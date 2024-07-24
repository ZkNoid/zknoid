import { NETWORKS, NetworkIds } from './networks';

export const LOTTERY_ADDRESS: {
  readonly [networkId: string]: string | 'not-deployed';
} = {
  [NetworkIds.MINA_DEVNET]:
    'B62qnHB2c9C7PCS6B1YZae7Ga6mgwFBL3tGbKkPGt5nFVqMdjNHHBCc',
  [NetworkIds.ZEKO_TESTNET]: 'not-deployed',
};
