import { useAppContext } from "@/app/context/AppContext";
import { useEffect, useState } from "react";
import AffiliateScreen from "./AffiliateScreen";

export default function Affiliate() {
    const { token } = useAppContext();
    const [isAffiliated, setIsAffiliated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [hasRequested, setHasRequested] = useState(false);
    const [referralCode, setReferralCode] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState("");
    const [affiliatedUserData, setAffiliatedUserData] = useState("");

    // Function to check if customer is affiliated
    const checkAffiliateStatus = async (authToken) => {
        setIsLoading(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_WEB_API_BASE_URL}check-if-the-customer-is-affiliated`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Affiliate API Response:', data);

            if (data.status === "success") {
                setAffiliatedUserData(data?.data)
                const { is_affiliated, requested } = data.data;
                setIsAffiliated(is_affiliated);
                setHasRequested(requested);
            } else {
                setIsAffiliated(false);
                setHasRequested(false);
            }

        } catch (error) {
            setIsAffiliated(false);
            setHasRequested(false);
        } finally {
            setIsLoading(false);
        }
    };

    // Function to request affiliate status
    const requestAffiliate = async (e) => {
        e.preventDefault();

        setIsSubmitting(true);
        setSubmitMessage("");

        try {
            const formData = new FormData();
            formData.append('affiliated', '1');
            if (referralCode.trim()) {
                formData.append('referral_code', referralCode.trim());
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_WEB_API_BASE_URL}request_for_affiliate`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.status === "success") {
                setSubmitMessage("Affiliate request submitted successfully!");
                setHasRequested(true);
                setTimeout(() => {
                    checkAffiliateStatus(token);
                }, 2000);
            } else {
                setSubmitMessage(data.message || "Failed to submit affiliate request");
            }

        } catch (error) {
            console.error('Error requesting affiliate status:', error);
            setSubmitMessage("Error submitting affiliate request. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Check affiliate status when component mounts or when token changes
    useEffect(() => {
        if (token) {
            checkAffiliateStatus(token);
        } else {
            setIsLoading(false);
            setIsAffiliated(false);
            setHasRequested(false);
        }
    }, [token]);

    // Loading screen
    if (isLoading) {
        return (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <span className="ml-3 text-gray-600">Checking affiliate status...</span>
                </div>
            </div>
        );
    }

    // If user is affiliated - show success message
    if (isAffiliated) {
        return (
            <AffiliateScreen affiliatedUserData={affiliatedUserData}/>
        );
    }

    // If user has requested but not approved yet - show waiting message
    if (hasRequested && !isAffiliated) {
        return (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-lg text-center">
                <h3 className="font-semibold">⏳ Request Pending</h3>
                <p className="mt-2">Your affiliate request has been submitted and is pending admin approval. Please wait for confirmation.</p>
            </div>
        );
    }

    // Don't render anything if no token
    if (!token) {
        return null;
    }

    // Only show form if user is not affiliated and has not requested yet
    return (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Become Affiliate User</h3>
            <p className="text-gray-600 mb-4">
                Join our affiliate program and start earning commissions on referrals!
            </p>

            <form onSubmit={requestAffiliate} className="space-y-4">
                <div>
                    <label htmlFor="referralCode" className="block text-sm font-medium text-gray-700 mb-2">
                        Referral Code (Optional)
                    </label>
                    <input
                        type="text"
                        id="referralCode"
                        value={referralCode}
                        onChange={(e) => setReferralCode(e.target.value)}
                        placeholder="Enter referral code if you have one"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        If you were referred by someone, enter their referral code here
                    </p>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting || !token}
                    className={`w-full py-2 px-4 rounded-md font-medium ${
                        isSubmitting || !token
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-primary'
                    } text-white transition duration-200`}
                >
                    {isSubmitting ? 'Joining...' : 'Join Now'}
                </button>

                {submitMessage && (
                    <div className={`p-3 rounded-md text-sm ${
                        submitMessage.toLowerCase().includes('successfully')
                            ? 'bg-green-100 text-green-700 border border-green-400'
                            : 'bg-red-100 text-red-700 border border-red-400'
                    }`}>
                        {submitMessage}
                    </div>
                )}
            </form>
        </div>
    );
}
