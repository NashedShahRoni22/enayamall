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
  const { data: productData, isLoading, error } = useGetData(`products?is_discounted=1&limit=10`);
  if (isLoading) return <VerticalCardLoadingScreen value={5} lgColumns={5} />;
  if (error) return <div>Error: {error.message}</div>;
  const products = productData?.data;
  return (
    <section className="py-[30px]">
      <Container>
        <section className={`flex justify-between items-center border-b border-[#008add] ${lang === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
          {/* caption here  */}
          <div className="border-b-4 border-[#008add]">
            <h5 className="text-[22px] 2xl:text-[30px] text-primaryblack text-center lg:text-left">
              <span className="font-bold text-primaryblack">{lang === 'en' ? 'Special Deals' : 'عروض خاصة'}</span>
            </h5>
          </div>
          {
            location !== '/special-deals' &&
            <div>
              <ShopNowButton route={"special-deals"} />
            </div>
          }
        </section>

        {/* banner and products here  */}
        <div className={`flex flex-col gap-4 mt-5 ${lang === 'ar' ? 'md:flex-row-reverse' : 'md:flex-row'}`}>
          {/* banner image section*/}
          <div className="md:w-1/3">
            <Link
              href={lang === 'en' ? bannerImage?.link : bannerImage?.ar_link}
              rel="noopener noreferrer"
            >
              <Image src={lang === 'en' ? bannerImage?.image : bannerImage?.ar_image} height={397} width={409} alt={lang === 'en' ? bannerImage?.title : bannerImage?.ar_title} className="h-full w-full rounded-xl" />
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
