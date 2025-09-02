import React, { useRef } from 'react'
import "swiper/swiper-bundle.css";
import { Swiper, SwiperSlide } from "swiper/react";
import VerticalProductCard from '../shared/cards/VerticalProductCard'
import { GoChevronLeft, GoChevronRight } from 'react-icons/go'
import { Autoplay } from "swiper/modules";

export default function ProductsSlider({ products }) {
    const swiperRef = useRef(null);
    return (
        <section className="relative my-[10px] lg:my-[20px]">
            <Swiper
                ref={swiperRef}
                spaceBetween={16}
                slidesPerView={2}
                autoplay={{
                    delay: 3500,
                    disableOnInteraction: false,
                }}
                modules={[Autoplay]}
                breakpoints={{
                    640: { slidesPerView: 3 },
                    1024: { slidesPerView: 4 },
                    1536: { slidesPerView: 5 },
                }}
            >
                {products?.map((p, index) => (
                    <SwiperSlide
                        key={index}
                        onMouseEnter={() => swiperRef.current?.swiper?.autoplay?.stop()}
                        onMouseLeave={() => swiperRef.current?.swiper?.autoplay?.start()}
                    >
                        <VerticalProductCard index={index} p={p} />
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
