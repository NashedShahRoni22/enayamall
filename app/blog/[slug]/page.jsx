"use client";
import { useParams } from "next/navigation";
import Container from "@/app/components/shared/Container";
import ScreenLoader from "@/app/components/loaders/ScreenLoader";
import { Calendar } from "lucide-react";
import Image from "next/image";
import { useGetData } from "@/app/components/helpers/useGetData";
import { useAppContext } from "@/app/context/AppContext";
import he from "he";


export default function BlogDetailPage() {
  const { lang } = useAppContext();
  const { slug } = useParams();
  const { data, isLoading } = useGetData(`blog/${slug}`);

  if (isLoading) return <ScreenLoader />;

  const blog = data?.data;

  if (!blog) return <Container>Blog not found.</Container>;

  return (
    <Container>
      <div className="mx-[10px] lg:mx-[40px]">
      {/* Header */}
      <div className="my-8">
        <h1 className={`text-3xl lg:text-4xl text-primary font-bold mb-2 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
          {lang === "en" ? blog.title : blog.ar_title}
        </h1>
        <div className={`flex items-center text-sm mt-2 gap-1 text-gray-500 ${lang === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
          <Calendar className="w-4 h-4" />
          <span>{blog.created_at}</span>
        </div>
      </div>

      {/* Banner Image */}
      <div className="relative w-full h-[300px] rounded-xl overflow-hidden mb-8">
        <Image
          src={blog.banner_image}
          alt={lang === "en" ? blog.title : blog.ar_title}
          fill
          className="object-cover"
        />
      </div>

      {/* Blog Content */}
      <div
        id="preview"
        className="text-[16px] 2xl:text-[18px] text-[#38444f] longDescription"
        dir={lang === "ar" ? "rtl" : "ltr"}
        dangerouslySetInnerHTML={{
          __html:
            lang === "en"
              ? he.decode(blog.content)
              : he.decode(blog.ar_content),
        }}
      />
      </div>
    </Container>
  );
}
