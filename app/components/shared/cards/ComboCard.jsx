"use client";
import Image from "next/image";
import ProductImage from "../../../resources/product/combo (2).png";
import { useAppContext } from "@/app/context/AppContext";
import { TiStarFullOutline, TiStarOutline } from "react-icons/ti";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ComboCard({ p }) {
    const router = useRouter();
    const { token, addToWishlist, addToCartDB, addToCartDBGuest } = useAppContext();

    // Function to calculate filled stars based on rating
    const getFilledStars = (rating) => {
        if (!rating) return 0;

        const numRating = parseFloat(rating);
        const wholeNumber = Math.floor(numRating);
        const decimal = numRating - wholeNumber;

        // If decimal is 0.5 or higher, round up to next whole number
        // If decimal is less than 0.5, keep the whole number
        if (decimal >= 0.5) {
            return Math.min(wholeNumber + 1, 5);
        } else {
            return wholeNumber;
        }
    };

    // rating count here
    const ratingCount = p?.ratings?.rating;
    const filledStars = getFilledStars(ratingCount);

    // Function to render 5 stars
    const renderStars = () => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            if (i <= filledStars) {
                // Filled star
                stars.push(
                    <TiStarFullOutline key={i} className="text-orange" />
                );
            } else {
                // Empty star
                stars.push(
                    <TiStarFullOutline key={i} className="text-gray-300" />
                );
            }
        }
        return stars;
    };

    // manage add to cart 
    const handleAddToCart = (e, p) => {
        e.preventDefault();
        e.stopPropagation();
        if (token === null) {
            addToCartDBGuest(p?.id, 1, "combo")
        } else {
            addToCartDB(p?.id, 1, "combo")
        }
    };

    // manage add to wishlist 
    const handleAddToWishlist = (e, id) => {
        e.preventDefault();
        e.stopPropagation();
        if (token === null) {
            toast.error("Please login to add combo!");
            router.push("login")
        } else {
            addToWishlist(id, "combo")
        }
    }

    return (
        <Link href={`/combo/${p?.slug}`} className="group relative text-primarymagenta">
            {/* Product Image Here  */}
            <div className="flex justify-center items-center bg-[#FAFAFA] rounded-[10px] relative overflow-hidden h-[260px] lg:h-[360px]">
                <Image
                    src={p?.photo}
                    // src={ProductImage}
                    alt={p?.name}
                    height={0}
                    width={0}
                    sizes="100vw"
                    className="h-full w-full object-contain group-hover:scale-105 ease-linear duration-300"
                    style={{
                        maxWidth: '100%',
                        maxHeight: '100%',
                    }}
                />

                {/* Add to Cart Button (Fade Up) */}
                <button
                    onClick={(e) => handleAddToCart(e, p)}
                    className="opacity-0 translate-y-5 group-hover:opacity-100 group-hover:translate-y-0 transition-all ease-linear duration-300 text-[10px] lg:text-[12px] rounded-[5px] hidden md:flex justify-center items-center bg-creamline  hover:bg-natural hover:text-white py-[16px] absolute bottom-[10px] left-[10px] right-[10px] cursor-pointer"
                >
                    Add To Cart
                </button>

                {/* Wishlist Button (Fade from Right, Label shows on button hover) */}
                <button
                    onClick={(e) => handleAddToWishlist(e, p?.id)}
                    className="wishlist-btn opacity-0 translate-x-5 group-hover:opacity-100 group-hover:translate-x-0 transition-all ease-in-out duration-500 hidden md:flex items-center absolute top-[14px] right-[14px] cursor-pointer"
                >
                    <div className="wishlist-label opacity-0 translate-x-5 transition-all duration-400 ease-in-out absolute right-[60px] top-1/2 transform -translate-y-1/2">
                        <div className="wishlist-text bg-natural px-[8px] py-[4px] text-[10px] rounded-[8px] text-white font-medium whitespace-nowrap relative transition-colors duration-300">
                            Add wishlist
                            <div className="wishlist-arrow absolute top-1/2 -right-[5px] transform -translate-y-1/2 w-0 h-0 border-l-[5px] border-l-natural border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent transition-colors duration-300 z-50"></div>
                        </div>
                    </div>

                    <div className="wishlist-icon  hover:text-white bg-white hover:bg-natural p-[8px] rounded-[8px] w-fit transition-all duration-300">
                        <TiStarOutline size={16} />
                    </div>
                </button>

            </div>

            {/* Product Info */}
            <div>
                {/* <p className="text-[12px] lg:text-[14px]  mt-[20px] lg:mt-[30px] text-button uppercase">{p?.main_category?.name}</p> */}
                <p className="text-[12px] lg:text-[14px]  mt-[20px] lg:mt-[30px] text-button uppercase">Combo</p>
                <p className="text-[14px] lg:text-[18px]  mt-[10px] lg:mt-[30px] truncate">
                    {p?.name} {p?.variant && p?.variant}
                </p>

                {/* Product Ratings  */}
                {
                    (p?.ratings?.total_rating > 0 || p?.total_sold) > 0 &&
                    <div className="my-[10px] lg:my-[20px] text-[12px] lg:text-[14px] flex gap-[8px] lg:gap-[16px]">
                        {
                            p?.ratings?.total_rating > 0 &&
                            <div className="flex gap-1 items-center">
                                {renderStars()}
                                <span className="text-orange">( {p?.ratings?.total_rating} )</span>
                            </div>
                        }
                        {
                            p?.total_sold > 0 &&
                            <p className="">{p?.total_sold} Sold</p>
                        }
                    </div>
                }


                <div className="text-[14px] lg:text-[18px] mt-[10px] lg:mt-[20px]">
                    {
                        p?.discount === null ?
                            <p className="">D {p?.combo_price} Taka</p>
                            :
                            <div className="flex flex-col lg:flex-row gap-[10px]">
                                <p className="">D {p?.discount?.discount_price} Taka</p>
                                <p className="text-button line-through opacity-50">D {p?.combo_price} Taka</p>
                            </div>
                    }
                </div>

                <div className="absolute top-[10px] left-[10px] bg-natural text-white px-3 py-2 rounded-full flex items-center gap-2 text-xs">
                    <p className="">Combo</p>
                </div>
            </div>
        </Link>
    );
}