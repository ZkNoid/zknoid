import { useMemo } from 'react';
import { DepositMenuItem } from './DepositMenuItem';
import { buildClient } from '@/lib/utils';
import { DefaultRuntimeModules } from '@/lib/runtimeModules';
import AppChainClientContext from '@/lib/contexts/AppChainClientContext';

export default function StoreDepositMenuItem() {
  const defaultClient = useMemo(() => buildClient(DefaultRuntimeModules), []);

  return (
    <AppChainClientContext.Provider value={defaultClient}>
      <DepositMenuItem />
    </AppChainClientContext.Provider>
  );
}
