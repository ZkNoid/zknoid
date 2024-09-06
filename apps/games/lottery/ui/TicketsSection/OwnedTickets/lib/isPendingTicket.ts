'use server';

export const isPendingTicket = async (hash: string) => {
  const res = await fetch(
    `https://api.blockberry.one/mina-devnet/v1/zkapps/txs/${hash}`,
    {
      method: 'GET',
      headers: {
        accept: 'application/json',
        'x-api-key': process.env.BLOCKBERRY_KEY || '',
      },
    }
  );
  if (!res.ok) {
    throw new Error('Error while fetching pending ticket state');
  }
  const data = await res.json();
  return data;
};
