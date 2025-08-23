import lastAddBanner1 from "@/public/lastAddBanner (1).svg";
import lastAddBanner2 from "@/public/lastAddBanner (2).svg";
import Image from "next/image";
import Container from "../shared/Container";

export default function LastAdd() {
    return (
        <Container>
            <div className='flex flex-col md:flex-row md:justify-between gap-5'>
                <Image src={lastAddBanner1} alt="Last Add Banner 1" />
                <Image src={lastAddBanner2} alt="Last Add Banner 2" />
            </div>
        </Container>
    )
}
