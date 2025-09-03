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
            <h5 className="mt-[20px] lg:mt-[35px] text-[30px] 2xl:text-[40px] text-primarymagenta text-center">
                <span>Authentic Brands</span> for You
            </h5>

            {brands?.length > 0 ? (
                <section
                    className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 py-[20px] lg:py-[40px]"
                >
                    {brands?.map((brand, index) => (
                        <div
                            key={index}
                            className="flex justify-center items-center"
                        >
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
                <div
                    className="w-full h-[50vh] flex justify-center items-center"
                >
                    <p className="text-3xl text-button">No Brand found</p>
                </div>
            )}
        </Container>
    )
}
