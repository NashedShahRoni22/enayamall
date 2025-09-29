import Image from 'next/image';
import { Calendar } from 'lucide-react';
import Link from 'next/link';
import { useAppContext } from '@/app/context/AppContext';

export default function BlogCard({ blog }) {
  const { lang } = useAppContext();
  return (
    <Link href={`/blog/${blog?.slug}`} className={`flex flex-col overflow-hidden transition-shadow duration-300 ${lang === 'ar' ? 'sm:flex-row-reverse' : 'sm:flex-row'}`}>
      {/* Image Section */}
      <div className="relative w-[150px] flex-shrink-0">
        <Image
          src={blog?.banner_image}
          alt={blog?.title}
          width={500}
          height={250}
          className="object-contain sm:static sm:w-full sm:h-full"
        />
      </div>

      {/* Content Section */}
      <div className="p-4 sm:p-5 flex flex-col justify-between sm:w-2/3 gap-2">
        {/* Title */}
        <h3 className={`text-sm font-semibold text-gray-900 line-clamp-2 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
          {lang == 'en' ? blog?.title : blog?.ar_title || blog?.title}
        </h3>

        {/* Created At */}
        <div className={`flex items-center text-xs gap-1 text-gray-400 ${lang === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
          <Calendar className="w-4 h-4" />
          <span>{blog?.created_at}</span>
        </div>
      </div>
    </Link>
  );
}
