"use client";
import { Heart, Star } from "lucide-react";
import productImg from "@/public/productImg.jpeg";
import Image from "next/image";
import { useAppContext } from "@/app/context/AppContext";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function VerticalProductCard({ p }) {
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

  const ratingCount = p?.ratings?.rating;
  const filledStars = getFilledStars(ratingCount);

  // Function to render 5 stars
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star 
          key={i} 
          size={14} 
          className={`${i <= filledStars ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
        />
      );
    }
    return stars;
  };

  // manage add to cart 
  const handleAddToCart = (e, p) => {
    e.preventDefault();
    e.stopPropagation();
    if (token === null) {
      addToCartDBGuest(p?.product_variant_id, 1)
    } else {
      addToCartDB(p?.product_variant_id, 1)
    }
  };

  // manage add to wishlist 
  const handleAddToWishlist = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    if (token === null) {
      toast.error("Please login to use wishlist!");
      router.push("login")
    } else {
      addToWishlist(id)
    }
  }

  return (
    <Link href={`/shop/${p?.slug}?variant=${p?.variant}`} className="group">
      <div className="p-3 lg:p-4 shadow rounded hover:shadow-lg transition-shadow duration-300">
        {/* Product Image Here with hover effects */}
        <div className="relative overflow-hidden rounded mb-3 lg:mb-4 h-[200px] lg:h-[300px] flex justify-center items-center">
          <Image 
            src={p?.main_image || productImg} 
            alt={p?.name || "Product Image"} 
            height={0}
            width={0}
            sizes="100vw"
            className="h-full w-full object-contain group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Discount Badge */}
          {p?.discount && (
            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
              {Math.round(((p?.price - p?.discount?.discount_price) / p?.price) * 100)}% OFF
            </div>
          )}

          {/* Add to Cart Button (Fade Up) */}
          <button
            disabled={p?.stock === 0}
            onClick={(e) => handleAddToCart(e, p)}
            className="opacity-0 translate-y-5 group-hover:opacity-100 group-hover:translate-y-0 transition-all ease-linear duration-300 text-[10px] lg:text-[12px] rounded-[5px] hidden md:flex justify-center items-center bg-creamline hover:bg-secondary hover:text-white py-[16px] absolute bottom-[10px] left-[10px] right-[10px] cursor-pointer disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"
          >
            {p?.stock > 0 ? "Add To Cart" : "Out of stock"}
          </button>
        </div>

        {/* Category and Wishlist */}
        <div className="flex justify-between items-center mt-[20px] lg:mt-[30px]">
          <p className="text-[12px] lg:text-[14px] text-secondary uppercase">
            {p?.main_category?.name}
          </p>
          <button
            onClick={(e) => handleAddToWishlist(e, p?.product_variant_id)}
            className="cursor-pointer"
          >
            <Heart 
              size={16} 
              className="text-secondary hover:text-red-500 transition-colors duration-200" 
            />
          </button>
        </div>

        {/* Product name after image */}
        <p className="text-primarymagenta text-[14px] lg:text-[18px] mt-[10px] lg:mt-[30px] line-clamp-2">
          {p?.name} {p?.variant && <span>- {p?.variant}</span>}
        </p>
        
        {/* Rating section */}
        {p?.ratings?.total_rating > 0 && (
          <div className="mt-[10px] lg:mt-[20px] text-[12px] lg:text-[14px] flex gap-[8px] lg:gap-[16px] text-primarymagenta">
            <div className="flex gap-1 items-center">
              <div className="flex">
                {renderStars()}
              </div>
              <span className="text-yellow-400 ml-1">( {p?.ratings?.total_rating} )</span>
            </div>
            {p?.total_sold > 0 && (
              <p className="text-gray-600">{p?.total_sold} Sold</p>
            )}
          </div>
        )}
        
        {/* price & discount here */}
        <div className="text-[14px] lg:text-[18px] mt-[10px] lg:mt-[20px] text-primarymagenta">
          {p?.discount ? (
            <div className="flex flex-col lg:flex-row gap-[10px]">
              <p className="text-gray-800">৳ {p?.discount?.discount_price} Taka</p>
              <p className="text-gray-500 line-through opacity-50">৳ {p?.price} Taka</p>
            </div>
          ) : (
            <p className="text-gray-800">৳ {p?.price} Taka</p>
          )}
        </div>

        {/* Mobile Add to Cart Button */}
        <button
          disabled={p?.stock === 0}
          onClick={(e) => handleAddToCart(e, p)}
          className="md:hidden w-full mt-3 py-2 px-4 bg-gray-800 text-white rounded text-sm font-medium hover:bg-gray-700 transition-colors disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
        >
          {p?.stock > 0 ? "Add To Cart" : "Out of stock"}
        </button>
      </div>
    </Link>
  );
}