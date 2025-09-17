"use client"
import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { usePostData } from '../helpers/usePostData';
import toast from 'react-hot-toast';
import { useAppContext } from '@/app/context/AppContext';
import translations from "@/app/locales/translations.json";

export default function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { lang } = useAppContext();
    const [loading, setLoading] = useState(false);
    const t = (key) => translations[key]?.[lang] || translations[key]?.en || key;

    // Get token and email from URL parameters
    const [urlParams, setUrlParams] = useState({
        token: '',
        email: ''
    });

    // Password visibility states
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Error state for form validation
    const [errors, setErrors] = useState({});

    // Form state
    const [form, setForm] = useState({
        password: '',
        password_confirmation: '',
    });

    // Extract URL parameters on component mount
    useEffect(() => {
        // Extract token from URL path (after password-reset/)
        const pathParts = window.location.pathname.split('/');
        const token = pathParts[pathParts.length - 1] || '';
        
        // Extract email from query parameters
        const email = searchParams.get('email') || '';
        
        setUrlParams({ token, email });

        // Redirect if token or email is missing
        if (!token || !email) {
            toast.error('Invalid reset link. Please request a new password reset.');
            router.push('/login');
        }
    }, [searchParams, router]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        
        // Clear error when user starts typing
        setErrors(prev => ({ ...prev, [name]: "" }));
    };

    // Validation function
    const validateForm = () => {
        const newErrors = {};

        if (!form.password.trim()) {
            newErrors.password = "Password is required";
        } else if (form.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        if (!form.password_confirmation.trim()) {
            newErrors.password_confirmation = "Please confirm your password";
        } else if (form.password !== form.password_confirmation) {
            newErrors.password_confirmation = "Passwords don't match";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const postResetPassword = usePostData('reset-password');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);
        toast.loading('Resetting your password...', { id: 'reset-password' });

        const formData = new FormData();
        formData.append('token', urlParams.token);
        formData.append('email', urlParams.email);
        formData.append('password', form.password);
        formData.append('password_confirmation', form.password_confirmation);

        try {
            const response = await postResetPassword.mutateAsync(formData);
            
            setLoading(false);

            // Check the response status
            if (response.status === 'error') {
                if (response.message === "Unauthenticated Request!") {
                    toast.error('Reset link has expired. Please request a new one.', { id: 'reset-password' });
                    setTimeout(() => {
                        router.push('/login');
                    }, 2000);
                } else {
                    toast.error(response.message || 'Failed to reset password', { id: 'reset-password' });
                }
                return;
            }

            // Success case
            toast.success(response.message || 'Password reset successfully! You can now login with your new password.', { id: 'reset-password' });
            
            // ✅ Reset form
            setForm({ password: '', password_confirmation: '' });

            // ✅ Redirect to login page after successful reset
            setTimeout(() => {
                router.push('/login');
            }, 2000);

        } catch (error) {
            setLoading(false);
            
            // Handle different types of errors
            let errorMessage = 'Failed to reset password';
            
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            toast.error(errorMessage, { id: 'reset-password' });
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    return (
        <div>
            <h5 className={`text-[24px] sm:text-[26px] text-primaryblack flex flex-col ${lang === "en" ? "flex-row" : "flex-row-reverse text-right"}`}>
                Reset Password
            </h5>
            <p className={`text-[16px] sm:text-[18px] text-ash mt-[30px] flex flex-col ${lang === "en" ? "flex-row" : "flex-row-reverse text-right"}`}>
                Enter your new password below. Make sure it's strong and memorable.
            </p>

            <div className='mt-[50px]'>
                <form onSubmit={handleSubmit}>
                    {/* New Password */}
                    <div className="mb-[20px]">
                        <label className="flex justify-between font-medium text-gray-700">
                            <p className='text-[16px] sm:text-[18px] text-ash'>
                                New Password <span className="text-button">*</span>
                            </p>
                            {errors.password && (
                                <span className="text-button ml-2">{errors.password}</span>
                            )}
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Enter your new password"
                                value={form.password}
                                onChange={handleChange}
                                className={`text-[14px] sm:text-[16px] rounded-xl text-primaryblack py-[12px] px-[10px] sm:px-[20px] pr-[50px] focus:outline-none border ${errors.password ? "border-button" : "border-creamline"} rounded-[5px] mt-[20px] w-full`}
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute right-[15px] top-[50%] transform -translate-y-[50%] text-gray-500 hover:text-gray-700 mt-[10px]"
                            >
                                {showPassword ? (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                    </svg>
                                )}
                            </button>
                        </div>
                        {/* Password strength indicator */}
                        {form.password && (
                            <div className="mt-2">
                                <div className="text-xs text-gray-500">
                                    Password length: 
                                    <span className={`ml-1 ${form.password.length >= 6 ? 'text-green-600' : 'text-red-500'}`}>
                                        {form.password.length >= 6 ? 'Good' : 'Too short (min 6 characters)'}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div className="mb-[20px]">
                        <label className="flex justify-between font-medium text-gray-700">
                            <p className='text-[16px] sm:text-[18px] text-ash'>
                                Confirm Password <span className="text-button">*</span>
                            </p>
                            {errors.password_confirmation && (
                                <span className="text-button ml-2">{errors.password_confirmation}</span>
                            )}
                        </label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                name="password_confirmation"
                                placeholder="Confirm your new password"
                                value={form.password_confirmation}
                                onChange={handleChange}
                                className={`text-[14px] sm:text-[16px] rounded-xl text-primaryblack py-[12px] px-[10px] sm:px-[20px] pr-[50px] focus:outline-none border ${errors.password_confirmation ? "border-button" : "border-creamline"} rounded-[5px] mt-[20px] w-full`}
                            />
                            <button
                                type="button"
                                onClick={toggleConfirmPasswordVisibility}
                                className="absolute right-[15px] top-[50%] transform -translate-y-[50%] text-gray-500 hover:text-gray-700 mt-[10px]"
                            >
                                {showConfirmPassword ? (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                    </svg>
                                )}
                            </button>
                        </div>
                        {/* Password match indicator */}
                        {form.password_confirmation && (
                            <div className="mt-2">
                                <div className="text-xs">
                                    <span className={form.password === form.password_confirmation ? 'text-green-600' : 'text-red-500'}>
                                        {form.password === form.password_confirmation ? '✓ Passwords match' : '✗ Passwords don\'t match'}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className={`py-[12px] text-[14px] sm:text-[16px] bg-primary text-white rounded-xl mt-[40px] w-full ${loading ? 'cursor-not-allowed bg-creamline' : 'cursor-pointer'}`}
                        disabled={postResetPassword.isLoading || loading}
                    >
                        {!loading ? "Reset Password" : "Updating Password"}
                    </button>
                </form>

                {/* Back to login link */}
                <p className={`text-primaryblack mt-[20px] sm:mt-[40px] flex flex-col ${lang === "en" ? "flex-row" : "flex-row-reverse"}`}>
                    Remember your password? 
                    <Link href={"/login"} className={`text-primary hover:underline ${lang === "en" ? "ml-2" : "mr-2"}`}>
                        Back to Login
                    </Link>
                </p>
            </div>
        </div>
    )
}