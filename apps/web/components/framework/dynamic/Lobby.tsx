// 'use client';
//
// import { useEffect, useMemo } from 'react';
//
// import { zkNoidConfig } from '@/games/config';
// import AppChainClientContext from '@/lib/contexts/AppChainClientContext';
// import { api } from '@/trpc/react';
// import { useNetworkStore } from '@/lib/stores/network';
// import { getEnvContext } from '@/lib/envContext';
// import { ZkNoidGameType } from '@/lib/platform/game_types';
//
// export default function Page({
//   gameId,
//   lobbyId,
// }: {
//   gameId: string;
//   lobbyId: string;
// }) {
//   const config = useMemo(
//     () =>
//       zkNoidConfig.games.find(
//         (game) => game.id == gameId && game.type == ZkNoidGameType.PVP
//       )!,
//     []
//   );
//   const client = useMemo(() => zkNoidConfig.getClient(), []);
//   const networkStore = useNetworkStore();
//   const logGameOpenedMutation = api.logging.logGameOpened.useMutation();
//
//   useEffect(() => {
//     if (networkStore.address) {
//       logGameOpenedMutation.mutate({
//         userAddress: networkStore.address,
//         gameId,
//         envContext: getEnvContext(),
//       });
//     }
//   }, [networkStore.address]);
//
//   return (
//     <AppChainClientContext.Provider value={client}>
//       <config.lobby
//         params={{
//           lobbyId: lobbyId
//         }}
//       />
//     </AppChainClientContext.Provider>
//   );
// }

'use client';

import { useMemo } from 'react';

import { zkNoidConfig } from '@/games/config';
import AppChainClientContext from '@/lib/contexts/AppChainClientContext';

export default function Page({
  gameId,
  lobbyId,
}: {
  gameId: string;
  lobbyId: string;
}) {
  const config = useMemo(
    () => zkNoidConfig.games.find((game) => game.id == gameId)!,
    []
  );
  const client = useMemo(() => zkNoidConfig.getClient(), []);

  const Lobby = config.lobby!;

  return (
    <AppChainClientContext.Provider value={client}>
      <Lobby params={{ lobbyId: lobbyId }} />
    </AppChainClientContext.Provider>
  );
}
