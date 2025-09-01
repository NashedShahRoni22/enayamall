import React, { useRef } from 'react'
import Container from '../shared/Container'
import { Swiper, SwiperSlide } from 'swiper/react'
import Image from 'next/image'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { Autoplay } from "swiper/modules";
import Link from 'next/link'

export default function ShopCategorySlider({ categories, lang }) {
    const swiperRef = useRef(null);
    return (
        <div className="mt-[50px] lg:mt-0 lg:absolute lg:bottom-0 lg:left-1/2 lg:transform lg:-translate-x-1/2 lg:translate-y-2/3 w-full z-10">
            <Container>
                <div className="lg:max-w-7xl lg:mx-auto">
                    <div className="relative">
                        <Swiper
                            ref={swiperRef}
                            spaceBetween={20}
                            slidesPerView={2}
                            autoplay={{
                                delay: 3500,
                                disableOnInteraction: false,
                            }}
                            modules={[Autoplay]}
                            breakpoints={{
                                640: { slidesPerView: 4 },
                                1024: { slidesPerView: 4 },
                                1536: { slidesPerView: 5 },
                            }}
                        >
                            {categories?.map((p, index) => (
                                <SwiperSlide
                                    key={index}
                                    className="group overflow-hidden"
                                    onMouseEnter={() => swiperRef.current?.swiper?.autoplay?.stop()}
                                    onMouseLeave={() => swiperRef.current?.swiper?.autoplay?.start()}
                                >
                                    <Link href={`/category/${p?.slug}`}>
                                        <div className="rounded-full overflow-hidden size-[150px] lg:size-[180px] mx-auto">
                                            <Image
                                                key={index}
                                                src={p?.icon}
                                                alt="category image"
                                                height={150}
                                                width={150}
                                                className="w-full h-full object-cover transform transition-transform duration-300 ease-linear group-hover:scale-105 rounded-full"
                                            />
                                        </div>
                                        <p className="text-[18px] lg:text-[24px] text-primarymagenta text-center mt-[20px] lg:mt-[32px] group-hover:text-secondary transition-colors duration-300 ease-linear">
                                             {lang === "en" ? p?.name : p?.ar_name }
                                        </p>
                                        <p className="text-[12px] lg:text-[14px] mt-[14px] lg:mt-[16px] text-primarymagenta text-center group-hover:text-secondary transition-colors duration-300 ease-linear">
                                            {p?.total_products} {lang === "en" ? "Products" : "مُنتَج" }
                                        </p>
                                    </Link>
                                </SwiperSlide>

                            ))}
                        </Swiper>

                        {/* Custom Navigation Buttons */}
                        <div className='absolute top-1/3 -left-5 transform -translate-y-1/2 z-10'>
                            <button
                                className='bg-white size-[40px] flex justify-center items-center rounded-full cursor-pointer shadow-xl'
                                onClick={() => swiperRef.current.swiper.slidePrev()}
                            >
                                <FaChevronLeft className='text-secondary' />
                            </button>
                        </div>
                        <div className='absolute top-1/3 -right-5 transform -translate-y-1/2 z-10'>
                            <button
                                className='bg-white size-[40px] flex justify-center items-center rounded-full cursor-pointer shadow-xl'
                                onClick={() => swiperRef.current.swiper.slideNext()}
                            >
                                <FaChevronRight className='text-secondary' />
                            </button>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    )
}
