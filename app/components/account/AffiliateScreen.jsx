import React, { useState } from 'react'
import { Info, Package, Wallet, Receipt } from 'lucide-react'
import TrackingIdScreen from './TrackingIdScreen'

export default function AffiliateScreen({affiliatedUserData}) {
  const [activeTab, setActiveTab] = useState('information')

  const tabs = [
    {
      id: 'information',
      label: 'Information',
      icon: Info
    },
    {
      id: 'tracking',
      label: 'Tracking ID',
      icon: Package
    },
    {
      id: 'balance-transaction',
      label: 'Balance & Transaction',
      icon: Wallet
    }
  ]

  const renderTabContent = () => {
    switch(activeTab) {
      case 'information':
        return (
          <div className="p-6 bg-white rounded-lg border border-creamline">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Affiliate Information</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Affiliate Status:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  affiliatedUserData?.is_affiliated 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {affiliatedUserData?.is_affiliated ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Affiliate Code:</span>
                <span className="font-mono bg-gray-100 px-3 py-1 rounded">
                  {affiliatedUserData?.affiliate_code || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Request Status:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  affiliatedUserData?.requested 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {affiliatedUserData?.requested ? 'Requested' : 'Not Requested'}
                </span>
              </div>
            </div>
          </div>
        )
      
      case 'tracking':
        return <TrackingIdScreen affiliateCode={affiliatedUserData?.affiliate_code} />
      
      case 'balance-transaction':
        return (
          <div className="space-y-6">
            {/* Balance Section */}
            <div className="p-6 bg-white rounded-lg border border-creamline">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Balance Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 className="text-sm text-green-600 font-medium">Available Balance</h4>
                  <p className="text-2xl font-bold text-green-700">$0.00</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <h4 className="text-sm text-yellow-600 font-medium">Pending Balance</h4>
                  <p className="text-2xl font-bold text-yellow-700">$0.00</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="text-sm text-primary font-medium">Total Earned</h4>
                  <p className="text-2xl font-bold text-primary">$0.00</p>
                </div>
              </div>
            </div>

            {/* Transaction Section */}
            <div className="p-6 bg-white rounded-lg border border-creamline">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Transaction History</h3>
              
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
                      <td className="py-3 px-4 text-gray-700">$25.50</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Completed
                        </span>
                      </td>
                    </tr>
                    <tr className="border-b border-creamline hover:bg-gray-50">
                      <td className="py-3 px-4 text-gray-700">2024-01-12</td>
                      <td className="py-3 px-4 text-gray-700">$15.75</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Pending
                        </span>
                      </td>
                    </tr>
                    <tr className="border-b border-creamline hover:bg-gray-50">
                      <td className="py-3 px-4 text-gray-700">2024-01-10</td>
                      <td className="py-3 px-4 text-gray-700">$32.25</td>
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
      
      default:
        return null
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Tab Navigation */}
      <div className="bg-white rounded-lg border border-creamline mb-6">
        <div className="border-b border-creamline">
          <nav className="-mb-px flex space-x-8 px-6 justify-between" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`cursor-pointer group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className={`mr-2 h-5 w-5 ${
                    activeTab === tab.id ? 'text-primary' : 'text-gray-400 group-hover:text-gray-500'
                  }`} />
                  {tab.label}
                </button>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="transition-all duration-300 ease-in-out">
        {renderTabContent()}
      </div>
    </div>
  )
}