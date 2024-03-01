import { useEffect, useState } from 'react';

import { NETWORKS } from '@/app/constants/networks';
import { walletInstalled } from '@/lib/helpers';
import { useNetworkStore } from '@/lib/stores/network';

import { useRegisterWorkerClient } from '@/lib/stores/workerClient';

import { HeaderCard } from './ui/games-store/HeaderCard';
import { AnimatePresence, motion } from 'framer-motion';

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
        svg={'mina'}
        text={networkStore.minaNetwork?.name || 'Unsupported network'}
        onClick={() => setExpanded(!expanded)}
        toggle={true}
        isMiddle={true}
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
                onClick={() => switchNetwork(network.chainId)}
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
