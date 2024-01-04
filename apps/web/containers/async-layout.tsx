import { GameType } from "@/app/constants/games";
import { Footer } from "@/components/Footer";
import Header from "@/components/Header";
import { useClientStore } from "@/lib/stores/client";
import { useBalancesStore, useObserveBalance } from "@/lib/stores/minaBalances";
import { usePollBlockHeight } from "@/lib/stores/minaChain";
import { useNetworkStore } from "@/lib/stores/network";
import { useNotifyTransactions, useWalletStore } from "@/lib/stores/wallet";
import { PublicKey } from "o1js";
import { ReactNode, useEffect, useMemo, useState } from "react";

export default function AsyncLayout({ children }: { children: ReactNode }) {
  const [balance, setBalance] = useState("0");
  const client = useClientStore();
  const networkStore = useNetworkStore();
  useNotifyTransactions();

  useEffect(() => {
    client.start();
  }, []);

  useEffect(() => {
    if (client.client && networkStore.address)
      client.client!.query.runtime.Balances.balances.get(PublicKey.fromBase58(networkStore.address))
    .then(balance => setBalance(balance?.toString() || "0"));
  }, [client]);

  usePollBlockHeight();
  useObserveBalance();

  const balances = useBalancesStore();

  return (
    <div className={"flex flex-col min-h-screen"}>
      <Header
        address={networkStore.address}
        connectWallet={networkStore.connectWallet}
        balance={networkStore.address ? balances.balances[networkStore.address] : "0"}
        walletInstalled={networkStore.walletInstalled()}
        currentGame={GameType.Arkanoid}
      />
      {children}
      {/* <Toaster /> */}
    </div>
  );
}
