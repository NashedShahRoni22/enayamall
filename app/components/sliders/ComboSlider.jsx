import React, { useRef } from 'react'
import "swiper/swiper-bundle.css";
import { Swiper, SwiperSlide } from "swiper/react";
import VerticalProductCard from '../shared/cards/VerticalProductCard'
import { GoChevronLeft, GoChevronRight } from 'react-icons/go'
import { Autoplay } from "swiper/modules";
import ComboCard from '../shared/cards/ComboCard';

export default function ComboSlider({ products }) {
    const swiperRef = useRef(null);
    return (
        <section className="hidden lg:block relative mt-[60px] pb-[50px] lg:pb-[120px]">
            <Swiper
                ref={swiperRef}
                spaceBetween={20}
                slidesPerView={1}
                autoplay={{
                    delay: 3500,
                    disableOnInteraction: false,
                }}
                modules={[Autoplay]}
                breakpoints={{
                    640: { slidesPerView: 2 },
                    1024: { slidesPerView: 3 },
                    1536: { slidesPerView: 5 },
                }}
            >
                {products?.map((p, index) => (
                    <SwiperSlide
                        key={index}
                        onMouseEnter={() => swiperRef.current?.swiper?.autoplay?.stop()}
                        onMouseLeave={() => swiperRef.current?.swiper?.autoplay?.start()}
                    >
                        <ComboCard index={index} p={p} />
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Custom Navigation Buttons */}
            {
                products?.length > 5 &&
                <>
                    <div className='absolute top-1/3 -left-5 transform -translate-y-1/2 z-10'>
                        <button
                            className='bg-white size-[48px] flex justify-center items-center rounded-full cursor-pointer shadow-xl'
                            onClick={() => swiperRef.current.swiper.slidePrev()}
                        >
                            <GoChevronLeft className='text-natural text-[24px]' />
                        </button>
                    </div>
                    <div className='absolute top-1/3 -right-5 transform -translate-y-1/2 z-10'>
                        <button
                            className='bg-white size-[48px] flex justify-center items-center rounded-full cursor-pointer shadow-xl'
                            onClick={() => swiperRef.current.swiper.slideNext()}
                        >
                            <GoChevronRight className='text-natural text-[24px]' />
                        </button>
                    </div>
                </>
            }

        </section>
    )
}
