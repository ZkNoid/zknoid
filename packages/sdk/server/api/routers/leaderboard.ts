import clientPromise from "../../../lib/mongodb";

import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../../../server/api/trpc";

const client = await clientPromise;
const db = client.db(process.env.MONGODB_DB);

export const leaderboardRouter = createTRPCRouter({
  getLeaderboard: publicProcedure
    .input(z.object({ gameId: z.string() }))
    .query(async ({ input }) => {
      return {
        leaderboard: await db
          .collection("leaderboard")
          .find({
            gameId: input.gameId,
          })
          .toArray(),
      };
    }),

  setLeaderboardItem: publicProcedure
    .input(
      z.object({
        gameId: z.string(),
        userAddress: z.string(),
        amount: z.number(),
      }),
    )
    .mutation(async ({ input }) => {
      await db.collection("leaderboard").updateOne(
        { gameId: input.gameId, userAddress: input.userAddress },
        {
          $set: {
            amount: input.amount,
          },
        },
        {
          upsert: true,
        },
      );
      return {
        gameId: input.gameId,
        userAddress: input.userAddress,
        amount: input.amount,
      };
    }),
});
