import React from 'react'

export default function BalanceTransectionScreen({walletBalance}) {
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
                                <th className="text-left py-3 px-4 text-gray-600 font-medium">Order No.</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Sample transaction rows - replace with actual data */}
                            <tr className="border-b border-creamline hover:bg-gray-50">
                                <td className="py-3 px-4 text-gray-700">2024-01-15</td>
                                <td className="py-3 px-4 text-gray-700"><span className="dirham-symbol text-[12px] md:text-[16px]">ê</span> 25.50</td>
                                <td className="py-3 px-4">
                                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        Completed
                                    </span>
                                </td>
                            </tr>
                            <tr className="border-b border-creamline hover:bg-gray-50">
                                <td className="py-3 px-4 text-gray-700">2024-01-12</td>
                                <td className="py-3 px-4 text-gray-700"><span className="dirham-symbol text-[12px] md:text-[16px]">ê</span> 15.75</td>
                                <td className="py-3 px-4">
                                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                        Pending
                                    </span>
                                </td>
                            </tr>
                            <tr className="border-b border-creamline hover:bg-gray-50">
                                <td className="py-3 px-4 text-gray-700">2024-01-10</td>
                                <td className="py-3 px-4 text-gray-700"> <span className="dirham-symbol text-[12px] md:text-[16px]">ê</span> 32.25</td>
                                <td className="py-3 px-4">
                                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                        Failed
                                    </span>
                                </td>
                            </tr>
                            {/* Empty state when no transactions */}
                            {/* <tr>
                      <td colSpan="3" className="text-center py-8 text-gray-500">
                        <Receipt className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                        <p>No transactions found</p>
                        <p className="text-sm">Your transaction history will appear here</p>
                      </td>
                    </tr> */}
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
                                <th className="text-left py-3 px-4 text-gray-600 font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Sample transaction rows - replace with actual data */}
                            <tr className="border-b border-creamline hover:bg-gray-50">
                                <td className="py-3 px-4 text-gray-700">2024-01-15</td>
                                <td className="py-3 px-4 text-gray-700"><span className="dirham-symbol text-[12px] md:text-[16px]">ê</span> 25.50</td>
                                <td className="py-3 px-4">
                                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        Completed
                                    </span>
                                </td>
                            </tr>
                            <tr className="border-b border-creamline hover:bg-gray-50">
                                <td className="py-3 px-4 text-gray-700">2024-01-12</td>
                                <td className="py-3 px-4 text-gray-700"><span className="dirham-symbol text-[12px] md:text-[16px]">ê</span> 15.75</td>
                                <td className="py-3 px-4">
                                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                        Pending
                                    </span>
                                </td>
                            </tr>
                            <tr className="border-b border-creamline hover:bg-gray-50">
                                <td className="py-3 px-4 text-gray-700">2024-01-10</td>
                                <td className="py-3 px-4 text-gray-700"><span className="dirham-symbol text-[12px] md:text-[16px]">ê</span> 32.25</td>
                                <td className="py-3 px-4">
                                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                        Failed
                                    </span>
                                </td>
                            </tr>
                            {/* Empty state when no transactions */}
                            {/* <tr>
                      <td colSpan="3" className="text-center py-8 text-gray-500">
                        <Receipt className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                        <p>No transactions found</p>
                        <p className="text-sm">Your transaction history will appear here</p>
                      </td>
                    </tr> */}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
