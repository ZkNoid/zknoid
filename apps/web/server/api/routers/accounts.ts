import clientPromise from '@/app/lib/mongodb';

import { z } from 'zod';

import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';

const client = await clientPromise;
const db = client.db(process.env.MONGODB_DB);

export const accountsRouter = createTRPCRouter({
  getAccount: publicProcedure
    .input(z.object({ userAddress: z.string() }))
    .query(async ({ ctx, input }) => {
      return {
        account: await db
          .collection('accounts')
          .findOne({ userAddress: input.userAddress }),
      };
    }),
  setName: publicProcedure
    .input(z.object({ userAddress: z.string(), name: z.string() }))
    .mutation(async ({ input }) => {
      await db.collection('accounts').updateOne(
        { userAddress: input.userAddress, name: input.name },
        {
          $set: {
            name: input.name,
          },
        },
        { upsert: true }
      );
      return {
        userAddress: input.userAddress,
        name: input.name,
      };
    }),
});
