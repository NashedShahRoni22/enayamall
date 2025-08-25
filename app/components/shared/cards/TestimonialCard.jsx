import Image from "next/image";
import userImage from "../../../resources/model.svg";
import productImage from "../../../resources/imgproductsmall.svg";

export default function TestimonialCard({ testimonial }) {
  return (
    <section className="p-[14px] bg-white rounded-[10px] border border-creamline h-full">
      <div className="flex gap-[14px]">
        <Image
          alt="user image"
          src={ testimonial?.customer_avatar ? testimonial?.customer_avatar : userImage}
          height={48}
          width={48}
          className="rounded-full object-cover"
        />
        <div>
          <p className="text-[16px] text-button">{testimonial?.customer_name} </p>
          <p className="text-[14px] text-natural">{testimonial?.customer_city} </p>
        </div>
      </div>
      <div className="w-full h-[1px] bg-creamline mt-[14px] mb-[20px]"></div>
      <div className="">
        <p className="text-[14px] text-button">{testimonial?.rating_title}</p>
        <p className="text-[14px] text-primarymagenta mt-[8px] leading-[21px]">
          {testimonial?.review}
        </p>

        {/* Compact Review Images - Smart Sizing */}
        <div className="mt-5 flex gap-4">
          {testimonial?.images?.slice(0, 3).map((img, index) => (
            <div key={index} className="w-[100px] h-[100px] overflow-hidden rounded-[10px]">
              <Image
                alt="product review image"
                src={img}
                width={500}
                height={500}
                className="object-cover w-full h-full"
                loading="lazy"
              />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
