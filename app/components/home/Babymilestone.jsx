import Image from "next/image";
import categoryBanner from "@/public/categoryBanner.svg";
import babyMilestoneBanner from "@/public/babyMilestoneBanner.svg";
import Container from "../shared/Container";

export default function Babymilestone() {
  return (
    <Container>
        <Image src={categoryBanner} alt="Baby Milestone Banner"/>
        <Image src={babyMilestoneBanner} alt="Baby Milestone Banner" className="mt-8"/>
    </Container>
  )
}
