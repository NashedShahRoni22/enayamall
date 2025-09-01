import VerticalCardLoadingScreen from '../loaders/VerticalCardLoadingScreen';
import HorizontalProductCard from '../shared/cards/HorizontalProductCard';
import VerticalProductCard from '../shared/cards/VerticalProductCard'

export default function Products({
    viewStyle,
    isLoading,
    products,
    error }) {
    if (isLoading) return <VerticalCardLoadingScreen value={6} />;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <>
            {
                products?.length > 0 ?
                    <div>
                        {
                            viewStyle === 0 ?
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-2 2xl:grid-cols-4 gap-x-[18px] gap-y-[30px] lg:gap-x-[24px] lg:gap-y-[40px]">
                                    {products?.map((p, index) => (
                                        <VerticalProductCard key={index} p={p} />
                                    ))}
                                </div>
                                :
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 2xl:grid-cols-2 gap-x-[18px] gap-y-[30px] lg:gap-x-[24px] lg:gap-y-[30px]">
                                    {products?.map((p, index) => (
                                        <HorizontalProductCard key={index} p={p} />
                                    ))}
                                </div>
                        }
                    </div>
                    :
                    <div className="w-full h-[50vh] flex justify-center items-center flex-1">
                        <p className="text-3xl text-secondary">No products found</p>
                    </div>
            }
        </>
    )
}