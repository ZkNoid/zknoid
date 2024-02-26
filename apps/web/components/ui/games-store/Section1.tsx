import { useEffect } from "react"
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/scrollbar'
import { Autoplay, Pagination } from 'swiper/modules'

export const Section1 = () => {
    return (
        <>
            <div className='relative banner-mask'>
                <svg width="1502" height="481" viewBox="0 0 1502 481" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                    <path d="M1 51V430C1 457.614 23.3858 480 51 480H650.474C663.726 480 676.436 474.739 685.812 465.373L723.596 427.627C732.971 418.261 745.681 413 758.933 413H1451C1478.61 413 1501 390.614 1501 363V51C1501 23.3858 1478.61 1 1451 1H51C23.3858 1 1 23.3858 1 51Z" stroke="#D2FF00" strokeWidth="2" />
                </svg>

                <div className="absolute w-full h-full top-0 left-0">
                    <div className="w-full h-full">
                        <Swiper
                            autoplay={{
                                delay: 5000,
                                disableOnInteraction: false,
                            }}
                            loop
                            modules={[Autoplay]}
                            className="w-full h-full"
                        >
                            <SwiperSlide key={0} className='bg-[url("/image/grid.svg")]'>
                                <div className="flex items-center justify-center w-full h-full">
                                    <img src="/image/slides/slide1.svg" />
                                </div>
                            </SwiperSlide>
                            <SwiperSlide key={1} className='bg-[url("/image/grid.svg")]'>
                                <div className="flex items-center justify-center w-full h-full">
                                    <div className="text-[35px]">Explore more games!</div>
                                </div>
                            </SwiperSlide>
                        </Swiper>
                    </div>
                </div>
            </div>
        </>
    )
}