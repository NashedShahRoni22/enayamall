import React, { useState } from 'react'
import { Info, Package, Wallet } from 'lucide-react'
import TrackingIdScreen from './TrackingIdScreen'
import AffiliateInFormationScreen from './AffiliateInFormationScreen'
import BalanceTransectionScreen from './BalanceTransectionScreen'

export default function AffiliateScreen({affiliatedUserData, affiliatedUserDetails}) {
  const [activeTab, setActiveTab] = useState('information');
  const walletBalance = affiliatedUserDetails?.wallet_balance

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
          <AffiliateInFormationScreen affiliatedUserData={affiliatedUserData} affiliatedUserDetails={affiliatedUserDetails}/>
        )
      
      case 'tracking':
        return <TrackingIdScreen affiliateCode={affiliatedUserData?.affiliate_code} />
      
      case 'balance-transaction':
        return (
          <BalanceTransectionScreen walletBalance={walletBalance}/>
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