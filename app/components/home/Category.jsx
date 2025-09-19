"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "swiper/css";
import "swiper/css/navigation";
import Container from "../shared/Container";
import babyPregnancyCategories from "./babyPregnancyCategories";
import bannerLeft from "@/public/addBannerLeft.svg";
import bannerRight from "@/public/addBannerRight.svg";
import Image from "next/image";
import { useGetData } from "../helpers/useGetData";
import { useAppContext } from "@/app/context/AppContext";
import Link from "next/link";

export default function Category() {
  const { lang } = useAppContext();
  const { data } = useGetData("categories?featured=1");
  const categories = data?.data;

  return (
    <Container>
      <div className="pt-8 pb-1">
        <h5 className="text-[22px] 2xl:text-[30px] text-center mb-4">
          <span className="font-bold text-sectionTitle">
            {lang === 'en' ? 'Most Popular' : 'الأكثر شهرة'}
          </span>{' '}
          {lang === 'en' ? 'Categories' : 'التصنيفات'}
        </h5>

        {/* Swiper for categories */}

        <div className="relative py-2">
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={8}
            slidesPerView={4}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            pagination={{ clickable: true }} // ✅ no custom el
            breakpoints={{
              640: { slidesPerView: 4, spaceBetween: 16 },
              768: { slidesPerView: 6, spaceBetween: 16 },
              1024: { slidesPerView: 8, spaceBetween: 16 },
            }}
            className="category-swiper"
          >
            {categories?.map((category, index) => (
              <SwiperSlide key={index}>
                <Link href={`/category/${category?.slug}`}>
                  <div className="flex flex-col justify-center items-center">
                    <div className="p-4 flex items-center justify-center bg-[#52a5dd26] rounded-full overflow-hidden">
                      <Image
                        src={category?.icon}
                        alt={category?.name}
                        height={60}
                        width={60}
                        loading="eager"
                      />
                    </div>
                    <p className="text-center mt-2.5 font-medium text-[12px] 2xl:text-[16px] text-primaryblack">
                      {lang === "en" ? category?.name : category?.ar_name}
                    </p>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Dots go here */}
          <div className="swiper-pagination-custom flex justify-center" />
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
