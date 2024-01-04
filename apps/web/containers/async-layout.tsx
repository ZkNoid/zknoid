import { GameType } from "@/app/constants/games";
import { Footer } from "@/components/Footer";
import Header from "@/components/Header";
import { useClientStore } from "@/lib/stores/client";
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
    if (client.client && networkStore.adderss)
      client.client!.query.runtime.Balances.balances.get(PublicKey.fromBase58(networkStore.adderss))
    .then(balance => setBalance(balance?.toString() || "0"));
  }, [client]);


  return (
    <div className={"flex flex-col min-h-screen"}>
      <Header
        address={networkStore.adderss}
        connectWallet={networkStore.connectWallet}
        balance={parseInt(balance)}
        walletInstalled={networkStore.walletInstalled()}
        currentGame={GameType.Arkanoid}
      />
      {children}
      {/* <Toaster /> */}
    </div>
  );
}
