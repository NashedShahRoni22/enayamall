import Slider from './components/home/Slider'
import Category from './components/home/Category'
import Clearance from './components/home/Clearance'
import Newarrival from './components/home/Newarrival'
import BannerWidth1 from './components/home/BannerWidth1'
import BannerWidth2 from './components/home/BannerWidth2'
import BannerWidth3 from './components/home/BannerWidth3'
import TwoAdsBanner from './components/home/TwoAdsBanner'
import Recommended from './components/home/Recommended'
import FlashDeals from './components/home/FlashDeals'
import LatestProduct from './components/home/LatestProduct'
import Features from './components/home/Features'
import Brands from './components/home/Brands'
import Reviews from './components/home/Reviews'
import Blogs from './components/home/Blogs'

export default function page() {
  return (
    <main>
      <Slider/>
      {/* <Category/> */}
      <Features/>
      {/* <TwoAdsBanner/> */}
      <FlashDeals/>
      <Brands/>
      <Reviews/>
      {/* <BannerWidth1/> */}
      <Recommended/>
      {/* <BannerWidth2 /> */}
      <LatestProduct/>
      <Blogs/>
      {/* <BannerWidth3 /> */}
      {/* <Recommended/> */}
      {/* <Clearance/> */}
      {/* <Newarrival/> */}
    </main>
  )
}
