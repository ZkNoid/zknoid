import { GameType } from "@/app/constants/games";
import { Footer } from "@/components/Footer";
import Header from "@/components/Header";
import { useClientStore } from "@/lib/stores/client";
import { useNotifyTransactions, useWalletStore } from "@/lib/stores/wallet";
import { walletInstalled } from "@/lib/utils";
import { PublicKey } from "o1js";
import { ReactNode, useEffect, useMemo, useState } from "react";

export default function AsyncLayout({ children }: { children: ReactNode }) {
  const wallet = useWalletStore();
  const [balance, setBalance] = useState("0");
  const client = useClientStore();
  useNotifyTransactions();

  useEffect(() => {
    client.start();
  }, []);

  useEffect(() => {
    if (client.client && wallet?.wallet)
      client.client!.query.runtime.Balances.balances.get(PublicKey.fromBase58(wallet!.wallet!))
    .then(balance => setBalance(balance?.toString() || "0"));
  }, [client]);


  useEffect(() => {
    if (!walletInstalled()) {
      return;
    }
    wallet.initializeWallet();
    wallet.observeWalletChange();
  }, []);

  return (
    <div className={"flex flex-col min-h-screen"}>
      <Header
        address={wallet.wallet}
        onConnectWallet={wallet.connectWallet}
        balance={parseInt(balance)}
        walletInstalled={walletInstalled()}
        currentGame={GameType.Arkanoid}
      />
      {children}
      {/* <Toaster /> */}
    </div>
  );
}
