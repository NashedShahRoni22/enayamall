import VerticalCardLoadingScreen from '../loaders/VerticalCardLoadingScreen';
import HorizontalProductCard from '../shared/cards/HorizontalProductCard';
import VerticalProductCard from '../shared/cards/VerticalProductCard'

export default function Products({
    viewStyle,
    isLoading,
    products,
    error,
    gridCount
}) {
    if (isLoading) return <VerticalCardLoadingScreen value={6} />;
    if (error) return <div>Error: {error.message}</div>;

    const gridColsClass = {
        2: '2xl:grid-cols-2',
        3: '2xl:grid-cols-3',
        4: '2xl:grid-cols-4',
        5: '2xl:grid-cols-5',
        6: '2xl:grid-cols-6',
    }[gridCount] || '2xl:grid-cols-4';
    const verticalGridClasses = `grid grid-cols-2 md:grid-cols-3 ${gridColsClass} gap-x-[16px] gap-y-[16px]`;
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
                    <div className="w-full h-[50vh] flex justify-center items-center flex-1">
                        <p className="text-3xl text-secondary">No products found</p>
                    </div>
                )
            }
        </>
    )
}