import { api } from "../../../../packages/sdk/trpc/react";

export default function useLeaderboard(gameId: string) {
  const leaderboardData = api.leaderboard.getLeaderboard.useQuery({
    gameId: gameId,
  }).data;
  const setLeaderboardItemMutation =
    api.leaderboard.setLeaderboardItem.useMutation();

  return { leaderboardData, setLeaderboardItemMutation };
}
