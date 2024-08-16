import { useContext, useEffect, useMemo } from 'react';
import DepositMenuItem from './nonSSR/DepositMenuItem/DepositMenuItem';
import ZkNoidGameContext from '@/lib/contexts/ZkNoidGameContext';

export default function StoreDepositMenuItem() {
  const { client } = useContext(ZkNoidGameContext);

  const defaultClient = useMemo(() => client, []);

  return (
    <ZkNoidGameContext.Provider value={{
      client: defaultClient,
      appchainSupported: false,
      buildLocalClient: false
    }}>
      <DepositMenuItem />
    </ZkNoidGameContext.Provider>
  );
}
