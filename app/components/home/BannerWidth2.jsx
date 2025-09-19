import Image from "next/image";
import Container from "../shared/Container";
import Link from "next/link";
import { useGetData } from "../helpers/useGetData";

export default function BannerWidth2() {
  const { data: bannerImageData } = useGetData(`banners?slug=4`);
    const bannerImage = (bannerImageData?.data[0])
    return (
       <Container>
              <Link 
                href={bannerImage?.link || "#"}
                target={bannerImage?.link ? "_blank" : "_self"}
                rel="noopener noreferrer"
              >
              <Image
                  src={bannerImage?.image}
                  alt={bannerImage?.title || "Banner Image"}
                  loading="eager"
                  priority
                  height={328}
                  width={1920}
                  className="rounded-md"
                />
              </Link>
          </Container>
    )
}
