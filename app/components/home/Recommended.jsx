"use client";
import "swiper/swiper-bundle.css";
import Container from "../shared/Container";
import ShopNowButton from "../shared/ShopNowButton";
import { useGetData } from "../helpers/useGetData";
import VerticalCardLoadingScreen from "../loaders/VerticalCardLoadingScreen";
import ProductsSlider from "../sliders/ProductsSlider";

export default function Recommended() {
  // fetch products
  const { data, isLoading, error } = useGetData(`popular-choices`);
  if (isLoading) return <VerticalCardLoadingScreen value={6} />;
  if (error) return <div>Error: {error.message}</div>;
  const products = data?.data;

  return (
    <section className="py-[30px]">
      <Container>
        {/* starting section  */}
        <section className="flex flex-col items-center lg:flex-row lg:justify-between">
          {/* caption here  */}
          <div>
            <h5 className="text-[22px] 2xl:text-[30px] text-primaryblack text-center lg:text-left">
              <span className="font-bold text-sectionTitle">Recommended</span> by Enayamall
            </h5>
          </div>

          <div>
            <ShopNowButton />
          </div>
        </section>

        {/* products section*/}
        <div>
          <ProductsSlider products={products} />
        </div>
      </Container>
    </section>
  );
}
