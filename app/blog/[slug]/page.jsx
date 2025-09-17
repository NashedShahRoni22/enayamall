"use client";
import { useParams } from "next/navigation";
import Container from "@/app/components/shared/Container";
import ScreenLoader from "@/app/components/loaders/ScreenLoader";
import { Calendar } from "lucide-react";
import Image from "next/image";
import { useGetData } from "@/app/components/helpers/useGetData";

export default function BlogDetailPage() {
  const { slug } = useParams();
  const { data, isLoading } = useGetData(`blog/${slug}`);

  if (isLoading) return <ScreenLoader />;

  const blog = data?.data;

  if (!blog) return <Container>Blog not found.</Container>;

  return (
    <Container>
      {/* Header */}
      <div className="my-8">
        <h1 className="text-3xl font-bold text-primary mb-2">
          {blog.title}
        </h1>
        <div className="flex items-center text-sm text-gray-500 gap-2">
          <Calendar className="w-4 h-4" />
          <span>{blog.created_at}</span>
        </div>
      </div>

      {/* Banner Image */}
      <div className="relative w-full h-[300px] rounded-xl overflow-hidden mb-8">
        <Image
          src={blog.banner_image}
          alt={blog.title}
          fill
          className="object-cover"
        />
      </div>

      {/* Blog Content */}
      <div
        className="prose prose-base max-w-none"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />
    </Container>
  );
}
