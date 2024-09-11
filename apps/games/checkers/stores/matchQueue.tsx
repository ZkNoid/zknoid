import { PublicKey, UInt64 } from "o1js";
import { useContext, useEffect } from "react";
import { useProtokitChainStore } from "@zknoid/sdk/lib/stores/protokitChain";
import { useNetworkStore } from "@zknoid/sdk/lib/stores/network";
import ZkNoidGameContext from "@zknoid/sdk/lib/contexts/ZkNoidGameContext";
import { checkersConfig } from "../config";
import { type ClientAppChain } from "zknoid-chain-dev";
import {
  MatchQueueState,
  matchQueueInitializer,
} from "@zknoid/sdk/lib/stores/matchQueue";
import { create } from "zustand";
import { client } from "zknoid-chain-dev";

export const useCheckersMatchQueueStore = create<
  MatchQueueState,
  [["zustand/immer", never]]
>(matchQueueInitializer);

export const useObserveCheckersMatchQueue = () => {
  const chain = useProtokitChainStore();
  const network = useNetworkStore();
  const matchQueue = useCheckersMatchQueueStore();
  const { client } = useContext(ZkNoidGameContext);

  useEffect(() => {
    if (
      !network.walletConnected ||
      !network.address ||
      !network.protokitClientStarted
    ) {
      return;
    }

    if (!client) {
      throw Error("Context app chain client is not set");
    }

    const client_ = client as ClientAppChain<
      typeof checkersConfig.runtimeModules,
      any,
      any,
      any
    >;

    matchQueue.loadMatchQueue(
      client_.query.runtime.CheckersLogic,
      chain.block?.height ?? 0
    );
    matchQueue.loadActiveGame(
      client_.query.runtime.CheckersLogic,
      chain.block?.height ?? 0,
      PublicKey.fromBase58(network.address!)
    );
  }, [
    chain.block?.height,
    network.walletConnected,
    network.address,
    network.protokitClientStarted,
  ]);
};
