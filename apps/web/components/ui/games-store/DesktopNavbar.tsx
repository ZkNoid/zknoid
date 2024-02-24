'use client';

import Image from "next/image";
import { useNetworkStore } from "@/lib/stores/network";
import { useProtokitBalancesStore } from "@/lib/stores/protokitBalances";
import dynamic from "next/dynamic";
import { HeaderCard } from "./HeaderCard";

const BalanceInfo = dynamic(() => import("@/components/ui/games-store/BalanceInfo"), {
    ssr: false,
  });



export default function DesktopNavbar() {
    const networkStore = useNetworkStore();

    return (
        <header className="w-full h-[91px] px-3 lg:px-[50px] items-center flex">
            <div className={'flex w-full items-center justify-between'}>
                <Image
                    src={'/image/zknoid-logo.svg'}
                    alt={'ZkNoid logo'}
                    width={219}
                    height={47}
                />

                {networkStore.walletConnected && (
                    <BalanceInfo />
                )}

                <div className="flex gap-5">
                    {networkStore.walletConnected ? (
                        <>
                            <HeaderCard image="image/cards/account.svg" text={networkStore.address!.substring(0, 10) + '..'} />
                            <HeaderCard image="image/cards/mina.png" text="Mina network" toggle={true} />
                        </>
                    ) : (
                        <HeaderCard image="image/cards/account.svg" text="Connect wallet" onClick={() => {
                            networkStore.connectWallet();
                        }} />
                    )}
                </div>
            </div>
        </header>
    )
}