import Image from "next/image";
import { GoPlus, GoShareAndroid } from "react-icons/go";
import { AiOutlineMinus } from "react-icons/ai";
import { FaStar } from "react-icons/fa";
import { CiSquareQuestion } from "react-icons/ci";
import { PiPhoneCallThin } from "react-icons/pi";
import { useState, useEffect } from "react";
import { useAppContext } from "@/app/context/AppContext";
import policyIco from "../../resources/icons/trust.svg";
import moneyIco from "../../resources/icons/pricing_icon.svg";
import supportIco from "../../resources/icons/support.svg";
import shippingIco from "../../resources/icons/deliverycar.svg";
import ProductImage from "../../resources/imgProductLarge.png";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { TiStarFullOutline } from "react-icons/ti";
import { handleShare } from "./handleShare";


export default function ComboProductDetails({ token, slug, product, setReviewable }) {
    const [isWishlisted, setIsWishlisted] = useState(false);
    const { addToWishlist, addToCartDB, addToCartDBGuest } = useAppContext();
    const router = useRouter();
    const [defaultQuantity, setDefaultQuantity] = useState(1);

    // share product 
    const shareCurrentProduct = () => {
        const productUrl = `https://laminax.com.bd/combo/${slug}`;
        handleShare(productUrl, 'Check out this product');
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

    // Update reviewable state when component mounts
    useEffect(() => {
        if (product) {
            setReviewable(product.is_reviewable);
        }
    }, [product, setReviewable]);

    // manage add to cart 
    const handleAddToCart = (p, type) => {
        if (token === null) {
            addToCartDBGuest(p?.id, defaultQuantity, "combo");
        } else {
            addToCartDB(p?.id, defaultQuantity, "combo");
        }
        if(type === "now"){
            router.push("/checkout");
        }
    };

    // manage add to wishlist 
    const handleAddToWishlist = (p) => {
        if (token === null) {
            toast.error("Please login to use wishlist!");
            router.push("/login")
        } else {
            addToWishlist(p?.id, "combo")
            setIsWishlisted(true);
        }
    }

    // product features
    const features = [
        {
            title: "Authentic Product",
            icon: policyIco,
        },
        {
            title: "Competitive Pricing",
            icon: moneyIco,
        },
        {
            title: "Skincare Guidance",
            icon: supportIco,
        },
        {
            title: "Fast Delivery",
            icon: shippingIco,
        }
    ];

    return (
        <div>
            <h1 className="text-primaryblack text-[20px] 2xl:text-[26px] font-[550]">
                {product?.name}
            </h1>

            <div className="text-[16px] text-primaryblack 2xl:text-[18px] my-[10px] md:my-[20px]">
                <p className="font-[550]">Combo Items:</p> <br />
                <ul className="list-disc list-inside">
                    {
                        product?.items?.map((pi, index) => <li key={index}>  <Link href={`/shop/${pi.slug}?variant=${pi.variant}`} className="hover:text-natural">{pi.name}  {pi.variant && <span>- {pi.variant}</span>}</Link> </li>)
                    }
                </ul>
            </div>

            {/* ratings */}
            {
                ratingCount > 0 &&
                <div className="flex gap-[30px]">
                    <div className="flex gap-[6px] items-center">
                        {renderStars()}
                        <p className="text-[18px] 2xl:text-[20px] font-[550] text-primaryblack ml-2">
                            ( {product?.ratings?.rating || 0} )
                        </p>
                    </div>
                    <p className="text-[16px] 2xl:text-[18px] text-[#4CA9DF]">
                        Based on {product?.ratings?.total_rating || 0} Ratings
                    </p>
                </div>
            }

            <div className="my-[20px] 2xl:my-[30px] h-[1px] bg-creamline w-full"></div>

            {/* pricing */}
            <div className="text-[20px] 2xl:text-[34px] text-button flex items-center gap-[30px] mb-[20px] 2xl:mb-[40px]">
                {
                    product?.discount === null ?
                        <p className="">D {product?.combo_price} Taka</p>
                        :
                        <div className="flex flex-col 2xl:flex-row 2xl:items-center gap-[20px]">
                            <div className="flex gap-[20px]">
                                <p>D {product?.discount?.discount_price} Taka</p>
                                <p className="text-ash line-through">
                                    D {product?.combo_price} Taka
                                </p>
                            </div>
                            <p className="text-[12px] 2xl:text-[18px] text-customgreen">
                                Save {product?.combo_price - product?.discount?.discount_price} Taka
                            </p>
                        </div>
                }
            </div>

            {/* user actions */}
            <div className="flex gap-[10px] 2xl:gap-[20px] items-center 2xl:w-[80%]">
                {/* quantity selector */}
                <div className="flex items-center gap-[20px] 2xl:gap-[30px] px-[20px] rounded-[10px] text-[18px] 2xl:text-[22px] justify-center bg-white border border-creamline h-[50px] 2xl:h-[60px] w-2/5">
                    <button disabled={defaultQuantity === 1} className="cursor-pointer text-primaryblack hover:bg-creamline hover:text-natural rounded-full p-2" onClick={() => setDefaultQuantity(defaultQuantity - 1)}>
                        <AiOutlineMinus />
                    </button>
                    <input
                        min={1}
                        value={defaultQuantity}
                        readOnly
                        className="w-8 text-center bg-transparent focus:outline-none text-natural"
                    />
                    <button className="cursor-pointer text-primaryblack hover:bg-creamline hover:text-natural rounded-full p-2" onClick={() => setDefaultQuantity(defaultQuantity + 1)}>
                        <GoPlus />
                    </button>
                </div>

                {/* add to cart */}
                <button
                    onClick={() => handleAddToCart(product)}
                    className="cursor-pointer flex-1 h-[50px] 2xl:h-[60px] bg-light rounded-[10px] hover:bg-natural hover:text-white ease-linear duration-300 text-[14px] 2xl:text-[18px] text-primaryblack flex items-center justify-center">
                    Add to cart
                </button>

                {/* add to wishlist  */}
                <button
                    disabled={product?.is_wishlisted || isWishlisted}
                    onClick={() => handleAddToWishlist(product)}
                    className={`cursor-pointer w-[50px] h-[50px] 2xl:w-[60px] 2xl:h-[60px] rounded-full border border-creamline flex justify-center hover:bg-natural hover:text-white ease-linear duration-300 items-center text-[#D0D0D0] text-[24px] ${(product?.is_wishlisted || isWishlisted) && "bg-natural text-white"}`}>
                    <FaStar />
                </button>
            </div>

            {/* buy it now */}
            <div className="mt-[30px] 2xl:w-[80%]">
                <button
                    onClick={() => handleAddToCart(product, "now")}
                    className={`cursor-pointer disabled:cursor-not-allowed flex-1 w-full h-[50px] 2xl:h-[60px] rounded-[10px] bg-natural disabled:bg-button hover:bg-accent text-white disabled:text-white hover:text-white ease-linear duration-300 text-[14px] 2xl:text-[18px] flex items-center justify-center`}>
                    Buy it Now
                </button>
            </div>


            {/* ask que, share or call from here  */}
            <div className="mt-[30px] 2xl:mt-[50px] flex flex-col 2xl:flex-row gap-[20px] 2xl:gap-[40px]">
                <Link
                    href="https://wa.me/+971506065857"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex gap-[12px] items-center text-ash"
                >
                    <CiSquareQuestion className="text-[24px]" />
                    <p className="text-[16px] 2xl:text-[18px]">Ask a Question</p>
                </Link>

                <button onClick={shareCurrentProduct} className="flex gap-[12px] items-center text-ash cursor-pointer">
                    <GoShareAndroid className="text-[24px]" />
                    <p className="text-[16px] 2xl:text-[18px]">Social Share</p>
                </button>

                <Link href="tel:+971506065857" className="flex gap-[12px] items-center text-ash">
                    <PiPhoneCallThin className="text-[24px]" />
                    <p className="text-[16px] 2xl:text-[18px]">
                        Call for Order
                    </p>
                </Link>
            </div>

            {/* product other informations  */}
            <div className="mt-[20px] 2xl:mt-[40px] text-[16px] 2xl:text-[18px]">
                <p><span className="text-primaryblack font-[550]">Product Code:</span> <span className="text-ash">{product?.product_code}</span> </p>
                <p className="my-[20px]">
                    <span className="text-primaryblack font-[550]">Categories:</span>{" "}
                    {product?.other_categories?.map((pc, index, array) => (
                        <Link href={`/category/${pc?.slug}`} className="text-ash hover:text-natural" key={pc?.id}>
                            {pc?.name}
                            {index === array.length - 1 ? "." : ","}
                            {" "}
                        </Link>
                    ))}
                </p>

                <p>
                    <span className="text-primaryblack font-[550]">Tags:</span>{" "}
                    {product?.tags?.map((pt, index, array) => (
                        <span className="text-ash capitalize" key={index}>
                            {pt}
                            {index === array.length - 1 ? "." : ","}
                            {" "}
                        </span>
                    ))}
                </p>
            </div>

            {/* benefit card  */}
            <div className="text-primaryblack border border-creamline p-[20px] mt-[56px] relative rounded-[5px]">
                {/* Heading positioned over top border */}
                <p className="absolute -top-[14px] left-1/2 -translate-x-1/2 bg-white px-[16px] text-[16px] 2xl:text-[18px] text-center">
                    The benefits of choosing us
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
            </div>
        </div>
    )
}