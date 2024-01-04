export interface Network {
    chainId: string;
    name: string;
    graphql: string;
}

export const NETWORKS: Network[] = [
    {
        "chainId": "testworld2",
        "name": "Testworld2",
        "graphql": "https://proxy.testworld.minaexplorer.com/graphql",
    },
    // {
    //     "chainId": "mainnet",
    //     "name": "Mainnet",
    //     "graphql": "https://proxy.mainnet.minaexplorer.com/graphql"

    // },
    {
        "chainId": "berkeley",
        "name": "Berkeley",
        "graphql": "https://proxy.berkeley.minaexplorer.com/graphql",
    },
    {
        "chainId": "devnet",
        "name": "Devnet",
        "graphql": "https://proxy.devnet.minaexplorer.com/graphql  "
    }
]