import Image from "next/image";
import { GoPlus } from "react-icons/go";
import { AiOutlineMinus } from "react-icons/ai";
import { FaStar } from "react-icons/fa";
import { TiStarFullOutline } from "react-icons/ti";
import { MessageCircleQuestion, Phone, Share2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useAppContext } from "@/app/context/AppContext";
import policyIco from "../../resources/icons/trust.svg";
import moneyIco from "../../resources/icons/pricing_icon.svg";
import supportIco from "../../resources/icons/support.svg";
import shippingIco from "../../resources/icons/deliverycar.svg";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { handleShare } from "./handleShare";

export default function ProductDetails({ token, slug, variant, product, setReviewable, setVariantId, setIsWishlisted, isWishlisted }) {
    const { addToWishlist, addToCartDB, addToCartDBGuest, lang } = useAppContext();
    const router = useRouter();
    const [defaultVarient, setDefaultVarient] = useState(variant);
    const [defaultQuantity, setDefaultQuantity] = useState(1);
    const [stock, setStock] = useState(0);

    // Localization helper function
    const getText = (key, dynamicValue = null) => {
        const texts = {
            aboutThisItem: lang === 'en' ? 'About this item:' : 'حول هذا المنتج:',
            basedOnRatings: lang === 'en' ? 'Based on' : 'بناء على',
            ratings: lang === 'en' ? 'Ratings' : 'تقييمات',
            save: lang === 'en' ? 'Save' : 'وفر',
            addToCart: lang === 'en' ? 'Add to cart' : 'أضف إلى السلة',
            outOfStock: lang === 'en' ? 'Out of Stock' : 'نفد المخزون',
            buyItNow: lang === 'en' ? 'Buy it Now' : 'اشتري الآن',
            askAQuestion: lang === 'en' ? 'Ask a Question' : 'اطرح سؤالاً',
            socialShare: lang === 'en' ? 'Social Share' : 'مشاركة اجتماعية',
            callForOrder: lang === 'en' ? 'Call for Order' : 'اتصل للطلب',
            productCode: lang === 'en' ? 'Product Code:' : 'كود المنتج:',
            availableStock: lang === 'en' ? 'Available Stock:' : 'المخزون المتاح:',
            items: lang === 'en' ? 'items' : 'عناصر',
            categories: lang === 'en' ? 'Categories:' : 'الفئات:',
            tags: lang === 'en' ? 'Tags:' : 'العلامات:',
            benefitsTitle: lang === 'en' ? 'The benefits of choosing us' : 'فوائد اختيارنا',
            authenticProduct: lang === 'en' ? 'Authentic Product' : 'منتج أصلي',
            competitivePricing: lang === 'en' ? 'Competitive Pricing' : 'أسعار تنافسية',
            skincareGuidance: lang === 'en' ? 'Skincare Guidance' : 'إرشادات العناية بالبشرة',
            fastDelivery: lang === 'en' ? 'Fast Delivery' : 'توصيل سريع',
            pleaseLoginToUseWishlist: lang === 'en' ? 'Please login to use wishlist!' : 'يرجى تسجيل الدخول لاستخدام قائمة الأمنيات!',
            checkOutThisProduct: lang === 'en' ? 'Check out this product' : 'تحقق من هذا المنتج'
        };

        if (dynamicValue !== null) {
            return texts[key] + ' ' + dynamicValue;
        }
        
        return texts[key];
    };

    // share product 
    const shareCurrentProduct = () => {
        const productUrl = `${process.env.NEXT_PUBLIC_WEB_SHOP_BASE_URL}${slug}?variant=${variant}`;
        handleShare(productUrl, getText('checkOutThisProduct'));
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

    const ratingCount = product?.ratings?.rating;
    const filledStars = getFilledStars(ratingCount);

    // Function to render 5 stars
    const renderStars = () => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            if (i <= filledStars) {
                // Filled star
                stars.push(
                    <TiStarFullOutline key={i} className="text-orange text-[20px] lg:text-[24px]" />
                );
            } else {
                // Empty star
                stars.push(
                    <TiStarFullOutline key={i} className="text-gray-300 text-[20px] lg:text-[24px]" />
                );
            }
        }
        return stars;
    };

    // Update reviewable state when component mounts or variant changes
    useEffect(() => {
        if (product?.variants && defaultVarient) {
            const selectedVariant = product.variants.find(v => v?.variant === defaultVarient);
            if (selectedVariant) {
                setReviewable(selectedVariant.is_reviewable);
                setVariantId(selectedVariant.product_variant_id);
                setIsWishlisted(selectedVariant.is_wishlisted);
                setStock(selectedVariant.stock)
            }
        }
    }, [product, defaultVarient]);

    // Handle variant change
    const handleVariantChange = (newVariant) => {
        setDefaultVarient(newVariant);
        // The useEffect above will handle updating the reviewable state
    };

    // manage add to cart 
    const handleAddToCart = (p, type) => {
        const selectedVariant = p?.variants?.find(v => v?.variant === defaultVarient);

        let price;
        if (selectedVariant) {
            price = selectedVariant?.discount?.discount_price
                ? selectedVariant?.discount?.discount_price
                : selectedVariant?.price;
        } else {
            price = p?.discount?.discount_price
                ? p?.discount?.discount_price
                : p?.price;
        }

        if (token === null) {
            addToCartDBGuest(selectedVariant?.product_variant_id, defaultQuantity, defaultVarient);
        } else {
            addToCartDB(selectedVariant?.product_variant_id, defaultQuantity, defaultVarient);
        }
        if(type === "now"){
            router.push("/checkout");
        }
    };

    // manage add to wishlist 
    const handleAddToWishlist = (p) => {
        const selectedVariant = p?.variants?.find(v => v?.variant === defaultVarient);
        if (token === null) {
            toast.error(getText('pleaseLoginToUseWishlist'));
            router.push("/login")
        } else {
            addToWishlist(selectedVariant?.product_variant_id);
            setIsWishlisted(true);
        }
    }

    // product features
    const features = [
        {
            title: getText('authenticProduct'),
            icon: policyIco,
        },
        {
            title: getText('competitivePricing'),
            icon: moneyIco,
        },
        {
            title: getText('skincareGuidance'),
            icon: supportIco,
        },
        {
            title: getText('fastDelivery'),
            icon: shippingIco,
        }
    ];

    return (
        <div>
            {/* brand logo here  */}
            <Link href={`/brand/${product?.brand?.slug}`} className="inline-block">
                <Image
                    src={product?.brand?.image}
                    alt={lang === 'en' ? product?.brand?.name : product?.brand?.ar_name || product?.brand?.name}
                    height={500}
                    width={500}
                    sizes=""
                    className="h-[120px] w-[160px]"
                />
            </Link>
            <h1 className="text-primarymagenta text-[20px] 2xl:text-[26px] font-[550]">
                {lang === 'en' ? product?.name : product?.ar_name || product?.name}
            </h1>

            <div className="text-[16px] 2xl:text-[18px] my-[20px] 2xl:my-[30px]">
                <p className="font-[550] text-primarymagenta">{getText('aboutThisItem')}</p> <br />
                <p className="text-ash 2xl:w-[70%]" dangerouslySetInnerHTML={{ 
                    __html: lang === 'en' ? product?.short_description : product?.ar_short_description || product?.short_description 
                }} />
            </div>

            {/* ratings */}
            {
                ratingCount > 0 &&
                <div className="flex gap-[30px]">
                    <div className="flex gap-[6px] items-center">
                        {renderStars()}
                        <p className="text-[18px] 2xl:text-[20px] font-[550] text-primarymagenta ml-2">
                            ( {product?.ratings?.rating || 0} )
                        </p>
                    </div>
                    <p className="text-[16px] 2xl:text-[18px] text-[#4CA9DF]">
                        {getText('basedOnRatings')} {product?.ratings?.total_rating || 0} {getText('ratings')}
                    </p>
                </div>
            }

            <div className="my-[20px] 2xl:my-[30px] h-[1px] bg-creamline w-full"></div>

            {/* pricing */}
            <div className="text-[20px] 2xl:text-[34px] text-secondary flex items-center gap-[30px] mb-[20px] 2xl:mb-[40px]">
                {
                    (() => {
                        const selectedVariant = product?.variants?.find(v => v?.variant === defaultVarient);

                        if (!selectedVariant) return null;

                        const hasDiscount = selectedVariant?.discount;

                        if (hasDiscount) {
                            return (
                                <div className="flex flex-col 2xl:flex-row 2xl:items-center gap-[20px]">
                                    <div className="flex gap-[20px]">
                                        <p><span className="dirham-symbol">ê</span> {selectedVariant?.discount?.discount_price}</p>
                                        <p className="text-ash line-through">
                                            <span className="dirham-symbol">ê</span> {selectedVariant?.price}
                                        </p>
                                    </div>
                                    <p className="text-[12px] 2xl:text-[18px] text-customgreen">
                                        {getText('save')} {selectedVariant?.price - selectedVariant?.discount?.discount_price}
                                    </p>
                                </div>
                            );
                        }

                        return <><span className="dirham-symbol">ê</span> {selectedVariant?.price}</>;
                    })()
                }
            </div>

            {/* variants */}
            {
                product?.variants[0]?.variant !== "null"
                &&
                <div className="mb-[20px] flex gap-[20px]">
                    {
                        product?.variants?.map(pv => (
                            <button
                                key={pv?.product_variant_id}
                                className={`border cursor-pointer ${pv?.variant === defaultVarient ? "bg-primary text-white border-primary" : "bg-white text-primarymagenta border-creamline"} w-[100px] 2xl:w-[130px] h-[50px] 2xl:h-[60px] rounded-[10px]`}
                                onClick={() => handleVariantChange(pv?.variant)}
                            >
                                {lang === 'en' ? pv?.variant : pv?.ar_variant || pv?.variant}
                            </button>
                        ))
                    }
                </div>
            }

            {/* user actions */}
            <div className="flex gap-[10px] 2xl:gap-[20px] items-center">
                {/* quantity selector */}
                <div className="flex items-center gap-[20px] 2xl:gap-[30px] px-[20px] rounded-[10px] text-[18px] 2xl:text-[22px] justify-center bg-white border border-creamline h-[50px] 2xl:h-[60px] w-2/5">
                    <button disabled={defaultQuantity === 1} className="cursor-pointer text-primarymagenta hover:bg-creamline hover:text-primary rounded-full p-2" onClick={() => setDefaultQuantity(defaultQuantity - 1)}>
                        <AiOutlineMinus />
                    </button>
                    <input
                        min={1}
                        value={defaultQuantity}
                        readOnly
                        className="w-8 text-center bg-transparent focus:outline-none text-primarymagenta"
                    />
                    <button className="cursor-pointer text-primarymagenta hover:bg-creamline hover:text-primary rounded-full p-2" onClick={() => setDefaultQuantity(defaultQuantity + 1)}>
                        <GoPlus />
                    </button>
                </div>

                {/* add to cart */}
                <button
                    disabled={stock === 0}
                    onClick={() => handleAddToCart(product)}
                    className={`cursor-pointer disabled:cursor-not-allowed flex-1 h-[50px] 2xl:h-[60px] rounded-[10px] bg-light disabled:bg-button hover:bg-primary text-primarymagenta disabled:text-white hover:text-white ease-linear duration-300 text-[14px] 2xl:text-[18px] flex items-center justify-center`}>
                    {stock > 0 ? getText('addToCart') : getText('outOfStock')}
                </button>

                {/* add to wishlist  */}
                <button
                    disabled={isWishlisted}
                    onClick={() => handleAddToWishlist(product)}
                    className={`cursor-pointer w-[50px] h-[50px] 2xl:w-[60px] 2xl:h-[60px] rounded-full border border-creamline flex justify-center items-center text-[#D0D0D0] hover:bg-primary hover:text-white ease-linear duration-300 text-[24px] ${isWishlisted && " bg-secondary text-white"}`}>
                    <FaStar />
                </button>
            </div>

            {/* buy it now */}
            {
                stock > 0 &&
                <div className="mt-[30px]">
                    <button
                        disabled={stock === 0}
                        onClick={() => handleAddToCart(product, "now")}
                        className={`cursor-pointer disabled:cursor-not-allowed flex-1 w-full h-[50px] 2xl:h-[60px] rounded-[10px] bg-primary disabled:bg-button hover:bg-creamline text-white disabled:text-white hover:text-primarymagenta ease-linear duration-300 text-[14px] 2xl:text-[18px] flex items-center justify-center`}>
                        {stock > 0 ? getText('buyItNow') : getText('outOfStock')}
                    </button>
                </div>
            }

            {/* ask que, share or call from here  */}
            <div className="mt-[30px] 2xl:mt-[50px] flex flex-col 2xl:flex-row gap-[20px] 2xl:gap-[40px]">
                <Link
                    href="https://wa.me/8801711996466"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex gap-[12px] items-center text-ash"
                >
                    <MessageCircleQuestion className="text-[24px]" />
                    <p className="text-[16px] 2xl:text-[18px]">{getText('askAQuestion')}</p>
                </Link>

                <button onClick={shareCurrentProduct} className="flex gap-[12px] items-center text-ash cursor-pointer">
                    <Share2 className="text-[24px]" />
                    <p className="text-[16px] 2xl:text-[18px]">{getText('socialShare')}</p>
                </button>

                <Link href="tel:+8801711996466" className="flex gap-[12px] items-center text-ash">
                    <Phone className="text-[24px]" />
                    <p className="text-[16px] 2xl:text-[18px]">
                        {getText('callForOrder')}
                    </p>
                </Link>
            </div>

            {/* product other informations  */}
            <div className="mt-[20px] 2xl:mt-[40px] text-[16px] 2xl:text-[18px]">
                <p><span className="text-primarymagenta font-[550]">{getText('productCode')}</span> <span className="text-ash">{product?.product_code}</span> </p>
                {
                    stock > 0 && <p className="mt-[20px]"><span className="text-primarymagenta font-[550]">{getText('availableStock')}</span> <span className="text-ash">{stock} {getText('items')}</span> </p>
                }

                <p className="mt-[20px]">
                    <span className="text-primarymagenta font-[550]">{getText('categories')}</span>{" "}
                    {product?.other_categories?.map((pc, index, array) => (
                        <Link href={`/category/${pc?.slug}`} className="text-ash hover:text-secondary" key={index}>
                            {lang === 'en' ? pc?.name : pc?.ar_name || pc?.name}
                            {index === array.length - 1 ? "." : ","}
                            {" "}
                        </Link>
                    ))}
                </p>

                <p className="mt-[20px]">
                    <span className="text-primarymagenta font-[550]">{getText('tags')}</span>{" "}
                    {product?.tags?.map((pt, index, array) => (
                        <span className="text-ash capitalize" key={index}>
                            {lang === 'en' ? pt : (product?.ar_tags && product?.ar_tags[index]) || pt}
                            {index === array.length - 1 ? "." : ","}
                            {" "}
                        </span>
                    ))}
                </p>
            </div>

            {/* benefit card  */}
            {/* <div className="text-primarymagenta border border-creamline p-[20px] mt-[56px] relative rounded-[5px]">
                <p className="absolute -top-[14px] left-1/2 -translate-x-1/2 bg-white px-[16px] text-[16px] 2xl:text-[18px] text-center">
                    {getText('benefitsTitle')}
                </p>

                <div className="flex gap-[20px] justify-center mt-[40px]">
                    {
                        features?.map((feature, index) => (
                            <div key={index} className="flex flex-col gap-[16px] items-center">
                                <Image src={feature?.icon} alt="benefits icon" className="size-[30px] 2xl:size-[40px]" />
                                <h5 className="text-[14px] 2xl:text-[18px] text-center">{feature?.title}</h5>
                            </div>
                        ))
                    }
                </div>
            </div> */}
        </div>
    )
}