export interface Network {
  networkID: string;
  palladNetworkID: string;
  name: string;
  graphql: string;
  archive: string;
}

export const NetworkIds = {
  ZEKO_TESTNET: 'zeko:testnet',
  MINA_DEVNET: 'mina:testnet',
};

export const PalladNetworkIds = {
  ZEKO_TESTNET: '69420',
  MINA_DEVNET: '29936104443aaf264a7f0192ac64b1c7173198c1ed404c1bcff5e562e05eb7f6',
};

export const PALLAD_TO_AURO_NETWORK_IDS = {
  [PalladNetworkIds.MINA_DEVNET]: NetworkIds.MINA_DEVNET,
  [PalladNetworkIds.ZEKO_TESTNET]: NetworkIds.ZEKO_TESTNET
}

export const NETWORKS: { readonly [networkId: string]: Network } = {
  [NetworkIds.MINA_DEVNET]: {
    networkID: NetworkIds.MINA_DEVNET,
    palladNetworkID: PalladNetworkIds.MINA_DEVNET,
    name: 'Devnet',
    graphql: 'https://api.minascan.io/node/devnet/v1/graphql',
    archive: 'https://api.minascan.io/archive/devnet/v1/graphql',
  },
  [NetworkIds.ZEKO_TESTNET]: {
    networkID: NetworkIds.ZEKO_TESTNET,
    palladNetworkID: PalladNetworkIds.ZEKO_TESTNET,
    name: 'Zeko',
    graphql: 'https://devnet.zeko.io/graphql',
    archive: '',
  },
};

export const ALL_NETWORKS = [
  NETWORKS[NetworkIds.MINA_DEVNET],
  NETWORKS[NetworkIds.ZEKO_TESTNET],
];
