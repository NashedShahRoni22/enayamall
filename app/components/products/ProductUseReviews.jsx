'use client'
import { useEffect, useRef, useState } from 'react';
import ReviewForm from '../forms/ReviewForm';

export default function ProductUseReviews({ product, reviewable, variantId, token, productType }) {
    const [activeTab, setActiveTab] = useState("description");

    // Refs for sections - separate ref for each section
    const descriptionRef = useRef(null);
    const usageRef = useRef(null);
    const benefitsRef = useRef(null);
    const reviewsRef = useRef(null);

    // Scroll to section on click
    const scrollToSection = (ref, section) => {
        setActiveTab(section);
        ref?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    // Detect active section on scroll
    useEffect(() => {
        const handleScroll = () => {
            // Get viewport height for better threshold calculation
            const viewportHeight = window.innerHeight;
            const threshold = viewportHeight * 0.3;
            
            const descTop = descriptionRef.current?.getBoundingClientRect().top ?? Infinity;
            const usageTop = usageRef.current?.getBoundingClientRect().top ?? Infinity;
            const benefitsTop = benefitsRef.current?.getBoundingClientRect().top ?? Infinity;
            const reviewTop = reviewsRef.current?.getBoundingClientRect().top ?? Infinity;

            // Check which section is currently in view (closest to top within threshold)
            const sections = [
                { name: 'description', top: descTop, ref: descriptionRef.current },
                { name: 'howtouse', top: usageTop, ref: usageRef.current },
                { name: 'benefits', top: benefitsTop, ref: benefitsRef.current },
                { name: 'reviews', top: reviewTop, ref: reviewsRef.current }
            ].filter(section => section.ref); // Only include sections that exist

            // Find the section that's currently most visible
            let activeSection = 'description';
            
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

        window.addEventListener('scroll', throttledHandleScroll, { passive: true });
        return () => window.removeEventListener('scroll', throttledHandleScroll);
    }, [reviewable]);

    return (
        <section className="mt-[60px] 2xl:mt-[120px] relative">
            {/* Sticky Nav Buttons */}
            <div className="sticky top-16 lg:top-22 z-10 bg-white border-b border-creamline py-4">
                <div className="flex justify-between 2xl:justify-center 2xl:gap-[80px] text-[18px] 2xl:text-[26px] font-[550]">
                    <button
                        className={`transition-colors ${activeTab === 'description' ? 'text-secondary' : 'text-primarymagenta'
                            } hover:text-primary cursor-pointer`}
                        onClick={() => scrollToSection(descriptionRef, 'description')}
                    >
                        Description
                    </button>
                    <button
                        className={`transition-colors ${activeTab === 'howtouse' ? 'text-secondary' : 'text-primarymagenta'
                            } hover:text-primary cursor-pointer`}
                        onClick={() => scrollToSection(usageRef, 'howtouse')}
                    >
                        How to use
                    </button>
                    <button
                        className={`transition-colors ${activeTab === 'benefits' ? 'text-secondary' : 'text-primarymagenta'
                            } hover:text-primary cursor-pointer`}
                        onClick={() => scrollToSection(benefitsRef, 'benefits')}
                    >
                        Benefits
                    </button>
                    <button
                        className={`transition-colors ${activeTab === 'reviews' ? 'text-secondary' : 'text-primarymagenta'
                            } hover:text-primary cursor-pointer`}
                        onClick={() => scrollToSection(reviewsRef, 'reviews')}
                    >
                        Reviews
                    </button>
                </div>
            </div>

            {/* Related details */}
            <div className="text-[18px]">
                {/* Description */}
                <div ref={descriptionRef} className="scroll-mt-[128px] lg:scroll-mt-[163px] text-ash py-[25px] 2xl:py-[50px] mt-[25px] 2xl:mt-[50px]">
                    <p className="font-[550]">Key Benefits</p> <br />
                    <div id='preview' className="text-[16px] 2xl:text-[18px]" dangerouslySetInnerHTML={{ __html: product?.long_description }} />
                </div>

                {/* How to use */}
                <div ref={usageRef} className="scroll-mt-[128px] lg:scroll-mt-[163px] text-ash py-[25px] 2xl:py-[50px] border-t border-creamline mt-[25px] 2xl:mt-[50px]">
                    <p className="font-[550]">How to use</p> <br />
                    <div id='preview' className="text-[16px] 2xl:text-[18px]" dangerouslySetInnerHTML={{ __html: product?.how_to_use }} />
                </div>

                {/* Benefits */}
                <div ref={benefitsRef} className="scroll-mt-[128px] lg:scroll-mt-[163px] text-ash py-[25px] 2xl:py-[50px] border-t border-creamline mt-[25px] 2xl:mt-[50px]">
                    <p className="font-[550]">Benefits</p> <br />
                    <div id='preview' className="text-[16px] 2xl:text-[18px]" dangerouslySetInnerHTML={{ __html: product?.benefits }} />
                </div>
            </div>

            {/* Review section for regular product */}
            {
                reviewable &&
                <div ref={reviewsRef}>
                    <ReviewForm variantId={variantId} token={token} productType={productType} />
                </div>
            }

        </section>
    );
}