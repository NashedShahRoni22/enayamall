import VerticalCardLoadingScreen from '../loaders/VerticalCardLoadingScreen';
import HorizontalProductCard from '../shared/cards/HorizontalProductCard';
import VerticalProductCard from '../shared/cards/VerticalProductCard'

export default function ProductsPage({
    viewStyle,
    isLoading,
    products,
    error,
    gridCount
}) {
    if (isLoading) return <VerticalCardLoadingScreen value={5} lgColumns={5} />;
    if (error) return <div>Error: {error.message}</div>;

    const verticalGridClasses = `grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-x-[16px] gap-y-[16px]`;
    return (
        <>
            {
                products?.length > 0 ? (
                    <div>
                        {
                            viewStyle === 0 ? (
                                <div className={verticalGridClasses}>
                                    {products.map((p, index) => (
                                        <VerticalProductCard key={index} p={p} />
                                    ))}
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-x-[16px] gap-y-[16px]">
                                    {products.map((p, index) => (
                                        <HorizontalProductCard key={index} p={p} />
                                    ))}
                                </div>
                            )
                        }
                    </div>
                ) : (
                    <div className="w-full h-[50vh] flex justify-center items-center">
                        <p className="text-3xl text-secondary">No products found</p>
                    </div>  
                )
            }
        </>
    )
}