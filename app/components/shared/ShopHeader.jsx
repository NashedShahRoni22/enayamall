import Image from 'next/image'
import { FaChevronRight } from 'react-icons/fa'
import DetailsBanner from "@/public/hero (2).jpg";
import Link from 'next/link';

export default function ShopHeader({ title, from, to }) {
    return (
        <div className="relative">
            <Image
                src={DetailsBanner}
                alt="Details Banner"
                className="w-full object-cover h-[200px] lg:h-[400px]"
            />

            <div className="absolute top-0 left-0 h-full w-full flex flex-col items-center justify-center">
                <h5 className="text-[26px] lg:text-[34px] text-primaryblack font-[350]">{title}</h5>
                <div className="text-[16px] lg:text-[20px] mt-[20px] lg:mt-[30px] text-primaryblack flex items-center gap-[16px] font-[400]">
                    <Link href={"/"} className='capitalize hover:text-natural'>{from}</Link>
                    <span> <FaChevronRight className="text-sm" /> </span>
                    <Link href={to} className='capitalize hover:text-natural'>{to}</Link>
                </div>
            </div>
        </div>
    )
}
