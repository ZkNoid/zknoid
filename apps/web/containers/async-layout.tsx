import { GameType } from "@/app/constants/games";
import Header from "@/components/Header";
import { useClientStore } from "@/lib/stores/client";
import { useMinaBalancesStore, useObserveMinaBalance } from "@/lib/stores/minaBalances";
import { usePollMinaBlockHeight } from "@/lib/stores/minaChain";
import { useNetworkStore } from "@/lib/stores/network";
import { useObserveProtokitBalance, useProtokitBalancesStore } from "@/lib/stores/protokitBalances";
import { usePollProtokitBlockHeight } from "@/lib/stores/protokitChain";
import { PublicKey } from "o1js";
import { ReactNode, useEffect, useMemo, useState } from "react";

export default function AsyncLayout({ children }: { children: ReactNode }) {

  return (
    <div className={"flex flex-col min-h-screen"}>
      {children}
      {/* <Toaster /> */}
    </div>
  );
}
