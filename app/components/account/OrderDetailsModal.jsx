import { MdHome, MdClose } from "react-icons/md";

export default function OrderDetailsModal({ order, isOpen, onClose }) {
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 bg-black/20 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[10px] max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="sticky top-0 bg-white border-b border-creamline p-6 flex justify-between items-center rounded-t-[10px]">
          <h2 className="text-xl lg:text-2xl font-bold text-primaryblack">
            Order Details
          </h2>
          <button
            onClick={onClose}
            className="text-red-500 hover:text-red-600 transition-colors cursor-pointer"
          >
            <MdClose className="text-2xl" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {/* Order Header */}
          <div className="flex flex-col 2xl:flex-row gap-[20px] 2xl:justify-between 2xl:items-center mb-8">
            <div className="flex gap-[20px]">
              <p className="px-[8px] lg:px-[32px] py-[6px] lg:py-[16px] bg-customgreen text-white text-[14px] lg:text-[18px] rounded-[5px]">
                Order Id: {order.order_id}
              </p>
              <p className="px-[8px] lg:px-[32px] py-[6px] lg:py-[16px] bg-orange text-white text-[14px] lg:text-[18px] rounded-[5px]">
                {order.payment_type}
              </p>
            </div>
            <div>
              <p className="text-button text-[14px] lg:text-[18px]">
                Date: {order.ordered_at}
              </p>
              <p className="text-[16px] lg:text-[20px] mt-[20px] font-[650]">
                <span className="text-primaryblack">Status:</span>
                <span className="text-customgreen ml-2">{order.status}</span>
              </p>
            </div>
          </div>

          {/* Products Section */}
          <div className="text-primaryblack mb-8">
            <p className="text-[16px] lg:text-[20px] font-[650] mb-4">Products</p>
            <div className="border-t border-b border-creamline pb-[20px] mb-[20px]">
              {order.order_details?.map((od, index) => (
                <div key={index} className="text-[16px] flex justify-between mt-[20px]">
                  <div className="w-[70%]">
                    <div className="flex justify-between">
                      <p>
                        {od.product_name} {od.product_variant}
                        <br />
                        <span className="lg:hidden">x {od.quantity}</span>
                      </p>
                      <p className="hidden lg:block">x {od.quantity}</p>
                    </div>
                    {od.items?.length > 0 && (
                      <ul className="mt-1 ml-2 list-disc list-inside">
                        {od.items.map((odi, itemIndex) => (
                          <li key={itemIndex}>
                            {odi.name}
                            {odi.variant && <span> - {odi.variant}</span>}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <p>
                    <span className="dirham-symbol text-[17px] mr-1">ê</span>
                    {od.price * od.quantity}
                  </p>
                </div>
              ))}
            </div>

            {/* Applied Discount */}
            {order.coupon_discount !== null && (
              <div className="text-button text-[16px] flex justify-between mb-[10px]">
                <p>Applied Discount</p>
                <p>{order.coupon_discount}</p>
              </div>
            )}

            {/* Delivery Charge */}
            <div className="text-successText text-[16px] flex justify-between pb-[20px] border-b border-creamline">
              <p>Delivery Charge</p>
              <p>
                <span className="dirham-symbol text-[17px] mr-1">ê</span>
                {order.shipping_cost}
              </p>
            </div>

            {/* Amount Payable */}
            <div className="text-[16px] lg:text-[20px] flex justify-between mt-[10px]">
              <p className="font-[650]">Amount Payable</p>
              <p className="font-[650]">
                <span className="dirham-symbol text-[17px] mr-1">ê</span>
                {order.amount_payable?.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Shipping Details */}
          <div className="text-primaryblack flex gap-[20px]">
            <div className="flex-shrink-0">
              <MdHome className="text-primary text-[24px]" />
            </div>
            <div className="text-[16px]">
              <h3 className="font-[650] text-[16px] lg:text-[18px] mb-2">
                Shipping Address
              </h3>
              {order.address?.name && <p>{order.address.name}</p>}
              {order.address?.phone && <p>{order.address.phone}</p>}
              <p>
                {[
                  order.address?.house_name_or_flat_number &&
                    `Flat/House Name: ${order.address.house_name_or_flat_number}`,
                  order.address?.house_number &&
                    `House: ${order.address.house_number}`,
                  order.address?.road_number &&
                    `Road: ${order.address.road_number}`,
                  order.address?.block && `Block: ${order.address.block}`,
                  order.address?.area && `Area: ${order.address.area}`,
                  order.address?.city_name && `City: ${order.address.city_name}`,
                  order.address?.district_name &&
                    `District: ${order.address.district_name}`,
                  order.address?.post_code &&
                    `Post Code: ${order.address.post_code}`,
                ]
                  .filter(Boolean)
                  .join(", ")}
              </p>

              {order.address?.additional_info && (
                <div className="mt-[20px]">
                  <p className="font-medium">Additional Information</p>
                  <p className="text-ash">{order.address.additional_info}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="sticky bottom-0 bg-white border-t border-creamline p-6 rounded-b-[10px]">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="cursor-pointer px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}