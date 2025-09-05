"use client"
import Link from 'next/link';
import { useGetData } from '../components/helpers/useGetData'
import Container from '../components/shared/Container';
import Image from 'next/image';
import ScreenLoader from '../components/loaders/ScreenLoader';

export default function page() {
    const { data, isLoading } = useGetData("brands");
    const brands = data?.data;
    if(isLoading) return <ScreenLoader/>;

    return (
        <Container>
            <h5 className="mt-[20px] lg:mt-[35px] text-[30px] 2xl:text-[40px] text-primaryblack text-center">
                <span className="font-[550] text-primary">Authentic Brands</span> for You
            </h5>

            {brands?.length > 0 ? (
                <section className="space-y-8 py-[20px] lg:py-[40px]">
  {brands
    ?.slice()
    .sort((a, b) => {
      const nameA = a?.name?.charAt(0).toUpperCase() || '';
      const nameB = b?.name?.charAt(0).toUpperCase() || '';
      if (nameA < nameB) return -1;
      if (nameA > nameB) return 1;
      return 0;
    })
    .reduce((acc, brand) => {
      const firstLetter = brand?.name?.charAt(0).toUpperCase();
      if (!acc[firstLetter]) acc[firstLetter] = [];
      acc[firstLetter].push(brand);
      return acc;
    }, {}) &&
    Object.keys(
      brands
        ?.slice()
        .sort((a, b) => {
          const nameA = a?.name?.charAt(0).toUpperCase() || '';
          const nameB = b?.name?.charAt(0).toUpperCase() || '';
          if (nameA < nameB) return -1;
          if (nameA > nameB) return 1;
          return 0;
        })
        .reduce((acc, brand) => {
          const firstLetter = brand?.name?.charAt(0).toUpperCase();
          if (!acc[firstLetter]) acc[firstLetter] = [];
          acc[firstLetter].push(brand);
          return acc;
        }, {})
    )
    .sort()
    .map((letter) => {
      const groupedBrands = brands
        ?.slice()
        .sort((a, b) => {
          const nameA = a?.name?.charAt(0).toUpperCase() || '';
          const nameB = b?.name?.charAt(0).toUpperCase() || '';
          if (nameA < nameB) return -1;
          if (nameA > nameB) return 1;
          return 0;
        })
        .reduce((acc, brand) => {
          const firstLetter = brand?.name?.charAt(0).toUpperCase();
          if (!acc[firstLetter]) acc[firstLetter] = [];
          acc[firstLetter].push(brand);
          return acc;
        }, {});
      
      return (
        <div key={letter}>
          {/* Letter heading */}
          <h2 className="text-xl md:text-[26px] font-bold mb-2">{letter}</h2>
          <hr className="mb-4 border-gray-300" />

          {/* Brand icons */}
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-4">
            {groupedBrands[letter].map((brand, index) => (
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
                      style={{ width: '100%', height: 'auto' }}
                    />
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      );
    })}
</section>


            ) : (
                <div
                    className="w-full h-[50vh] flex justify-center items-center"
                >
                    <p className="text-3xl text-button">No Brand found</p>
                </div>
            )}
        </Container>
    )
}
