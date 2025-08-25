import Image from "next/image";
import ProductImage from "../../../resources/product/800x1000THREE.png";
import { IoIosStar } from "react-icons/io";
import Link from "next/link";
import { TiStarFullOutline } from "react-icons/ti";
export default function SearchProductCard({ p, setShowSearch }) {
  // rating count here
  const ratingCount = p?.ratings?.rating;
  return (
    <Link onClick={()=> setShowSearch(false)} href={`/shop/${p?.slug}?variant=${p?.variant}`} className="group flex items-center gap-[20px] bg-white rounded-[10px] py-[8px] pl-[16px] pr-[32px] text-primarymagenta border border-creamline">

      <div className="flex justify-center rounded-[10px] relative w-1/4 h-[60px]  lg:h-[100px] overflow-hidden">
        <Image
          src={p?.main_image} 
          // src={ProductImage}
          alt={p?.name}
          height={0}
          width={0}
          sizes="100vw"
          className="h-full w-full object-contain p-1 group-hover:scale-105 ease-linear duration-300"
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
          }}
        />
      </div>

      <div className="w-3/4">
        <p className="text-[14px]">
          {p?.name} {p?.variant && p?.variant}
        </p>
        <div className="flex gap-[10px] text-[14px] mt-[2.5px]">
          {
            p?.discount === null ?
              <p>৳ {p?.price} Taka</p>
              :
              <div className="flex gap-[10px]">
                <p>৳ {p?.discount?.discount_price} Taka</p>
                <p className="text-button line-through opacity-50">৳ {p?.price} Taka</p>
              </div>
          }</div>
      </div>
    </Link>
  );
}
