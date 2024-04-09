import clientPromise from '@/app/lib/mongodb';

import { z } from 'zod';

import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';

const client = await clientPromise;
const db = client.db(process.env.MONGODB_DB);

export const favoritesRouter = createTRPCRouter({
  getFavoriteGames: publicProcedure
    .input(z.object({ userAddress: z.string() }))
    .query(async ({ ctx, input }) => {
      return {
        favorites: await db
          .collection('favorites')
          .find({
            userAddress: input.userAddress,
          })
          .toArray(),
      };
    }),

  setFavoriteGameStatus: publicProcedure
    .input(
      z.object({
        userAddress: z.string(),
        gameId: z.string(),
        status: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await db.collection('favorites').updateOne(
        { gameId: input.gameId, userAddress: input.userAddress },
        {
          $set: {
            status: input.status,
          },
        },
        {
          upsert: true,
        }
      );
      return {
        gameId: input.gameId,
        userAddress: input.userAddress,
        status: input.status,
      };
    }),
});
