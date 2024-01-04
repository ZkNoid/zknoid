import { NETWORKS } from "@/app/constants/networks";
import protokit from "@/public/protokit-zinc.svg";
import Image from "next/image";
import Link from "next/link";
// @ts-ignore
import truncateMiddle from "truncate-middle";
import { NetworkPicker } from "./NetworkPicker";
import { usePollBlockHeight } from "@/lib/stores/minaChain";
import { useBalancesStore, useObserveBalance } from "@/lib/stores/minaBalances";

export interface HeaderProps {
    walletInstalled: boolean;
    balance?: string;
    address?: string;
    connectWallet: () => void;
    currentGame: string
}

export default function Header({
    address,
    balance,
    connectWallet,
    walletInstalled,
    currentGame
}: HeaderProps) {
    return (
        <div className="flex items-center justify-between border-b p-2 shadow-sm">
            <div className="container flex">
                <div className="flex basis-6/12 items-center justify-start gap-10">
                    <Link href={`/${currentGame}/global`}>
                        <Image className="h-8 w-8" src={protokit} alt={"ZkNoid logo"} />
                    </Link>
                    <Link href={`/${currentGame}/new-competition`}>
                        <div className="cursor-pointer">Create competition</div>
                    </Link>
                </div>
                <div className="flex basis-6/12 flex-row items-center justify-end gap-10">
                    <div className="w-44" onClick={() => walletInstalled && connectWallet()}>
                        <div>
                            {
                                address ?
                                    truncateMiddle(address, 7, 7, "...") :
                                    walletInstalled ? "Connect wallet" : (
                                        <Link href="https://www.aurowallet.com/"
                                            rel="noopener noreferrer" target="_blank">
                                            Install wallet
                                        </Link>
                                    )
                            }
                        </div>
                        <div>
                            Balance: {balance ? (parseInt(balance) / 10**9).toFixed(2) : 0} 🪙
                        </div>
                    </div>
                    <NetworkPicker autoconnect={true} />
                </div>
            </div>
        </div>
    );
}
