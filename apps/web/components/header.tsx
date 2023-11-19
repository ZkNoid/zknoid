import { Button } from "@/components/ui/button";
import protokit from "@/public/protokit-zinc.svg";
import Image from "next/image";
// @ts-ignore
import truncateMiddle from "truncate-middle";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "./ui/separator";

export interface HeaderProps {
  loading: boolean;
  wallet?: string;
  onConnectWallet: () => void;
  blockHeight?: string;
}

export default function Header({
  loading,
  wallet,
  onConnectWallet,
  blockHeight,
}: HeaderProps) {
  return (
    <div className="flex items-center justify-between border-b p-2 shadow-sm">
      <div className="container flex">
        <div className="flex basis-6/12 items-center justify-start">
          <Image className="h-8 w-8" src={protokit} alt={"Protokit logo"} />          
        </div>
        <div className="flex basis-6/12 flex-row items-center justify-end">
          {/* balance */}

          {/* connect wallet */}
          <Button loading={loading} className="w-44" onClick={onConnectWallet}>
            <div>
              {wallet ? truncateMiddle(wallet, 7, 7, "...") : "Connect wallet"}
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
}
