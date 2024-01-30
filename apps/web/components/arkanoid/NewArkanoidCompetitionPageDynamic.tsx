import dynamic from 'next/dynamic';

export default dynamic(() => import('./NewArkanoidCompetitionPage'), {
  ssr: false,
});
