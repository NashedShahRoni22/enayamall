import Image from "next/image";
import Container from "../shared/Container";
import { useGetData } from "../helpers/useGetData";
import Link from "next/link";
import { useAppContext } from "@/app/context/AppContext";

export default function TwoAdsBanner() {
    const { lang } = useAppContext();
    const { data: imageDataLeft } = useGetData("banners?slug=1")
    const { data: imageDataRight } = useGetData("banners?slug=2")
    return (
        <Container>
            <div className={`flex flex-col justify-center items-center gap-5 py-5 ${lang === 'en' ? 'flex-row' : 'flex-row-reverse'}`}>
                {imageDataLeft?.data?.[0]?.image && (
                    <Link
                        href={lang === "ar" ? `${imageDataLeft?.data?.[0]?.link}` : `${imageDataLeft?.data?.[0]?.ar_link}`}
                        target={imageDataLeft?.data?.[0]?.link ? "_blank" : "_self"}
                        rel="noopener noreferrer"
                    >
                        <Image
                            src={lang === "en" ? imageDataLeft.data[0].image : imageDataLeft.data[0].ar_image}
                            alt="Banner"
                            width={1200}
                            height={400}
                            className="rounded-md"
                        />
                    </Link>
                    )}
                {imageDataRight?.data?.[0]?.image && (
                    <>
                    {console.log(imageDataRight.data[0])}
                    <Link
                        href={lang === "ar" ? `${imageDataRight?.data?.[0]?.link}` : `${imageDataRight?.data?.[0]?.ar_link}`}
                        target={imageDataLeft?.data?.[0]?.link ? "_blank" : "_self"}
                        rel="noopener noreferrer"
                    >
                        <Image
                            src={lang === "en" ? imageDataRight.data[0].image : imageDataRight.data[0].ar_image}
                            alt="Banner"
                            width={1200}
                            height={400}
                            className="rounded-md"
                            quality={100}
                        />
                    </Link>
                    </>
                    )}
            </div>
        </Container>
    )
}
