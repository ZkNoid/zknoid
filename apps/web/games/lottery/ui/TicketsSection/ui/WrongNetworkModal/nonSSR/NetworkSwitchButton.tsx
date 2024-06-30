import {useNetworkStore} from "@/lib/stores/network";
import {useRegisterWorkerClient} from "@/lib/stores/workerClient";
import {ALL_NETWORKS, Network, NetworkIds, NETWORKS} from "@/app/constants/networks";
import {requestAccounts, walletInstalled} from "@/lib/helpers";
import {useEffect} from "react";

export default function NetworkSwitchButton() {
    const networkStore = useNetworkStore();
    useRegisterWorkerClient();

    const switchNetwork = async (network: Network) => {
        console.log('Switching to', network);
        try {
            await (window as any).mina.switchChain({
                networkID: network.networkID,
            });
            networkStore.setNetwork(network);
        } catch (e: any) {
            if (e?.code == 1001) {
                await requestAccounts();
                await switchNetwork(network);
            }
            throw e;
        }
    };

    useEffect(() => {
        if (!walletInstalled()) return;

        (async () => {
            const listener = ({
                                  networkID,
                                  name,
                              }: {
                networkID: string;
                name: string;
            }) => {
                const minaNetwork = ALL_NETWORKS.find((x) =>
                    networkID != 'unknown' ? x.networkID == networkID : x.name == name
                );
                networkStore.setNetwork(minaNetwork);
            };

            (window.mina as any).on('chainChanged', listener);

            return () => {
                (window.mina as any).removeListener(listener);
            };
        })();
    }, [networkStore.walletConnected]);

    useEffect(() => {
        if (!walletInstalled()) return;

        (async () => {
            const listener = (accounts: string[]) => {
                const [account] = accounts;
                if (networkStore.minaNetwork?.networkID)
                    networkStore.setNetwork(networkStore.minaNetwork);
                networkStore.onWalletConnected(account);
            };

            (window.mina as any).on('accountsChanged', listener);

            return () => {
                (window.mina as any).removeListener(listener);
            };
        })();
    }, []);
    return (
        <button onClick={() => switchNetwork(NETWORKS[NetworkIds.MINA_DEVNET])} className={'text-bg-dark bg-left-accent p-[0.5vw] hover:opacity-80 rounded-[0.26vw] w-full text-[0.833vw] font-museo font-medium text-center'}>
            Switch to Devnet
        </button>
    )
}