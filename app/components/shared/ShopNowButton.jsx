import Link from 'next/link'
import vector from "../../resources/icons/vector.svg";
import naturalVector from "../../resources/icons/natural-vector.svg";
import Image from 'next/image';

export default function ShopNowButton() {
  return (
    <Link
      href={"/shop"}
      className='group text-[18px] 2xl:text-[24px] text-button hover:text-natural flex gap-[12px] items-center transition-all duration-300 ease-in-out'
    >
      <div className='relative h-6 w-6'>
        <Image
          className='absolute opacity-100 group-hover:opacity-0 transition-opacity duration-300 ease-in-out'
          src={vector}
          alt='vector icon'
          height={24}
          width={24}
        />
        <Image
          className='absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out'
          src={naturalVector}
          alt='vector icon'
          height={24}
          width={24}
        />
      </div>
      <span className='transition-colors duration-300 ease-in-out'>Shop Now</span>
    </Link>
  )
}
