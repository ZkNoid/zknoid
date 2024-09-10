"use client";

import { PublicKey, UInt64 } from "o1js";
import { useContext } from "react";
import { useNetworkStore } from "@sdk/lib/stores/network";
import {
  useArkanoidCompetitionsStore,
  useObserveArkanoidCompetitions,
} from "../stores/arkanoidCompetitions";
import ZkNoidGameContext from "@sdk/lib/contexts/ZkNoidGameContext";
import GamePage from "@sdk/components/framework/GamePage";
import { arkanoidConfig } from "../config";
import Competitions from "../../../sdk/components/framework/Competitions";
import { ICompetition } from "@sdk/lib/types";
import ArkanoidCoverSVG from "../assets/game-cover.svg";
import ArkanoidCoverMobileSVG from "../assets/game-cover-mobile.svg";

export default function CompetitionsPage() {
  const networkStore = useNetworkStore();
  const compStore = useArkanoidCompetitionsStore();

  useObserveArkanoidCompetitions();

  const { client } = useContext(ZkNoidGameContext);

  if (!client) {
    throw Error("Context app chain client is not set");
  }

  const register = async (competitionId: number) => {
    const gameHub = client.runtime.resolve("ArkanoidGameHub");

    const tx = await client.transaction(
      PublicKey.fromBase58(networkStore.address!),
      async () => {
        gameHub.register(UInt64.from(competitionId));
      },
    );

    await tx.sign();
    await tx.send();
  };

  const getReward = async (competitionId: number) => {
    const gameHub = client.runtime.resolve("ArkanoidGameHub");

    const tx = await client.transaction(
      PublicKey.fromBase58(networkStore.address!),
      async () => {
        gameHub.getReward(UInt64.from(competitionId));
      },
    );

    await tx.sign();
    await tx.send();
  };

  const competitionBlocks: ICompetition[] = compStore.competitions.slice(0, 3);

  return (
    <GamePage
      gameConfig={arkanoidConfig}
      image={ArkanoidCoverSVG}
      mobileImage={ArkanoidCoverMobileSVG}
      defaultPage={"Competitions List"}
    >
      <Competitions
        gameId={arkanoidConfig.id}
        competitionBlocks={competitionBlocks}
        competitionList={compStore.competitions}
        register={register}
      />
    </GamePage>
  );
}
