import type { Metadata } from 'next';

import './globals.css';
import AsyncLayoutDynamic from '@/containers/async-layout-dynamic';

import 'reflect-metadata';
import { plexMono, museoSlab, plexSans } from './fonts';

export const metadata: Metadata = {
  metadataBase: new URL('https://app.zknoid.io'),
  alternates: {
    canonical: '/',
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
      <body className={`${museoSlab.variable} ${plexMono.variable} ${plexSans.variable}`}>
        <AsyncLayoutDynamic>{children}</AsyncLayoutDynamic>
      </body>
    </html>
  );
}
