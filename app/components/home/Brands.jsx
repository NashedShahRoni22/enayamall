"use client";
import { useState } from "react";
import Container from "../shared/Container";
import koreaFlug from "../../resources/korea_flug.svg";
import japanFlug from "../../resources/Japan_flug.svg";
import Image from "next/image";
import { useGetData } from "../helpers/useGetData";
import Link from "next/link";
import { motion } from "motion/react";

export default function Brands() {
  const [active, setActive] = useState(null);
  const handleButtonClick = (buttonNumber) => {
    setActive(active === buttonNumber ? null : buttonNumber);
  };

  const endpoint = active ? `brands?country_id=${active}` : `brands`;
  const { data } = useGetData(endpoint);
  const brands = data?.data;

  const slideUpAnimation = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.3 },
    transition: { duration: 0.6, ease: "easeOut" }
  };

  return (
    <section className="bg-light">
      <Container>
        {/* Header Section */}
        <motion.section
          className="flex flex-col items-center lg:flex-row lg:justify-between pt-[50px] lg:pt-[120px]"
          {...slideUpAnimation}
        >
          <motion.div {...slideUpAnimation}>
            <p className="text-[18px] 2xl:text-[24px] text-button text-center lg:text-left">
              Just In
            </p>
            <h5 className="mt-[20px] lg:mt-[35px] text-[30px] 2xl:text-[40px] text-primaryblack text-center lg:text-left">
              <span className="font-[750] text-white">Authentic Brands</span> for You
            </h5>
          </motion.div>

          <motion.div
            className="mt-[50px] flex gap-[15px] sm:gap-[30px]"
            {...slideUpAnimation}
          >
            <button
              onClick={() => handleButtonClick(2)}
              className={`cursor-pointer flex gap-[10px] items-center transition-colors duration-200 ${
                active === 2
                  ? "bg-natural text-white"
                  : "bg-white text-primaryblack hover:bg-secondary"
              } py-[10px] sm:py-[15px] px-[10px] sm:px-[20px] rounded-[5px]`}
            >
              <Image
                src={koreaFlug}
                alt="korea flag"
                width={45}
                height={30}
              />
              <p className="text-[14px] lg:text-[18px]">
                Korean <span>Brands</span>
              </p>
            </button>

            <button
              onClick={() => handleButtonClick(1)}
              className={`cursor-pointer flex gap-[10px] items-center transition-colors duration-200 ${
                active === 1
                  ? "bg-natural text-white"
                  : "bg-white text-primaryblack hover:bg-secondary"
              } py-[10px] sm:py-[15px] px-[10px] sm:px-[20px] rounded-[5px]`}
            >
              <Image
                src={japanFlug}
                alt="japan flag"
                width={45}
                height={30}
                className="border border-creamline"
              />
              <p className="text-[14px] lg:text-[18px]">
                Japanese <span>Brands</span>
              </p>
            </button>
          </motion.div>
        </motion.section>

        {/* Brands Grid */}
        {brands?.length > 0 ? (
          <motion.section
            className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 mt-[60px] pb-[50px] lg:pb-[120px]"
            {...slideUpAnimation}
          >
            {brands.map((brand, index) => (
              <motion.div
                key={index}
                className="flex justify-center items-center"
                {...slideUpAnimation}
              >
                <Link
                  href={`/brand/${brand?.slug}`}
                  className="flex justify-center items-center w-full"
                >
                  <motion.div>
                    <Image
                      src={brand?.logo}
                      alt={brand?.name}
                      className="w-full h-auto object-contain"
                      width={0}
                      height={0}
                      sizes="100vw"
                      style={{ width: "100%", height: "auto" }}
                    />
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </motion.section>
        ) : (
          <motion.div
            className="w-full h-[50vh] flex justify-center items-center"
            {...slideUpAnimation}
          >
            <p className="text-3xl text-button">No Brand found</p>
          </motion.div>
        )}
      </Container>
    </section>
  );
}
