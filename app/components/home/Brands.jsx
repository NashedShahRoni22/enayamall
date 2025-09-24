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
            <div>
              {<ShopNowButton route={"/brand"} />}
            </div>
          </section>

          {/* Brands Grid */}
          {brands?.length > 0 ? (
            <section className="relative grid grid-cols-4 grid-rows-4 sm:grid-cols-8 sm:grid-rows-2 w-full mx-auto my-[10px] lg:my-[20px]">
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
