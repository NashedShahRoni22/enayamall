import Image from 'next/image'
import { FaChevronRight } from 'react-icons/fa'
import DetailsBanner from "../../resources/auth bannner.png";
import Link from 'next/link';

export default function AuthHeader({ title, from, to }) {
    return (
        <div className="relative">
            <Image
                src={DetailsBanner}
                alt="Auth Banner"
                className="w-full object-cover h-[200px] lg:h-[400px]" />

            <div className="absolute top-0 left-0 h-full w-full flex flex-col items-center justify-center">
                <h5 className="text-[26px] lg:text-[34px] text-primarymagenta">{title}</h5>
                <div className="text-[16px] lg:text-[20px] mt-[20px] lg:mt-[30px] text-primarymagenta flex items-center gap-[16px]">
                    <Link href={"/"} className='hover:text-natural capitalize hover:underline'>{from}</Link>
                    <span> <FaChevronRight className="text-sm" /> </span>
                    <Link href={to} className='hover:text-natural capitalize hover:underline'>{to}</Link>
                </div>
            </div>
        </div>
    )
}
