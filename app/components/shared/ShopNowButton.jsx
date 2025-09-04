import Link from 'next/link'
import vector from "../../resources/icons/vector.svg";
import naturalVector from "../../resources/icons/natural-vector.svg";
import Image from 'next/image';
import { ChevronLeft } from 'lucide-react';

export default function ShopNowButton() {
  return (
    <Link
      href={"/"}
      className='group text-[16px] 2xl:text-[18px] text-button hover:text-primary flex gap-[4px] items-center transition-all duration-300 ease-in-out'
    >
      <ChevronLeft className='text-primary transition-colors duration-300 ease-in-out' size={20} />
      {/* <div className='relative h-6 w-6 justify-center items-center flex'>
        <Image
          className='absolute opacity-100 group-hover:opacity-0 transition-opacity duration-300 ease-in-out'
          src={vector}
          alt='vector icon'
          height={16}
          width={16}
        />
        <Image
          className='absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out'
          src={naturalVector}
          alt='vector icon'
          height={16}
          width={16}
        />
      </div> */}
      <span className='text-primary transition-colors duration-300 ease-in-out'>Go to homepage</span>
    </Link>
  )
}
