export default function VerticalCardSkleton() {
    return (
        <div className="group relative animate-pulse">
            {/* Image Container Skeleton */}
            <div className="flex justify-center items-center bg-[#FAFAFA] rounded-[10px] relative overflow-hidden h-[260px]">
                <div className="w-[100px] h-[160px] bg-gray-200 rounded-md"></div>

                {/* Add to Cart Button Placeholder */}
                <div className="opacity-0 translate-y-5 group-hover:opacity-100 group-hover:translate-y-0 transition-all ease-linear duration-300 text-[10px] lg:text-[12px] rounded-[5px] flex justify-center items-center bg-white py-[16px] absolute bottom-[10px] left-[10px] right-[10px]">
                    <div className="w-full h-[20px] bg-gray-300 rounded"></div>
                </div>

                {/* Wishlist Button Placeholder */}
                <div className="wishlist-btn opacity-0 translate-x-5 group-hover:opacity-100 group-hover:translate-x-0 transition-all ease-in-out duration-500 flex items-center absolute top-[14px] right-[14px]">
                    <div className="wishlist-icon bg-gray-300 p-[8px] rounded-[8px] w-[32px] h-[32px]"></div>
                </div>
            </div>

            {/* Product Info Skeleton */}
            <div className="mt-[24px] space-y-[16px]">
                <div className="h-[12px] w-[80px] bg-gray-300 rounded"></div>
                <div className="h-[16px] w-[70%] bg-gray-300 rounded mt-[30px]"></div>

                {/* Rating & Sold */}
                <div className="my-[24px] text-[12px] flex flex-col lg:flex-row gap-[8px] lg:gap-[16px]">
                    <div className="flex gap-1">
                        <div className="w-[80px] h-[12px] bg-gray-300 rounded"></div>
                    </div>
                    <div className="w-[60px] h-[12px] bg-gray-300 rounded"></div>
                </div>

                {/* Price Skeleton */}
                <div className="text-[14px] flex gap-[10px]">
                    <div className="w-[80px] h-[14px] bg-gray-300 rounded"></div>
                    <div className="w-[60px] h-[14px] bg-gray-200 rounded"></div>
                </div>
            </div>
        </div>

    )
}
