"use client";
import { useEffect, useMemo, useState } from "react";
import "swiper/swiper-bundle.css";
import { FaChevronDown, FaChevronUp, FaList, FaSpinner } from "react-icons/fa";
import { IoCloseOutline, IoGridOutline } from "react-icons/io5";
import { CiFilter } from "react-icons/ci";
import { FilterIcon } from "lucide-react";

import Container from "@/app/components/shared/Container";
import ProductsPage from "@/app/components/products/ProductsPage";
import Categories from "@/app/components/filters/Categories";
import BrandBannerDisplay from "@/app/components/filters/BrandBannerDisplay";
import { useAppContext } from "@/app/context/AppContext";
import { useParams } from "next/navigation";
import { useGetData } from "@/app/components/helpers/useGetData";

export default function Page() {
  const { categories, brands, lang } = useAppContext();
  const { slug } = useParams() || {};

  const [filters, setFilters] = useState({
    brandIds: [],
    parentCategoryIds: [],
    childCategoryId: null,
    skinTypeIds: [],
    sortOption: 0,
    minPrice: 0,
    maxPrice: 5000,
  });

  const [viewStyle, setViewStyle] = useState(0);
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);

  const [allProducts, setAllProducts] = useState([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Debounce price
  const [debouncedPrice, setDebouncedPrice] = useState({
    min: filters.minPrice,
    max: filters.maxPrice,
  });

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedPrice({ min: filters.minPrice, max: filters.maxPrice }), 500);
    return () => clearTimeout(timer);
  }, [filters.minPrice, filters.maxPrice]);

  // Set brand if slug exists
  useEffect(() => {
    if (brands?.length && slug) {
      const matched = brands.find(b => b.slug === slug);
      if (matched) setFilters(prev => ({ ...prev, brandIds: [matched.id] }));
    }
  }, [brands, slug]);

  // Build query params
  const queryParams = useMemo(() => {
    const { brandIds, parentCategoryIds, childCategoryId, skinTypeIds, sortOption } = filters;
    return {
      page,
      childCategoryId: childCategoryId || undefined,
      orderByPrice: sortOption || undefined,
      category_ids: parentCategoryIds.length ? parentCategoryIds : undefined,
      brand_id: brandIds.length ? brandIds : undefined,
      skin_type_id: skinTypeIds.length ? skinTypeIds : undefined,
      lowest_price: debouncedPrice.min,
      highest_price: debouncedPrice.max,
    };
  }, [filters, debouncedPrice, page]);

  const { data: productData, isLoading, error } = useGetData("products", queryParams);
  const products = productData?.data || [];

  // Track previous filters to reset products on change
  const [prevFilters, setPrevFilters] = useState('');

  useEffect(() => {
    const currentFilters = JSON.stringify({ ...filters, price: debouncedPrice });
    if (currentFilters !== prevFilters) {
      setPage(1);
      setAllProducts([]);
      setPrevFilters(currentFilters);
    }
  }, [filters, debouncedPrice]);

  // Update products when API responds
  useEffect(() => {
    if (!isLoading && products.length) {
      if (page === 1) {
        setAllProducts(products);
      } else {
        setAllProducts(prev => [...prev, ...products]);
      }
      setIsLoadingMore(false);
    }
  }, [products, isLoading, page]);

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setPage(prev => prev + 1);
  };

  // Handle body scroll for mobile filters
  useEffect(() => {
    document.body.style.overflow = showFilters ? "hidden" : "unset";
    return () => (document.body.style.overflow = "unset");
  }, [showFilters]);

  const sortOptions = ["Recommended", "Price low to high", "Price high to low"];

  return (
    <section className="relative">
      <Container>
        <div className="py-[20px]">
          <div className="lg:flex lg:gap-[24px] bg-white z-10">
            <div className="hidden text-primary lg:w-2/6 2xl:w-1/4">
              <FilterIcon />
              <p className="text-[24px]">Filtered by</p>
            </div>

            <div className="w-full">
              {!brands ? (
                <div className="mb-[20px] animate-pulse flex space-x-4 items-center">
                  <div className="rounded-[8px] bg-gray-200 h-[100px] w-[240px] hidden lg:block"></div>
                  <div className="rounded-[8px] bg-gray-200 h-[100px] md:h-[200px] w-full"></div>
                </div>
              ) : (
                <BrandBannerDisplay
                  brands={brands}
                  brandIds={filters.brandIds}
                  setBrandIds={ids => setFilters(prev => ({ ...prev, brandIds: ids }))}
                  lang={lang}
                />
              )}

              <div className="bg-light p-[8px] rounded-[10px] flex justify-between items-center mt-[20px]">
                <div className="flex gap-[20px] items-center">
                  <div className="flex gap-[8px]">
                    <button
                      onClick={() => setViewStyle(0)}
                      className={`cursor-pointer p-[16px] rounded-[10px] ${viewStyle === 0 ? "bg-primary text-white" : "bg-white text-primary"}`}
                    >
                      <IoGridOutline className="text-[20px]" />
                    </button>
                    <button
                      onClick={() => setViewStyle(1)}
                      className={`cursor-pointer p-[16px] rounded-[10px] ${viewStyle === 1 ? "bg-primary text-white" : "bg-white text-primary"}`}
                    >
                      <FaList className="text-[20px]" />
                    </button>
                    <button
                      onClick={() => setShowFilters(prev => !prev)}
                      className={`hidden cursor-pointer p-[16px] rounded-[10px] ${showFilters ? "bg-primary text-white" : "bg-white text-primary"}`}
                    >
                      <CiFilter className="text-[20px]" />
                    </button>
                  </div>
                  {productData?.meta?.total > 0 && (
                    <p className="hidden lg:block text-primaryblack text-[16px]">
                      Showing {allProducts.length} of {productData?.meta?.total} results
                    </p>
                  )}
                </div>

                <div className="text-[16px] text-primaryblack bg-white min-w-[160px] lg:min-w-[190px] px-[16px] lg:px-[20px] py-[12px] lg:py-[16px] rounded-[5px] relative">
                  <button
                    onClick={() => setShowSortOptions(prev => !prev)}
                    className="flex min-w-full justify-between items-center cursor-pointer text-[14px] lg:text-[16px]"
                  >
                    {sortOptions[filters.sortOption]}
                    {showSortOptions ? <FaChevronUp className="text-xs" /> : <FaChevronDown className="text-xs" />}
                  </button>

                  {showSortOptions && (
                    <div className="flex flex-col items-start absolute min-w-full z-40 p-[4px] top-11 lg:top-14 left-0 bg-white rounded-[10px] border border-creamline">
                      {sortOptions.map((label, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setFilters(prev => ({ ...prev, sortOption: index }));
                            setShowSortOptions(false);
                          }}
                          className={`px-[12px] py-[8px] min-w-full text-left text-[14px] lg:text-[16px] rounded-[10px] hover:text-primary hover:bg-creamline cursor-pointer ${
                            filters.sortOption === index ? "font-[550] text-primary" : ""
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
          </div>

          <div className="mt-[30px]">
            <ProductsPage
              viewStyle={viewStyle}
              {...filters}
              isLoading={isLoading && page === 1}
              error={error}
              products={allProducts}
              gridCount={5}
            />

            {productData?.links?.next && (
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

        {/* Mobile Filters */}
        {showFilters && (
          <div className="lg:hidden fixed top-0 left-0 z-[9999] bg-black/40 min-w-full h-full flex">
            <div className="bg-white w-5/6 sm:w-1/2 h-screen flex flex-col gap-[20px] py-[30px] px-5 overflow-y-scroll">
              <div className="flex justify-between items-center">
                <button onClick={() => setShowFilters(false)} className="flex gap-[12px] items-center text-primary">
                  <FilterIcon />
                  <p className="text-[20px]">Filtered by</p>
                </button>

                <button onClick={() => setShowFilters(false)} className="p-[8px] bg-creamline rounded-full">
                  <IoCloseOutline className="text-[24px] text-primary" />
                </button>
              </div>

              <div className="h-[1px] w-full bg-creamline"></div>

              <Categories
                lang={lang}
                categories={categories}
                parentCategorytIds={filters.parentCategoryIds}
                setParentCategorytIds={ids => setFilters(prev => ({ ...prev, parentCategoryIds: ids }))}
                childCategoryId={filters.childCategoryId}
                setChildCategoryId={id => setFilters(prev => ({ ...prev, childCategoryId: id }))}
              />
            </div>
            <div className="flex-1" onClick={() => setShowFilters(false)}></div>
          </div>
        )}
      </Container>
    </section>
  );
}
