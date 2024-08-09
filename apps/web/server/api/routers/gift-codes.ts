import clientPromise from '@/app/lib/mongodb';

import { z } from 'zod';

import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';

const client = await clientPromise;
const db = client.db(process.env.MONGODB_DB);

export const giftCodesRouter = createTRPCRouter({
  getUserGiftCodes: publicProcedure
    .input(z.object({ userAddress: z.string() }))
    .query(async ({ input }) => {
      return {
        giftCodes: await db
          .collection('gift-codes')
          .find({ userAddress: input.userAddress })
          .toArray(),
      };
    }),
  addGiftCode: publicProcedure
    .input(
      z.object({
        userAddress: z.string(),
        code: z.string(),
        transactionHash: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      // const currentDate = new Date();
      // currentDate.setMonth(currentDate.getMonth() + 1);
      await db.collection('gift-codes').insertOne({
        userAddress: input.userAddress,
        transactionHash: input.transactionHash,
        code: input.code,
        used: false,
        createdAt: Date.now(),
        // expiredAt: currentDate.getTime(),
      });
      return {
        userAddress: input.userAddress,
        transactionHash: input.transactionHash,
        code: input.code,
        used: false,
        createdAt: Date.now(),
      };
    }),
  addGiftCodes: publicProcedure
    .input(
      z
        .object({
          userAddress: z.string(),
          code: z.string(),
          transactionHash: z.string(),
        })
        .array()
    )
    .mutation(async ({ input }) => {
      await db.collection('gift-codes').insertMany(
        input.map((item) => ({
          userAddress: item.userAddress,
          transactionHash: item.transactionHash,
          code: item.code,
          used: false,
          createdAt: Date.now(),
          // expiredAt: item.currentDate.getTime(),
        }))
      );
      return input.map((item) => ({
        userAddress: item.userAddress,
        transactionHash: item.transactionHash,
        code: item.code,
        used: false,
        createdAt: Date.now(),
      }));
    }),
  checkGiftCodeValidity: publicProcedure
    .input(z.object({ code: z.string() }))
    .query(async ({ input }) => {
      const code = await db
        .collection('gift-codes')
        .findOne({ code: input.code });
      return !code;
    }),
  useGiftCode: publicProcedure
    .input(z.object({ code: z.string() }))
    .mutation(async ({ input }) => {
      await db
        .collection('gift-codes')
        .updateOne({ code: input.code }, { $set: { used: true } });
    }),
  removeUsedGiftCodes: publicProcedure
    .input(z.object({ userAddress: z.string() }))
    .mutation(async ({ input }) => {
      await db
        .collection('gift-codes')
        .deleteMany({ userAddress: input.userAddress, code: { used: true } });
    }),
});
