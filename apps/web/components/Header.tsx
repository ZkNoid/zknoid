import { NETWORKS } from "@/app/constants/networks";
import protokit from "@/public/protokit-zinc.svg";
import Image from "next/image";
import Link from "next/link";
// @ts-ignore
import truncateMiddle from "truncate-middle";
import { NetworkPicker } from "./NetworkPicker";
import { DepositMenuItem } from "./DepositMenuItem";

export interface HeaderProps {
    walletInstalled: boolean;
    minaBalance?: string;
    protokitBalance?: string;
    address?: string;
    connectWallet: () => void;
    currentGame: string
}

export default function Header({
    address,
    minaBalance,
    protokitBalance,
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
                        
                    </div>
                    <div className="flex gap-5 items-center">
                            <div className="flex flex-col w-60">
                                <div>
                                    {minaBalance ? (parseInt(minaBalance) / 10 ** 9).toFixed(2) : 0} MINA
                                </div>
                                <div>
                                    {protokitBalance ? (parseInt(protokitBalance) / 10 ** 9).toFixed(2) : 0} 🪙 
                                    <DepositMenuItem />
                                </div>
                            </div>
                        </div>
                    <NetworkPicker autoconnect={true} />
                </div>
            </div>
        </div>
    );
}
