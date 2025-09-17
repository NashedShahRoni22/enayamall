import Container from "../shared/Container";
import ShopNowButton from "../shared/ShopNowButton";
import { useGetData } from "../helpers/useGetData";
import VerticalCardLoadingScreen from "../loaders/VerticalCardLoadingScreen";
import ProductsSlider from "../sliders/ProductsSlider";
import Image from "next/image";
import TwoProductSlider from "../sliders/TwoProductSlider";

export default function ProductOfTheDay() {
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
        {/* starting section  */}
        <div className="flex flex-row justify-between">
          <div>
            <h5 className="text-[22px] 2xl:text-[30px] text-primaryblack text-center lg:text-left">
              <span className="font-bold text-sectionTitle">Product Of The Day</span>
            </h5>
          </div>

          <div>
            <ShopNowButton />
          </div>
        </div>

        {/* banner and products here  */}
        <div className="flex flex-col md:flex-row gap-4 mt-10">
          {/* banner image section*/}
          <div className="md:w-1/2">
            <Image src={bannerImage?.image} height={500} width={500} alt={bannerImage?.title} className="h-full w-full rounded-xl" />
          </div>
          {/* products section*/}
          <div className="md:w-1/2">
            <TwoProductSlider products={products} />
          </div>
        </div>
      </Container>
    </section>
  );
}
