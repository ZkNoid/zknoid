import { CHUNK_LENGTH, GameInputs, Tick } from "zknoid-chain-dev";
import { Bool, Field, Int64, PublicKey, UInt64 } from "o1js";
import { getEnvContext } from "@zknoid/sdk/lib/envContext";
import { ITick } from "../components/GameView";
import { useWorkerClientStore } from "@zknoid/sdk/lib/stores/workerClient";
import { ICompetition } from "@zknoid/sdk/lib/types";
import { useContext } from "react";
import ZkNoidGameContext from "@zknoid/sdk/lib/contexts/ZkNoidGameContext";
import { useNetworkStore } from "@zknoid/sdk/lib/stores/network";
import { api } from "@zknoid/sdk/trpc/react";
// import { type PendingTransaction } from '@proto-kit/sequencer';

export const useProof = (
  lastTicks: ITick[],
  competition: ICompetition | undefined,
  score: number
) => {
  const workerClientStore = useWorkerClientStore();
  const networkStore = useNetworkStore();
  const { client } = useContext(ZkNoidGameContext);
  const progress = api.progress.setSolvedQuests.useMutation();

  if (!client) {
    throw Error("Context app chain client is not set");
  }

  return async () => {
    console.log("Ticks", lastTicks);

    const chunkenize = (arr: any[], size: number) =>
      Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
        arr.slice(i * size, i * size + size)
      );

    let chunks = chunkenize(
      lastTicks.map(
        (elem) =>
          //@ts-ignore
          new Tick({
            action: Int64.from(elem.action),
            momentum: Int64.from(elem.momentum),
          })
      ),
      CHUNK_LENGTH
    );

    //@ts-ignore
    let userInputs = chunks.map((chunk) => new GameInputs({ ticks: chunk }));

    try {
      const proof = await workerClientStore?.client?.proveGameRecord({
        seed: Field.from(competition!.seed),
        inputs: userInputs,
        debug: Bool(false),
      });

      console.log("Level proof", proof);

      const gameHub = client!.runtime.resolve("ArkanoidGameHub");

      const tx = await client!.transaction(
        PublicKey.fromBase58(networkStore.address!),
        async () => {
          gameHub.addGameResult(UInt64.from(competition!.id), proof!);
        }
      );

      await tx.sign();
      await tx.send();

      if (score > 90000) {
        await progress.mutateAsync({
          userAddress: networkStore.address!,
          section: "ARKANOID",
          roomId: competition?.id.toString(),
          id: 0,
          txHash: JSON.stringify((tx.transaction! as any).toJSON()),
          envContext: getEnvContext(),
        });
      }

      await progress.mutateAsync({
        userAddress: competition?.creator?.toBase58() || "",
        section: "ARKANOID",
        roomId: competition?.id.toString(),
        id: 2,
        txHash: JSON.stringify((tx.transaction! as any).toJSON()),
        envContext: getEnvContext(),
      });

      if ((competition?.id || 0) > 2) {
        await progress.mutateAsync({
          userAddress: networkStore.address!,
          section: "ARKANOID",
          roomId: competition?.id.toString(),
          id: 3,
          txHash: JSON.stringify((tx.transaction! as any).toJSON()),
          envContext: getEnvContext(),
        });
      }

      if (score > 90000 && (competition?.id || 0) > 2) {
        await progress.mutateAsync({
          userAddress: networkStore.address!,
          section: "ARKANOID",
          roomId: competition?.id.toString(),
          id: 4,
          txHash: JSON.stringify((tx.transaction! as any).toJSON()),
          envContext: getEnvContext(),
        });
      }
    } catch (e) {
      console.log("Error while generating ZK proof");
      console.log(e);
    }
  };
};
