import clientPromise from '@/app/lib/mongodb';

import { z } from 'zod';

import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';

const client = await clientPromise;
const db = client.db(process.env.BACKEND_MONGODB_DB);

export interface Progress {
  ARKANOID: boolean[];
  RANDZU: boolean[];
  THIMBLERIG: boolean[];
  UI_TESTS_WEB: boolean[];
}

type JsonProof = {
  publicInput: string[];
  publicOutput: string[];
  maxProofsVerified: 0 | 1 | 2;
  proof: string;
};

export const lotteryBackendRouter = createTRPCRouter({
  getRoundInfo: publicProcedure
    .input(
      z.object({
        roundId: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      const roundInfo = await db.collection('rounds').findOne({
        roundId: input.roundId,
      });

      return {
        proof: roundInfo?.dp as JsonProof,
        total: roundInfo?.total as number,
      };
    }),
  getMinaEvents: publicProcedure
    .input(z.object({}))
    .query(async ({ ctx, input }) => {
      const events = await db.collection('mina_events').find({}).toArray();

      return {
        events: events,
      };
    }),
});
