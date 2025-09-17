"use client";
import { useGetData } from "../components/helpers/useGetData"
import ScreenLoader from "../components/loaders/ScreenLoader";
import BlogCard from "../components/shared/cards/BlogCard";
import Container from "../components/shared/Container";

export default function page() {
    const { data, isLoading } = useGetData("blogs");
    if (isLoading) return <ScreenLoader />
    const blogs = data?.data;
    return (
        <section className="py-[20px] lg:py-[40px]">
            <Container>
                <h2 className="text-3xl font-bold text-primary mb-2">Enayamall Blog</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 my-[20px] lg:my-[40px]">
                    {blogs.map(blog => (
                        <BlogCard key={blog.id} blog={blog} />
                    ))}
                </div>
            </Container>
        </section>
    )
}
