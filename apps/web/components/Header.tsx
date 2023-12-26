import protokit from "@/public/protokit-zinc.svg";
import Image from "next/image";
import Link from "next/link";
// @ts-ignore
import truncateMiddle from "truncate-middle";

export interface HeaderProps {
    walletInstalled: boolean;
    balance?: number;
    address?: string;
    onConnectWallet: () => void;
}

export default function Header({
    address,
    balance,
    onConnectWallet,
    walletInstalled
}: HeaderProps) {
    return (
        <div className="flex items-center justify-between border-b p-2 shadow-sm">
            <div className="container flex">
                <div className="flex basis-6/12 items-center justify-start gap-10">
                    <Image className="h-8 w-8" src={protokit} alt={"Protokit logo"} />
                    <div className="cursor-pointer">Competitions</div>
                </div>
                <div className="flex basis-6/12 flex-row items-center justify-end">
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
                </div>
            </div>
        </div>
    );
}
