import Link from 'next/link'
import { useAppContext } from '@/app/context/AppContext';

export default function ShopNowButton({route}) {
  const { lang } = useAppContext();
  return (
    <Link
      href={route || "/"}
      className='group text-[16px] 2xl:text-[18px] flex gap-[4px] items-center transition-all duration-300 ease-in-out border border-primary px-3 py-1 rounded-lg hover:bg-primary hover:text-white w-max mx-auto lg:mx-0'
    >
      <span className='text-primary group-hover:text-white transition-colors duration-300 ease-in-out'>{lang === 'en' ? 'View all' : 'عرض الكل'}</span>
    </Link>
  )
}
