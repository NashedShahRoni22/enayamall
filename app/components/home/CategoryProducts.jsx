"use client";
import Container from "../shared/Container";
import ShopNowButton from "../shared/ShopNowButton";
import { useGetData } from "../helpers/useGetData";
import VerticalCardLoadingScreen from "../loaders/VerticalCardLoadingScreen";
import ProductsSlider from "../sliders/ProductsSlider";
import { usePathname } from "next/navigation";
import { useAppContext } from "@/app/context/AppContext";

export default function CategoryProducts({ categoryName, rows = 10 }) {
  const { lang } = useAppContext();
  const location = usePathname();

  if (!categoryName) return null;

  // Fetch category by name
  const {
    data: categoryData,
    isLoading: categoryLoading,
    error: categoryError,
  } = useGetData(`categories?search=${encodeURIComponent(categoryName)}`);

  const category = categoryData?.data?.[0] || null;

  if (categoryError || (!category && !categoryLoading)) {
    return null; // category not found or error
  }

  // Build query for products
  const queryParams = new URLSearchParams();
  queryParams.append("rows", rows.toString());
  if (category?.id) {
    queryParams.append("category_ids[]", category.id.toString());
  }

  // Fetch products for this category
  const {
    data: productsData,
    isLoading: productsLoading,
    error: productsError,
  } = useGetData(`products?${queryParams.toString()}`);

  if (categoryLoading || productsLoading)
    return <VerticalCardLoadingScreen value={5} lgColumns={5} />;

  if (productsError)
    return (
      <div className="text-center text-red-500 py-8">
        Error: {productsError.message}
      </div>
    );

  const products = productsData?.data?.products || productsData?.data;

  // If no products found
  if (!products || products.length === 0) {
    return "";
    //   <section className={`${location === "/" && "py-6"}`}>
    //     <Container>
    //       <div className="text-center py-8">
    //         <h5 className="text-[22px] 2xl:text-[30px] text-primaryblack mb-4">
    //           <span className="font-bold text-sectionTitle">
    //             {categoryName || (lang === "en" ? "Products" : "المنتجات")}
    //           </span>
    //         </h5>
    //         <p className="text-gray-500">
    //           {lang === "en"
    //             ? "No products found in this category"
    //             : "لا توجد منتجات في هذه الفئة"}
    //         </p>
    //       </div>
    //     </Container>
    //   </section>
  }

  return (
    <section className={`${location === "/" && "py-6"}`}>
      {products?.length > 0 && (
        <Container>
          {location === "/" && (
            <section className={`flex justify-between items-center border-b border-[#008add] ${lang === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
              {/* caption here  */}
              <div className="border-b-4 border-[#008add]">
                <h5 className="text-[22px] 2xl:text-[30px] text-primaryblack text-center lg:text-left">
                  <span className="font-bold text-primaryblack">
                    {(lang === 'en' ? category?.name : category?.ar_name) ||
                      (lang === "en" ? "Products" : "المنتجات")
                    }
                  </span>
                </h5>
              </div>
              {
                location !== '/recommended-product' &&
                <div>
                  <ShopNowButton route={`category/${category?.slug}`} />
                </div>
              }
            </section>
          )}

          <div>
            <ProductsSlider products={products} />
          </div>
        </Container>
      )}
    </section>
  );
}
