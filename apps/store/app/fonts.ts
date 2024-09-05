import { IBM_Plex_Mono } from 'next/font/google';
import { IBM_Plex_Sans } from 'next/font/google';
import localFont from 'next/font/local';

export const plexMono = IBM_Plex_Mono({
  weight: '400',
  subsets: ['latin'],
  variable: '--plex-mono',
  display: 'swap',
});

export const plexSans = IBM_Plex_Sans({
  weight: '400',
  subsets: ['latin'],
  variable: '--plex-sans',
  display: 'swap',
});

export const museoSlab = localFont({
  variable: '--museo-slab',
  display: 'swap',
  src: [
    {
      path: './fonts/MuseoSlab-100.woff2',
      weight: '100',
      style: 'normal',
    },
    {
      path: './fonts/MuseoSlab-100Italic.woff2',
      weight: '100',
      style: 'italic',
    },
    {
      path: './fonts/MuseoSlab-300.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: './fonts/MuseoSlab-300Italic.woff2',
      weight: '300',
      style: 'italic',
    },
    {
      path: './fonts/MuseoSlab-500.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: './fonts/MuseoSlab-500Italic.woff2',
      weight: '500',
      style: 'italic',
    },
    {
      path: './fonts/MuseoSlab-700.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: './fonts/MuseoSlab-700Italic.woff2',
      weight: '700',
      style: 'italic',
    },
    {
      path: './fonts/MuseoSlab-900.woff2',
      weight: '900',
      style: 'normal',
    },
    {
      path: './fonts/MuseoSlab-900Italic.woff2',
      weight: '900',
      style: 'italic',
    },
    {
      path: './fonts/MuseoSlab-1000.woff2',
      weight: '1000',
      style: 'normal',
    },
    {
      path: './fonts/MuseoSlab-1000Italic.woff2',
      weight: '1000',
      style: 'italic',
    },
  ],
});
