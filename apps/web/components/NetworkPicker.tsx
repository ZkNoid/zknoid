import { NETWORKS } from "@/app/constants/networks";
import { useNetworkStore } from "@/lib/stores/network";
import { useEffect, useState } from "react";

export const NetworkPicker = ({autoconnect}: {autoconnect: boolean}) => {
    const [expanded, setExpanded] = useState(false);
    const networkStore = useNetworkStore();
    
    const switchNetwork = async (chainId: string) => {
        await (window as any).mina.switchChain({
            chainId
        });

        networkStore.setNetwork(chainId);
        setExpanded(false);
    }

    useEffect(() => {
        (async () => {
            const network = await (window as any).mina.requestNetwork();
            networkStore.setNetwork(network.chainId);

            const listener = ({chainId, name}: {chainId: string, name: string}) => {
                networkStore.setNetwork(chainId);
            };

            (window.mina as any).on('chainChanged', listener);

            return () => {
                (window.mina as any).removeListener(listener);
            }
        })();
    }, []);

    useEffect(() => {
        (async () => {
            const [account] = await (window as any).mina.requestAccounts();

            networkStore.setAddress(account);

            const listener = (accounts: string[]) => {
                const [account] = accounts;
                networkStore.setAddress(account);
            };

            (window.mina as any).on('accountsChanged', listener);

            return () => {
                (window.mina as any).removeListener(listener);
            }
        })();
    }, []);

    useEffect(() => {
        if (autoconnect) {
            networkStore.connectWallet();
        }
    }, []);

    return (
        <div>
            <div className="cursor-pointer" onClick={() => setExpanded(!expanded)}>{networkStore.minaNetwork?.name || 'Unsupported network'}</div>
            {expanded && (
                <div className="flex flex-col items-center w-30 py-3 absolute bg-slate-200  text-xs rounded-xl top-20">
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
    )
}