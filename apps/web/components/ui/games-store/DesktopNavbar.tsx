'use client';

import Image from "next/image";
import { useNetworkStore } from "@/lib/stores/network";
import dynamic from "next/dynamic";
import { HeaderCard } from "./HeaderCard";
import { useEffect } from "react";
import { walletInstalled } from "@/lib/helpers";
import Link from "next/link";
import { useRegisterWorkerClient } from "@/lib/stores/workerClient";

const BalanceInfo = dynamic(() => import("@/components/ui/games-store/BalanceInfo"), {
    ssr: false,
});

const NetworkPicker = dynamic(() => import("@/components/NetworkPicker"), {
    ssr: false
});

export default function DesktopNavbar({ autoconnect }: { autoconnect: boolean }) {
    const networkStore = useNetworkStore();

    useEffect(() => {
        if (!walletInstalled()) return;

        if (autoconnect) {
            networkStore.connectWallet();
        }
    }, []);

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
                            <HeaderCard image="/image/cards/account.svg" isMiddle={true} text={networkStore.address!.substring(0, 10) + '..'} />
                            <NetworkPicker />
                        </>
                    ) : walletInstalled() ? (
                        <HeaderCard image="/image/cards/account.svg" text="Connect wallet" isMiddle={true} onClick={() => {
                            networkStore.connectWallet();
                        }} />
                    ) : (
                        <Link
                            href="https://www.aurowallet.com/"
                        >
                            <HeaderCard image="/image/cards/account.svg" text="Install wallet" isMiddle={true} onClick={() => {
                                networkStore.connectWallet();
                            }} />
                        </Link>
                    )}
                </div>
            </div>
        </header>
    )
}