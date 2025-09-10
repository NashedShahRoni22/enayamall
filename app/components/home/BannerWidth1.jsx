import Image from "next/image";
import Container from "../shared/Container";

export default function BannerWidth1() {
  return (
    <Container>
      <div className="relative my-8 overflow-hidden">
        <Image
          src="https://enayamall.fahimsultan.com/storage/uploads/maxi-cosi-brand-banner.webp"
          alt="Banner"
          loading="eager"
          priority
          height={426}
          width={2000}
          className="rounded-xl"
        />
      </div>
    </Container>
  )
}
