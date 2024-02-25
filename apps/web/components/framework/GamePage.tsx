'use client';

import { ReactNode, useContext, useEffect, useMemo, useState } from 'react';

import { useNetworkStore } from '@/lib/stores/network';
import { useObserveProtokitBalance, useProtokitBalancesStore } from '@/lib/stores/protokitBalances';
import { usePollMinaBlockHeight } from '@/lib/stores/minaChain';
import { usePollProtokitBlockHeight } from '@/lib/stores/protokitChain';
import { useMinaBalancesStore, useObserveMinaBalance } from '@/lib/stores/minaBalances';
import { ZkNoidGameConfig } from '@/lib/createConfig';
import AppChainClientContext from '@/lib/contexts/AppChainClientContext';
import { RuntimeModulesRecord } from '@proto-kit/module';
import { ClientAppChain } from '@proto-kit/sdk';
import DesktopNavbar from '../ui/games-store/DesktopNavbar';

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
  useObserveProtokitBalance(client);

  const minaBalances = useMinaBalancesStore();
  const protokitBalances = useProtokitBalancesStore();
  const networkStore = useNetworkStore();

  useEffect(() => {
    console.log('Starting client')
    client.start().then(() => networkStore.onProtokitClientStarted());
  }, []);

  return (
    <>
      <DesktopNavbar
        autoconnect={true}
      />
      {children}
    </>
  );
}