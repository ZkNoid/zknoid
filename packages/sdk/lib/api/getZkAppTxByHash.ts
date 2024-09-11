'use server';

export const getZkAppTxByHash = async (txHash: string) => {
    const response = await fetch(
        `https://api.blockberry.one/mina-devnet/v1/zkapps/txs/${txHash}`,
        {
            method: 'GET',
            headers: {
                accept: 'application/json',
                'x-api-key': process.env.BLOCKBERRY_KEY || '',
            },
        }
    );
    if (!response.ok) {
        throw new Error('Error while fetching transaction');
    }
    return response.json();
};