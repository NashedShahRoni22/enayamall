// GlobalSearch.jsx
"use client";
import { Search, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { FaSpinner } from "react-icons/fa";
import SearchProductCard from "../cards/SeachProductCard";

const BASE_URL = process.env.NEXT_PUBLIC_WEB_API_BASE_URL;

export default function GlobalSearch({ 
    isOpen = false,
    onClose,
    isMobile = false
}) {
    // Search states
    const [searchInput, setSearchInput] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    // Handle search debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchInput.trim()) {
                setDebouncedSearch(searchInput.trim());
            } else {
                setDebouncedSearch('');
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [searchInput]);

    // Search query
    const { data: searchData, isLoading: isSearchLoading, error: searchError } = useQuery({
        queryKey: ["search", { search: debouncedSearch }],
        queryFn: async () => {
            const url = new URL(`${BASE_URL}search`);
            if (debouncedSearch) {
                url.searchParams.append('search', debouncedSearch);
            }

            const res = await fetch(url.toString());
            if (!res.ok) {
                throw new Error("Failed to fetch search results");
            }
            return res.json();
        },
        enabled: Boolean(debouncedSearch && isOpen)
    });

    const searchProducts = searchData?.data || [];

    // Clear search and close
    const handleClose = () => {
        setSearchInput('');
        setDebouncedSearch('');
        onClose();
    };

    // Close on product click
    const handleProductClick = () => {
        handleClose();
    };

    // Handle escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) {
                handleClose();
            }
        };
        
        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }
        
        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm">
            {/* Search Modal */}
            <div className={`
                bg-white shadow-2xl
                ${isMobile ? 
                    'absolute inset-0' : 
                    'absolute top-20 left-1/2 transform -translate-x-1/2 w-full max-w-4xl mx-4 rounded-2xl max-h-[80vh]'
                }
                overflow-hidden
            `}>
                {/* Search Header */}
                <div className="px-4 sm:px-6 py-4 border-b border-gray-200 bg-white sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        <div className="flex-1 flex items-center gap-3 bg-gray-50 rounded-full px-4 py-3 focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/20 border border-transparent focus-within:border-primary/30 transition-all">
                            <Search className="size-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search products..."
                                className="flex-1 bg-transparent focus:outline-none text-gray-700 placeholder:text-gray-500"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                autoFocus
                            />
                            {searchInput && (
                                <button 
                                    onClick={() => setSearchInput('')}
                                    className="text-gray-400 hover:text-gray-600 hover:bg-gray-200 p-1 rounded-full transition-all"
                                >
                                    <X className="size-4" />
                                </button>
                            )}
                        </div>
                        <button 
                            onClick={handleClose}
                            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-all"
                        >
                            <X className="size-6" />
                        </button>
                    </div>
                    
                    {/* Search Stats */}
                    {debouncedSearch && (
                        <div className="flex items-center gap-2 mt-3 text-sm text-gray-600">
                            {isSearchLoading && <FaSpinner className="animate-spin text-primary" />}
                            <span>
                                {isSearchLoading ? 'Searching...' : 
                                `Search results for "${debouncedSearch}" ${searchProducts.length > 0 ? `(${searchProducts.length} found)` : ''}`}
                            </span>
                        </div>
                    )}
                </div>

                {/* Search Results */}
                <div className="overflow-y-auto" style={{ maxHeight: 'calc(80vh - 120px)' }}>
                    <div className="px-4 sm:px-6 py-6">
                        {/* No search yet */}
                        {!debouncedSearch && (
                            <div className="text-center py-16">
                                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                                    <Search className="size-8 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Start searching</h3>
                                <p className="text-gray-500">Type something to search for products</p>
                            </div>
                        )}

                        {/* Loading */}
                        {isSearchLoading && debouncedSearch && (
                            <div className="flex items-center gap-3 justify-center py-16 text-primary">
                                <FaSpinner className="animate-spin text-xl" />
                                <span className="font-medium">Searching for products...</span>
                            </div>
                        )}

                        {/* Error */}
                        {searchError && (
                            <div className="text-center py-16">
                                <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                                    <X className="size-8 text-red-500" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Something went wrong</h3>
                                <p className="text-gray-500">{searchError.message}</p>
                            </div>
                        )}

                        {/* No Results */}
                        {!isSearchLoading && !searchError && debouncedSearch && searchProducts?.length === 0 && (
                            <div className="text-center py-16">
                                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                                    <Search className="size-8 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                                <p className="text-gray-500">Try searching with different keywords</p>
                            </div>
                        )}

                        {/* Results Grid */}
                        {!isSearchLoading && !searchError && searchProducts?.length > 0 && (
                            <div className={`grid gap-4 ${
                                isMobile ? 
                                    'grid-cols-1 xs:grid-cols-2' : 
                                    'grid-cols-2 sm:grid-cols-3'
                            }`}>
                                {searchProducts.map((product, index) => (
                                    <div key={index} onClick={handleProductClick}>
                                        <SearchProductCard 
                                            p={product} 
                                            setShowSearch={handleProductClick} 
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Overlay to close */}
            <div 
                className="absolute inset-0 -z-10"
                onClick={handleClose}
            />
        </div>
    );
}