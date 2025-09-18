import Container from "../shared/Container";
import ShopNowButton from "../shared/ShopNowButton";
import { useGetData } from "../helpers/useGetData";
import VerticalCardLoadingScreen from "../loaders/VerticalCardLoadingScreen";
import ProductsSlider from "../sliders/ProductsSlider";
import { usePathname } from "next/navigation";
import { useAppContext } from "@/app/context/AppContext";

export default function CategoryProducts({ category, rows = 10 }) {
    const { lang } = useAppContext();
    const location = usePathname();
    
    // Define allowed category names
    const allowedCategories = ["Body Care", "Baby Care", "Hair Care", "Makeup"];
    
    // Check if category should be rendered
    const shouldRenderCategory = () => {
        if (!category?.name) return false;
        return allowedCategories.some(allowedName => 
            category.name.toLowerCase().includes(allowedName.toLowerCase()) ||
            allowedName.toLowerCase().includes(category.name.toLowerCase())
        );
    };

    // If category is not in allowed list, don't render anything
    if (!shouldRenderCategory()) {
        return null;
    }
    
    // Build query parameters for the products API
    const buildQueryParams = () => {
        const params = new URLSearchParams();
        
        // Add rows parameter
        params.append('rows', rows.toString());
        
        // Add category_ids[] parameter if category exists
        if (category?.id) {
            params.append('category_ids[]', category.id.toString());
        }
        
        return params.toString();
    };

    // Fetch products based on category
    const queryString = buildQueryParams();
    const { data, isLoading, error } = useGetData(`products?${queryString}`);

    if (isLoading) return <VerticalCardLoadingScreen value={5} lgColumns={5} />;
    if (error) return <div className="text-center text-red-500 py-8">Error: {error.message}</div>;

    const products = data?.data?.products || data?.data;

    // If no products found for this category
    if (!products || products.length === 0) {
        return (
            <section className={`${location === "/" && "py-6 lg:py-12"}`}>
                <Container>
                    <div className="text-center py-8">
                        <h5 className="text-[22px] 2xl:text-[30px] text-primaryblack mb-4">
                            <span className="font-bold text-sectionTitle">
                                {category?.name || (lang === 'en' ? 'Products' : 'المنتجات')}
                            </span>
                        </h5>
                        <p className="text-gray-500">
                            {lang === 'en' ? 'No products found in this category' : 'لا توجد منتجات في هذه الفئة'}
                        </p>
                    </div>
                </Container>
            </section>
        );
    }

    return (
        <section className={`${location === "/" && "py-6 lg:py-12"}`}>
            <Container>
                {/* Header section */}
                {location === "/" && (
                    <section className="flex flex-row justify-between items-center mb-6">
                        {/* Category title */}
                        <div>
                            <h5 className="text-[22px] 2xl:text-[30px] text-primaryblack text-center lg:text-left">
                                <span className="font-bold text-sectionTitle">
                                    {category?.name || (lang === 'en' ? 'Products' : 'المنتجات')}
                                </span>
                            </h5>
                        </div>

                        <div>
                            <ShopNowButton route={`category/${category?.slug}`} />
                        </div>
                    </section>
                )}

                {/* Products section */}
                <div>
                    <ProductsSlider products={products} />
                </div>
            </Container>
        </section>
    );
}