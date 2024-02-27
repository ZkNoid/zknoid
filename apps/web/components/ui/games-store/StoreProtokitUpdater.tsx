import { useEffect, useMemo, useState } from 'react';

import { DefaultRuntimeModules } from '@/lib/runtimeModules';
import { useObserveMinaBalance } from '@/lib/stores/minaBalances';
import { usePollMinaBlockHeight } from '@/lib/stores/minaChain';
import { useNetworkStore } from '@/lib/stores/network';
import { useObserveProtokitBalance } from '@/lib/stores/protokitBalances';
import { usePollProtokitBlockHeight } from '@/lib/stores/protokitChain';
import { buildClient } from '@/lib/utils';

export default function StoreProtokitUpdater() {
  const client = useMemo(() => buildClient(DefaultRuntimeModules), []);
  const networkStore = useNetworkStore();
  usePollMinaBlockHeight();
  usePollProtokitBlockHeight();
  useObserveMinaBalance();

  useEffect(() => {
    console.log('Starting client');

    client.start().then(() => networkStore.onProtokitClientStarted());
  }, []);

  // Order is important
  useObserveProtokitBalance({ client });

  return <></>;
}
