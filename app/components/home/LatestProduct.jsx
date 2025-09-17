import Container from "../shared/Container";
import ShopNowButton from "../shared/ShopNowButton";
import VerticalProductCard from "../shared/cards/VerticalProductCard";
import { useGetData } from "../helpers/useGetData";
import VerticalCardLoadingScreen from "../loaders/VerticalCardLoadingScreen";
import ProductsSlider from "../sliders/ProductsSlider";
import { usePathname } from "next/navigation";
import { useAppContext } from "@/app/context/AppContext";

export default function LatestProduct() {
  const { lang } = useAppContext();
  // fetch products
  const { data, isLoading, error } = useGetData(`products`);
  const location = usePathname();
  if (isLoading) return <VerticalCardLoadingScreen value={5} lgColumns={5}/>;
  if (error) return <div>Error: {error.message}</div>;

  const products = data?.data;

  return (
    <section className={`${location === "/" && "py-[30px]"}`}>
      <Container>
        {/* starting section  */}
        {
          location === "/" &&
          <section className="flex flex-row justify-between">
            {/* caption here  */}
            <div>
              <h5 className="text-xl md:text-3xl font-semibold text-gray-800">
                <span className="text-primary">
                  {lang === 'en' ? 'New' : 'وصل حديثًا'}
                </span>{' '}
                {lang === 'en' ? 'Arrival' : ''}
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