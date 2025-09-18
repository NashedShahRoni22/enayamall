import Image from "next/image";
import { GoPlus } from "react-icons/go";
import { AiOutlineMinus } from "react-icons/ai";
import { TiStarFullOutline } from "react-icons/ti";
import {
  Heart,
  MessageCircleQuestion,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAppContext } from "@/app/context/AppContext";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  BsFacebook,
  BsMessenger,
  BsTwitter,
  BsWhatsapp,
} from "react-icons/bs";
import { useGetDataWithToken } from "../helpers/useGetDataWithToken";

export default function ProductDetails({
  token,
  slug,
  product,
  setReviewable,
  setIsWishlisted,
  isWishlisted,
}) {
  const { addToWishlist, addToCartDB, addToCartDBGuest, lang } =
    useAppContext();
  const router = useRouter();
  const [defaultQuantity, setDefaultQuantity] = useState(1);
  const { affiliateData } = useGetDataWithToken("get-affiliate-info", token);
  const affiliatedUserDetails = affiliateData?.data;

  // Localization helper function
  const getText = (key, dynamicValue = null) => {
    const texts = {
      aboutThisItem: lang === "en" ? "About this item:" : "حول هذا المنتج:",
      basedOnRatings: lang === "en" ? "Based on" : "بناء على",
      ratings: lang === "en" ? "Ratings" : "تقييمات",
      save: lang === "en" ? "Save" : "وفر",
      addToCart: lang === "en" ? "Add to cart" : "أضف إلى السلة",
      outOfStock: lang === "en" ? "Out of Stock" : "نفد المخزون",
      buyItNow: lang === "en" ? "Buy it Now" : "اشتري الآن",
      askAQuestion: lang === "en" ? "Ask a Question" : "اطرح سؤالاً",
      socialShare: lang === "en" ? "Social Share" : "مشاركة اجتماعية",
      callForOrder: lang === "en" ? "Call for Order" : "اتصل للطلب",
      productCode: lang === "en" ? "SKU:" : "رمز المنتج:",
      availableStock: lang === "en" ? "Available Stock:" : "المخزون المتاح:",
      items: lang === "en" ? "items" : "عناصر",
      categories: lang === "en" ? "Categories:" : "الفئات:",
      tags: lang === "en" ? "Tags:" : "العلامات:",
      benefitsTitle:
        lang === "en" ? "The benefits of choosing us" : "فوائد اختيارنا",
      authenticProduct: lang === "en" ? "Authentic Product" : "منتج أصلي",
      competitivePricing:
        lang === "en" ? "Competitive Pricing" : "أسعار تنافسية",
      skincareGuidance:
        lang === "en" ? "Skincare Guidance" : "إرشادات العناية بالبشرة",
      fastDelivery: lang === "en" ? "Fast Delivery" : "توصيل سريع",
      pleaseLoginToUseWishlist:
        lang === "en"
          ? "Please login to use wishlist!"
          : "يرجى تسجيل الدخول لاستخدام قائمة الأمنيات!",
      checkOutThisProduct:
        lang === "en" ? "Check out this product" : "تحقق من هذا المنتج",
    };

    if (dynamicValue !== null) {
      return texts[key] + " " + dynamicValue;
    }

    return texts[key];
  };

  // share product
  const productUrl = `${process.env.NEXT_PUBLIC_WEB_SHOP_BASE_URL}${slug}`;
  const affProductUrl = `${process.env.NEXT_PUBLIC_WEB_SHOP_BASE_URL}${slug}?tracking=${affiliatedUserDetails?.affiliate_code}`;

  const shareUrl = affiliatedUserDetails?.affiliate_code
    ? affProductUrl
    : productUrl;

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

  const ratingCount = product?.ratings?.rating;
  const filledStars = getFilledStars(ratingCount);

  // Function to render 5 stars
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= filledStars) {
        // Filled star
        stars.push(
          <TiStarFullOutline key={i} className="text-orange text-[18px]" />
        );
      } else {
        // Empty star
        stars.push(
          <TiStarFullOutline key={i} className="text-gray-300 text-[18px]" />
        );
      }
    }
    return stars;
  };

  // Update reviewable state when component mounts
  useEffect(() => {
    if (product?.variant) {
      setReviewable(product.variant.is_reviewable);
      setIsWishlisted(product.variant.is_wishlisted);
    }
  }, [product]);

  // manage add to cart
  const handleAddToCart = (p, type) => {
    let price = p?.variant?.discount?.discount_price
      ? p?.variant?.discount?.discount_price
      : p?.variant?.price;

    if (token === null) {
      addToCartDBGuest(
        p?.variant?.product_variant_id,
        defaultQuantity
      );
    } else {
      addToCartDB(
        p?.variant?.product_variant_id,
        defaultQuantity
      );
    }
    if (type === "now") {
      router.push("/checkout");
    }
  };

  // manage add to wishlist
  const handleAddToWishlist = (p) => {
    if (token === null) {
      toast.error(getText("pleaseLoginToUseWishlist"));
      router.push("/login");
    } else {
      addToWishlist(p?.variant?.product_variant_id);
      setIsWishlisted(true);
    }
  };


  // get free shipping info 
  const [freeShippingAmount, setFreeShippingAmount] = useState(null);

  useEffect(() => {
    async function fetchFreeShipping() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_WEB_API_BASE_URL}amount-to-reach-for-free-shipping`
        );
        const json = await res.json();
        if (json?.status === "success") {
          setFreeShippingAmount(json.data);
        }
      } catch (error) {
        console.error("Error fetching free shipping:", error);
      }
    }
    fetchFreeShipping();
  }, []);

  return (
    <div>
      {/* brand logo here  */}
      <Link
        href={`/brand/${product?.brand?.slug}`}
        className={`flex ${lang === "ar" ? "flex-row-reverse" : ""
          } gap-4 items-center`}
      >
        <Image
          src={product?.brand?.image}
          alt={
            lang === "en"
              ? product?.brand?.name
              : product?.brand?.ar_name || product?.brand?.name
          }
          height={400}
          width={500}
          sizes=""
          className="w-[80px] border border-creamline p-2 rounded-[10px] mb-[20px] object-contain"
        />
      </Link>
      <h1 className="text-primaryblack text-[20px] 2xl:text-[24px] font-[500]">
        {lang === "en" ? product?.name : product?.ar_name || product?.name}
      </h1>

      {/* ratings */}
      {ratingCount > 0 && (
        <div className="flex gap-[20px] align-center mt-2">
          <div className="flex gap-[4px] items-center">
            {renderStars()}
            <p className="text-[14px] 2xl:text-[16px] font-[550] text-primaryblack ml-2">
              ( {product?.ratings?.rating || 0} )
            </p>
          </div>
          <p className="text-[14px] 2xl:text-[16px] text-[#4CA9DF]">
            {getText("basedOnRatings")} {product?.ratings?.total_rating || 0}{" "}
            {getText("ratings")}
          </p>
        </div>
      )}

      <div className="my-[15px] h-[.5px] bg-creamline w-full"></div>

      <div className="flex justify-between">
        {product?.is_express && (
          <div
            className={`relative flex mb-[20px] ${lang === "ar" ? "flex-row-reverse" : "flex-row"
              }`}
          >
            <img src="/express.png" alt="Express" className="peer" width={80} />
            <span
              className={`absolute bottom-full mb-2 ${lang === "ar" ? "right-0" : "left-0"
                }
                   hidden peer-hover:block bg-white border border-primary text-primary text-xs 
                   px-2 py-1 rounded whitespace-nowrap pointer-events-none`}
            >
              {lang === "en"
                ? "This product offers Express Delivery"
                : "هذا المنتج يقدم توصيل سريع"}
            </span>
          </div>
        )}

        {/* Free Shipping */}
        {(() => {
          if (!product?.variant) return null;

          const hasDiscount = product?.variant?.discount;
          const price = hasDiscount
            ? product?.variant?.discount?.discount_price
            : product?.variant?.price;

          return (
            freeShippingAmount != null &&
            price > freeShippingAmount && (
              <div className="relative inline-block">
                <div className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 inset-ring inset-ring-green-600/20 mb-3">
                  This product offer free shipping
                </div>
              </div>
            )
          );
        })()}
      </div>

      {/* pricing */}
      <div className="text-[20px] 2xl:text-[26px] text-secondary flex items-center gap-[10px] mb-[20px]">
        {(() => {
          if (!product?.variant) return null;

          const hasDiscount = product?.variant?.discount;

          if (hasDiscount) {
            return (
              <div className="flex flex-col 2xl:flex-row 2xl:items-center gap-[10px]">
                <div className="flex gap-[10px] items-center font-semibold">
                  <p className="flex items-center">
                    <span className="dirham-symbol mr-1">ê</span>{" "}
                    {product?.variant?.discount?.discount_price}
                  </p>
                  <p className="flex items-center text-ash line-through font-[300]">
                    {product?.variant?.price}
                  </p>
                </div>
              </div>
            );
          }

          return (
            <div className="font-semibold flex align-center">
              <span className="dirham-symbol mr-1">ê</span>{" "}
              {product?.variant?.price}
            </div>
          );
        })()}
      </div>

      {/* user actions */}
      <div className="flex gap-[10px] 2xl:gap-[20px] items-center">
        {/* quantity selector */}
        <div className="flex items-center gap-[10px] rounded-[10px] text-[18px] 2xl:text-[22px] justify-center bg-white border border-creamline h-[50px]">
          <button
            disabled={defaultQuantity === 1}
            className="cursor-pointer text-primaryblack hover:text-primary rounded-full p-2"
            onClick={() => setDefaultQuantity(defaultQuantity - 1)}
          >
            <AiOutlineMinus />
          </button>
          <input
            min={1}
            value={defaultQuantity}
            readOnly
            className="w-8 text-center bg-transparent focus:outline-none text-primaryblack"
          />
          <button
            className="cursor-pointer text-primaryblack hover:text-primary rounded-full p-2"
            onClick={() => setDefaultQuantity(defaultQuantity + 1)}
          >
            <GoPlus />
          </button>
        </div>

        {/* add to cart */}
        <button
          disabled={product?.variant?.stock === 0}
          onClick={() => handleAddToCart(product)}
          className={`cursor-pointer disabled:cursor-not-allowed flex-1 h-[50px] rounded-[10px] bg-primary  text-white disabled:text-white hover:text-white ease-linear duration-300 text-[14px] 2xl:text-[18px] flex items-center justify-center`}
        >
          {product?.variant?.stock > 0 ? getText("addToCart") : getText("outOfStock")}
        </button>

        {/* add to wishlist  */}
        <button
          disabled={isWishlisted}
          onClick={() => handleAddToWishlist(product)}
          className={`cursor-pointer w-[50px] h-[50px] rounded-full border border-creamline flex justify-center items-center text-[#D0D0D0] hover:bg-primary hover:text-white ease-linear duration-300 text-[24px] ${isWishlisted && " bg-secondary text-white"
            }`}
        >
          <Heart />
        </button>
      </div>

      {/* ask que, share or call from here  */}
      <div className="mt-[30px] flex flex-col 2xl:flex-row gap-[20px] 2xl:gap-[40px]">
        <Link
          href="https://wa.me/+971506065857"
          target="_blank"
          rel="noopener noreferrer"
          className="flex gap-[12px] items-center text-ash"
        >
          <MessageCircleQuestion className="text-[24px]" />
          <p className="text-[16px] 2xl:text-[18px]">
            {getText("askAQuestion")}
          </p>
        </Link>

        <div className="flex gap-[12px] items-center text-ash">
          <p className="text-[16px] 2xl:text-[18px]">
            {getText("socialShare")}:
          </p>
          <Link
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
              shareUrl
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex gap-[12px] items-center text-ash"
          >
            <BsFacebook className="text-[24px]" />
          </Link>
          <Link
            href={`fb-messenger://share/?link=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex gap-[12px] items-center text-ash"
          >
            <BsMessenger className="text-[24px]" />
          </Link>
          <Link
            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
              shareUrl
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex gap-[12px] items-center text-ash"
          >
            <BsTwitter className="text-[24px]" />
          </Link>
          <Link
            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
              shareUrl
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex gap-[12px] items-center text-ash"
          >
            <BsWhatsapp className="text-[24px]" />
          </Link>
        </div>
      </div>

      {/* product other informations  */}
      <div className="mt-[30px] text-[16px] 2xl:text-[18px]">
        {product?.sku && (
          <p>
            <span className="text-primaryblack font-[550]">
              {getText("productCode")}
            </span>{" "}
            <span className="text-ash">{product?.sku}</span>{" "}
          </p>
        )}
      </div>
    </div>
  );
}