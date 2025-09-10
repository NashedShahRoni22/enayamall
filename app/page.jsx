import Slider from './components/home/Slider'
import Category from './components/home/Category'
// import Recommended from './components/home/Recommended'
import Clearance from './components/home/Clearance'
import Newarrival from './components/home/Newarrival'
import BannerWidth1 from './components/home/BannerWidth1'
import BannerWidth2 from './components/home/BannerWidth2'
import BannerWidth3 from './components/home/BannerWidth3'
import TwoAdsBanner from './components/home/TwoAdsBanner'
import Recommended from './components/home/Recommended'
import FlashDeals from './components/home/FlashDeals'
import LatestProduct from './components/home/LatestProduct'

export default function page() {
  return (
    <main>
      <Slider/>
      <Category/>
      <TwoAdsBanner/>
      <FlashDeals/>
      <BannerWidth1/>
      <Recommended/>
      <BannerWidth2 />
      <LatestProduct/>
      <BannerWidth3 />
      {/* <Recommended/> */}
      {/* <Clearance/> */}
      {/* <Newarrival/> */}
    </main>
  )
}
