"use client";
import { ChevronRight, ChevronDown, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useAppContext } from "@/app/context/AppContext";

export default function CategoryDropdown({ categories = [], onClose, className = "", isMobile = false }) {
    const { lang } = useAppContext();
    const isRTL = lang === 'ar';
    const dropdownRef = useRef(null);
    const [hoveredCategory, setHoveredCategory] = useState(null);
    const [expandedCategory, setExpandedCategory] = useState(null);
    const [subcategoryPosition, setSubcategoryPosition] = useState({ top: 0 });

    // Localization texts
    const texts = {
        en: {
            noCategoriesAvailable: "No categories available"
        },
        ar: {
            noCategoriesAvailable: "لا توجد فئات متاحة"
        }
    };

    const t = texts[lang] || texts.en;

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
            <div 
                className={`bg-white shadow-lg rounded-lg p-4 ${className} ${isRTL ? 'rtl text-right' : 'ltr text-left'}`} 
                ref={dropdownRef}
                dir={isRTL ? 'rtl' : 'ltr'}
            >
                <p className="text-gray-500 text-sm">{t.noCategoriesAvailable}</p>
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

    // Get category name based on language
    const getCategoryName = (category) => {
        if (isRTL) {
            return category.ar_name || category.name || '';
        }
        return category.name || '';
    };

    return (
        <div 
            className={`bg-white shadow-lg rounded-lg ${isMobile ? 'relative shadow-none' : 'absolute z-50'} ${className} ${isRTL ? 'rtl' : 'ltr'}`}
            ref={dropdownRef}
            dir={isRTL ? 'rtl' : 'ltr'}
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
                                } ${isRTL ? 'flex-row-reverse' : ''}`}
                                onClick={() => handleCategoryClick(category.id, hasChildren)}
                                onMouseEnter={(e) => handleCategoryHover(category.id, e)}
                                onMouseLeave={handleCategoryLeave}
                            >
                                <Link
                                    href={`/category/${category.slug}`}
                                    className={`flex-1 font-medium text-gray-800 text-sm hover:text-blue-600 ${
                                        isRTL ? 'text-right' : 'text-left'
                                    }`}
                                    onClick={(e) => {
                                        if (isMobile && hasChildren) {
                                            e.preventDefault();
                                        } else {
                                            onClose?.();
                                        }
                                    }}
                                >
                                    {getCategoryName(category)}
                                </Link>
                                
                                {/* Show appropriate chevron based on device and RTL */}
                                {hasChildren && (
                                    <>
                                        {isMobile ? (
                                            <ChevronDown 
                                                className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''} ${
                                                    isRTL ? 'mr-2' : 'ml-2'
                                                }`} 
                                            />
                                        ) : (
                                            <>
                                                {isRTL ? (
                                                    <ChevronLeft className={`w-4 h-4 text-gray-400 mr-2`} />
                                                ) : (
                                                    <ChevronRight className={`w-4 h-4 text-gray-400 ml-2`} />
                                                )}
                                            </>
                                        )}
                                    </>
                                )}
                            </div>

                            {/* Mobile: Expanded subcategories below */}
                            {isMobile && isExpanded && hasChildren && (
                                <div className={`bg-gray-50 border-t border-gray-100 ${isRTL ? 'rtl' : 'ltr'}`}>
                                    {category.child.map((subcategory) => (
                                        <Link
                                            key={subcategory.id}
                                            href={`/category/${subcategory.slug}`}
                                            className={`block py-2 text-sm text-gray-600 hover:bg-gray-100 transition-colors border-b border-gray-200 last:border-b-0 ${
                                                isRTL ? 'px-8 pr-8 text-right' : 'px-8 pl-8 text-left'
                                            }`}
                                            onClick={() => onClose?.()}
                                        >
                                            {getCategoryName(subcategory)}
                                        </Link>
                                    ))}
                                </div>
                            )}

                            {/* Desktop: Hover subcategories on the appropriate side */}
                            {!isMobile && isHovered && hasChildren && (
                                <div 
                                    className={`absolute top-0 bg-white shadow-lg rounded-lg py-2 min-w-[600px] grid grid-cols-2 z-60 ${
                                        isRTL 
                                            ? 'right-full mr-1' 
                                            : 'left-full ml-1'
                                    }`}
                                    // style={{ top: `${subcategoryPosition.top}px` }}
                                    onMouseEnter={() => setHoveredCategory(category.id)}
                                    onMouseLeave={handleCategoryLeave}
                                    dir={isRTL ? 'rtl' : 'ltr'}
                                >
                                    {category.child.map((subcategory) => (
                                        <Link
                                            key={subcategory.id}
                                            href={`/category/${subcategory.slug}`}
                                            className={`block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors ${
                                                isRTL ? 'text-right' : 'text-left'
                                            }`}
                                            onClick={() => onClose?.()}
                                        >
                                            {getCategoryName(subcategory)}
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