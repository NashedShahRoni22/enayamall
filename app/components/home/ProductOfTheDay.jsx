import Container from "../shared/Container";
import ShopNowButton from "../shared/ShopNowButton";
import { useGetData } from "../helpers/useGetData";
import VerticalCardLoadingScreen from "../loaders/VerticalCardLoadingScreen";
import ProductsSlider from "../sliders/ProductsSlider";
import Image from "next/image";
import TwoProductSlider from "../sliders/TwoProductSlider";
import Link from "next/link";
import { useAppContext } from "@/app/context/AppContext";

export default function ProductOfTheDay() {
  const { lang } = useAppContext();
  //fetch banner
  const { data: bannerImageData } = useGetData(`banners?slug=product-of-the-day`);
  const bannerImage = (bannerImageData?.data[0]);
  // fetch products
  const { data: productData, isLoading, error } = useGetData(`product-of-the-day`);
  if (isLoading) return <VerticalCardLoadingScreen value={5} lgColumns={5} />;
  if (error) return <div>Error: {error.message}</div>;
  const products = productData?.data;
  return (
    <section className="py-[30px]">
      <Container>
        <h5 className={`flex text-[22px] 2xl:text-[30px] text-primaryblack text-center ${lang === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
          <span className="font-bold text-sectionTitle">{lang === 'ar' ? '' : 'Special Deals'}</span>
        </h5>

        {/* banner and products here  */}
        <div className={`flex flex-col gap-4 mt-5 ${lang === 'ar' ? 'md:flex-row-reverse' : 'md:flex-row'}`}>
          {/* banner image section*/}
          <div className="md:w-1/3">
            <Link
              href={bannerImage?.link || "#"}
              target={bannerImage?.link ? "_blank" : "_self"}
              rel="noopener noreferrer"
            >
              <Image src={bannerImage?.image} height={397} width={409} alt={bannerImage?.title} className="h-full w-full rounded-xl" />
            </Link>
          </div>
          {/* products section*/}
          <div className="md:w-2/3">
            <TwoProductSlider products={products} />
          </div>
        </div>
      </Container>
    </section>
  );
}
