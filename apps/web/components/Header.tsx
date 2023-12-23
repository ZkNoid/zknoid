import protokit from "@/public/protokit-zinc.svg";
import Image from "next/image";
// @ts-ignore
import truncateMiddle from "truncate-middle";

export interface HeaderProps {
    balance?: number;
    address?: string;
    onConnectWallet: () => void;
}

export default function Header({
    address,
    balance,
    onConnectWallet,
}: HeaderProps) {
    return (
        <div className="flex items-center justify-between border-b p-2 shadow-sm">
            <div className="container flex">
                <div className="flex basis-6/12 items-center justify-start">
                    <Image className="h-8 w-8" src={protokit} alt={"Protokit logo"} />
                </div>
                <div className="flex basis-6/12 flex-row items-center justify-end">
                    <div className="w-44" onClick={onConnectWallet}>
                        <div>
                            {address ? truncateMiddle(address, 7, 7, "...") : "Connect wallet"}
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
