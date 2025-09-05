import { ChevronDown, ChevronUp } from "lucide-react";
import { useState, useEffect, useRef } from "react";

export default function PriceRangeFilter({
    minPrice,
    maxPrice,
    setMinPrice,
    setMaxPrice,
    absoluteMin = 0,
    absoluteMax = 10000}) {
    const [show, setShow] = useState(true);
    const [isDragging, setIsDragging] = useState(null);
    const sliderRef = useRef(null);
    
    // Calculate percentages for slider positioning
    const minPercent = ((minPrice - absoluteMin) / (absoluteMax - absoluteMin)) * 100;
    const maxPercent = ((maxPrice - absoluteMin) / (absoluteMax - absoluteMin)) * 100;
    
    // Handle slider interactions
    const handleSliderClick = (e) => {
        if (!sliderRef.current) return;
        const rect = sliderRef.current.getBoundingClientRect();
        const percent = ((e.clientX - rect.left) / rect.width) * 100;
        const value = Math.round((percent / 100) * (absoluteMax - absoluteMin) + absoluteMin);
        
        // Determine which handle is closer
        const distanceToMin = Math.abs(value - minPrice);
        const distanceToMax = Math.abs(value - maxPrice);
        
        if (distanceToMin < distanceToMax) {
            setMinPrice(Math.max(absoluteMin, Math.min(value, maxPrice - 1)));
        } else {
            setMaxPrice(Math.min(absoluteMax, Math.max(value, minPrice + 1)));
        }
    };
    
    const handleMouseDown = (type) => {
        setIsDragging(type);
    };
    
    const handleMouseMove = (e) => {
        if (!isDragging || !sliderRef.current) return;
        const rect = sliderRef.current.getBoundingClientRect();
        const percent = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
        const value = Math.round((percent / 100) * (absoluteMax - absoluteMin) + absoluteMin);
        
        if (isDragging === 'min') {
            setMinPrice(Math.max(absoluteMin, Math.min(value, maxPrice - 1)));
        } else if (isDragging === 'max') {
            setMaxPrice(Math.min(absoluteMax, Math.max(value, minPrice + 1)));
        }
    };
    
    const handleMouseUp = () => {
        setIsDragging(null);
    };
    
    // Add global mouse event listeners
    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            return () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            };
        }
    }, [isDragging, minPrice, maxPrice]);

    return (
        <div className="border-b border-gray-300 pb-4 px-2">
            {/* Header */}
            <div className="flex justify-between items-center cursor-pointer" onClick={() => setShow(!show)}>
                <h3 className="text-md font-[500] text-primaryblack">Price Range</h3>
                <button className="cursor-pointer">
                    {show ? (
                        <ChevronUp className="text-primaryblack" strokeWidth={1.5} size={18}  />
                    ) : (
                        <ChevronDown className="text-primaryblack" strokeWidth={1.5} size={18}  />
                    )}
                </button>
            </div>

            {show && (
                <>
                    <div className="px-2">
                        {/* Dual Range Slider */}
                        <div className="mb-1 mt-4">
                            <div
                                ref={sliderRef}
                                className="relative h-2 bg-gray-100 rounded-full cursor-pointer"
                                onClick={handleSliderClick}
                            >
                                {/* Active Range Track */}
                                <div
                                    className="absolute h-full bg-primary rounded-full transition-all duration-200"
                                    style={{
                                        left: `${minPercent}%`,
                                        width: `${maxPercent - minPercent}%`
                                    }}
                                />
                                
                                {/* Min Handle */}
                                <div
                                    className="absolute w-5 h-5 bg-white border-2 border-primary rounded-full cursor-grab active:cursor-grabbing transform -translate-x-1/2 -translate-y-1/2 top-1/2 hover:scale-110 transition-transform shadow-md hover:shadow-lg z-10"
                                    style={{ left: `${minPercent}%` }}
                                    onMouseDown={() => handleMouseDown('min')}
                                />
                                
                                {/* Max Handle */}
                                <div
                                    className="absolute w-5 h-5 bg-white border-2 border-primary rounded-full cursor-grab active:cursor-grabbing transform -translate-x-1/2 -translate-y-1/2 top-1/2 hover:scale-110 transition-transform shadow-md hover:shadow-lg z-10"
                                    style={{ left: `${maxPercent}%` }}
                                    onMouseDown={() => handleMouseDown('max')}
                                />
                            </div>
                            
                            {/* Price Labels */}
                            <div className="flex justify-between mt-2 text-sm text-gray-500 -px-2">
                                <span><span className="dirham-symbol mr-1">ê</span>{minPrice.toLocaleString()}</span>
                                <span><span className="dirham-symbol mr-1">ê</span>{maxPrice.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}