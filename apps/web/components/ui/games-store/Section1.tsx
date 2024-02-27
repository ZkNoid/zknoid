import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { Autoplay, Pagination } from 'swiper/modules';

export const Section1 = () => {
  return (
    <>
      <div className="banner-mask relative">
        <svg
          width="1502"
          height="481"
          viewBox="0 0 1502 481"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-full"
        >
          <path
            d="M1 51V430C1 457.614 23.3858 480 51 480H650.474C663.726 480 676.436 474.739 685.812 465.373L723.596 427.627C732.971 418.261 745.681 413 758.933 413H1451C1478.61 413 1501 390.614 1501 363V51C1501 23.3858 1478.61 1 1451 1H51C23.3858 1 1 23.3858 1 51Z"
            stroke="#D2FF00"
            strokeWidth="2"
          />
        </svg>

        <div className="absolute left-0 top-0 h-full w-full">
          <div className="h-full w-full">
            <Swiper
              autoplay={{
                delay: 8000,
                disableOnInteraction: false,
              }}
              speed={600}
              loop
              modules={[Autoplay]}
              className="h-full w-full"
            >
              <SwiperSlide key={0} className='bg-[url("/image/grid.svg")]'>
                <div className="flex h-full w-full items-center justify-center">
                  <Image
                    src="/image/slides/slide1.svg"
                    width={1092}
                    height={378}
                    alt="Slide"
                  />
                </div>
              </SwiperSlide>
              <SwiperSlide key={1} className='bg-[url("/image/grid.svg")]'>
                <div className="flex h-full w-full items-center justify-center">
                  <div className="text-[35px]">Explore more games!</div>
                </div>
              </SwiperSlide>
            </Swiper>
          </div>
        </div>
      </div>
    </>
  );
};
