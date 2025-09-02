"use client";
import { Heart, Star, ShoppingCart, Eye } from "lucide-react";
import productImg from "@/public/productImg.jpeg";
import Image from "next/image";
import { useAppContext } from "@/app/context/AppContext";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function VerticalProductCard({ p }) {
  console.log('====================================');
  console.log(p);
  console.log('====================================');
  const router = useRouter();
  const { token, addToWishlist, addToCartDB, addToCartDBGuest, lang } = useAppContext();

  // Translation object
  const translations = {
    en: {
      addToCart: "Add to Cart",
      outOfStock: "Out of Stock",
      off: "OFF",
      sold: "sold",
      pleaseLogin: "Please login to use wishlist!"
    },
    ar: {
      addToCart: "أضف إلى السلة",
      outOfStock: "نفد من المخزون",
      off: "خصم",
      sold: "تم البيع",
      pleaseLogin: "يرجى تسجيل الدخول لاستخدام قائمة الأماني!"
    }
  };

  const t = translations[lang] || translations.en;

  // Helper function to get localized field
  const getLocalizedField = (obj, fieldName) => {
    if (!obj) return '';

    if (lang === 'ar' && obj[`ar_${fieldName}`]) {
      return obj[`ar_${fieldName}`];
    }
    return obj[fieldName] || '';
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
          className={`${i <= filledStars ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} transition-colors`}
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
      toast.error(t.pleaseLogin);
      router.push("login")
    } else {
      addToWishlist(id)
    }
  }

  const discountPercentage = p?.discount
    ? Math.round(((p?.price - p?.discount?.discount_price) / p?.price) * 100)
    : 0;

  // Get localized product data
  const productName = getLocalizedField(p, 'name');
  const categoryName = getLocalizedField(p?.main_category, 'name');
  const variantName = getLocalizedField(p, 'variant');
  return (
    <div className={`group relative ${lang === 'ar' ? 'rtl' : 'ltr'}`}>
      <Link href={`/shop/${p?.slug}?variant=${p?.variant}`} className="block">
        <div className="bg-white rounded-xl overflow-hidden border border-creamline group-hover:border-gray-200">

          {/* Product Image Container with Enhanced Hover Effects */}
          <div className="relative overflow-hidden aspect-square">
            <Image
              src={p?.main_image || productImg}
              alt={productName || "Product Image"}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-contain p-4 group-hover:scale-110 transition-transform duration-700 ease-out"
            />

            {/* Gradient Overlay on Hover */}
            {/* <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" /> */}

            {/* Badges Container */}
            <div className={`absolute top-3 ${lang === 'ar' ? 'right-3' : 'left-3'} flex flex-col gap-2 z-10`}>
              {/* Discount Badge */}
              {p?.discount && (
                <div className="bg-red-500 text-white px-3 py-1 rounded text-xs font-semibold shadow-lg animate-pulse">
                  {lang === 'ar' ? `${discountPercentage}% ${t.off}` : `${discountPercentage}% ${t.off}`}
                </div>
              )}

              {/* Stock Badge */}
              {p?.stock === 0 && (
                <div className="bg-gray-800 text-white px-3 py-1 rounded text-xs font-medium">
                  {t.outOfStock}
                </div>
              )}
            </div>

            {/* Wishlist Button */}
            <button
              onClick={(e) => handleAddToWishlist(e, p?.product_variant_id)}
              className={`absolute top-3 ${lang === 'ar' ? 'left-3' : 'right-3'} w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-white hover:shadow-lg transform hover:scale-110 transition-all duration-200 z-10`}
            >
              <Heart
                size={18}
                className="text-gray-600 hover:text-red-500 hover:fill-red-500 transition-all duration-200"
              />
            </button>

            {/* Action Buttons (Desktop) */}
            <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out hidden md:block">
              <button
                disabled={p?.stock === 0}
                onClick={(e) => handleAddToCart(e, p)}
                className="w-full py-3 px-4 rounded-xl font-medium bg-primary text-white transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingCart size={16} />
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
            <h3 className="text-primarymagenta leading-tight line-clamp-2 min-h-[40px] group-hover:text-secondary transition-colors duration-200">
              {productName}
              {variantName && (
                <span className="text-gray-600">
                  {lang === 'ar' ? ` - ${variantName}` : ` - ${variantName}`}
                </span>
              )}
            </h3>

            {/* Rating */}
            {p?.ratings?.total_rating > 0 && (
              <div className={`flex items-center gap-2 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                <div className="flex items-center gap-1">
                  {renderStars()}
                </div>
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
            <div className={`flex items-baseline gap-2 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
              {p?.discount ? (
                <>
                  <span className="text-xl font-bold text-primarymagenta">
                    <span className="dirham-symbol">ê</span> {p?.discount?.discount_price ?? "0.00"}
                  </span>
                  <span className="text-sm text-gray-500 line-through">
                    <span className="dirham-symbol">ê</span> {p?.price ?? "0.00"}
                  </span>
                </>
              ) : (
                <span className="text-xl font-bold text-primarymagenta">
                  <span className="dirham-symbol">ê</span> {p?.price ?? "0.00"}
                </span>
              )}
            </div>

            {/* Mobile Add to Cart Button */}
            <button
              disabled={p?.stock === 0}
              onClick={(e) => handleAddToCart(e, p)}
              className="md:hidden w-full bg-creamline text-primarymagenta py-3 px-4 rounded font-medium hover:bg-secondary hover:text-white transition-all duration-200 disabled:bg-gray-400 disabled:text-gray-500 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <ShoppingCart size={16} />
              {p?.stock > 0 ? t.addToCart : t.outOfStock}
            </button>
          </div>
        </div>
      </Link >
    </div >
  );
}