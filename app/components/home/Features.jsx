"use client"
import Marquee from "react-fast-marquee";
import { useGetData } from "../helpers/useGetData";

export default function Features() {
  const {data} = useGetData("amount-to-reach-for-free-shipping");
  const shippingAmount = data?.data;
  const features = [
    {
      title: "Free Shipping",
    },
    {
      title: `On orders over $${shippingAmount}`,
    },
  ];

  return (
    <section className="py-[10px] lg:py-[20px] bg-[#ece3dc]">
      <Marquee
        autoFill
        speed={25}
      >
        {features.map((feature, index) => (
          <div key={index} className="flex gap-[10px] lg:gap-[20px] items-center">
            <h5 className={`text-[14px] lg:text-[18px] ${index === 0 && "font-semibold uppercase"} text-center text-black`}>{feature.title}</h5>
            <div className="size-[3px] lg:size-[6px] bg-black rounded-full mx-[25px] lg:mx-[50px]"></div>
          </div>
        ))}
      </Marquee>
    </section>
  );
}
