import Image from "next/image";
import Container from "../shared/Container";
import { useGetData } from "../helpers/useGetData";
import Link from "next/link";

export default function TwoAdsBanner() {
    const { data: imageDataLeft } = useGetData("banners?slug=1")
    const { data: imageDataRight } = useGetData("banners?slug=2")
    return (
        <Container>
            <div className='flex flex-col lg:flex-row justify-center items-center gap-5 py-5'>
                {imageDataLeft?.data?.[0]?.image && (
                    <Link
                        href={imageDataLeft?.data?.[0]?.link || "#"}
                        target={imageDataLeft?.data?.[0]?.link ? "_blank" : "_self"}
                        rel="noopener noreferrer"
                    >
                        <Image
                            src={imageDataLeft.data[0].image}
                            alt="Banner"
                            width={600}
                            height={150}
                            className="rounded-md"
                        />
                    </Link>
                    )}
                {imageDataRight?.data?.[0]?.image && (
                    <Link
                        href={imageDataLeft?.data?.[0]?.link || "#"}
                        target={imageDataLeft?.data?.[0]?.link ? "_blank" : "_self"}
                        rel="noopener noreferrer"
                    >
                        <Image
                            src={imageDataRight.data[0].image}
                            alt="Banner"
                            width={600}
                            height={150}
                            className="rounded-md"
                        />
                    </Link>
                    )}
            </div>
        </Container>
    )
}
