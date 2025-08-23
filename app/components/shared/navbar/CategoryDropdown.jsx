"use client";
import { ChevronRight, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function CategoryDropdown({ isDesktop = true, isOpen, onToggle }) {
    const [hoveredCategory, setHoveredCategory] = useState(null);
    const [expandedCategories, setExpandedCategories] = useState([]);

    const categories = [
        {
            id: 1,
            name: "Pregnant & Postpartum",
            icon: "🤱",
            subcategories: ["Maternity Wear", "Postpartum Care", "Prenatal Vitamins", "Nursing Bras"]
        },
        {
            id: 2,
            name: "Milks & Foods",
            icon: "🍼",
            subcategories: ["Formula Milk", "Baby Cereal", "Purees", "Snacks", "Organic Foods"]
        },
        {
            id: 3,
            name: "Diapers & Wipes",
            icon: "🧷",
            subcategories: ["Disposable Diapers", "Cloth Diapers", "Wet Wipes", "Diaper Cream"]
        },
        {
            id: 4,
            name: "Infant",
            icon: "👶",
            subcategories: ["Newborn Essentials", "Baby Bottles", "Pacifiers", "Bibs", "Swaddles"]
        },
        {
            id: 5,
            name: "Eat & Drink Supplies",
            icon: "🥄",
            subcategories: ["High Chairs", "Baby Spoons", "Sippy Cups", "Feeding Sets"]
        },
        {
            id: 6,
            name: "Baby Fashion",
            icon: "👕",
            subcategories: ["Bodysuits", "Rompers", "Dresses", "Shoes", "Accessories"]
        },
        {
            id: 7,
            name: "Baby Out",
            icon: "🚗",
            subcategories: ["Car Seats", "Baby Carriers", "Diaper Bags", "Travel Gear"]
        },
        {
            id: 8,
            name: "Toys & Study",
            icon: "🧸",
            subcategories: ["Educational Toys", "Soft Toys", "Books", "Musical Toys", "Puzzles"]
        },
        {
            id: 9,
            name: "Stroller, Crib, Chair",
            icon: "🛏️",
            subcategories: ["Strollers", "Cribs", "High Chairs", "Baby Bouncers", "Playpens"]
        },
        {
            id: 10,
            name: "Washes & Bath",
            icon: "🛁",
            subcategories: ["Baby Shampoo", "Body Wash", "Bath Toys", "Towels", "Bath Seats"]
        },
        {
            id: 11,
            name: "Homewares",
            icon: "🏠",
            subcategories: ["Baby Monitors", "Night Lights", "Storage", "Decorations"]
        }
    ];

    const toggleCategory = (categoryId) => {
        setExpandedCategories(prev => 
            prev.includes(categoryId) 
                ? prev.filter(id => id !== categoryId)
                : [...prev, categoryId]
        );
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop for mobile */}
            {!isDesktop && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40"
                    onClick={onToggle}
                />
            )}

            <div className={`
                absolute z-50 bg-white shadow-lg rounded-lg border
                ${isDesktop 
                    ? 'top-full left-0 w-80 mt-2' 
                    : 'top-full left-0 right-0 mx-4 max-h-96 overflow-y-auto'
                }
            `}>
                {isDesktop ? (
                    /* Desktop View - with subcategories on hover */
                    <div className="relative bg-white">
                        <div className="py-2">
                            {categories.map((category) => (
                                <div
                                    key={category.id}
                                    className="relative"
                                    onMouseEnter={() => setHoveredCategory(category.id)}
                                    onMouseLeave={() => setHoveredCategory(null)}
                                >
                                    <Link
                                        href={`/category/${category.id}`}
                                        className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-xl">{category.icon}</span>
                                            <span className="text-sm font-medium text-gray-700 group-hover:text-primary">
                                                {category.name}
                                            </span>
                                        </div>
                                        <ChevronRight className="size-4 text-gray-400 group-hover:text-primary" />
                                    </Link>

                                    {/* Subcategory dropdown */}
                                    {hoveredCategory === category.id && (
                                        <div className="absolute left-full top-0 w-64 bg-white shadow-lg rounded-lg ml-1 z-60 border">
                                            <div className="py-2">
                                                <div className="px-4 py-2 border-b">
                                                    <h3 className="font-semibold text-primary text-sm">
                                                        {category.name}
                                                    </h3>
                                                </div>
                                                {category.subcategories.map((subcategory, index) => (
                                                    <Link
                                                        key={index}
                                                        href={`/category/${category.id}/${subcategory.toLowerCase().replace(/\s+/g, '-')}`}
                                                        className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-primary transition-colors"
                                                    >
                                                        {subcategory}
                                                    </Link>
                                                ))}
                                                <div className="px-4 py-2 border-t">
                                                    <Link
                                                        href={`/category/${category.id}`}
                                                        className="text-xs text-primary font-medium hover:underline"
                                                    >
                                                        View All {category.name} →
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="border-t px-4 py-3 bg-gray-50">
                            <Link
                                href="/categories"
                                className="text-sm font-semibold text-primary hover:underline"
                            >
                                View All Categories →
                            </Link>
                        </div>
                    </div>
                ) : (
                    /* Mobile View - Tree view with expandable categories */
                    <div className="py-2 bg-white">
                        {categories.map((category) => (
                            <div key={category.id} className="border-b border-gray-100 last:border-b-0">
                                {/* Main category */}
                                <div className="flex items-center justify-between px-4 py-3">
                                    <Link
                                        href={`/category/${category.id}`}
                                        className="flex items-center gap-3 flex-1"
                                        onClick={onToggle}
                                    >
                                        <span className="text-lg">{category.icon}</span>
                                        <span className="text-sm font-medium text-gray-700">
                                            {category.name}
                                        </span>
                                    </Link>
                                    
                                    {/* Expand/Collapse button */}
                                    <button
                                        onClick={() => toggleCategory(category.id)}
                                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                                    >
                                        {expandedCategories.includes(category.id) ? (
                                            <ChevronDown className="size-4 text-gray-500" />
                                        ) : (
                                            <ChevronRight className="size-4 text-gray-500" />
                                        )}
                                    </button>
                                </div>

                                {/* Subcategories */}
                                {expandedCategories.includes(category.id) && (
                                    <div className="bg-gray-50 border-t border-gray-200">
                                        {category.subcategories.map((subcategory, index) => (
                                            <Link
                                                key={index}
                                                href={`/category/${category.id}/${subcategory.toLowerCase().replace(/\s+/g, '-')}`}
                                                className="block px-8 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-primary transition-colors border-b border-gray-100 last:border-b-0"
                                                onClick={onToggle}
                                            >
                                                {subcategory}
                                            </Link>
                                        ))}
                                        <Link
                                            href={`/category/${category.id}`}
                                            className="block px-8 py-2 text-xs text-primary font-medium hover:bg-gray-100 transition-colors"
                                            onClick={onToggle}
                                        >
                                            View All {category.name} →
                                        </Link>
                                    </div>
                                )}
                            </div>
                        ))}
                        
                        {/* View all categories footer */}
                        <div className="px-4 py-3 bg-gray-50 border-t">
                            <Link
                                href="/categories"
                                className="text-sm font-semibold text-primary hover:underline"
                                onClick={onToggle}
                            >
                                View All Categories →
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}