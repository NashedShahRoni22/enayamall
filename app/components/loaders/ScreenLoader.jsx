import Image from 'next/image';
import logo from '@/public/logo.webp';

export default function ScreenLoader() {
  return (
    <div className="min-h-screen flex justify-center items-center bg-creamline fixed top-0 min-w-full z-[9999]">
      <Image src={logo} alt='Screen Loader Laminax' className='w-1/4 sm:w-1/6 xl:w-1/8 animate-bounce' />
    </div>
  )
}
