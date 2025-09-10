import imageLeft from "@/public/image1.png";
import imageRight from "@/public/image2.png";
import Image from "next/image";
import Container from "../shared/Container";

export default function TwoAdsBanner() {
    return (
        <Container>
            <div className='flex gap-5 mt-5 mb-8'>
                <Image src={imageLeft} alt="Left Banner"  />
                <Image src={imageRight} alt="Right Bannger" />
            </div>
        </Container>
    )
}
