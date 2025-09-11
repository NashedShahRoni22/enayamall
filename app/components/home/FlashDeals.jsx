"use client"
import Container from "../shared/Container";
import ShopNowButton from "../shared/ShopNowButton";
import VerticalProductCard from "../shared/cards/VerticalProductCard";
// import FlashDealTimer from "./FlashDealTimer";
import { useGetData } from "../helpers/useGetData";
import VerticalCardLoadingScreen from "../loaders/VerticalCardLoadingScreen";
import ProductsSlider from "../sliders/ProductsSlider";
import { usePathname } from "next/navigation";
import { useAppContext } from "@/app/context/AppContext";

export default function FlashDeals() {
  const {lang} = useAppContext();
  // fetch products
  const { data, isLoading, error } = useGetData(`flash-deal`);
  const location = usePathname();
  if (isLoading) return <VerticalCardLoadingScreen value={6} />;
  if (error) return <div>Error: {error.message}</div>;

  const products = data?.data?.products;

  return (
    <section className={`${location === "/" && "py-[10px]"}`}>
      <Container>
        {/* starting section  */}
        {
          location === "/" &&
          <section className="flex flex-row justify-between">
            {/* caption here  */}
            <div>
              <h5 className="text-[22px] 2xl:text-[30px] text-primaryblack text-center lg:text-left">
                <span className="font-bold text-sectionTitle">
                  {lang === 'en' ? 'Clearance' : 'تخفيضات'}
                </span>{' '}
                {lang === 'en' ? 'Sale' : 'التصفية'}
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