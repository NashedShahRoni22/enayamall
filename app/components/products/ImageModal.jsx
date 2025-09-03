import { useRef, useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { IoChevronBack, IoChevronForward, IoClose } from 'react-icons/io5';
import Image from 'next/image';
import 'swiper/css';
import 'swiper/css/navigation';

export default function ImageModal({ isOpen, images, activeIndex, productName, onClose, onIndexChange }) {
    const [modalActiveIndex, setModalActiveIndex] = useState(activeIndex || 0);
    const modalSwiperRef = useRef(null);

    // Update modal active index when activeIndex prop changes
    useEffect(() => {
        if (isOpen && activeIndex !== undefined) {
            setModalActiveIndex(activeIndex);
            if (modalSwiperRef.current) {
                modalSwiperRef.current.slideTo(activeIndex);
            }
        }
    }, [activeIndex, isOpen]);

    // Handle modal close
    const handleModalClose = () => {
        onClose();
        document.body.style.overflow = 'unset';
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
    };

    // Handle modal navigation
    const handleModalPrev = () => {
        if (modalSwiperRef.current) {
            modalSwiperRef.current.slidePrev();
        }
    };

    const handleModalNext = () => {
        if (modalSwiperRef.current) {
            modalSwiperRef.current.slideNext();
        }
    };

    // Handle slide change
    const handleSlideChange = (swiper) => {
        const newIndex = swiper.activeIndex;
        setModalActiveIndex(newIndex);
        
        // Update the gallery to match modal position
        if (window.updateGalleryIndex) {
            window.updateGalleryIndex(newIndex);
        }
        
        if (onIndexChange) {
            onIndexChange(newIndex);
        }
    };

    // Handle body scroll lock when modal opens
    useEffect(() => {
        if (isOpen) {
            const scrollY = window.scrollY;
            document.body.style.overflow = 'hidden';
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.width = '100%';
        }

        return () => {
            if (!isOpen) {
                document.body.style.overflow = 'unset';
                document.body.style.position = '';
                document.body.style.top = '';
                document.body.style.width = '';
            }
        };
    }, [isOpen]);

    // Handle ESC key press
    useEffect(() => {
        const handleEscapeKey = (event) => {
            if (event.key === 'Escape' && isOpen) {
                handleModalClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscapeKey);
        }

        return () => {
            document.removeEventListener('keydown', handleEscapeKey);
        };
    }, [isOpen]);

    if (!isOpen || !images?.length) return null;

    return (
        <div className="fixed inset-0 z-[9999]">
            {/* Blur Backdrop */}
            <div
                className="absolute inset-0 bg-black/20 backdrop-blur-sm"
                onClick={handleModalClose}
            ></div>

            {/* Modal Content */}
            <div className="relative h-full w-full flex items-center justify-center">
                {/* Image Container - Centered */}
                <div className="flex items-center justify-center h-full w-full p-8">
                    <Swiper
                        modules={[Navigation]}
                        spaceBetween={20}
                        slidesPerView={1}
                        initialSlide={modalActiveIndex}
                        onSwiper={(swiper) => {
                            modalSwiperRef.current = swiper;
                        }}
                        onSlideChange={handleSlideChange}
                        className="h-full w-full max-w-5xl"
                    >
                        {images.map((image, index) => (
                            <SwiperSlide key={index} className="flex items-center justify-center h-full">
                                <div className="flex items-center justify-center h-full w-full">
                                    <Image
                                        src={image}
                                        alt={`${productName || 'Product'} - Image ${index + 1}`}
                                        width={1200}
                                        height={800}
                                        sizes="100vw"
                                        className="object-contain bg-creamline"
                                        style={{
                                            maxWidth: '90vw',
                                            maxHeight: '85vh',
                                            width: 'auto',
                                            height: 'auto',
                                        }}
                                        onError={(e) => {
                                            console.log('Modal image failed to load:', image);
                                        }}
                                    />
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

                {/* Navigation Controls */}
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md rounded-full px-6 py-3">
                        {/* Previous Button */}
                        <button
                            onClick={handleModalPrev}
                            disabled={modalActiveIndex === 0}
                            className="cursor-pointer flex items-center justify-center w-10 h-10 rounded-full bg-primary hover:bg-primary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Previous image"
                        >
                            <IoChevronBack className="w-5 h-5 text-white" />
                        </button>

                        {/* Close Button */}
                        <button
                            onClick={handleModalClose}
                            className="cursor-pointer flex items-center justify-center w-10 h-10 rounded-full bg-primary hover:bg-primary/80 transition-colors"
                            title="Close (ESC)"
                        >
                            <IoClose className="w-5 h-5 text-white" />
                        </button>

                        {/* Next Button */}
                        <button
                            onClick={handleModalNext}
                            disabled={modalActiveIndex === (images.length - 1)}
                            className="cursor-pointer flex items-center justify-center w-10 h-10 rounded-full bg-primary hover:bg-primary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Next image"
                        >
                            <IoChevronForward className="w-5 h-5 text-white" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}