"use client";

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/navigation';
import Container from "../shared/Container";
import babyPregnancyCategories from "./babyPregnancyCategories";
import bannerLeft from "@/public/addBannerLeft.svg";
import bannerRight from "@/public/addBannerRight.svg";
import Image from 'next/image';
import { useGetData } from '../helpers/useGetData';
import { useAppContext } from '@/app/context/AppContext';
import Link from 'next/link';

export default function Category() {
    const { lang } = useAppContext();
    const { data } = useGetData("categories?featured=1");
    const categories = data?.data;
    console.log(categories);

    return (
        <Container>
            <div className="py-10">
                <h5 className="text-[24px] 2xl:text-[36px] text-primaryblack text-center mb-8">
                {/* Flash Deals You'll Love */}
                    <span className="font-semibold text-primary">Most Popular</span> Categories
                </h5>

                {/* Swiper for categories */}
                <div className="relative">
                    <Swiper
                        modules={[Navigation, Autoplay]}
                        spaceBetween={8}
                        slidesPerView={4}
                        navigation={{
                            prevEl: '.swiper-button-prev-custom',
                            nextEl: '.swiper-button-next-custom',
                        }}
                        autoplay={{
                            delay: 4000,
                            disableOnInteraction: false,
                            pauseOnMouseEnter: true,
                        }}
                        breakpoints={{
                            640: {
                                slidesPerView: 4,
                                spaceBetween: 16,
                            },
                            768: {
                                slidesPerView: 6,
                                spaceBetween: 16,
                            },
                            1024: {
                                slidesPerView: 8,
                                spaceBetween: 16,
                            },
                        }}
                        className="category-swiper"
                    >
                        {categories?.map((category, index) => {
                            return (
                                <SwiperSlide key={index}>
                                    <Link href={`/category/${category?.slug}`}>
                                        <div className='flex justify-center'>
                                            <Image src={category?.icon} alt={category?.name} height={130} width={130} loading='eager' />
                                        </div>
                                        <p className='text-center mt-2.5 text-md font-medium'>
                                            {lang === "en" ? category?.name : category?.ar_name}
                                        </p>
                                    </Link>
                                </SwiperSlide>
                            );
                        })}
                    </Swiper>

                    {/* Custom Navigation Buttons */}
                    <button className="swiper-button-prev-custom absolute left-0 lg:-left-5 top-1/3 -translate-y-1/2 z-10 w-8 h-8 md:w-10 md:h-10 bg-white rounded-full border border-gray-200 flex items-center justify-center transition-colors duration-200">
                        <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6 text-gray-600" />
                    </button>

                    <button className="swiper-button-next-custom absolute right-0 lg:-right-5 top-1/3 -translate-y-1/2 z-10 w-8 h-8 md:w-10 md:h-10 bg-white rounded-full border border-gray-200 flex items-center justify-center transition-colors duration-200">
                        <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6 text-gray-600" />
                    </button>
                </div>

                {/* add banners here  */}
                {/* <div className='flex flex-col md:flex-row md:justify-between gap-5 mt-8 md:mt-16'>
                    <Image src={bannerLeft} alt='Category Add Image' />
                    <Image src={bannerRight} alt='Category Add Image' />
                </div> */}
            </div>
        </Container>
    );
}