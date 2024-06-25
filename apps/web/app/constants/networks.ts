export interface Network {
  networkID: string;
  name: string;
  graphql: string;
}

export const NETWORKS: Network[] = [
  {
    networkID: 'zeko:testnet',
    name: 'Zeko',
    graphql: 'https://devnet.zeko.io/graphql',
  },
  {
    networkID: 'mina:testnet',
    name: 'Devnet',
    graphql: 'https://api.minascan.io/node/devnet/v1/graphql',
  },
];
