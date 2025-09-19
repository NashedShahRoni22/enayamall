import Marquee from "react-fast-marquee";
import { useGetData } from "../helpers/useGetData";

export default function Features() {
  const {data} = useGetData("amount-to-reach-for-free-shipping");
  const shippingAmount = data?.data;
  const dirham = 'ê';
  const features = [
    {
      title: "Free Shipping",
    },
    {
      title: `On orders over ${dirham}${shippingAmount}`,
    },
  ];

  return (
    <section className="py-[10px] lg:py-[20px] bg-[#52a5dd26]">
      <Marquee
        autoFill
        speed={25}
      >
        {features.map((feature, index) => (
          <div key={index} className="flex gap-[10px] lg:gap-[20px] items-center">
            <h5 className={`text-[16px] lg:text-[20px] dirham-symbol items-center flex ${index === 0 && "font-semibold uppercase"} text-center text-brand-pink`}>{feature.title}</h5>
            <div className="size-[3px] lg:size-[6px] bg-brand-pink rounded-full mx-[25px] lg:mx-[50px]"></div>
          </div>
        ))}
      </Marquee>
    </section>
  );
}
