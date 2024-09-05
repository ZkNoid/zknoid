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

      if (!roundInfo) return null;

      return {
        id: roundInfo?.roundId,
        bank: BigInt(roundInfo?.roundId),
        tickets: roundInfo?.tickets
          .filter((x: any) => x.amount > 0)
          .map((ticket: any) => ({
            ...ticket,
            amount: BigInt(ticket.amount),
          })),
        winningCombination: roundInfo?.winningCombination,
        proof: roundInfo?.dp as JsonProof,
        total: roundInfo?.total as number,
      } as {
        id: number;
        bank: bigint;
        tickets: {
          amount: bigint;
          numbers: number[];
          owner: string;
          claimed: boolean;
          funds: bigint;
          hash: string;
        }[];
        winningCombination: number[] | undefined;
      };
    }),
  getRoundInfos: publicProcedure
    .input(
      z.object({
        roundIds: z.array(z.number()),
      })
    )
    .query(async ({ ctx, input }) => {
      const roundInfos = await db
        .collection('rounds')
        .find({
          roundId: {
            $in: input.roundIds,
          },
        })
        .toArray();

      const data = {} as Record<
        number,
        {
          id: number;
          bank: bigint;
          tickets: {
            amount: bigint;
            numbers: number[];
            owner: string;
            claimed: boolean;
            funds: bigint;
            hash: string;
          }[];
          winningCombination: number[] | undefined;
        }
      >;

      for (let i = 0; i < roundInfos.length; i++) {
        const roundInfo = roundInfos[i];
        data[roundInfos[i].roundId!] = {
          id: roundInfo?.roundId,
          bank: BigInt(roundInfo?.roundId),
          tickets: roundInfo?.tickets.map((ticket: any) => ({
            ...ticket,
            amount: BigInt(ticket.amount),
          })),
          winningCombination: !!roundInfo?.dp
            ? roundInfo?.winningCombination
            : [],
          total: roundInfo?.total as number,
        } as any;
      }

      return data;
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
