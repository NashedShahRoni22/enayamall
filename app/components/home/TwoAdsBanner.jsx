import imageLeft from "@/public/image1.png";
import imageRight from "@/public/image2.png";
import Image from "next/image";
import Container from "../shared/Container";

export default function TwoAdsBanner() {
    return (
        <Container>
            <div className='flex flex-col lg:flex-row justify-center items-center gap-5 mt-5 mb-8'>
                <Image
                    src="https://enayamall.fahimsultan.com/storage/uploads/image1.png"
                    alt="Left Banner"
                    loading="eager"
                    priority
                    height={215}
                    width={600}
                    className="lg:w-1/2 h-full" />
                <Image
                    src="https://enayamall.fahimsultan.com/storage/uploads/image2.png"
                    alt="Right Bannger"
                    loading="eager"
                    priority
                    height={215}
                    width={600}
                    className="lg:w-1/2 h-full" />
            </div>
        </Container>
    )
}
