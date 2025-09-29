"use client";
import { Suspense, lazy } from "react";
import { useAppContext } from "./context/AppContext";

// Critical components loaded immediately
import Slider from "./components/home/Slider";
import Category from "./components/home/Category";
const TwoAdsBanner = lazy(() => import("./components/home/TwoAdsBanner"));
import CategoryProducts from "./components/home/CategoryProducts";

// Lazy-loaded components
const ProductOfTheDay = lazy(() => import("./components/home/ProductOfTheDay"));
const BannerWidth2 = lazy(() => import("./components/home/BannerWidth2"));
const BannerWidth3 = lazy(() => import("./components/home/BannerWidth3"));
const BannerWidth1 = lazy(() => import("./components/home/BannerWidth1"));
const Brands = lazy(() => import("./components/home/Brands"));
const Reviews = lazy(() => import("./components/home/Reviews"));
const Blogs = lazy(() => import("./components/home/Blogs"));

export default function Page() {
  const { categories } = useAppContext();

  return (
    <main>
      {/* STEP 1: Slider */}
      <Suspense>
        <Slider />

        {/* STEP 2: Category */}
        <Suspense>
          <Category />

          {/* STEP 3: Ads Banner */}
          <Suspense>
            <TwoAdsBanner />

            {/* STEP 4: ProductOfTheDay */}
            <Suspense>
              <ProductOfTheDay />

              {/* STEP 5: Category Products */}
              <CategoryProducts categoryName="Body Care" rows={8} />
              <CategoryProducts categoryName="Hair Care" rows={8} />

              <Suspense>
                <BannerWidth2 />
              </Suspense>

              <CategoryProducts categoryName="Baby Care" rows={8} />
              <CategoryProducts categoryName="Oral Care" rows={8} />

              <Suspense>
                <BannerWidth3 />
              </Suspense>

              <Suspense>
                <Brands />
              </Suspense>

              <Suspense>
                <BannerWidth1 />
              </Suspense>

              <Suspense>
                <Reviews />
              </Suspense>

              <Suspense>
                <Blogs />
              </Suspense>
            </Suspense>
          </Suspense>
        </Suspense>
      </Suspense>
    </main>
  );
}
