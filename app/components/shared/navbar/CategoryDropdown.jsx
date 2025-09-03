// CategoryDropdown.jsx
"use client";
import { ChevronRight, ChevronDown, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useAppContext } from "@/app/context/AppContext";

export default function CategoryDropdown({ categories = [], onClose, className = "", isMobile = false }) {
    const dropdownRef = useRef(null);
    const [hoveredCategory, setHoveredCategory] = useState(null);
    const [expandedCategory, setExpandedCategory] = useState(null);
    const [subcategoryPosition, setSubcategoryPosition] = useState({ top: 0 });

    // Get language state from context
    const { lang } = useAppContext();

    // Translation object
    const translations = {
        en: {
            noCategoriesAvailable: "No categories available"
        },
        ar: {
            noCategoriesAvailable: "لا توجد فئات متاحة"
        }
    };

    // Get current translations
    const t = translations[lang] || translations.en;

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
            <div className={`bg-white shadow-lg rounded-lg p-4 ${className} ${lang === 'ar' ? 'rtl' : 'ltr'}`} ref={dropdownRef}>
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

    // Function to get category name based on language
    const getCategoryName = (category) => {
        return (lang === 'ar' && category.ar_name) ? category.ar_name : category.name;
    };

    return (
        <div 
            className={`bg-white shadow-lg rounded-lg ${isMobile ? 'relative shadow-none' : 'absolute z-50'} ${className} ${lang === 'ar' ? 'rtl' : 'ltr'}`}
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
                                } ${lang === 'ar' ? 'flex-row-reverse' : ''}`}
                                onClick={() => handleCategoryClick(category.id, hasChildren)}
                                onMouseEnter={(e) => handleCategoryHover(category.id, e)}
                                onMouseLeave={handleCategoryLeave}
                            >
                                <Link
                                    href={`/category/${category.slug}`}
                                    className="flex-1 font-medium text-gray-800 text-sm hover:text-blue-600"
                                    style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}
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
                                
                                {/* Show appropriate chevron based on device and language */}
                                {hasChildren && (
                                    <>
                                        {isMobile ? (
                                            <ChevronDown 
                                                className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
                                            />
                                        ) : (
                                            lang === 'ar' ? (
                                                <ChevronLeft className="w-4 h-4 text-gray-400" />
                                            ) : (
                                                <ChevronRight className="w-4 h-4 text-gray-400" />
                                            )
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
                                            style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}
                                            onClick={() => onClose?.()}
                                        >
                                            {getCategoryName(subcategory)}
                                        </Link>
                                    ))}
                                </div>
                            )}

                            {/* Desktop: Hover subcategories on the right/left based on language */}
                            {!isMobile && isHovered && hasChildren && (
                                <div 
                                    className={`absolute ${lang === 'ar' ? 'right-full' : 'left-full'} top-0 bg-white shadow-lg rounded-lg py-2 min-w-[600px] grid grid-cols-2 z-60 ${lang === 'ar' ? 'mr-1' : 'ml-1'}`}
                                    // style={{ top: `${subcategoryPosition.top}px` }}
                                    onMouseEnter={() => setHoveredCategory(category.id)}
                                    onMouseLeave={handleCategoryLeave}
                                >
                                    {category.child.map((subcategory) => (
                                        <Link
                                            key={subcategory.id}
                                            href={`/category/${subcategory.slug}`}
                                            className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                                            style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}
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