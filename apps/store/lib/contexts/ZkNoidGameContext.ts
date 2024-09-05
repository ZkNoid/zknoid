import { type ClientAppChain } from '@proto-kit/sdk';
import { createContext } from 'react';

interface IZkNoidGameContext {
  client: ClientAppChain<any, any, any, any> | undefined;
  appchainSupported: boolean;
  buildLocalClient: boolean;
}

const ZkNoidGameContext = createContext<IZkNoidGameContext>({
  client: undefined,
  appchainSupported: false,
  buildLocalClient: false
});

export default ZkNoidGameContext;
