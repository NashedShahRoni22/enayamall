import { useState, useEffect, useRef } from "react";
import { BiChevronDown, BiChevronUp } from "react-icons/bi";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

export default function PriceRangeFilter({
    minPrice,
    maxPrice,
    setMinPrice,
    setMaxPrice,
    absoluteMin = 0,
    absoluteMax = 50000,
    onFilter
}) {
    const [show, setShow] = useState(true);
    const [isDragging, setIsDragging] = useState(null);
    const sliderRef = useRef(null);

    // Calculate percentages for slider positioning
    const minPercent = ((minPrice - absoluteMin) / (absoluteMax - absoluteMin)) * 100;
    const maxPercent = ((maxPrice - absoluteMin) / (absoluteMax - absoluteMin)) * 100;

    // Handle input changes
    const handleMinInputChange = (e) => {
        const value = Math.max(absoluteMin, Math.min(parseInt(e.target.value) || absoluteMin, maxPrice - 1));
        setMinPrice(value);
    };

    const handleMaxInputChange = (e) => {
        const value = Math.min(absoluteMax, Math.max(parseInt(e.target.value) || absoluteMax, minPrice + 1));
        setMaxPrice(value);
    };

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
        <div className="bg-white border border-gray-200 rounded-lg p-5">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-700">Price</h3>
                <button
                    onClick={() => setShow(!show)}
                    className="cursor-pointer"
                >
                    {show ? (
                        <FaChevronUp className="text-primarymagenta" />
                    ) : (
                        <FaChevronDown className="text-primarymagenta" />
                    )}
                </button>
            </div>


            {show && (
                <>
                    <div className="mt-[20px] h-[1px] w-full bg-creamline"></div>

                    {/* Dual Range Slider */}
                    <div className="mb-5 mt-[40px]">
                        <div
                            ref={sliderRef}
                            className="relative h-2 bg-gray-200 rounded-full cursor-pointer"
                            onClick={handleSliderClick}
                        >
                            {/* Active Range Track */}
                            <div
                                className="absolute h-full bg-primary rounded-full"
                                style={{
                                    left: `${minPercent}%`,
                                    width: `${maxPercent - minPercent}%`
                                }}
                            />

                            {/* Min Handle */}
                            <div
                                className="absolute w-5 h-5 bg-white border-2 border-primary rounded-full cursor-grab active:cursor-grabbing transform -translate-x-1/2 -translate-y-1/2 top-1/2 hover:scale-110 transition-transform shadow-sm"
                                style={{ left: `${minPercent}%` }}
                                onMouseDown={() => handleMouseDown('min')}
                            />

                            {/* Max Handle */}
                            <div
                                className="absolute w-5 h-5 bg-white border-2 border-primary rounded-full cursor-grab active:cursor-grabbing transform -translate-x-1/2 -translate-y-1/2 top-1/2 hover:scale-110 transition-transform shadow-sm"
                                style={{ left: `${maxPercent}%` }}
                                onMouseDown={() => handleMouseDown('max')}
                            />
                        </div>
                    </div>

                    {/* Price Input Fields */}
                    <div className="flex items-center justify-between gap-3 mb-4">
                        <div>
                            <input
                                // type="number"
                                min={absoluteMin}
                                max={absoluteMax}
                                value={minPrice}
                                onChange={handleMinInputChange}
                                className="px-2 py-1 w-[80px] border border-gray-300 rounded text-center text-sm focus:outline-none focus:border-primary"
                            />
                            <span className="text-gray-500 text-sm ml-4">৳</span>
                        </div>
                        <div>
                            <span className="text-gray-500 text-sm mr-4">৳</span>
                            <input
                                // type="number"
                                min={absoluteMin}
                                max={absoluteMax}
                                value={maxPrice}
                                onChange={handleMaxInputChange}
                                className="px-2 py-1 w-[80px] border border-gray-300 rounded text-center text-sm focus:outline-none focus:border-primary"
                            />
                        </div>
                    </div>

                    {/* Reset Button */}
                    <button
                        onClick={() => {
                            setMinPrice(absoluteMin);
                            setMaxPrice(absoluteMax);
                            if (onFilter) onFilter();
                        }}
                        className="bg-primary text-white px-6 py-2 rounded font-medium transition-colors cursor-pointer"
                    >
                        Reset
                    </button>
                </>
            )}
        </div>
    );
}