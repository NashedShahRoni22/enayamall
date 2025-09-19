"use client";
import { useEffect, useRef, useState } from "react";
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

  // Refs for sections - separate ref for each section
  const descriptionRef = useRef(null);
  const usageRef = useRef(null);
  const benefitsRef = useRef(null);
  const reviewsRef = useRef(null);

  // console.log("ProductUseReviews rendered", product.long_description);

  // Language-specific text
  const getText = (key) => {
    const texts = {
      en: {
        description: "Description",
        // howtouse: "How to use",
        // benefits: "Benefits",
        reviews: "Reviews",
        // keyBenefits: "Key Benefits"
      },
      ar: {
        description: "الوصف",
        // howtouse: "كيفية الاستخدام",
        // benefits: "الفوائد",
        reviews: "المراجعات",
        // keyBenefits: "الفوائد الرئيسية"
      },
    };
    return texts[lang]?.[key] || texts.en[key];
  };

  // Scroll to section on click
  const scrollToSection = (ref, section) => {
    setActiveTab(section);
    ref?.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Detect active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      // Get viewport height for better threshold calculation
      const viewportHeight = window.innerHeight;
      const threshold = viewportHeight * 0.3;

      const descTop =
        descriptionRef.current?.getBoundingClientRect().top ?? Infinity;
      const usageTop =
        usageRef.current?.getBoundingClientRect().top ?? Infinity;
      const benefitsTop =
        benefitsRef.current?.getBoundingClientRect().top ?? Infinity;
      const reviewTop =
        reviewsRef.current?.getBoundingClientRect().top ?? Infinity;

      // Check which section is currently in view (closest to top within threshold)
      const sections = [
        { name: "description", top: descTop, ref: descriptionRef.current },
        // { name: "howtouse", top: usageTop, ref: usageRef.current },
        // { name: "benefits", top: benefitsTop, ref: benefitsRef.current },
        { name: "reviews", top: reviewTop, ref: reviewsRef.current },
      ].filter((section) => section.ref); // Only include sections that exist

      // Find the section that's currently most visible
      let activeSection = "description";

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section.top <= threshold) {
          activeSection = section.name;
          break;
        }
      }

      setActiveTab(activeSection);
    };

    // Initial check
    handleScroll();

    // Throttle scroll events for better performance
    let ticking = false;
    const throttledHandleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", throttledHandleScroll, { passive: true });
    return () => window.removeEventListener("scroll", throttledHandleScroll);
  }, [reviewable]);

  return (
    <section className="mt-[60px] relative">
      {/* Sticky Nav Buttons */}
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
              activeTab === "description" ? "text-white bg-primary" : "text-primaryblack"
            } hover:text-white cursor-pointer  border border-primary rounded-md px-5 py-1`}
            onClick={() => scrollToSection(descriptionRef, "description")}
          >
            {getText("description")}
          </button>
          {/* <button
                        className={`transition-colors ${activeTab === 'howtouse' ? 'text-primary' : 'text-primaryblack'
                            } hover:text-primary cursor-pointer`}
                        onClick={() => scrollToSection(usageRef, 'howtouse')}
                    >
                        {getText('howtouse')}
                    </button> */}
          {/* <button
                        className={`transition-colors ${activeTab === 'benefits' ? 'text-primary' : 'text-primaryblack'
                            } hover:text-primary cursor-pointer`}
                        onClick={() => scrollToSection(benefitsRef, 'benefits')}
                    >
                        {getText('benefits')}
                    </button> */}
          <button
            className={`transition-colors ${
              activeTab === "reviews" ? "text-primary" : "text-primaryblack"
            } hover:text-primary cursor-pointer border border-primary rounded-md px-5 py-1`}
            onClick={() => scrollToSection(reviewsRef, "reviews")}
          >
            {getText("reviews")}
          </button>
        </div>
      </div>

      {/* Related details */}
      <div className={`text-[18px] ${lang === "ar" ? "rtl" : "ltr"}`}>
        {/* Description */}
        <div
          ref={descriptionRef}
          className="scroll-mt-[128px] lg:scroll-mt-[163px] text-ash"
        >
          <p className="font-[550]">{getText("keyBenefits")}</p> <br />
          <div
            id="preview"
            className={`text-[16px] 2xl:text-[18px] longDescription ${
              lang === "ar" ? "rtl text-right" : "ltr text-left"
            } text-[#38444f]`}
            dir={lang === "ar" ? "rtl" : "ltr"}
            dangerouslySetInnerHTML={{
              __html:
                lang === "ar"
                  ? he.decode(product?.ar_long_description) ||
                    he.decode(product?.long_description)
                  : he.decode(product?.long_description),
            }}
          />
        </div>

        {/* How to use */}
        {/* <div ref={usageRef} className="scroll-mt-[128px] lg:scroll-mt-[163px] text-ash py-[25px] 2xl:py-[50px] border-t border-creamline mt-[25px] 2xl:mt-[50px]">
                    <p className="font-[550]">{getText('howtouse')}</p> <br />
                    <div 
                        id='preview' 
                        className="text-[16px] 2xl:text-[18px]" 
                        dangerouslySetInnerHTML={{ __html: lang === 'ar' ? product?.how_to_use_ar || product?.how_to_use : product?.how_to_use }} 
                    />
                </div> */}

        {/* Benefits */}
        {/* <div ref={benefitsRef} className="scroll-mt-[128px] lg:scroll-mt-[163px] text-ash py-[25px] 2xl:py-[50px] border-t border-creamline mt-[25px] 2xl:mt-[50px]">
                    <p className="font-[550]">{getText('benefits')}</p> <br />
                    <div 
                        id='preview' 
                        className="text-[16px] 2xl:text-[18px]" 
                        dangerouslySetInnerHTML={{ __html: lang === 'ar' ? product?.benefits_ar || product?.benefits : product?.benefits }} 
                    />
                </div> */}
      </div>

      <p className="mt-[40px]">
          <span className="text-primaryblack font-[550]">{lang === 'en' ? 'Tags:' : 'العلامات:'}</span>{" "}
          {product?.tags?.map((pt, index, array) => (
              <Link href={`/tag/${pt}`} className="capitalize hover:text-white mr-1 last:mr-0 hover:bg-primary inline-flex items-center rounded-md px-2 py-1 text-xs font-medium text-primary inset-ring inset-ring-primary" key={index}>
                  {lang === 'en' ? pt : (product?.ar_tags && product?.ar_tags[index]) || pt}
                  {/* {index === array.length - 1 ? "." : ","} */}
                  {" "}
              </Link>
          ))}
      </p>

      {/* Review section for regular product */}
      <div ref={reviewsRef}>
        {reviewable ? (
          <ReviewForm
            variantId={variantId}
            token={token}
            productType={productType}
          />
        ) : (
          <p className="text-red-500 py-8">
            {lang === "en"
              ? "No reviews found for this product."
              : "لم يتم العثور على مراجعات لهذا المنتج"
            }
          </p>
        )}
      </div>

      
    </section>
  );
}
