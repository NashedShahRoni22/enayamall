"use client"
import "swiper/swiper-bundle.css";
import ShopNowButton from "../shared/ShopNowButton";
import VerticalProductCard from "../shared/cards/VerticalProductCard";
import ProductsSlider from "../sliders/ProductsSlider";
import { motion } from "motion/react"

export default function RelatedProducts({products}) {

  const slideUpAnimation = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.3 },
    transition: { duration: 0.6, ease: "easeOut" }
  };
  
  return (
    <div>
      {/* starting section  */}
      <motion.section
        className="flex flex-col items-center lg:flex-row lg:justify-between mt-[50px] lg:mt-[120px]"
        {...slideUpAnimation}
      >
        {/* caption here  */}
        <motion.div {...slideUpAnimation}>
          <motion.p
            className="text-[18px] 2xl:text-[24px] text-button text-center lg:text-left"
            {...slideUpAnimation}
          >
            Popular Choices
          </motion.p>
          <motion.h5
            className="mt-[20px] 2xl:mt-[35px] text-[30px] 2xl:text-[40px] text-primarymagenta text-center lg:text-left"
            {...slideUpAnimation}
          >
            Related Products
          </motion.h5>
        </motion.div>

        <motion.div
          className="mt-[50px]"
          {...slideUpAnimation}
        >
          <ShopNowButton />
        </motion.div>
      </motion.section>

      {/* products section mobile  */}
      <motion.section
        className="grid  grid-cols-2 md:grid-cols-3 lg:hidden gap-x-[18px] gap-y-[50px] mt-[60px] mb-[50px] lg:mb-[120px]"
      >
        {products?.map((p, index) => (
          <motion.div
            key={index}
          >
            <VerticalProductCard index={index} p={p} />
          </motion.div>
        ))}
      </motion.section>

      {/* products section  desktop*/}
      <motion.div>
        <ProductsSlider products={products} />
      </motion.div>
    </div>
  );
}