import { createTRPCClient, httpBatchLink } from '@trpc/client';
import { type AppRouter } from '@/server/api/root';
import SuperJSON from 'superjson';

function getBaseUrl() {
  if (process.env.NODE_ENV === 'development')
    return `http://localhost:${process.env.PORT ?? 3000}`;
  if (process.env.NEXT_PUBLIC_VERCEL_URL)
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
  return 'https://lottery.zknoid.io';
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
