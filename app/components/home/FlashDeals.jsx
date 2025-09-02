"use client"
import Container from "../shared/Container";
import ShopNowButton from "../shared/ShopNowButton";
import VerticalProductCard from "../shared/cards/VerticalProductCard";
// import FlashDealTimer from "./FlashDealTimer";
import { useGetData } from "../helpers/useGetData";
import VerticalCardLoadingScreen from "../loaders/VerticalCardLoadingScreen";
import ProductsSlider from "../sliders/ProductsSlider";
import { usePathname } from "next/navigation";

export default function FlashDeals() {
  // fetch products
  const { data, isLoading, error } = useGetData(`flash-deal`);
  const location = usePathname();
  if (isLoading) return <VerticalCardLoadingScreen value={6} />;
  if (error) return <div>Error: {error.message}</div>;

  const products = data?.data?.products;

  return (
    <section className={`${location === "/" && "bg-light py-[30px]"}`}>
      <Container>
        {/* starting section  */}
        {
          location === "/" &&
          <section className="flex flex-col items-center lg:flex-row lg:justify-between">
            {/* caption here  */}
            <div>
              <h5 className="text-[24px] 2xl:text-[36px] text-primarymagenta text-center lg:text-left">
                {/* Flash Deals You'll Love */}
                <span className="font-semibold text-primary">Clearance</span> Sale
              </h5>
            </div>

            <div>
              <ShopNowButton />
            </div>
          </section>
        }

        {/* products section */}
        <div>
          <ProductsSlider products={products} />
        </div>
      </Container>
    </section>
  );
}