import clientPromise from '@/app/lib/mongodb';

import { z } from 'zod';

import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';
import telegramBot from '@/app/lib/telegram_bot';
import { formatUnits } from '@/lib/unit';

const client = await clientPromise;
const db = client.db(process.env.MONGODB_DB);

// Current game, hostname,
const EnvContext = z.record(z.string(), z.string());

const settings = process.env.NOTIFICATIONS_VERSION
  ? (
      await db.collection('notifications').findOne({
        version: process.env.NOTIFICATIONS_VERSION,
      })
    )?.settings ?? {}
  : {};

export const loggingRouter = createTRPCRouter({
  logWalletConnected: publicProcedure
    .input(z.object({ envContext: EnvContext, userAddress: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const event = 'wallet_connected';

      const savedLog = await db.collection('logs').findOne(
        {
          event,
          userAddress: input.userAddress,
        },
        {
          sort: {
            _id: -1,
          },
        }
      );
      if (!savedLog || Date.now() - savedLog.time > 1000 * 60 * 60) {
        if (settings?.[event] && process.env.MAIN_CHAT_ID) {
          if (
            (settings[event].allowed_domains || []).includes(
              input.envContext.hostname
            )
          ) {
            await telegramBot.sendMessage(
              process.env.MAIN_CHAT_ID,
              `👝 Wallet connected: ${input.userAddress}`
            );
          }
        }
        await db.collection('logs').insertOne({
          event,
          env: input.envContext,
          userAddress: input.userAddress,
          time: Date.now(),
        });
      }
      return {
        ok: true,
      };
    }),
  logTestBalanceRecevied: publicProcedure
    .input(
      z.object({
        envContext: EnvContext,
        userAddress: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const event = 'test_balance_received';
      if (settings?.[event] && process.env.MAIN_CHAT_ID) {
        if (
          (settings[event].allowed_domains || []).includes(
            input.envContext.hostname
          )
        ) {
          await telegramBot.sendMessage(
            process.env.MAIN_CHAT_ID,
            `🚰 Test balance collected: ${input.userAddress}`
          );
        }
      }

      await db.collection('logs').insertOne({
        event,
        hostname: input.envContext,
        userAddress: input.userAddress,
      });
      return {
        ok: true,
      };
    }),
  logBridged: publicProcedure
    .input(
      z.object({
        envContext: EnvContext,
        amount: z.bigint(),
        userAddress: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const event = 'tokens_bridged';
      if (settings?.[event] && process.env.MAIN_CHAT_ID) {
        if (
          (settings[event].allowed_domains || []).includes(
            input.envContext.hostname
          )
        ) {
          await telegramBot.sendMessage(
            process.env.MAIN_CHAT_ID,
            `🚰 Bridged ${formatUnits(input.amount)} tokens by ${
              input.userAddress
            }`
          );
        }
      }

      await db.collection('logs').insertOne({
        event,
        hostname: input.envContext,
        amount: input.amount,
        userAddress: input.userAddress,
      });

      return {
        ok: true,
      };
    }),
  logMatchmakingEntered: publicProcedure
    .input(
      z.object({
        envContext: EnvContext,
        amount: z.bigint(),
        gameId: z.string(),
        userAddress: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const event = 'matchmaking_entered';
      if (settings?.[event] && process.env.MAIN_CHAT_ID) {
        if (
          (settings[event].allowed_domains || []).includes(
            input.envContext.hostname
          )
        ) {
          await telegramBot.sendMessage(
            process.env.MAIN_CHAT_ID,
            `🚰 Test balance connected: ${input.userAddress}`
          );
        }
      }

      await db.collection('logs').insertOne({
        event,
        hostname: input.envContext,
        amount: input.amount,
        userAddress: input.userAddress,
      });

      return {
        ok: true,
      };
    }),

  logGameOpened: publicProcedure
    .input(
      z.object({
        envContext: EnvContext,
        userAddress: z.string(),
        gameId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const event = 'game_opened';

      const savedLog = await db.collection('logs').findOne(
        {
          event,
          userAddress: input.userAddress,
          gameId: input.gameId,
        },
        {
          sort: {
            _id: -1,
          },
        }
      );
      if (!savedLog || Date.now() - savedLog.time > 1000 * 60 * 60) {
        if (settings?.[event] && process.env.MAIN_CHAT_ID) {
          if (
            (settings[event].allowed_domains || []).includes(
              input.envContext.hostname
            )
          ) {
            await telegramBot.sendMessage(
              process.env.MAIN_CHAT_ID,
              `🎮 Game opened <b>${input.gameId}</b> by ${input.userAddress}`,
              {
                parse_mode: 'HTML',
              }
            );
          }
        }
        await db.collection('logs').insertOne({
          event,
          env: input.envContext,
          userAddress: input.userAddress,
          gameId: input.gameId,
          time: Date.now(),
        });
      }
      return {
        ok: true,
      };
    }),

  logGameStarted: publicProcedure
    .input(
      z.object({
        envContext: EnvContext,
        userAddress: z.string(),
        gameId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const event = 'game_started';

      if (settings?.[event] && process.env.MAIN_CHAT_ID) {
        if (
          (settings[event].allowed_domains || []).includes(
            input.envContext.hostname
          )
        ) {
          await telegramBot.sendMessage(
            process.env.MAIN_CHAT_ID,
            `🟩 Game started <b>${input.gameId}</b> by ${input.userAddress}`,
            {
              parse_mode: 'HTML',
            }
          );
        }
      }
      await db.collection('logs').insertOne({
        event,
        env: input.envContext,
        userAddress: input.userAddress,
        gameId: input.gameId,
        time: Date.now(),
      });

      return {
        ok: true,
      };
    }),
});
