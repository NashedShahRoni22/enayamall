"use client"
import { useState } from "react";
import PageHeader from "../components/shared/PageHeader";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useGetData } from "../components/helpers/useGetData";
import ScreenLoader from "../components/loaders/ScreenLoader";

export default function page() {

    // manage accordion, set the first FAQ as open by default
    const [show, setShow] = useState({
        state: true,
        id: `${0}-${0}`
    });

    // Toggle FAQ logic
    const toggleFAQ = (id) => {
        setShow((prev) =>
            prev.id === id
                ? { state: false, id: null }
                : { state: true, id }
        );
    };

    // fetch faqs
    const { data, isLoading, error } = useGetData(`faqs`);
    if (isLoading) return <ScreenLoader/>;
    if (error) return <div>Error: {error.message}</div>;
    const faqs = data?.data;
    

    return (
        <section>
            {/* <PageHeader title={"Frequently Asked Questions"} from={"Home"} to={"faq"} /> */}
            <section className="mx-5 lg:max-w-4xl lg:mx-auto">
                <div className="pt-[30px] lg:pt-[60px] pb-[50px] lg:pb-[120px]">
                    <p className="text-[16px] text-ash">
                        Welcome to Enayamall! We know that shopping for skincare—especially international brands—can bring up a lot of questions. Whether you're wondering about product authenticity, delivery times, payment options, or which product suits your skin type best, we're here to help. Below, you’ll find answers to the most common questions our Bangladeshi customers ask. We've included both English and Bengali to make it easier for everyone.
                    </p>
                    <div className="mt-[50px]">
                        {faqs?.map((faq, i) => (
                            <div key={i} className={`${i > 0 ? "mt-[100px] lg:mt-[80px]" : ""}`}>
                                <h5 className="text-primary text-[20px] lg:text-[26px] font-[650]">
                                    {faq.section_name}
                                </h5>
                                <ul className="mt-[20px] lg:mt-[40px]">
                                    {faq?.faqs?.map((faqQuesAns, k) => {
                                        const uniqueId = `${i}-${k}`;
                                        const isActive = show.state && show.id === uniqueId;

                                        return (
                                            <li key={uniqueId} className={`${k > 0 ? "mt-[20px] lg:mt-[40px]" : ""}`}>
                                                <div
                                                    onClick={() => toggleFAQ(uniqueId)}
                                                    className="cursor-pointer flex justify-between items-center gap-[40px] mt-[20px] lg:mt-[40px]"
                                                >
                                                    <p className="text-[18px] lg:text-[20px] text-primaryblack font-[650]">
                                                        Q. {faqQuesAns?.question}
                                                    </p>
                                                    {isActive ? (
                                                        <FaChevronUp className="text-primary text-[18px]" />
                                                    ) : (
                                                        <FaChevronDown className="text-primaryblack text-[18px]" />
                                                    )}
                                                </div>

                                                <div
                                                    className={`transition-all duration-500 ease-in-out overflow-hidden ${isActive ? "max-h-[500px] mt-[20px]" : "max-h-0"}`}
                                                >
                                                    <p className="text-[16px] text-ash">{faqQuesAns?.answer}</p>
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </section>
    );
}
