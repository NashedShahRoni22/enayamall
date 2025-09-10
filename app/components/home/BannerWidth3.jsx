import Image from "next/image";
import BannerWide from "@/public/babyMilestoneBanner.svg";
import Container from "../shared/Container";

export default function BannerWidth2() {
  return (
    <Container>
        <Image src={BannerWide} alt="Baby Milestone Banner" className="my-8"/>
    </Container>
  )
}
