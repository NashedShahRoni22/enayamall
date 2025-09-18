import imageLeft from "@/public/image1.png";
import imageRight from "@/public/image2.png";
import Image from "next/image";
import Container from "../shared/Container";
import { useGetData } from "../helpers/useGetData";

export default function TwoAdsBanner() {
    const { data: imageDataLeft } = useGetData("banners?slug=1")
    const { data: imageDataRight } = useGetData("banners?slug=2")
    return (
        <Container>
            <div className='flex flex-col lg:flex-row justify-center items-center gap-5 my-5'>
                {imageDataLeft?.data?.[0]?.image && (
                    <Image
                        src={imageDataLeft.data[0].image}
                        alt="Banner"
                        width={600}
                        height={150}
                        className="lg:w-1/2 h-full rounded-md"
                    />
                    )}
                {imageDataRight?.data?.[0]?.image && (
                    <Image
                        src={imageDataRight.data[0].image}
                        alt="Banner"
                        width={600}
                        height={150}
                        className="lg:w-1/2 h-full rounded-md"
                    />
                    )}
            </div>
        </Container>
    )
}
