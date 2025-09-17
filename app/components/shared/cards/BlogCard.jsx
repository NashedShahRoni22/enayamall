import Image from 'next/image';
import { Calendar } from 'lucide-react';

export default function BlogCard({ blog }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl flex flex-col sm:flex-row overflow-hidden">
      {/* Image Section */}
      <div className="relative w-full sm:w-1/3 aspect-video sm:aspect-auto">
        <Image
          src={blog?.banner_image}
          alt={blog?.title}
          fill
          className="object-cover sm:static sm:w-full sm:h-full"
        />
      </div>

      {/* Content Section */}
      <div className="p-4 sm:p-5 flex flex-col justify-between sm:w-2/3 gap-2">
        {/* Title */}
        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">
          {blog?.title}
        </h3>

        {/* Created At */}
        <div className="flex items-center text-xs text-gray-500 gap-1">
          <Calendar className="w-4 h-4" />
          <span>{new Date(blog?.created_at).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
}
