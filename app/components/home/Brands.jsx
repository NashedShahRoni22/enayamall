"use client";
import Container from "../shared/Container";
import Image from "next/image";
import { useGetData } from "../helpers/useGetData";
import Link from "next/link";
import { useAppContext } from "@/app/context/AppContext";

export default function Brands() {
  const { lang } = useAppContext();
  const { data } = useGetData("brands?featured=1");
  const brands = data?.data;

  return (
    <section className="py-[30px]">
      <Container>
        <h2 className="text-3xl font-bold text-primary mb-2">
          {lang === 'en' ? 'Shop by brand' : 'سوق حسب الماركة'}
        </h2>
        {/* Brands Grid */}
        {brands?.length > 0 ? (
          <section className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 my-[10px] lg:my-[20px]">
            {brands.map((brand, index) => (
              <div key={index} className="flex justify-center items-center">
                <Link
                  href={`/brand/${brand?.slug}`}
                  className="flex justify-center items-center w-full"
                >
                  <div>
                    <Image
                      src={brand?.logo}
                      alt={brand?.name}
                      className="w-full h-auto object-contain"
                      width={0}
                      height={0}
                      sizes="100vw"
                      style={{ width: "100%", height: "auto" }}
                    />
                  </div>
                </Link>
              </div>
            ))}
          </section>
        ) : (
          <div className="w-full h-[50vh] flex justify-center items-center">
            <p className="text-3xl text-button">No Brand found</p>
          </div>
        )}
      </Container>
    </section>
  );
}
