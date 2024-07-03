export interface Network {
  networkID: string;
  name: string;
  graphql: string;
  archive: string;
}

export const NetworkIds = {
  ZEKO_TESTNET: window.mina?.isPallad ? '69420' : 'zeko:testnet',
  MINA_DEVNET: window.mina?.isPallad ? '29936104443aaf264a7f0192ac64b1c7173198c1ed404c1bcff5e562e05eb7f6' : 'mina:testnet',
};

export const NETWORKS: { readonly [networkId: string]: Network } = {
  [NetworkIds.MINA_DEVNET]: {
    networkID: NetworkIds.MINA_DEVNET,
    name: 'Devnet',
    graphql: 'https://api.minascan.io/node/devnet/v1/graphql',
    archive: 'https://api.minascan.io/archive/devnet/v1/graphql',
  },
  [NetworkIds.ZEKO_TESTNET]: {
    networkID: NetworkIds.ZEKO_TESTNET,
    name: 'Zeko',
    graphql: 'https://devnet.zeko.io/graphql',
    archive: '',
  },
};

export const ALL_NETWORKS = [
  NETWORKS[NetworkIds.MINA_DEVNET],
  NETWORKS[NetworkIds.ZEKO_TESTNET],
];
