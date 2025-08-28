"use client"
import "swiper/swiper-bundle.css";
import ShopNowButton from "../shared/ShopNowButton";
import VerticalProductCard from "../shared/cards/VerticalProductCard";
import ProductsSlider from "../sliders/ProductsSlider";

export default function RelatedProducts({products}) {
  
  return (
    <div>
      {/* starting section  */}
      <section className="flex flex-col items-center lg:flex-row lg:justify-between mt-[50px] lg:mt-[120px]">
        {/* caption here  */}
        <div>
          <p className="text-[18px] 2xl:text-[24px] text-button text-center lg:text-left">
            Popular Choices
          </p>
          <h5 className="mt-[20px] 2xl:mt-[35px] text-[30px] 2xl:text-[40px] text-primarymagenta text-center lg:text-left">
            Related Products
          </h5>
        </div>

        <div className="mt-[50px]">
          <ShopNowButton />
        </div>
      </section>

      {/* products section mobile  */}
      <section className="grid  grid-cols-2 md:grid-cols-3 lg:hidden gap-x-[18px] gap-y-[50px] mt-[60px] mb-[50px] lg:mb-[120px]">
        {products?.map((p, index) => (
          <div key={index}>
            <VerticalProductCard index={index} p={p} />
          </div>
        ))}
      </section>

      {/* products section  desktop*/}
      <div>
        <ProductsSlider products={products} />
      </div>
    </div>
  );
}