import React, { useState } from 'react'
import { Edit2, Save, X } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { usePostDataWithToken } from '../helpers/usePostDataWithToken';
import { useAppContext } from '@/app/context/AppContext';

export default function AffiliateInFormationScreen({ affiliatedUserData, affiliatedUserDetails }) {
    const { token } = useAppContext()
    // to refetch data 
    const queryClient = useQueryClient();
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false)

    // manage form here 
    const [formData, setFormData] = useState({
        account_name: affiliatedUserDetails?.account_name || '',
        account_number: affiliatedUserDetails?.account_number || '',
        additional_info: affiliatedUserDetails?.additional_info || '',
        bank_name: affiliatedUserDetails?.bank_name || '',
        branch_number: affiliatedUserDetails?.branch_number || '',
        cheque_payee_name: affiliatedUserDetails?.cheque_payee_name || '',
        commission_percentage: affiliatedUserDetails?.commission_percentage || '0.00',
        company_name: affiliatedUserDetails?.company_name || '',
        company_website: affiliatedUserDetails?.company_website || '',
        payment_method: affiliatedUserDetails?.payment_method || 1,
        paypal_email: affiliatedUserDetails?.paypal_email || '',
        swift_code: affiliatedUserDetails?.swift_code || '',
        tax_id: affiliatedUserDetails?.tax_id || '',
        wallet_balance: affiliatedUserDetails?.wallet_balance || 0
    })

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const postAffiliateUpdate = usePostDataWithToken("update-affiliate-info");
    const handleSave = async () => {
        setLoading(true);

        try {
            const apiFormData = new FormData();
            apiFormData.append('company_name', formData.company_name);
            apiFormData.append('company_website', formData.company_website);
            apiFormData.append('tax_id', formData.tax_id);
            apiFormData.append('payment_method', formData.payment_method);
            apiFormData.append('cheque_payee_name', formData.cheque_payee_name);
            apiFormData.append('paypal_email', formData.paypal_email);
            apiFormData.append('bank_name', formData.bank_name);
            apiFormData.append('branch_number', formData.branch_number);
            apiFormData.append('swift_code', formData.swift_code);
            apiFormData.append('account_name', formData.account_name);
            apiFormData.append('account_number', formData.account_number);
            apiFormData.append('additional_info', formData.additional_info);

            await toast.promise(
                postAffiliateUpdate.mutateAsync({
                    endpoint: 'update-affiliate-info',
                    formData: apiFormData,
                    token,
                }),
                {
                    loading: 'Updating affiliate information...',
                    success: 'Affiliate information updated successfully!',
                    error: (err) => err.message || 'Failed to update affiliate information',
                }
            );

            await queryClient.invalidateQueries({ queryKey: ['get-affiliate-info'] });

            setIsEditing(false);
            console.log('Affiliate information updated successfully.');

        } catch (error) {
            console.error('Error updating affiliate info:', error);
        } finally {
            setLoading(false);
        }
    };



    const handleCancel = () => {
        // Reset form data to original values
        setFormData({
            account_name: affiliatedUserDetails?.account_name || '',
            account_number: affiliatedUserDetails?.account_number || '',
            additional_info: affiliatedUserDetails?.additional_info || '',
            bank_name: affiliatedUserDetails?.bank_name || '',
            branch_number: affiliatedUserDetails?.branch_number || '',
            cheque_payee_name: affiliatedUserDetails?.cheque_payee_name || '',
            commission_percentage: affiliatedUserDetails?.commission_percentage || '0.00',
            company_name: affiliatedUserDetails?.company_name || '',
            company_website: affiliatedUserDetails?.company_website || '',
            payment_method: affiliatedUserDetails?.payment_method || 1,
            paypal_email: affiliatedUserDetails?.paypal_email || '',
            swift_code: affiliatedUserDetails?.swift_code || '',
            tax_id: affiliatedUserDetails?.tax_id || '',
            wallet_balance: affiliatedUserDetails?.wallet_balance || 0
        })
        setIsEditing(false)
    }

    const ReadOnlyField = ({ label, value, bgColor = "bg-blue-50" }) => (
        <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">{label}:</label>
            <p className={`text-gray-900 ${bgColor} px-3 py-2 rounded-md border-l-4 border-blue-400`}>
                {value || 'N/A'}
            </p>
        </div>
    )

    return (
        <div className="space-y-6">
            {/* Affiliate Information Section */}
            <div className="p-6 bg-white rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Affiliate Information</h3>
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600">Affiliate Status:</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${affiliatedUserData?.is_affiliated
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                            }`}>
                            {affiliatedUserData?.is_affiliated ? 'Active' : 'Inactive'}
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <div className='flex flex-col'>
                            <span className="text-gray-600">Affiliate Code:</span>
                            <small className='text-gray-500'>Use this code also as referral code to join someone as affiliate.</small>
                        </div>
                        <span className="font-mono bg-gray-100 px-3 py-1 rounded">
                            {affiliatedUserData?.affiliate_code || 'N/A'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Account Details Section */}
            <div className="p-6 bg-white rounded-lg border border-gray-200">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-800">Account Details</h3>

                    {!isEditing ? (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="flex items-center gap-2 px-2.5 py-1.5 cursor-pointer bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                        >
                            <Edit2 size={16} />
                            Edit
                        </button>
                    ) : (
                        <div className="flex gap-2">
                            <button
                                onClick={handleSave}
                                className="flex items-center gap-2 px-2.5 py-1.5 cursor-pointer bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
                            >
                                <Save size={16} />
                                Save
                            </button>
                            <button
                                onClick={handleCancel}
                                className="flex items-center gap-2 px-2.5 py-1.5 cursor-pointer bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors text-sm"
                            >
                                <X size={16} />
                                Cancel
                            </button>
                        </div>
                    )}
                </div>

                <div className='flex flex-col gap-3 mb-3 md:flex-row'>
                    {/* Commission Percentage - Interactive Read-only */}
                    <div className="space-y-1 flex-1">
                        <label className="text-sm font-medium text-gray-700">Commission Percentage:</label>
                        <div className="relative bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                                    <span className="text-lg font-bold text-green-800">
                                        {formData.commission_percentage || '0.00'}%
                                    </span>
                                </div>
                                <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                                    Active Rate
                                </span>
                            </div>
                            <div className="mt-2 h-2 bg-green-200 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-1000"
                                    style={{ width: `${Math.min(parseFloat(formData.commission_percentage) || 0, 100)}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>

                    {/* Wallet Balance - Interactive Read-only */}
                    <div className="space-y-1 flex-1">
                        <label className="text-sm font-medium text-gray-700">Wallet Balance:</label>
                        <div className="relative bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                        <span className="dirham-symbol text-[12px] md:text-[16px] text-white">ê</span>
                                    </div>
                                    <div>
                                        <span className="text-2xl font-bold text-blue-800">
                                            {parseFloat(formData.wallet_balance || 0).toLocaleString('en-US', {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2
                                            })}
                                        </span>
                                        <p className="text-xs text-blue-600">Available Balance</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="w-12 h-12 relative">
                                        <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
                                            <path
                                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                                fill="none"
                                                stroke="#e5e7eb"
                                                strokeWidth="3"
                                            />
                                            <path
                                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                                fill="none"
                                                stroke="#3b82f6"
                                                strokeWidth="3"
                                                strokeDasharray={`${Math.min((parseFloat(formData.wallet_balance) || 0) / 1000 * 100, 100)}, 100`}
                                                className="transition-all duration-1000"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            {parseFloat(formData.wallet_balance || 0) > 0 && (
                                <div className="mt-3 flex items-center gap-2 text-xs text-blue-600">
                                    <div className="flex-1 bg-blue-200 h-1 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-blue-500 rounded-full animate-pulse"
                                            style={{ width: `${Math.min((parseFloat(formData.wallet_balance) || 0) / 1000 * 100, 100)}%` }}
                                        ></div>
                                    </div>
                                    <span>Earning Progress</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Read-only fields with distinct styling */}
                    <div className="space-y-4">
                        <h4 className="text-md font-medium text-gray-800 mb-3 border-b pb-2">Affiliate Settings (Read Only)</h4>
                        <ReadOnlyField
                            label="Affiliate Code"
                            value={affiliatedUserDetails?.affiliate_code}
                            bgColor="bg-amber-50"
                        />
                        <ReadOnlyField
                            label="Affiliated By"
                            value={affiliatedUserDetails?.affiliated_by}
                            bgColor="bg-amber-50"
                        />
                        <ReadOnlyField
                            label="Affiliated Commission Percentage"
                            value={`${affiliatedUserDetails?.affiliated_commission_percentage || '0.00'}%`}
                            bgColor="bg-amber-50"
                        />
                    </div>

                    {/* Editable fields */}
                    <div className="space-y-4">
                        <h4 className="text-md font-medium text-gray-800 mb-3 border-b pb-2">General Information</h4>

                        {/* Account Name */}
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Account Name:</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={formData.account_name}
                                    onChange={(e) => handleInputChange('account_name', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter account name"
                                />
                            ) : (
                                <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                                    {formData.account_name || 'N/A'}
                                </p>
                            )}
                        </div>

                        {/* Account Number */}
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Account Number:</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={formData.account_number}
                                    onChange={(e) => handleInputChange('account_number', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter account number"
                                />
                            ) : (
                                <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                                    {formData.account_number || 'N/A'}
                                </p>
                            )}
                        </div>

                        {/* Company Name */}
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Company Name:</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={formData.company_name}
                                    onChange={(e) => handleInputChange('company_name', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter company name"
                                />
                            ) : (
                                <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                                    {formData.company_name || 'N/A'}
                                </p>
                            )}
                        </div>

                        {/* Company Website */}
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Company Website:</label>
                            {isEditing ? (
                                <input
                                    type="url"
                                    value={formData.company_website}
                                    onChange={(e) => handleInputChange('company_website', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="https://example.com"
                                />
                            ) : (
                                <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                                    {formData.company_website || 'N/A'}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Banking Information */}
                    <div className="space-y-4">
                        <h4 className="text-md font-medium text-gray-800 mb-3 border-b pb-2">Banking Information</h4>

                        {/* Bank Name */}
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Bank Name:</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={formData.bank_name}
                                    onChange={(e) => handleInputChange('bank_name', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter bank name"
                                />
                            ) : (
                                <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                                    {formData.bank_name || 'N/A'}
                                </p>
                            )}
                        </div>

                        {/* Branch Number */}
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Branch Number:</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={formData.branch_number}
                                    onChange={(e) => handleInputChange('branch_number', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter branch number"
                                />
                            ) : (
                                <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                                    {formData.branch_number || 'N/A'}
                                </p>
                            )}
                        </div>

                        {/* Swift Code */}
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Swift Code:</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={formData.swift_code}
                                    onChange={(e) => handleInputChange('swift_code', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter SWIFT code"
                                />
                            ) : (
                                <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                                    {formData.swift_code || 'N/A'}
                                </p>
                            )}
                        </div>

                        {/* Cheque Payee Name */}
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Cheque Payee Name:</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={formData.cheque_payee_name}
                                    onChange={(e) => handleInputChange('cheque_payee_name', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter payee name"
                                />
                            ) : (
                                <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                                    {formData.cheque_payee_name || 'N/A'}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Payment & Other Details */}
                    <div className="space-y-4">
                        <h4 className="text-md font-medium text-gray-800 mb-3 border-b pb-2">Payment & Other Details</h4>

                        {/* PayPal Email */}
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">PayPal Email:</label>
                            {isEditing ? (
                                <input
                                    type="email"
                                    value={formData.paypal_email}
                                    onChange={(e) => handleInputChange('paypal_email', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter PayPal email"
                                />
                            ) : (
                                <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                                    {formData.paypal_email || 'N/A'}
                                </p>
                            )}
                        </div>

                        {/* Tax ID */}
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Tax ID:</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={formData.tax_id}
                                    onChange={(e) => handleInputChange('tax_id', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter tax ID"
                                />
                            ) : (
                                <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                                    {formData.tax_id || 'N/A'}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Additional Information - Full Width */}
                    <div className="md:col-span-2 space-y-4">
                        <h4 className="text-md font-medium text-gray-800 mb-3 border-b pb-2">Additional Information</h4>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Additional Info:</label>
                            {isEditing ? (
                                <textarea
                                    value={formData.additional_info}
                                    onChange={(e) => handleInputChange('additional_info', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    rows={3}
                                    placeholder="Enter additional information"
                                />
                            ) : (
                                <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md min-h-[80px]">
                                    {formData.additional_info || 'N/A'}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}