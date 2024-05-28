import { useEffect, useState } from 'react';

import { NETWORKS, Network } from '@/app/constants/networks';
import { walletInstalled } from '@/lib/helpers';
import { useNetworkStore } from '@/lib/stores/network';

import { useRegisterWorkerClient } from '@/lib/stores/workerClient';

import { HeaderCard } from './ui/games-store/HeaderCard';
import { AnimatePresence, motion } from 'framer-motion';
import NetworkPickerCard from './ui/games-store/header/NetworkPickerCard';

export default function NetworkPicker() {
  const [expanded, setExpanded] = useState(false);
  const networkStore = useNetworkStore();
  useRegisterWorkerClient();

  const switchNetwork = async (network: Network) => {
    console.log('Switching to', network);
    try {
      if (network.chainId == 'zeko') {
        (window.mina as any).addChain({
          url: 'https://devnet.zeko.io/graphql',
          name: 'Zeko',
        });
      }

      await (window as any).mina.switchChain({
        chainId: network.chainId,
      });
      networkStore.setNetwork(network);
      setExpanded(false);
    } catch (e: any) {
      if (e?.code == 1001) {
        await (window as any).mina.requestAccounts();
        await switchNetwork(network)
      }
      throw e;
    }
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
        const minaNetwork = NETWORKS.find((x) =>
          chainId != 'unknown' ? x.chainId == chainId : x.name == name
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
        if (networkStore.minaNetwork?.chainId)
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
    <div className="relative">
      <NetworkPickerCard
        text={networkStore.minaNetwork?.name || 'Unsupported network'}
        onClick={() => setExpanded(!expanded)}
        toggle={true}
        expanded={expanded}
      />
      <AnimatePresence initial={false} mode={'wait'}>
        {expanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ type: 'spring', duration: 0.4, bounce: 0 }}
            className="absolute top-[95%] flex w-full flex-col items-center overflow-hidden rounded-b border border-middle-accent bg-bg-dark"
          >
            {NETWORKS.map((network) => (
              <div
                key={network.chainId}
                className="flex h-full w-full cursor-pointer flex-row items-center gap-2 py-3 pl-2 text-header-menu text-middle-accent transition duration-75 ease-in last:rounded-b hover:bg-middle-accent/20"
                onClick={() => switchNetwork(network)}
              >
                <div
                  className={
                    'rounded-[5px] border border-middle-accent bg-bg-dark p-1'
                  }
                >
                  <svg
                    aria-hidden="true"
                    role="presentation"
                    viewBox="0 0 17 18"
                    className={'h-3.5 w-3.5'}
                  >
                    <polyline
                      fill="none"
                      points="1 9 7 14 15 4"
                      stroke="currentColor"
                      strokeDasharray="22"
                      strokeDashoffset="44"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className={
                        networkStore.minaNetwork?.name == network.name
                          ? 'opacity-100'
                          : 'opacity-0'
                      }
                    ></polyline>
                  </svg>
                </div>
                <span>{network.name}</span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
