import { PublicKey } from "o1js";
import { useContext, useEffect } from "react";
import { useProtokitChainStore } from "@zknoid/sdk/lib/stores/protokitChain";
import { useNetworkStore } from "@zknoid/sdk/lib/stores/network";
import ZkNoidGameContext from "@zknoid/sdk/lib/contexts/ZkNoidGameContext";
import { thimblerigConfig } from "../config";
import { type ClientAppChain } from "zknoid-chain-dev";
import { create } from "zustand";
import {
  MatchQueueState,
  matchQueueInitializer,
} from "@zknoid/sdk/lib/stores/matchQueue";

export const useThimblerigMatchQueueStore = create<
  MatchQueueState,
  [["zustand/immer", never]]
>(matchQueueInitializer);

export const useObserveThimblerigMatchQueue = () => {
  const chain = useProtokitChainStore();
  const network = useNetworkStore();
  const matchQueue = useThimblerigMatchQueueStore();
  const { client } = useContext(ZkNoidGameContext);

  const client_ = client as ClientAppChain<
    typeof thimblerigConfig.runtimeModules,
    any,
    any,
    any
  >;

  useEffect(() => {
    if (!network.walletConnected || !network.address || !chain.block?.height) {
      return;
    }

    if (!client) {
      throw Error("Context app chain client is not set");
    }

    matchQueue.loadMatchQueue(
      client_.query.runtime.ThimblerigLogic,
      chain.block?.height
    );
    matchQueue.loadActiveGame(
      client_.query.runtime.ThimblerigLogic,
      chain.block?.height,
      PublicKey.fromBase58(network.address!)
    );
  }, [chain.block?.height, network.walletConnected, network.address]);
};
