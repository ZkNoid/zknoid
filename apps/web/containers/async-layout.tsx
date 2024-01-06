import { GameType } from "@/app/constants/games";
import Header from "@/components/Header";
import { useClientStore } from "@/lib/stores/client";
import { useMinaBalancesStore, useObserveMinaBalance } from "@/lib/stores/minaBalances";
import { usePollMinaBlockHeight } from "@/lib/stores/minaChain";
import { useNetworkStore } from "@/lib/stores/network";
import { useProtokitBalancesStore } from "@/lib/stores/protokitBalances";
import { usePollProtokitBlockHeight } from "@/lib/stores/protokitChain";
import { useNotifyTransactions, useWalletStore } from "@/lib/stores/wallet";
import { PublicKey } from "o1js";
import { ReactNode, useEffect, useMemo, useState } from "react";

export default function AsyncLayout({ children }: { children: ReactNode }) {
  const client = useClientStore();
  const networkStore = useNetworkStore();
  useNotifyTransactions();

  useEffect(() => {
    client.start();
  }, []);

  usePollMinaBlockHeight();
  usePollProtokitBlockHeight();
  useObserveMinaBalance();

  const minaBalances = useMinaBalancesStore();
  const protokitBalances = useProtokitBalancesStore();

  return (
    <div className={"flex flex-col min-h-screen"}>
      <Header
        address={networkStore.address}
        connectWallet={networkStore.connectWallet}
        minaBalance={networkStore.address ? minaBalances.balances[networkStore.address] : "0"}
        protokitBalance={networkStore.address ? protokitBalances.balances[networkStore.address] : "0"}
        walletInstalled={networkStore.walletInstalled()}
        currentGame={GameType.Arkanoid}
      />
      {children}
      {/* <Toaster /> */}
    </div>
  );
}
