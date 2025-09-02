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

export default function Category() {
    return (
        <Container>
            <div className="py-10 md:py-20">
                <h5 className="text-xl md:text-3xl font-semibold text-primary text-center mb-8 md:mb-16">
                    Most popular categories
                </h5>
                
                {/* Swiper for categories */}
                <div className="relative">
                    <Swiper
                        modules={[Navigation, Autoplay]}
                        spaceBetween={16}
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
                                spaceBetween: 20,
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
                        {babyPregnancyCategories.map((category, index) => {
                            const IconComponent = category.icon;
                            return (
                                <SwiperSlide key={index}>
                                    <div className="flex flex-col items-center cursor-pointer">
                                        {/* Icon */}
                                        <div className="mb-3 p-4 sm:p-6 md:p-8 bg-primary/10 rounded-full hover:bg-primary/20 transition-colors duration-200">
                                            <IconComponent
                                                className="text-primary sm:w-8 sm:h-8 md:w-12 md:h-12"
                                            />
                                        </div>
                                        
                                        {/* Category name */}
                                        <h6 className="text-xs sm:text-sm md:text-base font-medium text-gray-600 text-center leading-tight">
                                            {category.name}
                                        </h6>
                                    </div>
                                </SwiperSlide>
                            );
                        })}
                    </Swiper>
                    
                    {/* Custom Navigation Buttons */}
                    <button className="swiper-button-prev-custom absolute left-0 lg:-left-5 top-1/3 -translate-y-1/2 z-10 w-8 h-8 md:w-10 md:h-10 bg-white rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors duration-200">
                        <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6 text-gray-600" />
                    </button>
                    
                    <button className="swiper-button-next-custom absolute right-0 lg:-right-5 top-1/3 -translate-y-1/2 z-10 w-8 h-8 md:w-10 md:h-10 bg-white rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors duration-200">
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