interface Network {
    chainId: string;
    name: string;
    graphql: string;
}

export const NETWORKS: Network[] = [
    {
        "chainId": "testworld2",
        "name": "Testworld2",
        "graphql": "https://mina-testworld2-graphql.aurowallet.com/graphql",
    },
    {
        "chainId": "mainnet",
        "name": "Mainnet",
        "graphql": "https://mina-mainnet-graphql.aurowallet.com/graphql"

    },
    {
        "chainId": "berkeley",
        "name": "Berkeley",
        "graphql": "https://mina-berkeley-archive.aurowallet.com/graphql",
    },
    {
        "chainId": "devnet",
        "name": "Devnet",
        "graphql": "https://mina-devnet-graphql.aurowallet.com/graphql  "
    }
]