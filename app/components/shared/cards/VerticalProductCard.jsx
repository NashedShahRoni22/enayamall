"use client";
import { Heart, Star, ShoppingBag } from "lucide-react";
import productImg from "@/public/productImg.jpeg";
import Image from "next/image";
import { useAppContext } from "@/app/context/AppContext";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function VerticalProductCard({ p }) {
  const router = useRouter();
  const { token, addToWishlist, addToCartDB, addToCartDBGuest, lang } =
    useAppContext();

  // Translation object
  const translations = {
    en: {
      addToCart: "Add to Cart",
      outOfStock: "Out of Stock",
      off: "OFF",
      sold: "sold",
      pleaseLogin: "Please login to use wishlist!",
    },
    ar: {
      addToCart: "أضف إلى السلة",
      outOfStock: "نفد من المخزون",
      off: "خصم",
      sold: "تم البيع",
      pleaseLogin: "يرجى تسجيل الدخول لاستخدام قائمة الأماني!",
    },
  };

  const t = translations[lang] || translations.en;

  // Helper function to get localized field
  const getLocalizedField = (obj, fieldName) => {
    if (!obj) return "";

    if (lang === "ar" && obj[`ar_${fieldName}`]) {
      return obj[`ar_${fieldName}`];
    }
    return obj[fieldName] || "";
  };

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
          size={12}
          className={`${
            i <= filledStars
              ? "fill-yellow-400 text-yellow-400"
              : "text-gray-300"
          } transition-colors`}
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
      addToCartDBGuest(p?.product_variant_id, 1);
    } else {
      addToCartDB(p?.product_variant_id, 1);
    }
  };

  // manage add to wishlist
  const handleAddToWishlist = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    if (token === null) {
      toast.error(t.pleaseLogin);
      router.push("login");
    } else {
      addToWishlist(id);
    }
  };

  const discountPercentage = p?.discount
    ? Math.round(((p?.price - p?.discount?.discount_price) / p?.price) * 100)
    : 0;
  const query = p?.variant ? `?variant=${p?.variant}` : ''
  // Get localized product data
  const productName = getLocalizedField(p, "name");
  const categoryName = getLocalizedField(p?.main_category, "name");
  const variantName = getLocalizedField(p, "variant");
  return (
    <div className={`group relative ${lang === "ar" ? "rtl" : "ltr"}`}>
      <Link href={`/shop/${p?.slug}${query}`} className="block">
        <div className="bg-white rounded-xl overflow-hidden border border-creamline group-hover:border-gray-200">
          {/* Product Image Container with Enhanced Hover Effects */}
          <div className="relative overflow-hidden aspect-square">
            <Image
              src={p?.main_image || productImg}
              alt={productName || "Product Image"}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-contain p-8 pb-0 group-hover:scale-110 transition-transform duration-700 ease-out"
            />

            {/* Gradient Overlay on Hover */}
            {/* <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" /> */}

            {/* Badges Container */}
            <div
              className={`absolute top-3 ${
                lang === "ar" ? "right-3" : "left-3"
              } flex flex-col gap-2 z-10`}
            >
              {/* Discount Badge */}
              {p?.discount && (
                <div className="bg-primary text-white px-3 py-1 rounded text-xs font-semibold shadow-lg animate-pulse">
                  {lang === "ar"
                    ? `${discountPercentage}% ${t.off}`
                    : `${discountPercentage}% ${t.off}`}
                </div>
              )}

              {/* Stock Badge */}
              {p?.stock === 0 && (
                <div className="bg-primary text-white px-3 py-1 rounded text-xs font-medium">
                  {t.outOfStock}
                </div>
              )}
            </div>

            {/* Wishlist Button */}
            <button
              onClick={(e) => handleAddToWishlist(e, p?.product_variant_id)}
              className={`absolute top-3 ${
                lang === "ar" ? "left-3" : "right-3"
              } flex items-center justify-center`}
            >
              <Heart
                size={24}
                strokeWidth={1}
                className="text-[var(--color-primary)] hover:text-[var(--color-primary)] hover:fill-[var(--color-primary)] transition-all duration-200 cursor-pointer"
              />
            </button>

            {/* Action Buttons (Desktop) */}
            <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out hidden md:block">
              <button
                disabled={p?.stock === 0}
                onClick={(e) => handleAddToCart(e, p)}
                className="w-full py-2 px-4 rounded-lg text-sm bg-primary text-white transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingBag size={16} />
                {p?.stock > 0 ? t.addToCart : t.outOfStock}
              </button>
            </div>
          </div>

          {/* Product Information */}
          <div className="p-4 space-y-3">
            {/* Category */}
            {/* <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider line-through">
                {categoryName}
              </span>
              {p?.total_sold > 0 && (
                <span className="text-xs text-gray-500 bg-creamline px-2 py-1 rounded">
                  {lang === 'ar' ? `${p?.total_sold} ${t.sold}` : `${p?.total_sold} ${t.sold}`}
                </span>
              )}
            </div> */}

            {/* Product Name */}
            <span className={`text-primaryblack text-[14px] mb-0 leading-tight line-clamp-2 min-h-[36px] group-hover:text-primary transition-colors duration-200 ${lang === "ar" ? "text-right" : "text-left"}`}>
              {productName}
              {variantName && (
                <span className="text-gray-600">
                  {lang === "ar" ? ` - ${variantName}` : ` - ${variantName}`}
                </span>
              )}
            </span>

            {/* Rating */}
            {p?.ratings?.total_rating > 0 && (
              <div
                className={`flex items-center gap-2 ${
                  lang === "ar" ? "flex-row-reverse" : ""
                }`}
              >
                <div className="flex items-center gap-1">{renderStars()}</div>
                <span className="text-xs text-gray-600">
                  ({p?.ratings?.total_rating})
                </span>
                {ratingCount && (
                  <span className="text-xs font-medium text-yellow-600">
                    {parseFloat(ratingCount).toFixed(1)}
                  </span>
                )}
              </div>
            )}

            {/* Price */}
            <div
              className={`flex items-end mb-0 justify-between ${
                lang === "ar" ? "flex-row-reverse" : ""
              }`}
            >
              <div
                className={`float-left block gap-2 ${
                  lang === "ar" ? "float-right" : ""
                }`}
              >
                {p?.discount ? (
                  <>
                    <span className="text-xl font-bold text-primaryblack flex items-center">
                      <span className="dirham-symbol text-[17px] mr-1">ê</span>{" "}
                      {p?.discount?.discount_price ?? "0.00"}
                    </span>
                    <span
                      className={`text-sm text-gray-500 line-through flex items-center ${
                        lang === "ar" ? "justify-end" : "justify-start"
                      }`}
                    >
                      {p?.price ?? "0.00"}
                    </span>
                  </>
                ) : (
                  <span className="text-xl font-bold text-primaryblack flex items-center min-h-[48px]">
                    <span className="dirham-symbol text-[17px] mr-1">ê</span>{" "}
                    {p?.price ?? "0.00"}
                  </span>
                )}
              </div>
              {/* Express delivery */}
              {p?.is_express && (
                <div className="relative inline-block">
                  <img
                    src="https://enayamall.com/image/express.png"
                    alt="Express"
                    className="cursor-pointer peer"
                    width={60}
                  />
                  <span
                    className={`absolute bottom-full mb-2 ${
                      lang === "ar" ? "left-0" : "right-0"
                    }
                   hidden peer-hover:block bg-primary text-white text-xs 
                   px-2 py-1 rounded whitespace-nowrap pointer-events-none`}
                  >
                    Express Delivery
                  </span>
                </div>
              )}
            </div>

            {/* Mobile Add to Cart Button */}
            <button
              disabled={p?.stock === 0}
              onClick={(e) => handleAddToCart(e, p)}
              className="md:hidden text-[12px] sm:text-sm mt-2 w-full bg-creamline text-primaryblack py-2 px-2 rounded-lg font-medium hover:bg-primary hover:text-white transition-all duration-200 disabled:bg-gray-400 disabled:text-gray-500 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <ShoppingBag size={16} />
              {p?.stock > 0 ? t.addToCart : t.outOfStock}
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
}
