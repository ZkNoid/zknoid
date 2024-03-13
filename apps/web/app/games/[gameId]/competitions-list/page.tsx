'use client';
import 'reflect-metadata';

import dynamic from 'next/dynamic';

const CompetitionsListPage = dynamic(
  () => import('@/components/framework/dynamic/CompetitionsPageWrapper'),
  {
    ssr: false,
  }
);

export default function Home({ params }: { params: { gameId: string } }) {
  return <CompetitionsListPage gameId={params.gameId} />;
}
