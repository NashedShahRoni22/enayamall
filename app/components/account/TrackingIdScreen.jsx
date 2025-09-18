import React, { useState, useEffect } from 'react'
import { Search, X, Copy, ExternalLink, Plus } from 'lucide-react'
import { useQuery } from "@tanstack/react-query"
import { FaSpinner } from "react-icons/fa"

const BASE_URL = process.env.NEXT_PUBLIC_WEB_API_BASE_URL

export default function TrackingIdScreen({ affiliateCode }) {
  const [searchInput, setSearchInput] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [trackedProducts, setTrackedProducts] = useState([])

  // Handle search debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput.trim()) {
        setDebouncedSearch(searchInput.trim())
      } else {
        setDebouncedSearch('')
      }
    }, 500)
    return () => clearTimeout(timer)
  }, [searchInput])

  // Search query
  const { data: searchData, isLoading: isSearchLoading, error: searchError } = useQuery({
    queryKey: ["search", { search: debouncedSearch }],
    queryFn: async () => {
      const url = new URL(`${BASE_URL}search`)
      if (debouncedSearch) {
        url.searchParams.append('search', debouncedSearch)
      }

      const res = await fetch(url.toString())
      if (!res.ok) {
        throw new Error("Failed to fetch search results")
      }
      return res.json()
    },
    enabled: Boolean(debouncedSearch)
  })

  const searchProducts = searchData?.data || []
  // const query = variant ? `?variant=${variant}` : `?variant=${variant}`

  // Generate tracking URL
  const generateTrackingUrl = (productSlug) => {
    if (!affiliateCode || !productSlug) return ''
    // return `${process.env.NEXT_PUBLIC_WEB_SHOP_BASE_URL}${productSlug}?tracking=${affiliateCode}`
    return `http://localhost:3000/shop/${productSlug}?tracking=${affiliateCode}`
  }

  // Add single product to tracked list
  const addSingleProductToTracking = (product) => {
    const trackingUrl = generateTrackingUrl(product.slug)
    const newTrackedProduct = {
      id: product.id,
      name: product.name,
      slug: product.slug,
      image: product.thumbnail_image,
      price: product.price,
      trackingUrl: trackingUrl
    }
    
    setTrackedProducts(prev => {
      const exists = prev.find(p => p.id === product.id)
      if (exists) return prev
      return [...prev, newTrackedProduct]
    })
  }

  // Copy tracking URL
  const copyTrackingUrl = async (url) => {
    try {
      await navigator.clipboard.writeText(url)
      alert('Tracking URL copied to clipboard!')
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  // Remove tracked product
  const removeTrackedProduct = (productId) => {
    setTrackedProducts(prev => prev.filter(p => p.id !== productId))
  }

  return (
    <div className="space-y-6">
      {/* Affiliate Code Display */}
      <div className="p-6 bg-white rounded-lg border border-creamline">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Your Affiliate Code</h3>
        <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border border-creamline">
          <code className="text-lg font-mono text-primary">
            {affiliateCode || 'No code available'}
          </code>
          <button 
            onClick={() => copyTrackingUrl(affiliateCode)}
            className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors flex items-center gap-2"
          >
            <Copy className="h-4 w-4" />
            Copy
          </button>
        </div>
      </div>

      {/* Product Search */}
      <div className="p-6 bg-white rounded-lg border border-creamline">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Add Products for Tracking</h3>
        
        {/* Search Input */}
        <div className="relative mb-4">
          <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-3 border border-creamline focus-within:border-blue-300 transition-all">
            <Search className="h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products by name..."
              className="flex-1 bg-transparent focus:outline-none text-gray-700 placeholder:text-gray-500"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            {searchInput && (
              <button
                onClick={() => setSearchInput('')}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-200 p-1 rounded-full transition-all"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Search Results */}
        {debouncedSearch && (
          <div className="border border-creamline rounded-lg max-h-96 overflow-y-auto">
            {/* Loading */}
            {isSearchLoading && (
              <div className="flex items-center gap-3 justify-center py-8 text-primary">
                <FaSpinner className="animate-spin text-xl" />
                <span className="font-medium">Searching products...</span>
              </div>
            )}

            {/* Error */}
            {searchError && (
              <div className="text-center py-8 text-red-500">
                <p>Error searching products. Please try again.</p>
              </div>
            )}

            {/* No Results */}
            {!isSearchLoading && !searchError && searchProducts.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p>No products found for "{debouncedSearch}"</p>
              </div>
            )}

            {/* Results */}
            {!isSearchLoading && !searchError && searchProducts.length > 0 && (
              <div className="p-4">
                <p className="text-sm text-gray-600 mb-4">
                  Found {searchProducts.length} products for "{debouncedSearch}"
                </p>
                
                <div className="space-y-2">
                  {searchProducts.map((product, index) => {
                    const isAlreadyTracked = trackedProducts.some(p => p.id === product.id)
                    
                    return (
                      <div 
                        key={index} 
                        className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                          isAlreadyTracked
                            ? 'bg-gray-50 border-gray-200 opacity-60'
                            : 'hover:bg-gray-50 border-gray-200'
                        }`}
                      >
                        <img 
                          src={product.thumbnail_image || '/placeholder-product.jpg'} 
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-800 text-sm line-clamp-1">{product.name}</h4>
                          <p className="text-xs text-gray-500"><span className="dirham-symbol text-[13px] mr-1">ê</span>{product.price || 'N/A'}</p>
                        </div>
                        
                        <div className="flex gap-2">
                          {isAlreadyTracked ? (
                            <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                              Already Tracked
                            </span>
                          ) : (
                            <button
                              onClick={() => addSingleProductToTracking(product)}
                              className="bg-green-500 text-white p-2 rounded hover:bg-green-600 transition-colors"
                              title="Add to tracked products"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Tracked Products */}
      <div className="p-6 bg-white rounded-lg border border-creamline">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Tracked Products</h3>
        
        {trackedProducts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Search className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <p>No products tracked yet</p>
            <p className="text-sm">Search and add products above to generate tracking URLs</p>
          </div>
        ) : (
          <div className="space-y-4">
            {trackedProducts.map((product) => (
              <div key={product.id} className="border border-creamline rounded-lg p-4">
                <div className="flex items-start gap-4">
                  <img 
                    src={product.image || '/placeholder-product.jpg'} 
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 mb-1">{product.name}</h4>
                    <p className="text-sm text-gray-600 mb-2"><span className="dirham-symbol text-[17px] mr-1">ê</span>{" "}{product.price || 'N/A'}</p>
                    
                    {/* Tracking URL */}
                    <div className="bg-gray-50 p-3 rounded border border-creamline">
                      <label className="block text-xs text-gray-500 mb-1">Tracking URL:</label>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 text-sm text-primary bg-white p-2 rounded border border-gray-200 font-mono break-all">
                          {product.trackingUrl}
                        </code>
                        <div className="flex gap-2">
                          <button
                            onClick={() => copyTrackingUrl(product.trackingUrl)}
                            className="bg-blue-500 text-white p-2 rounded hover:bg-primary transition-colors"
                            title="Copy URL"
                          >
                            <Copy className="h-4 w-4" />
                          </button>
                          <a
                            href={product.trackingUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600 transition-colors"
                            title="Open URL"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                          <button
                            onClick={() => removeTrackedProduct(product.id)}
                            className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition-colors"
                            title="Remove"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}