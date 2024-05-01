import clientPromise from '@/app/lib/mongodb';

import { z } from 'zod';

import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';
import { PushOperator } from 'mongodb';

const client = await clientPromise;
const db = client.db(process.env.MONGODB_DB);

export interface Progress {
  ARKANOID: boolean[];
  RANDZU: boolean[];
  THIMBLERIG: boolean[];
  UI_TESTS_WEB: boolean[];
}

// Current game, hostname,
const EnvContext = z.record(z.string(), z.string());

export const progressRouter = createTRPCRouter({
  getSolvedQuests: publicProcedure
    .input(z.object({ userAddress: z.string() }))
    .query(async ({ ctx, input }) => {
      return {
        quests: (
          await db.collection('statuses').findOne({
            address: input.userAddress,
          })
        )?.statuses as Progress | null,
      };
    }),
  setSolvedQuests: publicProcedure
    .input(
      z.object({
        userAddress: z.string(),
        section: z.string(),
        id: z.number(),
        roomId: z.string().or(z.undefined()),
        txHash: z.string(),
        envContext: EnvContext,
      })
    )
    .mutation(async ({ ctx, input }) => {
      await db.collection('statuses').updateOne(
        { address: input.userAddress },
        {
          $set: {
            [`statuses.${input.section}.${input.id}`]: true,
          },
          $inc: {
            [`counter.${input.section}.${input.id}`]: 1,
          },
          $push: {
            [`ctx.${input.section}.${input.id}`]: input.envContext,
            [`hashes.${input.section}.${input.id}`]: input.txHash,
            ...(input.roomId
              ? { [`rooms.${input.section}.${input.id}`]: input.roomId }
              : {}),
          } as unknown as PushOperator<Document>,
        },
        {
          upsert: true,
        }
      );
      return {
        userAddress: input.userAddress,
        section: input.section,
        id: input.id,
      };
    }),
});
