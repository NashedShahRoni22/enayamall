import Image from "next/image";
import Link from "next/link";
export default function SearchProductCard({ p, setShowSearch, lang }) {
  return (
    <Link onClick={() => setShowSearch(false)} href={`/shop/${p?.slug}`} className="group flex items-center gap-[20px] bg-white rounded-[10px] py-[8px] pl-[16px] pr-[32px] text-primaryblack border border-creamline">

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
        <p className="text-[14px] line-clamp-3">
          {
            lang === "ar" ? p?.ar_name : p?.name
          }
          {p?.variant && p?.variant}
        </p>
        <div className="flex gap-[10px] text-[14px] mt-[2.5px]">
          {
            p?.discount === null ?
              <p><span className="dirham-symbol">ê</span> {p?.price ?? "0.00"}</p>
              :
              <div className="flex gap-[10px]">
                <p><span className="dirham-symbol">ê</span> {p?.discount?.discount_price ?? "0.00"}</p>
                <p className="text-button line-through opacity-50"><span className="dirham-symbol">ê</span> {p?.price ?? "0.00"}</p>
              </div>
          }
        </div>
      </div>
    </Link>
  );
}
