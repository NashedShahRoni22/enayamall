import Container from "../shared/Container";
import ShopNowButton from "../shared/ShopNowButton";
import { useGetData } from "../helpers/useGetData";
import VerticalCardLoadingScreen from "../loaders/VerticalCardLoadingScreen";
import ProductsSlider from "../sliders/ProductsSlider";
import { usePathname } from "next/navigation";
import VerticalProductCard from "../shared/cards/VerticalProductCard";

export default function Recommended() {
  const location = usePathname();
  console.log('====================================');
  console.log(location);
  console.log('====================================');
  // fetch products
  const { data, isLoading, error } = useGetData(`popular-choices`);
  if (isLoading) return <VerticalCardLoadingScreen value={5} lgColumns={5} />;
  if (error) return <div>Error: {error.message}</div>;
  const products = data?.data;

  return (
    <section className="py-[30px]">
      <Container>
        {/* starting section  */}
        <section className="flex flex-row justify-between">
          {/* caption here  */}
          <div>
            <h5 className="text-[22px] 2xl:text-[30px] text-primaryblack text-center lg:text-left">
              <span className="font-bold text-sectionTitle">Recommended</span>
            </h5>
          </div>
          {
            location !== '/recommended-product' &&
            <div>
              <ShopNowButton route={"recommended-product"} />
            </div>
          }

        </section>

        {/* products section*/}
        <div>
          {
            location === "/recommended-product" ?
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-10">
                {
                  products.map(p => <VerticalProductCard p={p} key={p?.id} />)
                }
              </div>
              :
              <ProductsSlider products={products} />
          }
        </div>
      </Container>
    </section>
  );
}
