import type { Metadata } from 'next';
import 'reflect-metadata';
import { TRPCReactProvider } from '@/trpc/react';
import './globals.css';
import { plexMono, museoSlab, plexSans } from './fonts';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import NotificationsContainer from '@/components/shared/Notification/NotificationsContainer';

export const metadata: Metadata = {
  metadataBase: new URL('https://app.zknoid.io'),
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/favicon.ico',
  },
  title: 'ZkNoid gaming platform',
  description:
    'Revolutionizing competitive gaming using zero knowledge technologies',
  openGraph: {
    title: 'ZkNoid gaming platform',
    description:
      'Revolutionizing competitive gaming using zero knowledge technologies',
    url: 'https://app.zknoid.io',
    images: '/meta-preview.png',
    siteName: 'ZkNoid gaming platform',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${museoSlab.variable} ${plexMono.variable} ${plexSans.variable}`}
      >
        <TRPCReactProvider>{children}</TRPCReactProvider>
        <Analytics />
        <SpeedInsights />

        <NotificationsContainer />
      </body>
    </html>
  );
}
