import Image from "next/image";
import Link from "next/link";
import { TiStarFullOutline } from "react-icons/ti";
import { useAppContext } from "@/app/context/AppContext";

export default function HorizontalProductCard({ p }) {
  const { lang } = useAppContext();

  // Translation object
  const translations = {
    en: {
      sold: "Sold",
      taka: "Taka"
    },
    ar: {
      sold: "تم البيع",
      taka: "تاكا"
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

  // Get localized product data
  const productName = getLocalizedField(p, 'name');
  const categoryName = getLocalizedField(p?.main_category, 'name');
  const variantName = getLocalizedField(p, 'variant');

  return (
    <div className={lang === 'ar' ? 'rtl' : 'ltr'}>
      <Link
        href={`/shop/${p?.slug}?variant=${p?.variant}`}
        className={`group flex items-center gap-[16px] bg-white rounded-[10px] py-[16px] text-primaryblack border border-creamline ${lang === 'ar' ? 'pr-[8px] pl-[32px]' : 'pl-[8px] pr-[32px]'
          }`}
      >
        <div className="flex justify-center items-center rounded-[10px] relative w-1/3 h-[120px] lg:h-[160px] overflow-hidden">
          <Image
            src={p?.main_image}
            alt={productName || "Product Image"}
            height={0}
            width={0}
            sizes="100vw"
            className="h-full w-full object-contain p-1 group-hover:scale-105 ease-linear duration-300 rounded-[10px]"
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
            }}
          />
        </div>

        <div className="w-2/3">
          {/* <p className="text-[12px] lg:text-[14px] text-secondary">{categoryName}</p> */}
          <p className="text-[14px] lg:text-[18px] mt-[10px] line-clamp-2">
            {productName}
            {variantName && (
              <span>
                {lang === 'ar' ? ` - ${variantName}` : ` - ${variantName}`}
              </span>
            )}
          </p>

          {/* Product Rating */}
          {(p?.ratings?.total_rating > 0 || p?.total_sold > 0) && (
            <div className={`mt-[8px] text-[10px] lg:text-[14px] flex flex-col 2xl:flex-row gap-[8px] 2xl:gap-[16px] ${lang === 'ar' ? '2xl:flex-row-reverse' : ''
              }`}>
              {p?.ratings?.total_rating > 0 && (
                <div className={`flex gap-1 items-center ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                  <div className="flex gap-1">
                    {renderStars()}
                  </div>
                  <span className={`text-orange ${lang === 'ar' ? 'mr-1' : 'ml-1'}`}>
                    ( {p?.ratings?.total_rating} )
                  </span>
                </div>
              )}
              {p?.total_sold > 0 && (
                <p>
                  {lang === 'ar' ? `${p?.total_sold} ${t.sold}` : `${p?.total_sold} ${t.sold}`}
                </p>
              )}
            </div>
          )}

          {/* Price */}
          <div className={`mt-[8px] flex gap-[10px] text-[14px] lg:text-[18px] ${lang === 'ar' ? 'flex-row-reverse' : ''
            }`}>
            {p?.discount === null ? (
              <p>
                <span className="dirham-symbol">ê</span> {p?.price ?? "0.00"}
              </p>
            ) : (
              <div className={`flex gap-[10px] ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                <p className="flex items-center">
                  <span className="dirham-symbol">ê</span> {p?.discount?.discount_price ?? "0.00"}
                </p>
                <p className="text-secondary line-through opacity-50">
                  <span className="dirham-symbol">ê</span> {p?.price ?? "0.00"}
                </p>
              </div>
            )}
          </div>

        </div>
      </Link >
    </div >
  );
}