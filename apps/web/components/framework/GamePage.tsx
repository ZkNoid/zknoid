'use client';

import { RuntimeModulesRecord } from '@proto-kit/module';
import { ClientAppChain } from '@proto-kit/sdk';
import { ReactNode, useContext, useEffect, useMemo, useState } from 'react';

import AppChainClientContext from '@/lib/contexts/AppChainClientContext';
import { ZkNoidGameConfig } from '@/lib/createConfig';
import {
  useMinaBalancesStore,
  useObserveMinaBalance,
} from '@/lib/stores/minaBalances';
import { usePollMinaBlockHeight } from '@/lib/stores/minaChain';
import { useNetworkStore } from '@/lib/stores/network';
import {
  useObserveProtokitBalance,
  useProtokitBalancesStore,
} from '@/lib/stores/protokitBalances';
import { usePollProtokitBlockHeight } from '@/lib/stores/protokitChain';

import DesktopNavbar from '../ui/games-store/DesktopNavbar';

export default function GamePage<RuntimeModules extends RuntimeModulesRecord>({
  children,
  gameConfig,
}: {
  children: ReactNode;
  gameConfig: ZkNoidGameConfig<RuntimeModules>;
}) {
  const client = useContext(AppChainClientContext) as ClientAppChain<any>;

  usePollMinaBlockHeight();
  usePollProtokitBlockHeight();
  useObserveMinaBalance();
  const networkStore = useNetworkStore();

  useEffect(() => {
    console.log('Starting client');

    client.start().then(() => networkStore.onProtokitClientStarted());
  }, []);

  // Order is important
  useObserveProtokitBalance({ client });

  return (
    <>
      <DesktopNavbar autoconnect={true} />
      {children}
    </>
  );
}
