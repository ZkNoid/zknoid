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
          .find({ userAddress: input.userAddress, deleted: false })
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
      await db.collection('gift-codes').insertOne({
        userAddress: input.userAddress,
        transactionHash: input.transactionHash,
        code: input.code,
        used: false,
        deleted: false,
        createdAt: new Date().toISOString(),
      });
      return {
        userAddress: input.userAddress,
        transactionHash: input.transactionHash,
        code: input.code,
        used: false,
        deleted: false,
        createdAt: new Date().toISOString(),
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
          deleted: false,
          createdAt: new Date().toISOString(),
        }))
      );
      return input.map((item) => ({
        userAddress: item.userAddress,
        transactionHash: item.transactionHash,
        code: item.code,
        used: false,
        deleted: false,
        createdAt: new Date().toISOString(),
      }));
    }),
  checkGiftCodeValidity: publicProcedure
    .input(z.object({ code: z.string() }))
    .query(async ({ input }) => {
      const code = await db
        .collection('gift-codes')
        .findOne({ code: input.code, used: false, deleted: false });
      return !!code;
    }),
  useGiftCode: publicProcedure
    .input(z.object({ giftCode: z.string() }))
    .mutation(async ({ input }) => {
      await db
        .collection('gift-codes')
        .updateOne({ code: input.giftCode }, { $set: { used: true } });
    }),
  removeUsedGiftCodes: publicProcedure
    .input(z.object({ userAddress: z.string() }))
    .mutation(async ({ input }) => {
      await db
        .collection('gift-codes')
        .updateMany(
          { userAddress: input.userAddress, used: true },
          { $set: { deleted: true } }
        );
    }),
  sendTicketQueue: publicProcedure
    .input(
      z.object({
        userAddress: z.string(),
        giftCode: z.string(),
        roundId: z.number(),
        ticket: z.object({
          numbers: z.array(z.number()),
        }),
      })
    )
    .mutation(async ({ input }) => {
      await db.collection('promo_tickets_queue').insertOne({
        userAddress: input.userAddress,
        giftCode: input.giftCode,
        roundId: input.roundId,
        ticket: input.ticket,
        createdAt: new Date().toISOString(),
      });
    }),
});
