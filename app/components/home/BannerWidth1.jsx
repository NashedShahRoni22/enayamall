import Image from "next/image";
import BannerWide from "@/public/babyMilestoneBanner.svg";
import Container from "../shared/Container";

export default function BannerWidth1() {
  return (
    <Container>
      <div className="relative w-full h-[230px] my-8 raounded-lg overflow-hidden">
        <Image
          src="https://enayamall.com/image/cachewebp/catalog/Slider%20Home/eng/deonat-1920x450w.webp"
          alt="Banner"
          fill
          priority
          className="raounded-lg object-cover"
        />
      </div>
    </Container>
  )
}
