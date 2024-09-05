import clientPromise from '@/app/lib/mongodb';

import { z } from 'zod';

import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';

const client = await clientPromise;
const db = client.db(process.env.MONGODB_DB);

export const accountsRouter = createTRPCRouter({
  getAccount: publicProcedure
    .input(z.object({ userAddress: z.string() }))
    .query(async ({ input }) => {
      return {
        account: await db
          .collection('accounts')
          .findOne({ userAddress: input.userAddress }),
      };
    }),
  getAccounts: publicProcedure
    .input(z.object({ userAddresses: z.array(z.string()) }))
    .query(async ({ input }) => {
      return {
        accounts: await db
          .collection('accounts')
          .find({ userAddress: { $in: input.userAddresses } })
          .toArray(),
      };
    }),
  setName: publicProcedure
    .input(z.object({ userAddress: z.string(), name: z.string() }))
    .mutation(async ({ input }) => {
      await db.collection('accounts').updateOne(
        { userAddress: input.userAddress },
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
  checkNameUnique: publicProcedure
    .input(z.object({ name: z.string() }))
    .query(async ({ input }) => {
      const account = await db
        .collection('accounts')
        .findOne({ name: input.name });
      return !account;
    }),
  setAvatar: publicProcedure
    .input(z.object({ userAddress: z.string(), avatarId: z.number() }))
    .mutation(async ({ input }) => {
      await db.collection('accounts').updateOne(
        { userAddress: input.userAddress },
        {
          $set: {
            avatarId: input.avatarId,
          },
        },
        { upsert: true }
      );
      return {
        userAddress: input.userAddress,
        avatarId: input.avatarId,
      };
    }),
});
