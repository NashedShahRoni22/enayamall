"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, Navigation, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { useGetData } from "../helpers/useGetData";
import ScreenLoader from "../loaders/ScreenLoader";
import { useAppContext } from "@/app/context/AppContext";

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
    background: var(--primary-color, #51A6DD);
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
    background: var(--primary-color, #51A6DD);
    opacity: 1;
    transform: scale(1.2);
  }
`;

export default function Slider() {
  const {lang} = useAppContext();
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
          effect="fade"
          fadeEffect={{ crossFade: true }}
          speed={1500}
          // pagination={{ 
          //   clickable: true,
          //   dynamicBullets: false 
          // }}
          navigation={true}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          modules={[Pagination, Autoplay, Navigation, EffectFade]}
          className="mySwiper custom-swiper"
        >
        {banners?.map((banner, index) => (
          <SwiperSlide key={banner.id}>
            <Image
              src={ lang === "en" ? banner?.image : banner?.ar_image }
              height={450}
              width={1920}
              alt={banner?.alt || "Banner Image" }
              className="object-cover"
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