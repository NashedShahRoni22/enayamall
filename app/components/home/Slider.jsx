"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, Navigation } from "swiper/modules";
import hero1 from "@/public/hero (1).jpg";
import hero2 from "@/public/hero (2).jpg";
import hero3 from "@/public/hero (3).jpg";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { useGetData } from "../helpers/useGetData";
import ScreenLoader from "../loaders/ScreenLoader";

// Custom styles for Swiper
const swiperStyles = `
  .custom-swiper .swiper-button-next,
  .custom-swiper .swiper-button-prev {
    background: white;
    border-radius: 50%;
    width: 44px;
    height: 44px;
    margin-top: -22px;
    color: #666;
    transition: all 0.3s ease;
  }
  
  .custom-swiper .swiper-button-next:hover,
  .custom-swiper .swiper-button-prev:hover {
    background: var(--primary-color, #3b82f6);
    color: white;
  }
  
  .custom-swiper .swiper-button-next:after,
  .custom-swiper .swiper-button-prev:after {
    font-size: 18px;
    font-weight: 600;
  }
  
  .custom-swiper .swiper-pagination-bullet {
    background: white;
    opacity: 0.7;
    width: 12px;
    height: 12px;
    transition: all 0.3s ease;
  }
  
  .custom-swiper .swiper-pagination-bullet-active {
    background: var(--primary-color, #3b82f6);
    opacity: 1;
    transform: scale(1.2);
  }
`;

export default function Slider() {
  const { data, isLoading, error } = useGetData("banners");
  const banners = data?.data;
  
  if (isLoading) return <ScreenLoader />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <>
      {/* Inject custom styles */}
      <style jsx global>{swiperStyles}</style>
      
      <section className="group relative">
        <Swiper
          loop={true}
          pagination={{ 
            clickable: true,
            dynamicBullets: false 
          }}
          navigation={true}
          autoplay={{
            delay: 3500,
            disableOnInteraction: false,
          }}
          modules={[Pagination, Autoplay, Navigation]}
          className="mySwiper custom-swiper h-96 md:h-[500px]"
        >
        {banners?.map((banner, index) => (
          <SwiperSlide key={banner.id}>
            <Image
              src={banner.image}
              height={1080}
              width={1920}
              alt={banner.alt}
              className="object-cover w-full h-full"
              priority={index === 0}
              loading={index === 0 ? 'eager' : 'lazy'}
            />
          </SwiperSlide>
        ))}
        </Swiper>
      </section>
    </>
  );
}