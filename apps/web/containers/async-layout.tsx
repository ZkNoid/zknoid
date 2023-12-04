import Header from "@/components/header";
import { Toaster } from "@/components/ui/toaster";
import { useClientStore } from "@/lib/stores/client";
import { useNotifyTransactions, useWalletStore } from "@/lib/stores/wallet";
import { ReactNode, useEffect, useMemo } from "react";

export default function AsyncLayout({ children }: { children: ReactNode }) {
  const wallet = useWalletStore();
  const client = useClientStore();
  useNotifyTransactions();

  useEffect(() => {
    client.start();
  }, []);

  useEffect(() => {
    wallet.initializeWallet();
    wallet.observeWalletChange();
  }, []);

  return (
    <>
      <Header
        loading={false}
        wallet={wallet.wallet}
        onConnectWallet={wallet.connectWallet}
        blockHeight={"0"}
      />
      {children}
      <Toaster />
    </>
  );
}
