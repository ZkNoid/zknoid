import { useContext, useMemo } from 'react';
import { DepositMenuItem } from './DepositMenuItem';
import { buildClient } from '@/lib/utils';
import { DefaultRuntimeModules } from '@/lib/runtimeModules';
import AppChainClientContext from '@/lib/contexts/AppChainClientContext';

export default function StoreDepositMenuItem() {
  const contextAppChainClient = useContext(AppChainClientContext);

  const defaultClient = useMemo(
    () => contextAppChainClient || buildClient(DefaultRuntimeModules),
    []
  );

  return (
    <AppChainClientContext.Provider value={defaultClient}>
      <DepositMenuItem />
    </AppChainClientContext.Provider>
  );
}
