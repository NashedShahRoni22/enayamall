import { useState } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import Container from '../shared/Container';

// Mock data for client reviews
const reviewsData = [
  {
    id: 1,
    name: "Sarah Johnson",
    review: "Absolutely exceptional service! The team went above and beyond to deliver exactly what we needed. Their attention to detail and professionalism made the entire process seamless."
  },
  {
    id: 2,
    name: "Michael Chen",
    review: "Outstanding quality and incredible support. I couldn't be happier with the results. They truly understand their clients' needs and deliver beyond expectations."
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    review: "Professional, reliable, and innovative. Working with this team has been a game-changer for our business. Highly recommend their services to anyone looking for excellence."
  },
  {
    id: 4,
    name: "David Thompson",
    review: "From start to finish, the experience was flawless. Great communication, timely delivery, and results that exceeded our expectations. Will definitely work with them again."
  },
  {
    id: 5,
    name: "Lisa Park",
    review: "Incredible attention to detail and creative solutions. They took our vision and made it even better than we imagined. Truly talented and professional team."
  }
];

export default function ClientReviewSwiper() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const nextSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev + 1) % reviewsData.length);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev - 1 + reviewsData.length) % reviewsData.length);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const goToSlide = (index) => {
    if (isTransitioning || index === currentSlide) return;
    setIsTransitioning(true);
    setCurrentSlide(index);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  return (
    <Container>
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-primary mb-2">Clients Reviews</h2>
        <p className="text-slate-600">Only the best seller products added recently in our catalog</p>
      </div>

      {/* Swiper Container */}
      <div className="relative bg-creamline rounded-xl border border-creamline overflow-hidden min-h-[300px]">
        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          disabled={isTransitioning}
          className="cursor-pointer absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white shadow-lg rounded-full flex items-center justify-center text-primary hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          <ChevronLeft className="w-6 h-6 transform group-hover:scale-110 transition-transform" />
        </button>

        <button
          onClick={nextSlide}
          disabled={isTransitioning}
          className="cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white shadow-lg rounded-full flex items-center justify-center text-primary hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          <ChevronRight className="w-6 h-6 transform group-hover:scale-110 transition-transform" />
        </button>

        {/* Slides Container */}
        <div className="relative overflow-hidden">
          <div 
            className="flex transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {reviewsData.map((review, index) => (
              <div
                key={review.id}
                className="w-full flex-shrink-0 px-16 py-12"
              >
                <div className="text-center max-w-2xl mx-auto">
                  {/* Quote Icon */}
                  <div className="text-blue-200 mb-6">
                    <Quote className="w-12 h-12 mx-auto" />
                  </div>
                  
                  {/* Review Text */}
                  <p className="text-lg text-slate-700 leading-relaxed mb-8 italic">
                    "{review.review}"
                  </p>
                  
                  {/* Client Name */}
                  <div>
                    <h4 className="text-xl font-semibold text-slate-800 mb-1">
                      {review.name}
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
        {reviewsData.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            disabled={isTransitioning}
            className={`w-3 h-3 rounded-full transition-all duration-200 disabled:cursor-not-allowed ${
              index === currentSlide
                ? 'bg-primary w-8'
                : 'bg-slate-300 hover:bg-slate-400'
            }`}
          />
        ))}
      </div>
    </Container>
  );
}