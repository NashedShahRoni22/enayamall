"use client"
import Link from 'next/link'
import React, { useState } from 'react'
import { usePostData } from '../helpers/usePostData';
import toast from 'react-hot-toast';
import { useAppContext } from '@/app/context/AppContext';
import LoadingSvg from '../shared/LoadingSvg';
import translations from "@/app/locales/translations.json";

export default function RecoverPasswordForm() {
    const { lang } = useAppContext();
    const [loading, setLoading] = useState(false);
    const t = (key) => translations[key]?.[lang] || translations[key]?.en || key;

    // Error state for form validation
    const [errors, setErrors] = useState({});

    // Form state
    const [form, setForm] = useState({
        email: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));

        // Clear error when user starts typing
        setErrors(prev => ({ ...prev, [name]: "" }));
    };

    // Validation function
    const validateForm = () => {
        const newErrors = {};

        if (!form.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(form.email)) {
            newErrors.email = "Please enter a valid email address";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const postForgotPassword = usePostData('forgot-password');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);
        toast.loading('Sending recovery email...', { id: 'forgot-password' });

        const formData = new FormData();
        formData.append('email', form.email);

        try {
            const response = await postForgotPassword.mutateAsync(formData);

            setLoading(false);

            // Check the response status
            if (response.status === 'error') {
                toast.error(response.message || 'Failed to send recovery email', { id: 'forgot-password' });
                return;
            }

            // Success case
            toast.success(response.message || 'Password recovery email sent! Please check your inbox.', { id: 'forgot-password' });

            // ✅ Reset form
            setForm({ email: '' });
        } catch (error) {
            setLoading(false);

            // Handle different types of errors
            let errorMessage = 'Failed to send recovery email';

            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.message) {
                errorMessage = error.message;
            }

            toast.error(errorMessage, { id: 'forgot-password' });
        }
    };

    return (
        <div>
            <h5 className={`text-[24px] sm:text-[26px] text-primaryblack flex flex-col ${lang === "en" ? "flex-row" : "flex-row-reverse text-right"}`}>
                Recover Password
            </h5>
            <p className={`text-[16px] sm:text-[18px] text-ash mt-[30px] flex flex-col ${lang === "en" ? "flex-row" : "flex-row-reverse text-right"}`}>
                Enter your email address and we'll send you a link to reset your password.
            </p>

            <div className='mt-[50px]'>
                <form onSubmit={handleSubmit}>
                    {/* Email */}
                    <label className="flex justify-between font-medium text-gray-700">
                        <p className='text-[16px] sm:text-[18px] text-ash'>
                            Email Address <span className="text-button">*</span>
                        </p>
                        {errors.email && (
                            <span className="text-button ml-2">{errors.email}</span>
                        )}
                    </label>
                    <input
                        type="text"
                        name="email"
                        placeholder="Enter your email address"
                        value={form.email}
                        onChange={handleChange}
                        className={`text-[14px] sm:text-[16px] rounded-xl text-primaryblack py-[12px] px-[10px] sm:px-[20px] focus:outline-none border ${errors.email ? "border-button" : "border-creamline"} rounded-[5px] mt-[20px] w-full`}
                    />

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className={`py-[12px] text-[14px] sm:text-[16px] bg-primary text-white rounded-xl mt-[40px] w-full ${loading ? 'cursor-not-allowed bg-creamline' : 'cursor-pointer'}`}
                        disabled={postForgotPassword.isLoading || loading}
                    >
                        {!loading ? "Send Recovery Email" : null}

                        {loading && <LoadingSvg label="Sending..." color="text-white" />}
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