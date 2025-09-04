"use client"
import { TbCurrencyTaka } from "react-icons/tb";
import PageHeader from '../../components/shared/PageHeader'
import Container from '../../components/shared/Container'
import { FaCheck } from 'react-icons/fa'
import { IoBagCheck } from "react-icons/io5";
import { CgShoppingBag } from "react-icons/cg";
import Link from "next/link";
import { AiOutlineClose } from "react-icons/ai";
import { useParams } from "next/navigation";

export default function page() {
    const params = useParams();
    const slug = params?.slug;
    return (
        <section>
            <PageHeader title="Checkout" from="home" to="checkout" />
            <Container>
                <div className="lg:flex justify-center pt-[90px] pb-[120px]">
                    {/* Confirm content here   */}
                    <div className="py-[40px] px-[30px] border border-creamline shadow-xl lg:w-1/2 rounded-[10px] relative">

                        {/* go back to home button  */}
                        <Link href={"/"} className="p-2 bg-creamline rounded-full absolute top-2 right-2">
                            <AiOutlineClose className="text-xl text-primary"/>
                        </Link>

                        <div className="flex justify-center">
                            <button className="p-2 rounded-full bg-customgreen text-white">
                                <FaCheck className="text-[36px] sm:text-[48px]" />
                            </button>
                        </div>

                        <h5 className="text-[#0D834D] text-[28px] sm:text-[36px] text-center mt-[30px]">Congratulations</h5>
                        <h5 className="text-[#0D834D] text-[28px] sm:text-[36px] text-center">Your order has been received</h5>

                        <div className="flex justify-center items-center gap-[10px] mt-[40px]">
                            <div className="bg-customgreen text-white p-2 rounded-full">
                                <IoBagCheck className="text-[36px]" />
                            </div>

                            <div className="h-[2px] w-[150px] bg-gradient-to-tr from-primary to-customgreen"></div>

                            <div className="bg-creamline text-white p-2 rounded-full">
                                <TbCurrencyTaka className="text-[36px]" />
                            </div>
                        </div>

                        <div className="sm:flex sm:justify-center">
                            <p className="py-[8px] sm:py-[16px] bg-customgreen text-white rounded-[5px] text-[16px] sm:text-[18px] mt-[30px] sm:w-1/2 flex items-center justify-center gap-[10px]">
                                <CgShoppingBag /> Order ID: {slug}
                            </p>
                        </div>

                        <p className="text-ash text-center text-[14px] sm:text-[16px] mt-[30px]">A confirmation will be sent to your SMS and email. <br />Our customer care executive will contact you shortly.</p>

                        {/* buttons here  */}
                        <div className="flex flex-col gap-[20px] mt-[50px]">
                            <Link href={"/account"} className="text-[16px] sm:text-[18px] py-[10px] sm:py-[20px] rounded-[5px] bg-primary text-white text-center hover:bg-creamline hover:text-primary duration-300 ease-linear cursor-pointer">Orders</Link>
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    )
}
