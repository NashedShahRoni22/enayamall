import { useGetDataWithToken } from '../helpers/useGetDataWithToken'
import { useAppContext } from '@/app/context/AppContext'

export default function BalanceTransectionScreen({ walletBalance }) {
    const { token } = useAppContext();
    const { data: earningHistory } = useGetDataWithToken("earning-history", token);
    const earningData = earningHistory?.data;
    const { data: paymentHistory } = useGetDataWithToken("payment-history", token);
    const paymentData = paymentHistory?.data;
    return (
        <div className="space-y-6">
            {/* Balance Section */}
            <div className="p-6 bg-white rounded-lg border border-creamline flex flex-col md:flex-row justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">Balance</h3>
                <p className="text-lg font-bold text-green-700"> <span className="dirham-symbol text-[12px] md:text-[16px]">ê</span> {walletBalance}</p>
            </div>

            {/* Transaction Section */}
            <div className="p-6 bg-white rounded-lg border border-creamline">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Earning History</h3>

                {/* Transaction Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-creamline">
                                <th className="text-left py-3 px-4 text-gray-600 font-medium">Date</th>
                                <th className="text-left py-3 px-4 text-gray-600 font-medium">Amount</th>
                                <th className="text-left py-3 px-4 text-gray-600 font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Sample transaction rows - replace with actual data */}
                            {
                                earningData?.map((ed, index) =>
                                    <tr className="border-b border-creamline hover:bg-gray-50" key={index}>
                                        <td className="py-3 px-4 text-gray-700">2024-01-15</td>
                                        <td className="py-3 px-4 text-gray-700"><span className="dirham-symbol text-[12px] md:text-[16px]">ê</span> {ed?.amount}</td>
                                        <td className="py-3 px-4">
                                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                {ed?.status_type}
                                            </span>
                                        </td>
                                    </tr>
                                )
                            }
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Transaction Section */}
            <div className="p-6 bg-white rounded-lg border border-creamline">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Payment History</h3>

                {/* Transaction Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-creamline">
                                <th className="text-left py-3 px-4 text-gray-600 font-medium">Date</th>
                                <th className="text-left py-3 px-4 text-gray-600 font-medium">Amount</th>
                                <th className="text-left py-3 px-4 text-gray-600 font-medium">Transaction Id</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Sample transaction rows - replace with actual data */}
                            {
                                paymentData?.map((pd, index) =>
                                    <tr className="border-b border-creamline hover:bg-gray-50" key={index}>
                                        <td className="py-3 px-4 text-gray-700">2024-01-15</td>
                                        <td className="py-3 px-4 text-gray-700"><span className="dirham-symbol text-[12px] md:text-[16px]">ê</span> {pd?.amount}</td>
                                        <td className="py-3 px-4 text-gray-700">
                                            {pd?.transaction_id}
                                        </td>
                                    </tr>
                                )
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
