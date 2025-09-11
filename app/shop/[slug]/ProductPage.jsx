"use client"
import { useGetData } from "@/app/components/helpers/useGetData";
import Container from "@/app/components/shared/Container";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import ProductImageGallery from "@/app/components/products/ProductImageGallery";
import ProductDetails from "@/app/components/products/ProductDetails";
import ProductUseReviews from "@/app/components/products/ProductUseReviews";
import { useAppContext } from "@/app/context/AppContext";
import { useGetDataWithToken } from "@/app/components/helpers/useGetDataWithToken";
import ScreenLoader from "@/app/components/loaders/ScreenLoader";
import TestimonialCardProductDetails from "@/app/components/shared/cards/TestimonialCardProductDetails";
import RelatedProducts from "@/app/components/products/RelatedProducts";
import ImageModal from "@/app/components/products/ImageModal";

export default function ProductPage() {
    const { token, lang } = useAppContext();
    const params = useParams();
    const slug = params?.slug;
    const searchParams = useSearchParams();
    const variant = searchParams?.get('variant');
    const tracking = searchParams?.get('tracking');
    const [defaultImage, setDefaultImage] = useState(null);
    const [reviewable, setReviewable] = useState(false);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [variantId, setVariantId] = useState(null);

    // Modal state for image gallery
    const [imageModal, setImageModal] = useState({
        isOpen: false,
        images: [],
        activeIndex: 0,
        productName: ''
    });

    // Simple conditional at the top level
    const { data, isLoading, error } = token
        ? useGetDataWithToken(`product/${slug}?variant=${variant}`, token)
        : useGetData(`product/${slug}?variant=${variant}`);

    const product = data?.data;

    // Set default image when data loads
    useEffect(() => {
        if (product?.main_image?.[0] && product.main_image[0] !== null) {
            setDefaultImage(product.main_image[0]);
        } else if (product?.thumbnail_image && product.thumbnail_image !== null) {
            setDefaultImage(product.thumbnail_image);
        }
    }, [product]);

    // Handle modal close
    const handleCloseModal = () => {
        setImageModal({
            isOpen: false,
            images: [],
            activeIndex: 0,
            productName: ''
        });
    };

    // Handle modal index change (when user navigates in modal)
    const handleModalIndexChange = (newIndex) => {
        setImageModal(prev => ({
            ...prev,
            activeIndex: newIndex
        }));
    };

    if (isLoading) return <ScreenLoader />;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <>
            <Container>
                <section className="py-[40px]">
                    {/* product information here  */}
                    <div className={`flex flex-col gap-[20px] md:flex-row md:gap-[40px] ${lang === 'ar' ? 'md:flex-row-reverse' : ''}`}>
                        {/* product image */}
                        <div className="w-full md:w-5/10 md:sticky md:top-26">
                            <ProductImageGallery
                                product={product}
                                defaultImage={defaultImage}
                                setDefaultImage={setDefaultImage}
                                imageModal={imageModal}
                                setImageModal={setImageModal}
                            />
                        </div>

                        {/* product description */}
                        <div className="md:w-5/10">
                            <ProductDetails
                                token={token}
                                slug={slug}
                                variant={variant}
                                tracking={tracking}
                                product={product}
                                setReviewable={setReviewable}
                                setVariantId={setVariantId}
                                isWishlisted={isWishlisted}
                                setIsWishlisted={setIsWishlisted}
                            />
                        </div>
                    </div>

                    {/* details, how to use, reviews here  */}
                    <div className="mt-[60px]">
                        <ProductUseReviews
                            product={product}
                            reviewable={reviewable}
                            variantId={variantId}
                            token={token}
                            productType={"regular"}
                        />
                    </div>

                    {/* customers reviews here  */}
                    <div className="mt-[50px]">
                        {/* <p className='text-primaryblack text-[18px] 2xl:text-[20px] font-[650]'>Trusted by Skincare Lovers</p> */}
                        <div className="mt-[50px] ">
                            {
                                product?.reviews?.length > 0 ?
                                    <div className="grid grid-cols-1 gap-y-[40px]">
                                        {product?.reviews?.map((review, index) => (
                                            <TestimonialCardProductDetails review={review} index={index} key={index} />
                                        ))}
                                    </div>
                                    :
                                    <p className="text-xl text-primaryblack">No reviews yet</p>
                            }
                        </div>
                    </div>

                    {/* related product heres  */}
                    {
                        product?.related_products?.length > 0 &&
                        <RelatedProducts products={product?.related_products} />
                    }
                </section>
            </Container>

            {/* Image Modal - Rendered at the root level, outside Container */}
            <ImageModal
                isOpen={imageModal.isOpen}
                images={imageModal.images}
                activeIndex={imageModal.activeIndex}
                productName={imageModal.productName}
                onClose={handleCloseModal}
                onIndexChange={handleModalIndexChange}
            />
        </>
    )
}