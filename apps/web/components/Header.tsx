import { NETWORKS } from "@/app/constants/networks";
import protokit from "@/public/protokit-zinc.svg";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
// @ts-ignore
import truncateMiddle from "truncate-middle";

export interface HeaderProps {
    walletInstalled: boolean;
    balance?: number;
    address?: string;
    onConnectWallet: () => void;
    currentGame: string
}

export default function Header({
    address,
    balance,
    onConnectWallet,
    walletInstalled,
    currentGame
}: HeaderProps) {
    const [expanded, setExpanded] = useState(false);
    const [network, setNetwork] = useState('Mainnet');

    const switchNetwork = async (chainId: string) => {
        await (window as any).mina.switchChain({
            chainId
        });
        setNetwork(chainId);
    }

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
                    <div className="w-44" onClick={walletInstalled ? onConnectWallet : () => { }}>
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
                            Balance: {balance || 0} 🪙
                        </div>
                    </div>
                    <div>
                        <div className="cursor-pointer" onClick={() => setExpanded(!expanded)}>{network}</div>
                        {expanded && (
                            <div className="flex flex-col items-center w-40 py-5 absolute bg-slate-300  text-xs rounded-xl right-5 top-20">
                                {NETWORKS.map(network => (
                                    <div
                                        className="cursor-pointer h-full w-full hover:bg-slate-400 py-3 px-7"
                                        onClick={() => switchNetwork(network.chainId)}
                                    >
                                        {network.name}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
