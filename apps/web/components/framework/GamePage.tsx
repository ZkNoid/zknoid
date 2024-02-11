'use client';

import { ReactNode, useContext, useEffect, useMemo, useState } from 'react';

import { useNetworkStore } from '@/lib/stores/network';
import { useMinaBridge, useProtokitBalancesStore } from '@/lib/stores/protokitBalances';
import { usePollMinaBlockHeight } from '@/lib/stores/minaChain';
import { usePollProtokitBlockHeight } from '@/lib/stores/protokitChain';
import { useMinaBalancesStore, useObserveMinaBalance } from '@/lib/stores/minaBalances';
import Header from '@/components/Header';
import { GameType } from '@/app/constants/games';
import { ZkNoidGameConfig, getZkNoidGameClient } from '@/lib/createConfig';
import { AppChainClientContext } from '@/lib/contexts/AppChainClientContext';
import { RuntimeModulesRecord } from '@proto-kit/module';
import { ClientAppChain } from '@proto-kit/sdk';

export default function GamePage<RuntimeModules extends RuntimeModulesRecord>({
  children,
  gameConfig,
}: {
    children: ReactNode,
    gameConfig: ZkNoidGameConfig<RuntimeModules>,
}) {
  const client = useContext(AppChainClientContext) as ClientAppChain<any>;

  usePollMinaBlockHeight();
  usePollProtokitBlockHeight();
  useObserveMinaBalance();

  const minaBalances = useMinaBalancesStore();
  const protokitBalances = useProtokitBalancesStore();
  const networkStore = useNetworkStore();

  useEffect(() => {
    client.start().then(() => networkStore.onProtokitClientStarted());
  }, []);

  return (
    <>
      <Header
        address={networkStore.address}
        connectWallet={networkStore.connectWallet}
        minaBalance={networkStore.address ? minaBalances.balances[networkStore.address] : 0n}
        protokitBalance={networkStore.address ? protokitBalances.balances[networkStore.address] : 0n}
        walletInstalled={networkStore.walletInstalled()}
        currentGame={GameType.Arkanoid}
      />
      {children}
    </>
  );
}