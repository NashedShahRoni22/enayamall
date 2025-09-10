import Image from "next/image";
import Container from "../shared/Container";

export default function BannerWidth1() {
  return (
    <Container>
      <div className="relative my-8  overflow-hidden">
        <Image
          src="https://enayamall.com/image/cachewebp/catalog/Slider%20Home/eng/deonat-1920x450w.webp"
          alt="Banner"
          loading="eager"
          priority
          height={450}
          width={1920}
          className="rounded-xl"
        />
      </div>
    </Container>
  )
}
