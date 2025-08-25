// CategoryDropdown.jsx
"use client";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";

export default function CategoryDropdown({ categories = [], onClose, className = "", isMobile = false }) {
    const dropdownRef = useRef(null);

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

    return (
        <div 
            className={`bg-white shadow-lg rounded-lg py-2 min-w-[250px] max-h-80 overflow-y-auto ${className} ${isMobile ? 'relative shadow-none' : 'absolute'}`}
            ref={dropdownRef}
        >
            {categories.map((category) => (
                <Link
                    key={category.id}
                    href={`/category/${category.slug}`}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                    onClick={() => onClose?.()}
                >
                    {/* Category Icon */}
                    {category.icon && (
                        <div className="w-8 h-8 flex-shrink-0">
                            <Image
                                src={category.icon}
                                alt={category.name}
                                width={32}
                                height={32}
                                className="w-full h-full object-contain rounded"
                            />
                        </div>
                    )}
                    
                    {/* Category Info */}
                    <div className="flex-1">
                        <h4 className="font-medium text-gray-800 text-sm">
                            {category.name}
                        </h4>
                        {category.total_products > 0 && (
                            <p className="text-xs text-gray-500">
                                {category.total_products} {category.total_products === 1 ? 'product' : 'products'}
                            </p>
                        )}
                    </div>
                    
                    {/* Arrow for subcategories (if any) */}
                    {category.child && category.child.length > 0 && (
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                    )}
                </Link>
            ))}
        </div>
    );
}