import Container from "../shared/Container";
import Image from "next/image";
import { useGetData } from "../helpers/useGetData";
import Link from "next/link";
import { useAppContext } from "@/app/context/AppContext";
import ShopNowButton from "../shared/ShopNowButton";

export default function Brands() {
  const { lang } = useAppContext();
  const { data } = useGetData("brands?featured=1");
  const brands = data?.data;

  return (
    brands?.length > 0 ? (
      <section className="py-[30px]">
        <Container>
          <section className={`flex justify-between items-center border-b border-[#008add] ${lang === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
            {/* caption here  */}
            <div className="border-b-4 border-[#008add]">
              <h5 className="text-[22px] 2xl:text-[30px] text-primaryblack text-center lg:text-left">
                <span className="font-bold text-primaryblack">
                  {lang === "en" ? "Featured Brands" : "ماركات مميزة"}
                </span>
              </h5>
            </div>
            {<ShopNowButton route={"/brand"} />}
          </section>

          {/* Brands Grid */}
          {brands?.length > 0 ? (
            <section className="relative grid grid-cols-4 grid-rows-4 sm:grid-cols-8 sm:grid-rows-2 w-full mx-auto my-[10px] lg:my-[20px]">
              {/* Horizontal lines */}
              {/* For small screens: 3 horizontal dividers (between 4 rows) */}
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={`h-small-${i}`}
                  className="absolute left-0 right-0 h-px bg-[#ddd] block sm:hidden"
                  style={{ top: `${((i + 1) / 4) * 100}%` }}
                ></div>
              ))}
              {/* For sm+ screens: 1 horizontal divider (between 2 rows) */}
              <div className="absolute left-0 right-0 top-1/2 h-px bg-[#ddd] hidden sm:block"></div>

              {/* Vertical lines */}
              {/* For small screens: 3 vertical dividers (between 4 cols) */}
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={`v-small-${i}`}
                  className="absolute top-0 bottom-0 w-px bg-[#ddd] block sm:hidden"
                  style={{ left: `${((i + 1) / 4) * 100}%` }}
                ></div>
              ))}
              {/* For sm+ screens: 7 vertical dividers (between 8 cols) */}
              {Array.from({ length: 7 }).map((_, i) => (
                <div
                  key={`v-large-${i}`}
                  className="absolute top-0 bottom-0 w-px bg-[#ddd] hidden sm:block"
                  style={{ left: `${((i + 1) / 8) * 100}%` }}
                ></div>
              ))}

              {/* Brand items */}
              {brands.map((brand, index) => (
                <div key={index} className="flex justify-center items-center p-4">
                  <Link
                    href={`/brand/${brand?.slug}`}
                    className="flex justify-center items-center w-full"
                  >
                    <Image
                      src={brand?.logo}
                      alt={brand?.name}
                      className="w-full h-auto object-contain"
                      width={0}
                      height={0}
                      sizes="100vw"
                      style={{ width: "100%", height: "auto" }}
                    />
                  </Link>
                </div>
              ))}
            </section>

          ) : (
            <div className="w-full h-[50vh] flex justify-center items-center">
              <p className="text-3xl text-button">
                No brand found right now. Please try again.
              </p>
            </div>
          )}
        </Container>
      </section>
    ) : (
      <div className="pb-[30px]">
      </div>
    )
  );
}
