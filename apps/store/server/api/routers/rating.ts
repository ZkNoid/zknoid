import clientPromise from '@/app/lib/mongodb';

import { z } from 'zod';

import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';

const client = await clientPromise;
const db = client.db(process.env.MONGODB_DB);

export const ratingsRouter = createTRPCRouter({
  getGameRating: publicProcedure
    .input(z.object({ gameId: z.string() }))
    .query(async ({ ctx, input }) => {
      const aggregated = await db
        .collection('ratings')
        .aggregate([
          {
            $match: {
              gameId: input.gameId,
            },
          },
          {
            $group: {
              _id: null,
              sum: {
                $avg: '$rating',
              },
            },
          },
        ])
        .toArray();

      return {
        rating: aggregated?.[0]?.sum ?? 0,
      };
    }),

  setGameFeedback: publicProcedure
    .input(
      z.object({
        userAddress: z.string(),
        gameId: z.string(),
        feedback: z.string(),
        rating: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await db.collection('ratings').updateOne(
        { gameId: input.gameId, userAddress: input.userAddress },
        {
          $set: {
            rating: input.rating,
            feedback: input.feedback,
          },
        },
        {
          upsert: true,
        }
      );
      return {
        gameId: input.gameId,
        userAddress: input.userAddress,
        rating: input.rating,
        feedback: input.feedback,
      };
    }),
});
