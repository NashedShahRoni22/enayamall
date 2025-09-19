import { MdHome, MdClose } from "react-icons/md";
import DirhamSign from "../shared/DirhamSign";

export default function OrderDetailsModal({ order, isOpen, onClose }) {
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-5 flex justify-between items-center rounded-t-xl">
          <h2 className="text-2xl font-semibold text-gray-800">Order Details</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <MdClose className="text-2xl text-gray-500 hover:text-gray-700" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-8">
          {/* Order Header */}
          <div className="flex flex-col 2xl:flex-row 2xl:items-center 2xl:justify-between gap-6">
            <div className="flex flex-wrap gap-3">
              <span className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg">
                Order ID: {order.order_id}
              </span>
              <span className="px-4 py-2 bg-orange-500 text-white text-sm font-medium rounded-lg">
                {order.payment_type}
              </span>
            </div>
            <div className="text-right space-y-2">
              <p className="text-gray-600 text-sm">Date: {order.ordered_at}</p>
              <p className="text-base font-semibold">
                <span className="text-gray-800">Status:</span>{" "}
                <span className="text-green-600">{order.status}</span>
              </p>
            </div>
          </div>

          {/* Products Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Products</h3>
            <div className="divide-y divide-gray-100 border-y border-gray-200">
              {order.order_details?.map((od, index) => (
                <div
                  key={index}
                  className="flex justify-between py-4 text-gray-700 text-sm"
                >
                  <div className="w-[70%]">
                    <div className="flex justify-between">
                      <p className="font-medium">
                        {od.product_name} {od.product_variant}
                      </p>
                      <p className="hidden lg:block text-gray-500">x {od.quantity}</p>
                    </div>
                    {od.items?.length > 0 && (
                      <ul className="mt-1 ml-5 list-disc text-gray-500 text-xs">
                        {od.items.map((odi, itemIndex) => (
                          <li key={itemIndex}>
                            {odi.name}
                            {odi.variant && <span> - {odi.variant}</span>}
                          </li>
                        ))}
                      </ul>
                    )}
                    <p className="lg:hidden text-gray-500 mt-1">x {od.quantity}</p>
                  </div>
                  <p className="font-medium">
                    <span className="mr-1"><DirhamSign /></span>
                    {od.price * od.quantity}
                  </p>
                </div>
              ))}
            </div>

            {/* Applied Discount */}
            {order.coupon_discount !== null && (
              <div className="flex justify-between text-sm text-gray-600 mt-4">
                <p>Applied Discount</p>
                <p>- {order.coupon_discount}</p>
              </div>
            )}

            {/* Delivery Charge */}
            <div className="flex justify-between text-sm text-gray-600 mt-2">
              <p>Delivery Charge</p>
              <p>
                <span className="mr-1"><DirhamSign /></span>
                {order.shipping_cost}
              </p>
            </div>

            {/* Amount Payable */}
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
              <p className="text-lg font-semibold">Amount Payable</p>
              <p className="text-lg font-bold text-gray-800">
                <span className="mr-1"><DirhamSign /></span>
                {order.amount_payable?.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Shipping Details */}
          <div className="flex gap-4 text-gray-700">
            <div className="flex-shrink-0">
              <MdHome className="text-blue-600 text-2xl" />
            </div>
            <div className="space-y-2 text-sm">
              <h3 className="text-base font-semibold text-gray-800">
                Shipping Address
              </h3>
              {order.address?.name && <p>{order.address.name}</p>}
              {order.address?.phone && <p>{order.address.phone}</p>}
              <p className="text-gray-600">
                {[
                  order.address?.house_name_or_flat_number &&
                    `Flat/House: ${order.address.house_name_or_flat_number}`,
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
                <div className="pt-2">
                  <p className="font-medium">Additional Info</p>
                  <p className="text-gray-500">{order.address.additional_info}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-4 rounded-b-xl">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
