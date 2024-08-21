import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import Image from 'next/image';
import defaultSlide from '@/public/image/slides/slide1.svg';
import mobileCoverIMG from '@/public/image/section1/mobile-cover.svg';
import lotterySlide from '@/public/image/slides/lottery.svg';
import tileVilleSlide from '@/public/image/slides/tileville.svg';
import Link from 'next/link';

export default function Swiper() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
    },
    [Autoplay({ playOnInit: true, delay: 8000 })]
  );

  return (
    <>
      <div className="banner-mask relative">
        <svg
          width="1502"
          height="481"
          viewBox="0 0 1502 481"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="hidden h-full w-full lg:block"
        ></svg>
        <svg
          width="1502"
          height="481"
          viewBox="0 0 1502 481"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="pointer-events-none absolute bottom-0 top-0 z-40 hidden h-full w-full lg:block"
        >
          <path
            d="M1 51V430C1 457.614 23.3858 480 51 480H650.474C663.726 480 676.436 474.739 685.812 465.373L723.596 427.627C732.971 418.261 745.681 413 758.933 413H1451C1478.61 413 1501 390.614 1501 363V51C1501 23.3858 1478.61 1 1451 1H51C23.3858 1 1 23.3858 1 51Z"
            stroke="#D2FF00"
            strokeWidth="2"
          />
        </svg>

        <div className="absolute left-0 top-0 hidden h-full w-full lg:block">
          <div className="h-full w-full overflow-hidden" ref={emblaRef}>
            <div className="flex h-full w-full">
              <div key={0} className="min-w-0 flex-[0_0_100%]">
                <div className="flex h-full w-full items-center justify-center">
                  <Image src={defaultSlide} alt="Slide" className="w-full" />
                </div>
              </div>
              <Link
                key={1}
                href={
                  'https://forums.minaprotocol.com/t/zknoid-l1-lottery/6269'
                }
                target={'_blank'}
                rel={'noopener noreferrer'}
                className="min-w-0 flex-[0_0_100%]"
              >
                <div className="flex h-full w-full items-center justify-center">
                  <Image src={lotterySlide} alt="Slide" className="w-full" />
                </div>
              </Link>
              <Link
                key={2}
                href={'https://www.tileville.xyz'}
                target={'_blank'}
                rel={'noopener noreferrer'}
                className="min-w-0 flex-[0_0_100%]"
              >
                <div className="flex h-full w-full items-center justify-center">
                  <Image src={tileVilleSlide} alt="Slide" className="w-full" />
                </div>
              </Link>
            </div>
          </div>
        </div>

        <div
          className={
            'block h-full w-full rounded-[10px] border border-left-accent lg:hidden'
          }
        >
          <div
            className={
              'relative flex flex-col items-center justify-center bg-[url("/image/grid.svg")] bg-center p-4'
            }
          >
            <Image
              src={mobileCoverIMG}
              alt={'MobileCover'}
              className={'min-h-[450px]'}
            />
            <div
              className={
                'absolute bottom-[18%] px-[2%] text-center text-[20px]/[20px] font-medium text-left-accent'
              }
            >
              This is just a preview page. If you want to play games or take a
              part in competitions - please use Web-version
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
