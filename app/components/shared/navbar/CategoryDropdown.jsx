// CategoryDropdown.jsx
"use client";
import { ChevronRight, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function CategoryDropdown({ categories = [], onClose, className = "", isMobile = false }) {
    const dropdownRef = useRef(null);
    const [hoveredCategory, setHoveredCategory] = useState(null);
    const [expandedCategory, setExpandedCategory] = useState(null);
    const [subcategoryPosition, setSubcategoryPosition] = useState({ top: 0 });

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                onClose?.();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    if (!categories || categories.length === 0) {
        return (
            <div className={`bg-white shadow-lg rounded-lg p-4 ${className}`} ref={dropdownRef}>
                <p className="text-gray-500 text-sm">No categories available</p>
            </div>
        );
    }

    const handleCategoryClick = (categoryId, hasChildren) => {
        if (isMobile && hasChildren) {
            setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
        }
    };

    const handleCategoryHover = (categoryId, event) => {
        if (!isMobile) {
            setHoveredCategory(categoryId);
            // Calculate position for subcategory dropdown
            const rect = event.currentTarget.getBoundingClientRect();
            setSubcategoryPosition({
                top: rect.top - dropdownRef.current.getBoundingClientRect().top
            });
        }
    };

    const handleCategoryLeave = () => {
        if (!isMobile) {
            setHoveredCategory(null);
        }
    };

    return (
        <div 
            className={`bg-white shadow-lg rounded-lg ${isMobile ? 'relative shadow-none' : 'absolute z-50'} ${className}`}
            ref={dropdownRef}
        >
            {/* Main category list */}
            <div className={`${isMobile ? 'py-2 max-h-[400px] overflow-y-auto' : ''}`}>
                {categories.map((category) => {
                    const hasChildren = category.child && category.child.length > 0;
                    const isExpanded = expandedCategory === category.id;
                    const isHovered = hoveredCategory === category.id;
                    
                    return (
                        <div key={category.id} className="relative">
                            <div
                                className={`min-w-[250px] rounded-lg flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer ${
                                    isMobile ? 'border-b border-gray-100 last:border-b-0' : ''
                                }`}
                                onClick={() => handleCategoryClick(category.id, hasChildren)}
                                onMouseEnter={(e) => handleCategoryHover(category.id, e)}
                                onMouseLeave={handleCategoryLeave}
                            >
                                <Link
                                    href={`/category/${category.slug}`}
                                    className="flex-1 font-medium text-gray-800 text-sm hover:text-blue-600"
                                    onClick={(e) => {
                                        if (isMobile && hasChildren) {
                                            e.preventDefault();
                                        } else {
                                            onClose?.();
                                        }
                                    }}
                                >
                                    {category.name}
                                </Link>
                                
                                {/* Show appropriate chevron based on device */}
                                {hasChildren && (
                                    <>
                                        {isMobile ? (
                                            <ChevronDown 
                                                className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
                                            />
                                        ) : (
                                            <ChevronRight className="w-4 h-4 text-gray-400" />
                                        )}
                                    </>
                                )}
                            </div>

                            {/* Mobile: Expanded subcategories below */}
                            {isMobile && isExpanded && hasChildren && (
                                <div className="bg-gray-50 border-t border-gray-100">
                                    {category.child.map((subcategory) => (
                                        <Link
                                            key={subcategory.id}
                                            href={`/category/${subcategory.slug}`}
                                            className="block px-8 py-2 text-sm text-gray-600 hover:bg-gray-100 transition-colors border-b border-gray-200 last:border-b-0"
                                            onClick={() => onClose?.()}
                                        >
                                            {subcategory.name}
                                        </Link>
                                    ))}
                                </div>
                            )}

                            {/* Desktop: Hover subcategories on the right */}
                            {!isMobile && isHovered && hasChildren && (
                                <div 
                                    className="absolute left-full top-0 bg-white shadow-lg rounded-lg py-2 min-w-[600px] grid grid-cols-2 z-60 ml-1"
                                    // style={{ top: `${subcategoryPosition.top}px` }}
                                    onMouseEnter={() => setHoveredCategory(category.id)}
                                    onMouseLeave={handleCategoryLeave}
                                >
                                    {category.child.map((subcategory) => (
                                        <Link
                                            key={subcategory.id}
                                            href={`/category/${subcategory.slug}`}
                                            className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                                            onClick={() => onClose?.()}
                                        >
                                            {subcategory.name}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}