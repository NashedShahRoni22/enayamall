import { MdHome } from "react-icons/md";

export default function Orders({ orders }) {
  return (
    <section className="flex flex-col gap-[30px]">
      {
        orders?.length > 0 ?
          <>
            {/* order cards here  */}
            {
              orders?.map((order, index) =>
                <div key={index} className="p-[20px] lg:p-[40px] border-[1px] border-creamline rounded-[10px]">
                  {/* order header  */}
                  <div className="flex flex-col 2xl:flex-row gap-[20px] 2xl:justify-between 2xl:items-center">
                    <div className="flex gap-[20px]">
                      <p className="px-[8px] lg:px-[32px] py-[6px] lg:py-[16px] bg-customgreen text-white text-[14px] lg:text-[18px] rounded-[5px]">Order Id: {order?.order_id}</p>
                      <p className="px-[8px] lg:px-[32px] py-[6px] lg:py-[16px] bg-orange text-white text-[14px] lg:text-[18px] rounded-[5px]">{order?.payment_type}</p>
                    </div>
                    <div>
                      <p className="text-button text-[14px] lg:text-[18px]">Date: {order?.ordered_at}</p>
                      <p className="text-[16px] lg:text-[20px] mt-[20px] font-[650]"> <span className="text-primaryblack">Status:</span> <span className="text-customgreen">{order?.status}</span> </p>
                    </div>
                  </div>
                  {/* products here  */}
                  <div className="text-primaryblack mt-[40px]">
                    <p className="text-[16px] lg:text-[20px] font-[650]">Product</p>
                    <div className="border-t border-b border-creamline pb-[20px] mt-[8px] mb-[20px]">
                      {
                        order?.order_details?.map((od, index) =>
                          <div key={index} className="text-[16px] flex justify-between mt-[20px]">
                            <div className="w-[70%]">
                              <div className="flex justify-between">
                                <p>
                                  {od?.product_name} {od?.product_variant}
                                  <br />
                                  <span className="lg:hidden">x {od?.quantity}</span>
                                </p>
                                <p className="hidden lg:block">x {od?.quantity}</p>
                              </div>
                              {
                                od?.items?.length > 0 &&
                                <ul className="mt-1 ml-2 list-disc list-inside">
                                  {
                                    od?.items?.map((odi, index) => <li key={index}>{odi?.name} {odi.variant && <span>-  {odi.variant}</span>} </li>)
                                  }
                                </ul>
                              }

                            </div>
                            <p><span className="dirham-symbol text-[17px] mr-1">ê</span>{" "} {od?.price * od?.quantity}</p>
                          </div>)
                      }
                    </div>

                    {/* Applied discounnt */}
                    {
                      order?.coupon_discount !== null &&
                      <div className="text-button text-[16px] flex justify-between mb-[10px]">
                        <p>Applied discounnt</p>
                        <p>{order?.coupon_discount}</p>
                      </div>
                    }

                    {/* Delivery charge  */}
                    <div className="text-successText text-[16px] flex justify-between pb-[20px] border-b border-creamline">
                      <p>Delivery charge</p>
                      <p><span className="dirham-symbol text-[17px] mr-1">ê</span>{" "} {order?.shipping_cost}</p>
                    </div>

                    <div className="text-[16px] lg:text-[20px] flex justify-between mt-[10px]">
                      <p className="font-[650]">Amount payable</p>
                      <p className="font-[650]"><span className="dirham-symbol text-[17px] mr-1">ê</span>{" "} {order?.amount_payable?.toFixed(2)}</p>
                    </div>
                  </div>

                  {/* shipping details here  */}
                  <div className="mt-[40px] text-primaryblack flex gap-[20px]">
                    <div className="flex-1">
                      <MdHome className="text-primary text-[24px]" />
                    </div>
                    <div className="text-[16px]">
                      <p>{order?.address?.name}</p>
                      <p>{order?.address?.phone}</p>
                      <p>
                        {[
                          order?.address?.house_name_or_flat_number && `Flat/House Name: ${order.address.house_name_or_flat_number}`,
                          order?.address?.house_number && `House: ${order.address.house_number}`,
                          order?.address?.road_number && `Road: ${order.address.road_number}`,
                          order?.address?.block && `Block: ${order.address.block}`,
                          order?.address?.area && `Area: ${order.address.area}`,
                          order?.address?.city_name && `City: ${order.address.city_name}`,
                          order?.address?.district_name && `District: ${order.address.district_name}`,
                          order?.address?.post_code && `Post Code: ${order.address.post_code}`,
                        ]
                          .filter(Boolean)
                          .join(', ')}
                      </p>

                      {
                        order?.address?.additional_info &&
                        <div className="mt-[30px]">
                          <p>
                            Additional Information
                          </p>
                          <p className="text-ash">{order?.address?.additional_info}</p>
                        </div>
                      }
                    </div>

                  </div>
                </div>)
            }
          </>
          :
          <div className="flex justify-center items-center h-[50vh]">
            <p className="text-button text-xl">No order found</p>
          </div>
      }
    </section>
  )
}
