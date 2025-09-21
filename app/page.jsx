"use client";
import Slider from './components/home/Slider'
import Category from './components/home/Category'
import Clearance from './components/home/Clearance'
import Newarrival from './components/home/Newarrival'
import BannerWidth1 from './components/home/BannerWidth1'
import BannerWidth2 from './components/home/BannerWidth2'
import BannerWidth3 from './components/home/BannerWidth3'
import BannerWidth4 from './components/home/BannerWidth4'
import TwoAdsBanner from './components/home/TwoAdsBanner'
import Recommended from './components/home/Recommended'
import FlashDeals from './components/home/FlashDeals'
import LatestProduct from './components/home/LatestProduct'
import Features from './components/home/Features'
import Brands from './components/home/Brands'
import Reviews from './components/home/Reviews'
import Blogs from './components/home/Blogs'
import ProductOfTheDay from './components/home/ProductOfTheDay'
import CategoryProducts from './components/home/CategoryProducts';
import { useAppContext } from './context/AppContext';

export default function page() {
  const { categories } = useAppContext();
  return (
    <main>
      <Slider />
      {/* <Features /> */}
      <Category />
      <TwoAdsBanner />
      {/* <FlashDeals/> */}
      <Recommended />
      <BannerWidth1/>
      <ProductOfTheDay />
      <BannerWidth2 />
      {/* category components here  */}
      {/* {
        categories?.map((category, index) => <CategoryProducts key={index} category={category} />)
      } */}
      <CategoryProducts categoryName="Body Care" rows={8} />
      <CategoryProducts categoryName="Baby Care" rows={8} />
      <BannerWidth3 />
      <CategoryProducts categoryName="Hair Care" rows={8} />
      <CategoryProducts categoryName="Oral Care" rows={8} />
      <BannerWidth4 />
      <Brands />
      <Reviews />
      {/* <LatestProduct/> */}
      <Blogs />
      {/* <Recommended/> */}
      {/* <Clearance/> */}
      {/* <Newarrival/> */}
    </main>
  )
}
