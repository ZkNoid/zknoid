import dynamic from 'next/dynamic';

export default dynamic(() => import('./ArkanoidCompetitionsListPage'), {
  ssr: false,
});
