import Link from "next/link";
import { useGetData } from "../helpers/useGetData";
import ScreenLoader from "../loaders/ScreenLoader";
import BlogCard from "../shared/cards/BlogCard";
import BlogImageCard from "../shared/cards/BlogImageCard";
import Container from "../shared/Container";
import ShopNowButton from "../shared/ShopNowButton";
import { useAppContext } from "@/app/context/AppContext";

export default function Blogs() {
  const { data, isLoading } = useGetData("blogs");
  const { lang } = useAppContext();

  // if (isLoading) return <ScreenLoader />;

  const blogs = data?.data || [];

  // Early return if there’s no data
  if (!blogs.length) return null;

  // Slice to get the next 4 blogs (after index 0)
  const blogList = blogs.slice(1, 5);

  return (
    <section className="py-[20px] lg:py-[40px]">
      <Container>
        <div className={`flex justify-between items-center ${lang === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
            <h2 className="text-3xl font-bold text-primary mb-2">{lang === 'ar' ? 'نبض عناية' : 'Enaya Beat'}</h2>            {/* <Link href={"/blog"} className="text-sm">See more options</Link>  */}
            <ShopNowButton route={"/blog"}/>
        </div>

        {/* Blogs Split Layout */}
        <div className={`flex flex-col gap-6 mt-6 ${lang === 'ar' ? 'lg:flex-row-reverse' : 'lg:flex-row'}`}>
          {/* Left side - Featured Blog */}
          <div className="md:w-1/2 lg:w-1/3">
            <BlogImageCard blog={blogs[0]} />
          </div>

          {/* Right side - Next 4 Blogs */}
          <div className="md:w-1/2 lg:w-2/3 grid grid-cols-2 lg:grid-cols-2 gap-6">
            {blogList?.map((blog,index) => (
              <BlogCard key={index} blog={blog} />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
