"use client"
import React, { useState, useEffect } from 'react'
import { usePostData } from '../helpers/usePostData';
import toast from 'react-hot-toast';
import { useRouter, useSearchParams } from 'next/navigation'
import { useAppContext } from '@/app/context/AppContext';
import { usePostDataWithToken } from '../helpers/usePostDataWithToken';
import { useQueryClient } from '@tanstack/react-query';
import LoadingSvg from '../shared/LoadingSvg';
import teletalkLogo from "../../resources/operators/teletalk logo.png";
import robiLogo from "../../resources/operators/robi logo.png";
import airtelLogo from "../../resources/operators/airtel logo.jpg";
import blkLogo from "../../resources/operators/bl logo.png";
import gpLogo from "../../resources/operators/gp logo.png";
import Image from 'next/image';

export default function SignInWithPhone({ option }) {
    const [otpSent, setOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [timer, setTimer] = useState(0); // Timer state in seconds
    const router = useRouter();
    const searchParams = useSearchParams();
    const { setUser, setToken, guestToken } = useAppContext();
    const queryClient = useQueryClient();

    // Error state for form validation
    const [errors, setErrors] = useState({});

    // Timer effect - countdown every second
    useEffect(() => {
        let interval = null;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer(timer => timer - 1);
            }, 1000);
        } else if (timer === 0) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [timer]);

    // Format timer display (MM:SS)
    const formatTimer = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    // Get operator logo based on phone number
    const getOperatorLogo = (phoneNumber) => {
        const number = phoneNumber.replace(/\D/g, '');
        if (number.length < 3) return null;

        const prefix = number.substring(0, 3);

        // Bangladeshi operators
        if (['017', '013'].includes(prefix)) {
            return { logo: gpLogo, name: 'Grameenphone' };
        } else if (['014', '019'].includes(prefix)) {
            return { logo: blkLogo, name: 'Banglalink' };
        } else if (['018'].includes(prefix)) {
            return { logo: robiLogo, name: 'Robi' };
        } else if (['015'].includes(prefix)) {
            return { logo: teletalkLogo, name: 'Teletalk' };
        } else if (['016'].includes(prefix)) {
            return { logo: airtelLogo, name: 'Airtel' };
        }

        return null;
    };

    // Format phone number - only allow 11 digits
    const formatPhoneNumber = (value) => {
        const numbers = value.replace(/\D/g, '');
        return numbers.slice(0, 11);
    };

    // OTP form state
    const [otpForm, setOtpForm] = useState({
        phone: '',
        otp: ''
    });

    const handleOtpChange = (e) => {
        const { name, value } = e.target;

        if (name === 'phone') {
            const formatted = formatPhoneNumber(value);
            setOtpForm(prev => ({ ...prev, [name]: formatted }));
        } else {
            setOtpForm(prev => ({ ...prev, [name]: value }));
        }

        // Clear error when user starts typing
        setErrors(prev => ({ ...prev, [name]: "" }));
    };

    // Validation function
    const validateForm = () => {
        const newErrors = {};

        if (!otpForm.phone.trim()) {
            newErrors.phone = "Phone number is required";
        } else if (otpForm.phone.length !== 11) {
            newErrors.phone = "Please enter a valid 11-digit phone number";
        }

        if (otpSent && (!otpForm.otp || otpForm.otp.length < 4)) {
            newErrors.otp = "Please enter a valid OTP";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const postRequestOtp = usePostData(`login/request-otp?${otpForm.phone}`);
    const postVerifyOtp = usePostData('login/verify-otp');
    const postCartSync = usePostDataWithToken('add-to-cart-from-guest');

    // Handle OTP request
    const handleRequestOtp = (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);

        const formData = new FormData();
        formData.append('phone', `${otpForm.phone}`);

        toast.promise(
            postRequestOtp.mutateAsync(formData)
                .then((data) => {
                    setOtpSent(true);
                    setTimer(120); // Set 2 minutes timer (120 seconds)
                    setLoading(false);
                }),
            {
                loading: 'Sending OTP...',
                success: "OTP sent successfully, It'll be valid for 2 minutes",
                error: (err) => {
                    setLoading(false);
                    return err.message || 'Failed to send OTP'
                },
            }
        );
    };

    // Handle OTP verification and complete login flow
    const handleVerifyOtp = (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);

        const formData = new FormData();
        formData.append('phone', `${otpForm.phone}`);
        formData.append('otp', otpForm.otp);

        toast.promise(
            postVerifyOtp.mutateAsync(formData)
                .then(async (data) => {
                    const jsonData = data?.data;
                    const authToken = jsonData.token;

                    // ✅ Save to localStorage
                    localStorage.setItem('EnayamallUser', JSON.stringify(jsonData.details));
                    localStorage.setItem('EnayamallAuthToken', authToken);

                    // ✅ Set global user state
                    setUser(jsonData.details);
                    setToken(authToken);

                    // ✅ Reset form and timer
                    setOtpForm({ phone: '', otp: '' });
                    setOtpSent(false);
                    setTimer(0);
                    setLoading(false);

                    // ✅ Sync cart using guestToken if it exists
                    if (guestToken) {
                        const cartFormData = new FormData();
                        cartFormData.append('guest_token', guestToken);

                        try {
                            // Pass formData with guest_token and auth token to the mutation
                            await postCartSync.mutateAsync({
                                formData: cartFormData,
                                token: authToken
                            });

                            // ✅ Invalidate and refetch cart data
                            await queryClient.invalidateQueries({ queryKey: ['cart'] });
                        } catch (error) {
                            console.error('Cart sync failed:', error);
                        }
                    }

                    // ✅ Redirect to previous or default page
                    const redirectTo = searchParams.get('redirect') || '/';
                    router.push(redirectTo);
                }),
            {
                loading: 'Verifying OTP...',
                success: 'Signed in successfully!',
                error: (err) => {
                    setLoading(false)
                    return err.message || 'OTP verification failed'
                },
            }
        );
    };

    // Handle resend OTP
    const handleResendOtp = () => {
        setOtpSent(false);
        setOtpForm(prev => ({ ...prev, otp: '' }));
        setTimer(0);
        setErrors(prev => ({ ...prev, otp: "" }));
    };

    const operatorInfo = getOperatorLogo(otpForm.phone);

    return (
        <form onSubmit={otpSent ? handleVerifyOtp : handleRequestOtp}>
            {/* Phone Number Input */}
            <label className="flex justify-between font-medium text-gray-700">
                <p className='text-[16px] sm:text-[18px] text-ash'>
                    Phone Number <span className="text-button">*</span>
                </p>
                {errors.phone && (
                    <span className="text-button ml-2">{errors.phone}</span>
                )}
            </label>
            
            <div className='relative mt-[20px]'>
                <div className='absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2 z-10'>
                    <span className='text-[14px] sm:text-[16px] text-ash font-medium'>+88</span>
                    {operatorInfo && (
                        <div className='w-5 h-5 sm:w-6 sm:h-6 relative flex-shrink-0'>
                            <Image
                                src={operatorInfo.logo}
                                alt={operatorInfo.name}
                                fill
                                className='object-contain rounded-sm p-0.5'
                            />
                        </div>
                    )}
                </div>
                <input
                    type="tel"
                    name="phone"
                    value={otpForm.phone}
                    onChange={handleOtpChange}
                    placeholder='Enter 11-digit phone number'
                    className={`text-[14px] sm:text-[16px] rounded-xl text-primaryblack py-[12px] pl-[70px] sm:pl-[85px] pr-[15px] sm:pr-[20px] focus:outline-none border ${errors.phone ? "border-button" : "border-creamline"} rounded-[5px] w-full`}
                    maxLength="11"
                    disabled={otpSent}
                />
            </div>

            {/* OTP Input - Shows only after OTP is sent */}
            {otpSent && (
                <div className='mt-[20px]'>
                    <label className="flex justify-between font-medium text-gray-700">
                        <p className='text-[16px] sm:text-[18px] text-ash'>
                            Enter OTP <span className="text-button">*</span>
                        </p>
                        {errors.otp && (
                            <span className="text-button ml-2">{errors.otp}</span>
                        )}
                    </label>
                    <input
                        type="text"
                        name="otp"
                        value={otpForm.otp}
                        onChange={handleOtpChange}
                        placeholder='Enter your OTP code number'
                        className={`text-[14px] sm:text-[16px] text-primaryblack py-[12px] sm:py-[24px] px-[10px] sm:px-[20px] focus:outline-none border ${errors.otp ? "border-button" : "border-creamline"} rounded-[5px] mt-[20px] w-full`}
                        maxLength="6"
                        required
                    />
                </div>
            )}

            {/* Submit Button */}
            <button
                type="submit"
                className={`py-[12px] text-[14px] rounded-xl sm:text-[16px] ${option === 1 ? "bg-primary text-white" : "bg-creamline"} rounded mt-[40px] w-full ${loading ? 'cursor-not-allowed bg-creamline' : 'cursor-pointer'}`}
                disabled={postRequestOtp.isLoading || postVerifyOtp.isLoading || loading}
            >
                {!loading ? otpSent ? 'Verify OTP' : 'Send OTP' : null}

                {
                    loading && <LoadingSvg label={otpSent ? 'Verifying OTP' : 'Sending OTP'} color='text-white' />
                }
            </button>

            {/* Resend OTP option with timer */}
            {otpSent && (
                <div className='text-center mt-[20px]'>
                    {timer > 0 ? (
                        <div className='text-ash text-[14px] sm:text-[16px]'>
                            <p>Didn't receive OTP?</p>
                            <p className='text-primaryblack font-medium'>
                                Try again in {formatTimer(timer)}
                            </p>
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={handleResendOtp}
                            className='text-natural hover:underline text-[14px] sm:text-[16px]'
                        >
                            Didn't receive OTP? Try again
                        </button>
                    )}
                </div>
            )}
        </form>
    )
}