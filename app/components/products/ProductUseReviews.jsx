"use client";
import { useState } from "react";
import ReviewForm from "../forms/ReviewForm";
import { useAppContext } from "@/app/context/AppContext";
import he from "he";
import Link from "next/link";

export default function ProductUseReviews({
  product,
  reviewable,
  variantId,
  token,
  productType,
}) {
  const [activeTab, setActiveTab] = useState("description");

  // Get language from context
  const { lang } = useAppContext();

  // Language-specific text
  const getText = (key) => {
    const texts = {
      en: {
        description: "Description",
        reviews: "Reviews",
        tags: "Tags:",
        noReviews: "No reviews found for this product.",
      },
      ar: {
        description: "الوصف",
        reviews: "المراجعات",
        tags: ":العلامات",
        noReviews: "لم يتم العثور على مراجعات لهذا المنتج",
      },
    };
    return texts[lang]?.[key] || texts.en[key];
  };

  return (
    <section className="mt-[60px] relative">
      {/* Tab Buttons */}
      <div
        className={`bg-white border-b border-creamline py-4 ${
          lang === "ar" ? "rtl" : "ltr"
        }`}
      >
        <div
          className={`flex gap-2 2xl:gap-5 text-[18px] 2xl:text-[26px] font-[550] ${
            lang === "ar" ? "flex-row-reverse" : ""
          }`}
        >
          <button
            className={`transition-colors ${
              activeTab === "description"
                ? "text-white bg-primary hover:text-white"
                : "text-primaryblack border border-primary hover:text-primary"
            }  cursor-pointer rounded-md px-5 py-1`}
            onClick={() => setActiveTab("description")}
          >
            {getText("description")}
          </button>

          <button
            className={`transition-colors ${
              activeTab === "reviews"
                ? "text-white bg-primary hover:text-white"
                : "text-primaryblack border border-primary hover:text-primary"
            }  cursor-pointer rounded-md px-5 py-1`}
            onClick={() => setActiveTab("reviews")}
          >
            {getText("reviews")}
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="py-6 text-[18px]">
        {activeTab === "description" && (
          <div className={lang === "ar" ? "rtl text-right" : "ltr text-left"}>
            <div
              id="preview"
              className="text-[16px] 2xl:text-[18px] text-[#38444f] longDescription"
              dir={lang === "ar" ? "rtl" : "ltr"}
              dangerouslySetInnerHTML={{
                __html:
                  lang === "ar"
                    ? he.decode(product?.ar_long_description) ||
                      he.decode(product?.long_description)
                    : he.decode(product?.long_description),
              }}
            />

            {/* Tags */}
            <p
              className={`mt-[40px] flex flex-wrap w-full gap-1 ${
                lang === "ar" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <span className="text-primaryblack font-[550]">
                {getText("tags")}
              </span>
              {product?.tags?.map((pt, index) => (
                <Link
                  href={`/tag/${pt}`}
                  key={index}
                  className="capitalize hover:text-white mr-1 last:mr-0 hover:bg-primary inline-flex items-center rounded-md px-2 py-1 text-xs font-medium text-primary inset-ring inset-ring-primary"
                >
                  {lang === "en"
                    ? pt
                    : (product?.ar_tags && product?.ar_tags[index]) || pt}
                </Link>
              ))}
            </p>
          </div>
        )}

        {activeTab === "reviews" && (
          <div>
            {reviewable ? (
              <ReviewForm
                variantId={variantId}
                token={token}
                productType={productType}
              />
            ) : (
              <p className="text-red-500 pt-8">{getText("noReviews")}</p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
