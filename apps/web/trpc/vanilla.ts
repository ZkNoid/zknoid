import { createTRPCClient, httpBatchLink } from '@trpc/client';
import { type AppRouter } from '@/server/api/root';
import SuperJSON from 'superjson';

function getBaseUrl() {
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

export const api = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: getBaseUrl() + '/api/trpc',
      headers: () => {
        const headers = new Headers();
        headers.set('x-trpc-source', 'nextjs-react');
        return headers;
      },
      transformer: SuperJSON,
    }),
  ],
});
