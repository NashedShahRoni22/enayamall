import Image from "next/image";
import BannerWide from "@/public/babyMilestoneBanner.svg";
import Container from "../shared/Container";

export default function BannerWidth2() {
  return (
    <Container>
        <Image
                  src={`data:image/svg+xml;base64,${Buffer.from(
                                `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="160">
                                <rect width="1200" height="160" fill="#e5e7eb"/>
                                </svg>`
                            ).toString("base64")}`}
                  // src="https://enayamall.fahimsultan.com/storage/uploads/maxi-cosi-brand-banner.webp"
                  alt="Banner"
                  loading="eager"
                  priority
                  height={160}
                  width={1200}
                  className="rounded-md"
                />
    </Container>
  )
}
