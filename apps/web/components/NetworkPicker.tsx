import { NETWORKS } from "@/app/constants/networks";
import { useNetworkStore } from "@/lib/stores/network";
import { walletInstalled } from "@/lib/helpers";
import { useEffect, useState } from "react";
import { HeaderCard } from "./ui/games-store/HeaderCard";
import { useRegisterWorkerClient } from "@/lib/stores/workerClient";

export default function NetworkPicker() {
    const [expanded, setExpanded] = useState(false);
    const networkStore = useNetworkStore();
    useRegisterWorkerClient();
    
    
    const switchNetwork = async (chainId: string) => {
        await (window as any).mina.switchChain({
            chainId
        });

        networkStore.setNetwork(chainId);
        setExpanded(false);
    }

    useEffect(() => {
        if (!walletInstalled()) return;

        (async () => {
        
            const listener = ({chainId, name}: {chainId: string, name: string}) => {
                networkStore.setNetwork(chainId);
            };

            (window.mina as any).on('chainChanged', listener);

            return () => {
                (window.mina as any).removeListener(listener);
            }
        })();
    }, [networkStore.walletConnected]);

    useEffect(() => {
        if (!walletInstalled()) return;

        (async () => {
            const [account] = await (window as any).mina.requestAccounts();

            networkStore.onWalletConnected(account);

            const listener = (accounts: string[]) => {
                const [account] = accounts;
                networkStore.onWalletConnected(account);
            };

            (window.mina as any).on('accountsChanged', listener);

            return () => {
                (window.mina as any).removeListener(listener);
            }
        })();
    }, []);

    return (
        <div>
            <HeaderCard 
                image="/image/cards/mina.png" 
                text={networkStore.minaNetwork?.name || 'Unsupported network'} 
                onClick={() => setExpanded(!expanded)} toggle={true} 
                isMiddle={true}
            />
            {expanded && (
                <div className="flex flex-col items-center w-30 py-3 absolute bg-left-accent  text-xs rounded-xl top-20">
                    {NETWORKS.map(network => (
                        <div
                            key={network.chainId}
                            className="cursor-pointer h-full w-full hover:bg-slate-400 py-3 px-7"
                            onClick={() => switchNetwork(network.chainId)}
                        >
                            {network.name}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}