import { use, useState } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import Container from '../shared/Container';
import { useGetData } from '../helpers/useGetData';
import { useAppContext } from '@/app/context/AppContext';

export default function ClientReviewSwiper() {
  const { lang } = useAppContext();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  // get reviews 
  const {data:reviewsData} = useGetData("main-testimonials");
  const reviews = reviewsData?.data;

  const nextSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev + 1) % reviews.length);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev - 1 + reviews.length) % reviews.length);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const goToSlide = (index) => {
    if (isTransitioning || index === currentSlide) return;
    setIsTransitioning(true);
    setCurrentSlide(index);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  console.log(reviews);
  console.log(lang);

  return (
    <section className="py-10 bg-[#efefef] mt-10">
      <Container>
            {/* Header */}
            {/* <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-brand-pink mb-2">Clients Reviews</h2>
              <p className="text-slate-600">Only the best seller products added recently in our catalog</p>
            </div> */}

            {/* Swiper Container */}
            <div className="relative bg-white rounded-xl border border-white overflow-hidden min-h-[300px]">
              {/* Navigation Arrows */}
              <button
                onClick={prevSlide}
                disabled={isTransitioning}
                className="cursor-pointer absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white shadow-lg rounded-full flex items-center justify-center text-brand-pink hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                <ChevronLeft className="w-6 h-6 transform group-hover:scale-110 transition-transform" />
              </button>

              <button
                onClick={nextSlide}
                disabled={isTransitioning}
                className="cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white shadow-lg rounded-full flex items-center justify-center text-brand-pink hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                <ChevronRight className="w-6 h-6 transform group-hover:scale-110 transition-transform" />
              </button>

              {/* Slides Container */}
              <div className="relative overflow-hidden">
                <div 
                  className="flex transition-transform duration-300 ease-in-out"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {reviews?.map((review, index) => (
                    <div
                      key={index}
                      className="w-full flex-shrink-0 px-16 py-12"
                    >
                      <div className="text-center max-w-2xl mx-auto">
                        {/* Quote Icon */}
                        <div className="text-brand-pink/20 mb-6">
                          <Quote className="w-12 h-12 mx-auto" />
                        </div>
                        
                        {/* Review Text */}
                        <p className="text-lg text-slate-700 leading-relaxed mb-8 italic">
                          "{lang === 'en' ? review.description : review.ar_description}"
                        </p>
                        
                        {/* Client Name */}
                        <div>
                          <h4 className="text-xl font-semibold text-slate-800 mb-1">
                            {lang === 'en' ? review.name : review.ar_name}
                          </h4>
                          <h4 className="text-xl font-semibold text-slate-800 mb-1">
                            {lang === 'en' ? review.designation : review.ar_designation}
                          </h4>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Pagination Dots */}
            <div className="flex justify-center mt-8 space-x-2">
              {reviews?.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  disabled={isTransitioning}
                  className={`w-3 h-3 rounded-full transition-all duration-200 disabled:cursor-not-allowed ${
                    index === currentSlide
                      ? 'bg-brand-pink w-8'
                      : 'bg-brand-pink/20 hover:bg-brand-pink/50 cursor-pointer'
                  }`}
                />
              ))}
            </div>
          </Container>
    </section>
  );
}