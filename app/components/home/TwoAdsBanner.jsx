import imageLeft from "@/public/image1.png";
import imageRight from "@/public/image2.png";
import Image from "next/image";
import Container from "../shared/Container";

export default function TwoAdsBanner() {
    return (
        <Container>
            <div className='flex flex-col lg:flex-row justify-center items-center gap-5 mt-5 mb-8'>
                <Image
                    src={imageLeft}
                    alt="Left Banner"
                    loading="eager"
                    priority
                    className="lg:w-1/2 h-full" />
                <Image
                    src={imageRight}
                    alt="Right Bannger"
                    loading="eager"
                    priority
                    className="lg:w-1/2 h-full" />
            </div>
        </Container>
    )
}
