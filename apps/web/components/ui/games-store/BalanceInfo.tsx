import { useNetworkStore } from "@/lib/stores/network";
import { useProtokitBalancesStore } from "@/lib/stores/protokitBalances";
import { HeaderCard } from "./HeaderCard";
import { usePollMinaBlockHeight } from "@/lib/stores/minaChain";
import { useMinaBalancesStore, useObserveMinaBalance } from "@/lib/stores/minaBalances";

export default function BalanceInfo() {
    const minaBalancesStore = useMinaBalancesStore();
    const networkStore = useNetworkStore();
    usePollMinaBlockHeight();
    useObserveMinaBalance();
    const protokitBalancesStore = useProtokitBalancesStore();

    return (
        <>
            {networkStore.walletConnected && (
                <div className="flex text-base gap-5 items-center">
                    <div className="flex flex-col items-end">
                        <div>Deposit: {(Number(protokitBalancesStore.balances[networkStore.address!] ?? 0n) / 10 ** 9).toFixed(2)}</div>
                        <div>{(Number(minaBalancesStore.balances[networkStore.address!] ?? 0n) / 10 ** 9).toFixed(2)} Mina</div>
                    </div>
                    <div>
                        <HeaderCard image="/image/cards/top-up.svg" text="Top up" />
                    </div>
                </div>
            )}
        </>
    )
}