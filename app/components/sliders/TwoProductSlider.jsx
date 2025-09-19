import React, { useRef, useState } from "react";
import "swiper/swiper-bundle.css";
import { Swiper, SwiperSlide } from "swiper/react";
import VerticalProductCard from "../shared/cards/VerticalProductCard";
import { Autoplay } from "swiper/modules";

export default function TwoProductSlider({ products }) {
  const swiperRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  return (
    <section className="relative">
      <Swiper
        ref={swiperRef}
        spaceBetween={16}
        slidesPerView={2}
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
        }}
        modules={[Autoplay]}
        onSlideChange={(swiper) => setCurrentIndex(swiper.realIndex)}
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

      {/* Custom Pagination Dots */}
      <div className="flex justify-center gap-2 mt-4">
        {Array.from({ length: Math.ceil(products.length / 2) }).map((_, index) => (
          <button
            key={index}
            onClick={() => swiperRef.current?.swiper?.slideTo(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 cursor-pointer ${
              index === currentIndex ? "bg-primary" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
