"use client";
import { useEffect, useMemo, useState } from "react";
import { FaChevronDown, FaChevronUp, FaList, FaSpinner } from "react-icons/fa";
import { IoGridOutline } from "react-icons/io5";
import { useParams } from "next/navigation";
import Container from "@/app/components/shared/Container";
import ProductsPage from "@/app/components/products/ProductsPage";
import { useAppContext } from "@/app/context/AppContext";
import { useGetData } from "@/app/components/helpers/useGetData";

export default function Page() {
  const { lang } = useAppContext();
  const params = useParams();
  const slug = params?.slug ? decodeURIComponent(params.slug) : null;

  const [parentCategorytIds, setParentCategorytIds] = useState([]);
  const [childCategoryId, setChildCategoryId] = useState(null);
  const [viewStyle, setViewStyle] = useState(0);
  const [sortOption, setSortOption] = useState(0);
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Price filters
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(5000);
  const [debouncedMinPrice, setDebouncedMinPrice] = useState(minPrice);
  const [debouncedMaxPrice, setDebouncedMaxPrice] = useState(maxPrice);

  // Cursor for pagination
  const [nextCursor, setNextCursor] = useState(null);

  // Trigger fetch when clicking "Load More"
  const [pageLoadTrigger, setPageLoadTrigger] = useState(0);

  // Debounce price changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedMinPrice(minPrice);
      setDebouncedMaxPrice(maxPrice);
    }, 500);
    return () => clearTimeout(timer);
  }, [minPrice, maxPrice]);

  // Build query parameters
  const queryParams = useMemo(() => {
    const params = {};
    if (childCategoryId) params.childCategoryId = childCategoryId;
    if (sortOption) params.orderByPrice = sortOption;
    if (parentCategorytIds?.length > 0) params.category_ids = parentCategorytIds;
    if (debouncedMinPrice !== undefined) params.lowest_price = debouncedMinPrice;
    if (debouncedMaxPrice !== undefined) params.highest_price = debouncedMaxPrice;
    if (nextCursor) params.cursor = nextCursor;
    return params;
  }, [parentCategorytIds, childCategoryId, sortOption, debouncedMinPrice, debouncedMaxPrice, pageLoadTrigger]);

  const endpoint = slug ? `products/tags/${encodeURIComponent(slug)}` : "products";
  const { data: productData, isLoading, error } = useGetData(endpoint, queryParams);

  // Reset products if filters change (price, category, sort)
  const currentFilters = JSON.stringify({
    parentCategorytIds,
    childCategoryId,
    sortOption,
    debouncedMinPrice,
    debouncedMaxPrice,
    slug,
  });

  useEffect(() => {
    setAllProducts([]);
    setNextCursor(null);
  }, [currentFilters]);

  // Append new product data safely
  useEffect(() => {
    if (productData?.data && productData.data.length > 0 && !isLoading) {
      setAllProducts((prev) => {
        const existingIds = new Set(prev.map((p) => p.product_id));
        const newProducts = productData.data.filter((p) => !existingIds.has(p.product_id));
        return [...prev, ...newProducts];
      });
      setNextCursor(productData.meta?.next_cursor || null);
    }
    setIsLoadingMore(false);
  }, [productData, isLoading]);

  // Load more button click
  const handleLoadMore = () => {
    if (!nextCursor || isLoadingMore) return;
    setIsLoadingMore(true);
    setPageLoadTrigger((prev) => prev + 1); // triggers queryParams -> fetch next page
  };

  const sortOptions = ["Recommended", "Price low to high", "Price high to low"];

  return (
    <section className="relative">
      <Container>
        {slug && (
          <div className={`flex gap-2 items-center ${lang === "ar" ? "flex-row-reverse" : "flex-row"}`}>
            <h3 className="text-[20px] mt-[30px] font-semibold text-primaryblack">
              {lang === "en" ? "Tags:" : "الكلمات الدليليلة:"}
            </h3>
            <h3 className="text-[20px] mt-[30px] font-semibold text-primaryblack">
              {slug.charAt(0).toUpperCase() + slug.slice(1)}
            </h3>
          </div>
        )}

        <div className="pb-[20px]">
          <div className="w-full">
            <div className="bg-light p-[8px] rounded-[10px] flex justify-between items-center mt-[20px]">
              <div className="flex gap-[20px] items-center">
                <div className="flex gap-[8px]">
                  <button
                    onClick={() => setViewStyle(0)}
                    className={`cursor-pointer p-[16px] rounded-[10px] ${
                      viewStyle === 0 ? "bg-primary text-white" : "bg-white text-primary"
                    }`}
                  >
                    <IoGridOutline className="text-[20px]" />
                  </button>
                  <button
                    onClick={() => setViewStyle(1)}
                    className={`cursor-pointer p-[16px] rounded-[10px] ${
                      viewStyle === 1 ? "bg-primary text-white" : "bg-white text-primary"
                    }`}
                  >
                    <FaList className="text-[20px]" />
                  </button>
                </div>

                {productData?.meta?.total > 0 && (
                  <p className="hidden lg:block text-primaryblack text-[16px]">
                    Showing {allProducts.length} of {productData.meta.total} results
                  </p>
                )}
              </div>

              <div className="text-[16px] text-primaryblack bg-white min-w-[160px] lg:min-w-[190px] px-[16px] lg:px-[20px] py-[12px] lg:py-[16px] rounded-[5px] relative">
                <button
                  onClick={() => setShowSortOptions(!showSortOptions)}
                  className="flex min-w-full justify-between items-center cursor-pointer text-[14px] lg:text-[16px]"
                >
                  {sortOptions[sortOption]}
                  {showSortOptions ? <FaChevronUp className="text-xs" /> : <FaChevronDown className="text-xs" />}
                </button>

                {showSortOptions && (
                  <div className="flex flex-col items-start absolute min-w-full z-40 p-[4px] top-11 lg:top-14 left-0 bg-white rounded-[10px] border border-creamline">
                    {sortOptions.map((label, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setSortOption(index);
                          setShowSortOptions(false);
                        }}
                        className={`px-[12px] py-[8px] min-w-full text-left text-[14px] lg:text-[16px] rounded-[10px] hover:text-primary hover:bg-creamline cursor-pointer ${
                          sortOption === index && "font-[550] text-primary"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-[30px]">
            <ProductsPage
              viewStyle={viewStyle}
              parentCategorytIds={parentCategorytIds}
              childCategoryId={childCategoryId}
              sortOption={sortOption}
              minPrice={minPrice}
              maxPrice={maxPrice}
              isLoading={isLoading && allProducts.length === 0}
              error={error}
              products={allProducts}
              gridCount={5}
            />

            {nextCursor && (
              <div className="mt-5 flex flex-col gap-5 items-center justify-center">
                <p className="hidden lg:block text-primaryblack text-[16px]">
                  Showing {allProducts.length} of {productData?.meta?.total} results
                </p>
                <button
                  disabled={isLoadingMore}
                  onClick={handleLoadMore}
                  className="px-8 py-3 bg-primary text-white text-sm rounded-[5px] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoadingMore ? (
                    <div className="flex items-center gap-2">
                      <FaSpinner className="animate-spin" />
                      <span>Loading more...</span>
                    </div>
                  ) : (
                    "Load more items"
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
