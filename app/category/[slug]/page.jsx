"use client";
import { useEffect, useMemo, useState } from "react";
import "swiper/swiper-bundle.css";
import { FaChevronDown, FaChevronUp, FaList, FaSpinner } from "react-icons/fa";
import Image from "next/image";
import filterIcon from "../../resources/icons/filter.svg";
import { IoCloseOutline, IoGridOutline } from "react-icons/io5";
import Categories from "@/app/components/filters/Categories";
import Brands from "@/app/components/filters/Brands";
import SkinTypes from "@/app/components/filters/SkinTypes";
import Products from "@/app/components/products/Products";
import Container from "@/app/components/shared/Container";
import PageHeader from "@/app/components/shared/PageHeader";
import { useAppContext } from "@/app/context/AppContext";
import { useParams, useSearchParams } from "next/navigation";
import BrandLogoDisplay from "@/app/components/filters/BrandLogoDisplay";
import PriceRangeFilter from "@/app/components/filters/PriceRangeFilter";
import { useGetData } from "@/app/components/helpers/useGetData";
import { CiFilter } from "react-icons/ci";
import { FilterIcon } from "lucide-react";

export default function page() {
  const { categories, brands, lang } = useAppContext();
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params?.slug ?? null;
  const sub = searchParams?.get("sub");

  const [brandIds, setBrandIds] = useState([]);
  const [parentCategorytIds, setParentCategorytIds] = useState([]);
  const [childCategoryId, setChildCategoryId] = useState(null);
  const [skinTypeIds, setSkinTypeIds] = useState([]);
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [viewStyle, setViewStyle] = useState(0);
  const [sortOption, setSortOption] = useState(0);
  const [page, setPage] = useState(1);

  // State to accumulate all products for smooth loading
  const [allProducts, setAllProducts] = useState([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [previousFilters, setPreviousFilters] = useState(null);

  // Price states
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000);

  // Handle price filter application
  const handlePriceFilter = () => {
    applyFilters();
  };

  // Match slug to brand and set brandIds
 useEffect(() => {
  if (!categories || !slug) return;

  const matchedParentCategory = categories.find(
    (category) => category.slug === slug
  );

  if (!matchedParentCategory) return;

  setParentCategorytIds([matchedParentCategory.id]);

  if (sub && Array.isArray(matchedParentCategory.child)) {
    const matchedChild = matchedParentCategory.child.find(
      (child) => child.slug === sub
    );
    if (matchedChild) setChildCategoryId(matchedChild.id);
  }
}, [categories, slug, sub]);


  

  // category options
  const sortOptions = [
    "Recommended",
    "Price low to high",
    "Price high to low",
  ];

  // Debounced price values - only these trigger API calls
  const [debouncedMinPrice, setDebouncedMinPrice] = useState(minPrice);
  const [debouncedMaxPrice, setDebouncedMaxPrice] = useState(maxPrice);

  // Debounce price changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedMinPrice(minPrice);
      setDebouncedMaxPrice(maxPrice);
    }, 500); // Wait 500ms after user stops sliding

    return () => clearTimeout(timer);
  }, [minPrice, maxPrice]);

  // Build FormData parameters object - using debounced values
  const queryParams = useMemo(() => {
    const params = {};

    if (page) params.page = page;
    if (childCategoryId) params.childCategoryId = childCategoryId;
    if (sortOption) params.orderByPrice = sortOption;
    if (parentCategorytIds?.length > 0)
      params.category_ids = parentCategorytIds;
    if (brandIds?.length > 0) params.brand_id = brandIds;
    if (skinTypeIds?.length > 0) params.skin_type_id = skinTypeIds;

    // Add debounced price range filters
    if (debouncedMinPrice !== undefined && debouncedMinPrice !== null)
      params.lowest_price = debouncedMinPrice;
    if (debouncedMaxPrice !== undefined && debouncedMaxPrice !== null)
      params.highest_price = debouncedMaxPrice;

    return params;
  }, [
    parentCategorytIds,
    childCategoryId,
    brandIds,
    skinTypeIds,
    sortOption,
    debouncedMinPrice,
    debouncedMaxPrice,
    page,
  ]);

  // Fetch products with filters
  const {
    data: productData,
    isLoading,
    error,
  } = useGetData("products", queryParams);
  const products = productData?.data;
  const name = productData?.meta?.name || (categories?.find(cat => cat.id === parentCategorytIds[0])?.name) || '';

  // Track filter changes and reset when needed
  const currentFilters = JSON.stringify({
    parentCategorytIds,
    childCategoryId,
    brandIds,
    skinTypeIds,
    sortOption,
    debouncedMinPrice,
    debouncedMaxPrice,
  });

  useEffect(() => {
    // Check if filters have changed
    if (previousFilters && previousFilters !== currentFilters) {
      // Filters changed - reset everything
      setPage(1);
      setAllProducts([]);
    }
    setPreviousFilters(currentFilters);
  }, [currentFilters, previousFilters]);

  // Handle new product data
  useEffect(() => {
    if (products && products.length > 0 && !isLoading) {
      if (page === 1) {
        // First page or after filter change - replace products
        setAllProducts(products);
      } else {
        // Additional pages - add to existing products
        setAllProducts((prevProducts) => [...prevProducts, ...products]);
      }
      setIsLoadingMore(false);
    }
  }, [products, page, isLoading]);

  // Handle load more click
  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setPage((prevPage) => prevPage + 1);
  };

  // Handle body scroll when search is open
  useEffect(() => {
    if (showFilters) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup function to reset overflow when component unmounts
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showFilters]);

  useEffect(() => {
}, [parentCategorytIds, childCategoryId, queryParams]);

  return (
    <section className="relative">
      {/* filters & products here  */}
      <Container>
        {name && (
          <h3 className="text-[20px] mt-[30px] font-semibold text-primaryblack">Category: {name}</h3>
        )}
        <div className="pb-[20px]">
          <div className={`lg:flex lg:gap-[24px] mt-[30px] ${lang === "ar" ? "flex-row-reverse" : "flex-row"}`}>
            {/* filters options here for large device  */}
            <div className="hidden lg:block lg:w-22/100 border border-gray-100 p-[20px] rounded-[10px] h-fit self-start">
              {/* filetrs actions  */}
              {/* for large device  */}
              <div className="flex gap-1 items-center font-semibold text-primary border-b border-gray-300 pb-4 mb-4">
                <FilterIcon size={20}/>
                <p className="text-[20px]">Filtered by</p>
              </div>

              <div className="flex flex-col gap-[20px] lg:gap-[30px]">
                {/* Price Range Filter */}
                <PriceRangeFilter
                  minPrice={minPrice}
                  maxPrice={maxPrice}
                  setMinPrice={setMinPrice}
                  setMaxPrice={setMaxPrice}
                  absoluteMin={0}
                  absoluteMax={10000}
                  onFilter={handlePriceFilter}
                />

                {/* category */}
                <Categories
                  lang={lang}
                  categories={categories}
                  parentCategorytIds={parentCategorytIds}
                  setParentCategorytIds={setParentCategorytIds}
                  childCategoryId={childCategoryId}
                  setChildCategoryId={setChildCategoryId}
                />

                {/* brands */}
                {/* <Brands
                  lang={lang}
                  brands={brands}
                  brandIds={brandIds}
                  setBrandIds={setBrandIds}
                /> */}
              </div>
            </div>

            {/* products here  */}
            <div className="lg:w-78/100">
              <div className="mb-4">
                {/* brands logo here  */}
                {!brands ? (
                  <div className="mb-[20px]">
                    <div className="animate-pulse flex space-x-4">
                      <div className="rounded-[8px] bg-gray-200 h-[64px] w-[84px]"></div>
                      <div className="rounded-[8px] bg-gray-200 h-[64px] w-[84px]"></div>
                      <div className="rounded-[8px] bg-gray-200 h-[64px] w-[84px]"></div>
                    </div>
                  </div>
                ) : (
                  <BrandLogoDisplay
                    brands={brands}
                    brandIds={brandIds}
                    setBrandIds={setBrandIds}
                  />
                )}

                <div className={`bg-light p-[8px] rounded-[10px] flex justify-between items-center ${lang === "ar" ? "flex-row-reverse" : "flex-row"}`}>
                  {/* product layouts buttons  */}
                  <div className={`flex gap-[20px] items-center ${lang === "ar" ? "flex-row-reverse" : "flex-row"}`}>
                    <div className={`flex gap-[8px] ${lang === "ar" ? "flex-row-reverse" : "flex-row"}`}>
                      <button
                        onClick={() => setViewStyle(0)}
                        className={`cursor-pointer p-[16px] rounded-[10px] ${
                          viewStyle === 0
                            ? "bg-primary text-white"
                            : "bg-white text-primary"
                        }`}
                      >
                        {/* <Image src={gridIcon} alt="filter icon" /> */}
                        <IoGridOutline className="text-[20px]" />
                      </button>
                      <button
                        onClick={() => setViewStyle(1)}
                        className={`cursor-pointer p-[16px] rounded-[10px] ${
                          viewStyle === 1
                            ? "bg-primary text-white"
                            : "bg-white text-primary"
                        }`}
                      >
                        {/* <Image src={listIcon} alt="list icon" /> */}
                        <FaList className="text-[20px]" />
                      </button>
                      <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`lg:hidden cursor-pointer p-[16px] rounded-[10px] ${
                          showFilters
                            ? "bg-primary text-white"
                            : "bg-white text-primary"
                        }`}
                      >
                        {/* <Image src={listIcon} alt="list icon" /> */}
                        <CiFilter className="text-[20px]" />
                      </button>
                    </div>
                    {productData?.meta?.total > 0 && (
                      <p className="hidden lg:block text-primaryblack text-[16px]">
                        Showing {allProducts.length} of{" "}
                        {productData?.meta?.total} results
                      </p>
                    )}
                  </div>
                  {/* product sorting options  */}
                  <div className="text-[16px] text-primaryblack bg-white min-w-[160px] lg:min-w-[190px] px-[16px] lg:px-[20px] py-[12px] lg:py-[16px] rounded-[5px] relative">
                    <button
                      onClick={() => setShowSortOptions(!showSortOptions)}
                      className="flex min-w-full justify-between items-center cursor-pointer text-[14px] lg:text-[16px]"
                    >
                      {sortOptions[sortOption]}
                      {showSortOptions ? (
                        <FaChevronUp className="text-xs" />
                      ) : (
                        <FaChevronDown className="text-xs" />
                      )}
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

              <Products
                viewStyle={viewStyle}
                parentCategorytIds={parentCategorytIds}
                childCategoryId={childCategoryId}
                brandIds={brandIds}
                skinTypeIds={skinTypeIds}
                sortOption={sortOption}
                minPrice={minPrice}
                maxPrice={maxPrice}
                isLoading={isLoading && page === 1}
                error={error}
                products={allProducts}
              />
              {/* pagination here  */}
              {productData?.links?.next !== null && (
                <div className="mt-20 flex flex-col gap-5 items-center justify-center">
                  <p className="hidden lg:block text-primaryblack text-[16px]">
                    Showing {allProducts.length} of {productData?.meta?.total}{" "}
                    results
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
        </div>

        {/* show filters for mobile here  */}
        {showFilters && (
          <div className="lg:hidden fixed top-0 left-0 z-[9999] bg-black/40 min-w-full h-full flex">
            {/* Filter panel */}
            <div className="bg-white w-5/6 sm:w-1/2 h-screen flex flex-col gap-[20px] py-[30px] px-5 overflow-y-scroll">
              <div className="flex justify-between items-center">
                <button
                  onClick={() => setShowFilters(false)}
                  className="flex gap-[12px] items-center text-primary"
                >
                  {/* <Image src={filterIcon} alt="filter icon" /> */}
                  <FilterIcon />
                  <p className="text-[20px]">Filtered by</p>
                </button>

                <button
                  onClick={() => setShowFilters(false)}
                  className="p-[8px] bg-creamline rounded-full"
                >
                  <IoCloseOutline className="text-[24px] text-primary" />
                </button>
              </div>

              <div className="h-[1px] w-full bg-creamline"></div>

              <PriceRangeFilter
                  minPrice={minPrice}
                  maxPrice={maxPrice}
                  setMinPrice={setMinPrice}
                  setMaxPrice={setMaxPrice}
                  absoluteMin={0}
                  absoluteMax={10000}
                  onFilter={handlePriceFilter}
                />

              {/* category */}
              <Categories
                lang={lang}
                categories={categories}
                parentCategorytIds={parentCategorytIds}
                setParentCategorytIds={setParentCategorytIds}
                childCategoryId={childCategoryId}
                setChildCategoryId={setChildCategoryId}
              />

              {/* brands */}
              {/* <Brands
                lang={lang}
                brands={brands}
                brandIds={brandIds}
                setBrandIds={setBrandIds}
              /> */}
            </div>

            {/* Click-outside area to close filter */}
            <div className="flex-1" onClick={() => setShowFilters(false)}></div>
          </div>
        )}
      </Container>
    </section>
  );
}
