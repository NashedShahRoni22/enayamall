import Image from 'next/image';

export default function BlogCard({ blog }) {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Banner Image */}
      <div className="relative w-full h-60">
        <Image
          src={blog?.banner_image}
          alt={blog?.title}
          fill
          className="object-cover"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="text-lg font-semibold text-primaryblack mb-2 line-clamp-2">
          {blog?.title}
        </h3>

        {/* Blog Excerpt or Content */}
        {/* <div
          className="text-sm text-gray-600 line-clamp-4"
          dangerouslySetInnerHTML={{ __html: blog?.content }}
        /> */}
      </div>
    </div>
  );
}
