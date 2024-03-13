'use client';
import 'reflect-metadata';
import dynamic from 'next/dynamic';

const NewCompetitionPage = dynamic(
  () => import('@/components/framework/dynamic/NewCompetitionPageWrapper'),
  {
    ssr: false,
  }
);

export default function Home({ params }: { params: { gameId: string } }) {
  return <NewCompetitionPage gameId={params.gameId} />;
}
