"use client"
import { useGetData } from "../components/helpers/useGetData";
import ScreenLoader from "../components/loaders/ScreenLoader";
import PageHeader from "../components/shared/PageHeader";


export default function page() {
  // fetch content
  const { data, isLoading, error } = useGetData('page?title=Terms Conditions');
  if (isLoading) return <ScreenLoader/>;
  if (error) return <div>Error: {error.message}</div>;
  return (


    <div>
      {/* <PageHeader title="About us" from="Home" to="/about" /> */}

      <section className="mx-5 lg:max-w-4xl lg:mx-auto">
        <div
          dangerouslySetInnerHTML={{ __html: data?.data?.content }}
          className="py-[20px] lg:py-[40px]"
        />
      </section>
    </div>
  )
}
