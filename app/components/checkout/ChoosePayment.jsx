import { MdCheckCircle, MdOutlineRadioButtonUnchecked } from 'react-icons/md'

export default function ChoosePayment({method, setMethod}) {
  return (
    <div className="bg-creamline p-[20px] rounded-xl mt-[30px]">
                <p className='text-[18px] text-primaryblack font-[650]'>
                    Select Payment
                </p>
                <div className="flex flex-col sm:flex-row gap-[20px] sm:gap-[40px] mt-[15px]">
                    <button onClick={() => setMethod("cod")} className="flex items-center gap-[6px] sm:gap-[12px] cursor-pointer">
                        <span>
                            {
                                method === "cod" ?
                                    <MdCheckCircle className="text-[20px] sm:text-[24px] text-customgreen" />
                                    :
                                    <MdOutlineRadioButtonUnchecked className="text-[20px] sm:text-[24px] text-primaryblack" />
                            }
                        </span>
                        <span className={`text-[16px] sm:text-[18px] ${method === "cod" ? "text-customgreen font-[650]" : "text-ash"}`}>Cash On Delivery</span>
                    </button>

                    <button onClick={() => setMethod("online")} className="flex items-center gap-[6px] sm:gap-[12px] cursor-pointer">
                        <span>
                            {
                                method === "online" ?
                                    <MdCheckCircle className="text-[20px] sm:text-[24px] text-customgreen" />
                                    :
                                    <MdOutlineRadioButtonUnchecked className="text-[20px] sm:text-[24px] text-primaryblack" />
                            }
                        </span>
                        <span className={`text-[16px] sm:text-[18px] ${method === "online" ? "text-customgreen font-[650]" : "text-ash"}`}>Pay Online</span>
                    </button>
                </div>
            </div> 
  )
}
