import Image from 'next/image';
import { Calendar } from 'lucide-react';
import Link from 'next/link';
import { useAppContext } from '@/app/context/AppContext';

export default function BlogImageCard({ blog }) {
  const { lang } = useAppContext();
  return (
    <Link href={`/blog/${blog?.slug}`} className="relative w-full h-full aspect-video rounded-xl overflow-hidden inline-block">
      {/* Background Image */}
      <Image
        src={blog?.banner_image}
        alt={blog?.title}
        fill
        className="object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Content overlaid at the bottom */}
      <div className="absolute bottom-0 left-0 w-full p-4 text-white">
        <h3 className={`text-base font-semibold line-clamp-2 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
          {lang == 'en' ? blog?.title : blog?.ar_title || blog?.title}
        </h3>

        <div className={`flex items-center text-sm mt-2 gap-1 text-gray-300 ${lang === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
          <Calendar className="w-4 h-4" />
          <span>{blog?.created_at}</span>
        </div>
      </div>
    </Link>
  );
}
