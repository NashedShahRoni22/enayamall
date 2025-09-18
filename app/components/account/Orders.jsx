import { useState } from "react";
import OrderDetailsModal from "./OrderDetailsModal";

export default function Orders({ orders }) {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  if (!orders || orders.length === 0) {
    return (
      <section className="flex justify-center items-center h-[50vh]">
        <p className="text-button text-xl">No order found</p>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-[30px] min-h-[60vh]">
      {/* Orders Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border-[1px] border-creamline rounded-[10px] overflow-hidden">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b border-creamline">
                Order ID
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b border-creamline">
                Payment Type
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b border-creamline">
                Order Date
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b border-creamline">
                Status
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b border-creamline">
                Amount
              </th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 border-b border-creamline">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-creamline">
            {orders.map((order, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-sm text-primaryblack font-medium">
                  {order.order_id}
                </td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 bg-orange text-white text-xs rounded">
                    {order.payment_type}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-button">
                  {order.ordered_at}
                </td>
                <td className="px-4 py-3">
                  <span className="text-customgreen text-sm font-medium">
                    {order.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm font-semibold text-primaryblack">
                  <span className="dirham-symbol text-sm mr-1">ê</span>
                  {order.amount_payable?.toFixed(2)}
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => handleViewDetails(order)}
                    className="cursor-pointer px-3 py-1 bg-primary text-white text-sm rounded"
                  >
                    Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Order Details Modal */}
      {isModalOpen && selectedOrder && (
        <OrderDetailsModal 
          order={selectedOrder} 
          isOpen={isModalOpen} 
          onClose={closeModal} 
        />
      )}
    </section>
  );
}