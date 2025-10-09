import React, { useState } from 'react'
import { Edit2, Save, X } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { usePostDataWithToken } from '../helpers/usePostDataWithToken';
import { useAppContext } from '@/app/context/AppContext';

export default function AffiliateInFormationScreen({ affiliatedUserData, affiliatedUserDetails }) {
    console.log('====================================');
    console.log(affiliatedUserData);
    console.log('====================================');
    console.log('====================================');
    console.log(affiliatedUserDetails);
    console.log('====================================');
    
    const { token } = useAppContext()
    const queryClient = useQueryClient();
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false)

    // Payment method options
    const paymentMethods = [
        { value: 1, label: 'Bank Transfer' },
        { value: 2, label: 'PayPal' },
        { value: 3, label: 'Cheque' }
    ];

    // Manage form here 
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
            
            // Only append relevant payment fields based on payment method
            if (formData.payment_method == 2) { // PayPal
                apiFormData.append('paypal_email', formData.paypal_email);
            } else if (formData.payment_method == 3) { // Cheque
                apiFormData.append('cheque_payee_name', formData.cheque_payee_name);
            } else { // Bank Transfer
                apiFormData.append('bank_name', formData.bank_name);
                apiFormData.append('branch_number', formData.branch_number);
                apiFormData.append('swift_code', formData.swift_code);
                apiFormData.append('account_name', formData.account_name);
                apiFormData.append('account_number', formData.account_number);
            }
            
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

    const getPaymentMethodLabel = (value) => {
        const method = paymentMethods.find(m => m.value == value);
        return method ? method.label : 'Unknown';
    }

    const renderPaymentMethodFields = () => {
        const paymentMethod = parseInt(formData.payment_method);
        
        if (paymentMethod === 2) { // PayPal
            return (
                <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">PayPal Email:</label>
                    {isEditing ? (
                        <input
                            type="email"
                            value={formData.paypal_email}
                            onChange={(e) => handleInputChange('paypal_email', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter PayPal email"
                            required
                        />
                    ) : (
                        <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                            {formData.paypal_email || 'N/A'}
                        </p>
                    )}
                </div>
            );
        } else if (paymentMethod === 3) { // Cheque
            return (
                <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Cheque Payee Name:</label>
                    {isEditing ? (
                        <input
                            type="text"
                            value={formData.cheque_payee_name}
                            onChange={(e) => handleInputChange('cheque_payee_name', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter payee name"
                            required
                        />
                    ) : (
                        <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                            {formData.cheque_payee_name || 'N/A'}
                        </p>
                    )}
                </div>
            );
        } else { // Bank Transfer
            return (
                <div className="space-y-4">
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
                                required
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
                                required
                            />
                        ) : (
                            <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                                {formData.account_number || 'N/A'}
                            </p>
                        )}
                    </div>

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
                                required
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
                </div>
            );
        }
    };

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
                                disabled={loading}
                                className="flex items-center gap-2 px-2.5 py-1.5 cursor-pointer bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm disabled:opacity-50"
                            >
                                <Save size={16} />
                                {loading ? 'Saving...' : 'Save'}
                            </button>
                            <button
                                onClick={handleCancel}
                                disabled={loading}
                                className="flex items-center gap-2 px-2.5 py-1.5 cursor-pointer bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors text-sm disabled:opacity-50"
                            >
                                <X size={16} />
                                Cancel
                            </button>
                        </div>
                    )}
                </div>

                {/* Read-only Commission and Balance Section */}
                

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Read-only Affiliate Settings */}
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
                            value={`${affiliatedUserDetails?.commission_percentage || '0.00'}%`}
                            bgColor="bg-amber-50"
                        />
                    </div>

                    {/* Editable Company Information */}
                    <div className="space-y-4">
                        <h4 className="text-md font-medium text-gray-800 mb-3 border-b pb-2">Company Information</h4>

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

                    {/* Payment Information */}
                    <div className="md:col-span-2 space-y-4">
                        <h4 className="text-md font-medium text-gray-800 mb-3 border-b pb-2">Payment Information</h4>
                        
                        {/* Payment Method Selection */}
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Payment Method:</label>
                            {isEditing ? (
                                <select
                                    value={formData.payment_method}
                                    onChange={(e) => handleInputChange('payment_method', parseInt(e.target.value))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    {paymentMethods.map(method => (
                                        <option key={method.value} value={method.value}>
                                            {method.label}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                                    {getPaymentMethodLabel(formData.payment_method)}
                                </p>
                            )}
                        </div>

                        {/* Dynamic Payment Method Fields */}
                        <div className="mt-4">
                            {renderPaymentMethodFields()}
                        </div>
                    </div>

                    {/* Additional Information */}
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