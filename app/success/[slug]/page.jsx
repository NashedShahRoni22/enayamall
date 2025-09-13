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
            {/* <PageHeader title="Checkout" from="home" to="checkout" /> */}
            <Container>
                <div className="lg:flex justify-center py-[40px]">
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

                        <h5 className="text-[#0D834D] text-[28px] sm:text-[36px] font-semibold text-center mt-[30px]">Congratulations!</h5>
                        <h5 className="text-[#0D834D] text-[22px] sm:text-[30px] text-center">Your order has been received. Your order id is:</h5>


                        <div className="sm:flex sm:justify-center">
                            <p className="py-[8px] px-[16px] bg-customgreen text-white rounded-[5px] text-[16px] sm:text-[18px] mt-[30px] sm:w-1/2 flex items-center justify-center gap-[10px]">
                                {slug}
                            </p>
                        </div>

                        <p className="text-ash text-center text-[14px] sm:text-[16px] mt-[30px]">A confirmation will be sent to your SMS and email. <br />If any issue you can contact with us.</p>

                        {/* buttons here  */}
                        <div className="flex flex-col gap-[15px] mt-[50px]">
                            <Link href={"/track-order"} className="text-[16px] sm:text-[18px] py-[10px] rounded-lg border border-primary text-primary text-center duration-300 ease-linear cursor-pointer">Track Order</Link>
                            
                            <Link href={"/account"} className="text-[16px] sm:text-[18px] py-[10px] rounded-lg bg-primary text-white text-center duration-300 ease-linear cursor-pointer">Go to account</Link>
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    )
}
