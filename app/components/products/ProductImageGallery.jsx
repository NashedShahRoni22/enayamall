import { useRef, useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Thumbs, Autoplay } from 'swiper/modules';
import Image from 'next/image';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';
import { useAppContext } from '@/app/context/AppContext';

export default function ProductImageGallery({
    product,
    defaultImage,
    setDefaultImage,
    imageModal,
    setImageModal
}) {
    // Swiper states
    const [thumbsSwiper, setThumbsSwiper] = useState(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const mainSwiperRef = useRef(null);
    const thumbsSwiperRef = useRef(null);
    const { lang } = useAppContext();
    
    // Handle image selection
    const handleImageSelect = (selectedImage, index) => {
        setDefaultImage(selectedImage);
        setActiveIndex(index);
        if (mainSwiperRef.current) {
            mainSwiperRef.current.slideTo(index);
        }
    };
    
    // Handle main image click to open modal
    const handleMainImageClick = () => {
        if (setImageModal && product?.main_image) {
            setImageModal({
                isOpen: true,
                images: product.main_image,
                activeIndex: activeIndex,
                productName: product?.name || 'Product'
            });
        }
    };
    
    // Handle slide change from swiper
    const handleSlideChange = (swiper) => {
        const newIndex = swiper.activeIndex;
        setActiveIndex(newIndex);
        if (product?.main_image?.[newIndex]) {
            setDefaultImage(product.main_image[newIndex]);
        }
    };
    
    // Update active index when external changes occur (from modal)
    const updateActiveIndex = (index) => {
        setActiveIndex(index);
        if (mainSwiperRef.current) {
            mainSwiperRef.current.slideTo(index);
        }
        if (product?.main_image?.[index]) {
            setDefaultImage(product.main_image[index]);
        }
    };
    
    // Expose updateActiveIndex function to parent via window object
    useEffect(() => {
        window.updateGalleryIndex = updateActiveIndex;
        return () => {
            if (window.updateGalleryIndex) {
                delete window.updateGalleryIndex;
            }
        };
    }, [product]);
    
    useEffect(() => {
        if (mainSwiperRef.current && mainSwiperRef.current.autoplay) {
            if (imageModal.isOpen) {
                mainSwiperRef.current.autoplay.stop();
            } else {
                mainSwiperRef.current.autoplay.start();
            }
        }
    }, [imageModal.isOpen]);

    return (
        <section className={`flex flex-col md:flex-row gap-4 md:gap-6 ${lang === 'ar' ? 'md:flex-row-reverse' : ''}`}>
            {
                product?.main_image?.length > 0 ?
                    <>
                        {/* Thumbnail Swiper - Left side */}
                        <div className="w-full md:w-1/5 flex md:flex-col gap-2 order-2 md:order-1">
                            <Swiper
                                modules={[Navigation, Thumbs]}
                                onSwiper={(swiper) => {
                                    setThumbsSwiper(swiper);
                                    thumbsSwiperRef.current = swiper;
                                }}
                                spaceBetween={8}
                                slidesPerView={3.5}
                                freeMode={true}
                                direction="horizontal"
                                breakpoints={{
                                    640: {
                                        slidesPerView: 4,
                                        spaceBetween: 8,
                                    },
                                    768: {
                                        direction: "vertical",
                                        slidesPerView: 4,
                                        spaceBetween: 8,
                                    },
                                    1280: {
                                        direction: "vertical",
                                        slidesPerView: 5,
                                        spaceBetween: 10,
                                    },
                                }}
                                watchSlidesProgress={true}
                                className="thumbs-swiper h-full"
                            >
                                {product?.main_image &&
                                    product?.main_image?.map((image, index) => (
                                        <SwiperSlide key={index} className="!h-auto">
                                            <button
                                                onClick={() => handleImageSelect(image, index)}
                                                className={`w-full aspect-square border-2 rounded-[5px] cursor-pointer transition-all duration-300 overflow-hidden hover:border-primary/60 flex items-center justify-center ${activeIndex === index
                                                        ? "border-primary"
                                                        : "border-creamline"
                                                    }`}
                                            >
                                                <Image
                                                    src={image}
                                                    alt={`${product?.name || 'Product'} - Thumbnail ${index + 1}`}
                                                    width={120}
                                                    height={120}
                                                    sizes="120px"
                                                    className="h-full w-full object-contain p-2"
                                                    style={{
                                                        maxWidth: '100%',
                                                        maxHeight: '100%',
                                                    }}
                                                    onError={(e) => {
                                                        console.log('Thumbnail failed to load:', image);
                                                    }}
                                                />
                                            </button>
                                        </SwiperSlide>
                                    ))
                                }
                            </Swiper>
                        </div>
                        
                        {/* Main Image Swiper - Right side */}
                        <div className="w-full md:w-4/5 order-1 md:order-2">
                            <div className="border border-creamline rounded-[10px] overflow-hidden h-[400px] md:h-[500px] lg:h-[500px] relative">
                                <Swiper
                                    modules={[Navigation, Pagination, Thumbs, Autoplay]}
                                    spaceBetween={10}
                                    slidesPerView={1}
                                    thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                                    autoplay={{
                                        delay: 3000,
                                        disableOnInteraction: false,
                                        pauseOnMouseEnter: true,
                                    }}
                                    onSwiper={(swiper) => {
                                        mainSwiperRef.current = swiper;
                                    }}
                                    onSlideChange={handleSlideChange}
                                    className="h-full"
                                >
                                    {product?.main_image &&
                                        product?.main_image?.map((image, index) => (
                                            <SwiperSlide key={index} className="flex justify-center items-center">
                                                <div
                                                    className="relative h-full w-full cursor-zoom-in overflow-hidden group"
                                                    onClick={handleMainImageClick}
                                                >
                                                    <Image
                                                        src={image || defaultImage}
                                                        alt={`${product?.name || 'Product'} - Image ${index + 1}`}
                                                        width={800}
                                                        height={600}
                                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                        className="h-full w-full object-contain p-6"
                                                        style={{
                                                            maxWidth: '100%',
                                                            maxHeight: '100%',
                                                        }}
                                                        onError={(e) => {
                                                            console.log('Image failed to load:', image);
                                                        }}
                                                    />
                                                    {/* Zoom indicator */}
                                                    <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                        <svg
                                                            className="w-4 h-4 text-white"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                                                            />
                                                        </svg>
                                                    </div>
                                                </div>
                                            </SwiperSlide>
                                        ))
                                    }
                                </Swiper>
                            </div>
                        </div>
                    </>
                    :
                    <div className="w-full border border-creamline rounded-[10px] overflow-hidden h-[400px] md:h-[500px] lg:h-[500px] relative">
                        {defaultImage && (
                            <Image
                                src={defaultImage}
                                alt={`${product?.name || 'Product Image'}`}
                                width={120}
                                height={120}
                                sizes="120px"
                                className="h-full w-full object-contain p-4"
                                style={{
                                    maxWidth: '100%',
                                    maxHeight: '100%',
                                }}
                                onError={(e) => {
                                    console.log('Thumbnail failed to load:', defaultImage);
                                }}
                            />
                        )}
                    </div>
            }
        </section>
    );
}