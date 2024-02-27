import { useEffect, useState } from 'react';

import { NETWORKS } from '@/app/constants/networks';
import { walletInstalled } from '@/lib/helpers';
import { useNetworkStore } from '@/lib/stores/network';

import { useRegisterWorkerClient } from '@/lib/stores/workerClient';

import { HeaderCard } from './ui/games-store/HeaderCard';

export default function NetworkPicker() {
  const [expanded, setExpanded] = useState(false);
  const networkStore = useNetworkStore();
  useRegisterWorkerClient();

  const switchNetwork = async (chainId: string) => {
    await (window as any).mina.switchChain({
      chainId,
    });

    networkStore.setNetwork(chainId);
    setExpanded(false);
  };

  useEffect(() => {
    if (!walletInstalled()) return;

    (async () => {
      const listener = ({
        chainId,
        name,
      }: {
        chainId: string;
        name: string;
      }) => {
        networkStore.setNetwork(chainId);
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
      const [account] = await (window as any).mina.requestAccounts();

      networkStore.onWalletConnected(account);

      const listener = (accounts: string[]) => {
        const [account] = accounts;
        networkStore.onWalletConnected(account);
      };

      (window.mina as any).on('accountsChanged', listener);

      return () => {
        (window.mina as any).removeListener(listener);
      };
    })();
  }, []);

  return (
    <div className="relative">
      <HeaderCard
        image="/image/cards/mina.png"
        text={networkStore.minaNetwork?.name || 'Unsupported network'}
        onClick={() => setExpanded(!expanded)}
        toggle={true}
        isMiddle={true}
      />
      {expanded && (
        <div className="absolute top-[-px2] flex w-full flex-col items-center rounded-b-xl bg-middle-accent text-xs">
          {NETWORKS.map((network) => (
            <div
              key={network.chainId}
              className="h-full w-full cursor-pointer px-7 py-3 text-black hover:bg-slate-400"
              onClick={() => switchNetwork(network.chainId)}
            >
              {network.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
