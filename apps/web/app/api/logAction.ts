import clientPromise from '@/app/lib/mongodb';

export async function POST(request: Request) {
  const data = await request.json();

  const { wallet, action, transaction, captchaResp, signature } = data;

  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB);

  await db
    .collection('actions')
    .insertOne({ wallet, action, transaction, captchaResp, signature });

  return Response.json({
    status: 'ok',
  });
}
