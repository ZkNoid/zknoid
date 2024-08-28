import Swiper from './ui/Swiper';
import CentralBlock from './ui/CentralBlock';
import Storefront from './ui/Storefront';
import { Suspense } from 'react';

export default function MainSection() {
  return (
    <main className={'px-[2.604vw]'}>
      <Swiper />

      <Suspense fallback={<p>Loading...</p>}>
        <CentralBlock />
        <Storefront />
      </Suspense>
    </main>
  );
}
