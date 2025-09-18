import imageLeft from "@/public/image1.png";
import imageRight from "@/public/image2.png";
import Image from "next/image";
import Container from "../shared/Container";
import { useGetData } from "../helpers/useGetData";

export default function TwoAdsBanner() {
    const { data: imageData } = useGetData("banners?slug=1")
    console.log('====================================');
    console.log(imageData);
    console.log('====================================');
    return (
        <Container>
            <div className='flex flex-col lg:flex-row justify-center items-center gap-5 my-5'>
                <Image
                    src={`data:image/svg+xml;base64,${Buffer.from(
                        `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="150">
                        <rect width="600" height="150" fill="#e5e7eb"/>
                        </svg>`
                    ).toString("base64")}`}
                    // src="https://enayamall.fahimsultan.com/storage/uploads/image1.png"
                    alt="Left Banner"
                    loading="eager"
                    priority
                    height={150}
                    width={600}
                    className="lg:w-1/2 h-full rounded-md" />
                <Image
                    src={`data:image/svg+xml;base64,${Buffer.from(
                        `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="150">
                        <rect width="600" height="150" fill="#e5e7eb"/>
                        </svg>`
                    ).toString("base64")}`}
                    // src="https://enayamall.fahimsultan.com/storage/uploads/image2.png"
                    alt="Right Bannger"
                    loading="eager"
                    priority
                    height={150}
                    width={600}
                    className="lg:w-1/2 h-full rounded-md" />
            </div>
        </Container>
    )
}
