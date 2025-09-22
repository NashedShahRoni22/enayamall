import Image from "next/image";
import Container from "../shared/Container";
import Link from "next/link";
import { useGetData } from "../helpers/useGetData";
import { useAppContext } from "@/app/context/AppContext";

export default function BannerWidth1() {
  const { lang } = useAppContext();
  const { data: bannerImageData } = useGetData(`banners?slug=3`);
  const bannerImage = bannerImageData?.data[0];
  return (
    <Container>
      {bannerImage && (
        <Link
          href={lang === "en" ? bannerImage?.link : bannerImage?.ar_link}
          target={bannerImage?.link ? "_blank" : "_self"}
          rel="noopener noreferrer"
        >
          <Image
            src={lang === "en" ? bannerImage?.image : bannerImage?.ar_image}
            alt={lang === "en" ? bannerImage?.title : bannerImage?.ar_title || "Banner Image"}
            loading="eager"
            priority
            height={328}
            width={1920}
            className="rounded-md"
          />
        </Link>
      )}
    </Container>
  );
}
