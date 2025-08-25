import Image from "next/image";
import { TiStarFullOutline, TiStarOutline } from "react-icons/ti";

export default function TestimonialCardProductDetails({ review }) {
    // Function to render stars based on rating
    const renderStars = (rating) => {
        const stars = [];
        const numRating = Number(rating) || 0;

        for (let i = 1; i <= 5; i++) {
            if (i <= numRating) {
                // Filled star
                stars.push(
                    <span key={i} className="text-yellow-400 text-[18px]"> <TiStarFullOutline/> </span>
                );
            } else {
                // Empty star
                stars.push(
                    <span key={i} className="text-gray-300 text-[18px]"> <TiStarOutline/> </span>
                );
            }
        }
        return stars;
    };

    return (
        <section className="flex flex-col md:flex-row gap-[20px] lg:gap-[100px]">
            <div className="flex gap-[14px] md:w-1/4">
                <Image
                    alt="user image"
                    src={ review?.customer_avatar ? review?.customer_avatar : userImage}
                    height={48}
                    width={48}
                    className="rounded-full object-cover h-fit"
                />
                <div className="flex-1 flex justify-between">
                    <div>
                        <p className="text-[16px] text-button">{review?.customer_name}</p>
                        <p className="text-[14px] text-natural">{review?.customer_city}</p>
                    </div>

                    <p className="text-primarymagenta text-[16px] md:hidden">{review?.created_at}</p>
                </div>
            </div>

            <div className="md:w-2/4">
                {/* Rating stars - shown on mobile after customer info */}
                <div className="flex items-center gap-2 mt-2 md:hidden">
                    <div className="flex items-center">
                        {renderStars(review?.rating)}
                    </div>
                    <span className="text-[14px] text-natural">({review?.rating}/5)</span>
                </div>
                <p className="text-[16px] text-button">
                    {review?.rating_title}
                </p>
                <p className="text-[14px] text-primarymagenta mt-[8px] leading-[21px]">
                    {review?.review}
                </p>

                {/* Compact Review Images - Smart Sizing */}
                <div className="mt-5 flex gap-4">
                    {review?.images?.slice(0, 3).map((img, index) => (
                        <div key={index} className="w-[100px] h-[100px] overflow-hidden rounded-[10px]">
                        <Image
                            alt="product review image"
                            src={img}
                            width={500}
                            height={500}
                            className="object-cover w-full h-full"
                            loading="lazy"
                        />
                        </div>
                    ))}
                </div>
            </div>

            {/* Rating and Date - hidden on mobile, shown on desktop */}
            <div className="hidden md:flex md:w-1/4 gap-[80px] items-start">
                <div className="flex flex-col items-center gap-1">
                    <div className="flex items-center">
                        {renderStars(review?.rating)}
                    </div>
                </div>
                <p className="text-primarymagenta text-[16px]">{review?.created_at}</p>
            </div>
        </section>
    )
}