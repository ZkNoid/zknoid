import { ClientAppChain } from '@proto-kit/sdk';
import runtime from './runtime';

export const client = ClientAppChain.fromRuntime(runtime);
client.configurePartial({
  GraphqlClient: {
    url:
      process.env.NEXT_PUBLIC_PROTOKIT_URL || 'http://127.0.0.1:8080/graphql',
  },
});
