import Swiper from './ui/Swiper';
import CentralBlock from './ui/CentralBlock';
import Storefront from './ui/Storefront';

export default function MainSection() {
  return (
    <main className={'px-[2.604vw]'}>
      <Swiper />

      <CentralBlock />

      <Storefront />
    </main>
  );
}
