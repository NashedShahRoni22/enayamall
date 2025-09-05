"use client"
import Link from 'next/link'
import { FiEye, FiEyeOff } from 'react-icons/fi';
import React, { useState } from 'react'
import { usePostData } from '../helpers/usePostData';
import toast from 'react-hot-toast';
import { useRouter, useSearchParams } from 'next/navigation'
import { useAppContext } from '@/app/context/AppContext';
import { usePostDataWithToken } from '../helpers/usePostDataWithToken';
import { useQueryClient } from '@tanstack/react-query';
import SignInWithPhone from './SignInWithPhone';
import LoadingSvg from '../shared/LoadingSvg';
import translations from "@/app/locales/translations.json";

export default function Login() {
    const [option, setOption] = useState(1);
    const router = useRouter();
    const searchParams = useSearchParams();
    const { setUser, setToken, lang } = useAppContext();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { guestToken } = useAppContext();
    const t = (key) => translations[key]?.[lang] || translations[key]?.en || key;

    // Error state for form validation
    const [errors, setErrors] = useState({});

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    //managed sign in with password
    const [form, setForm] = useState({
        email: '',
        password: '',
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

        if (!form.password.trim()) {
            newErrors.password = "Password is required";
        } else if (form.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters long";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const postLogin = usePostData('login');
    const postCartSync = usePostDataWithToken('add-to-cart-from-guest');
    const queryClient = useQueryClient();

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);

        const formData = new FormData();
        formData.append('email', form.email);
        formData.append('password', form.password);

        toast.promise(
            postLogin.mutateAsync(formData)
                .then(async (data) => {
                    const jsonData = data?.data;
                    const authToken = jsonData.token;

                    // ✅ Save to localStorage
                    localStorage.setItem('EnayamallUser', JSON.stringify(jsonData.details));
                    localStorage.setItem('EnayamallAuthToken', authToken);

                    // ✅ Set global user state
                    setUser(jsonData.details);
                    setToken(authToken);

                    // ✅ Reset form
                    setForm({ email: '', password: '' });

                    // ✅ Set Loading
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
                loading: 'Signing in...',
                success: 'Signed in successfully!',
                error: (err) => {
                    setLoading(false);
                    return err.message || 'Sign in failed'
                },
            }
        );
    };

    return (
        <div>
            <h5 className={`text-[24px] sm:text-[26px] text-primaryblack flex flex-col ${lang === "en" ? "flex-row" : "flex-row-reverse text-right" }`}>{t("login")}</h5>
            <p className={`text-[16px] sm:text-[18px] text-ash mt-[30px] flex flex-col ${lang === "en" ? "flex-row" : "flex-row-reverse text-right" }`}>
                {t("welcome_back")} <br /> {t("please_login")}
            </p>

            {/* tabs here  */}
            <div className='mt-[50px]'>
                {/* tab buttons  */}
                <div className={`flex gap-[30px] pb-[10px] ${lang === "en" ? "flex-row" : "flex-row-reverse" }`}>
                    <button onClick={() => setOption(1)} className={`text-[16px] sm:text-[18px] cursor-pointer ${option === 1 ? "text-primary border-b-2 border-primary font-[650]" : "text-primaryblack"}`}>{t("sign_in_otp")}</button>
                    <button onClick={() => setOption(2)} className={`text-[16px] sm:text-[18px] cursor-pointer ${option === 2 ? "text-primary border-b-2 border-primary font-[650]" : "text-primaryblack"}`}>{t("sign_in_password")}</button>
                </div>
                {/* tab forms */}
                <div className='mt-[25px] sm:mt-[50px]'>
                    {
                        (option === 1) ?
                            <SignInWithPhone option={option} />
                            :
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
                                    placeholder="Enter email address"
                                    value={form.email}
                                    onChange={handleChange}
                                    className={`text-[14px] sm:text-[16px] rounded-xl text-primaryblack py-[12px] px-[10px] sm:px-[20px] focus:outline-none border ${errors.email ? "border-button" : "border-creamline"} rounded-[5px] mt-[20px] w-full`}
                                />

                                {/* Password */}
                                <label className="flex justify-between font-medium text-gray-700 mt-[20px]">
                                    <p className='text-[16px] sm:text-[18px] text-ash'>
                                        Password <span className="text-button">*</span>
                                    </p>
                                    {errors.password && (
                                        <span className="text-button ml-2">{errors.password}</span>
                                    )}
                                </label>
                                <div className='relative mt-[20px]'>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        placeholder="Enter your password"
                                        value={form.password}
                                        onChange={handleChange}
                                        className={`text-[14px] sm:text-[16px] rounded-xl text-primaryblack py-[12px] px-[10px] sm:px-[20px] focus:outline-none border ${errors.password ? "border-button" : "border-creamline"} rounded-[5px] w-full pr-[40px]`}
                                    />
                                    <div
                                        onClick={togglePasswordVisibility}
                                        className='absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer'>
                                        {showPassword ? <FiEyeOff size={24} color="#ccc" /> : <FiEye size={24} color="#ccc" />}
                                    </div>
                                </div>

                                {/* Lost password link */}
                                <div className='flex justify-end mt-[20px]'>
                                    <Link href="/recover-password" className='text-danger hover:underline'>
                                        Lost your password?
                                    </Link>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    className={`py-[12px] text-[14px] sm:text-[16px] ${option === 2 ? "bg-primary text-white" : "bg-creamline"} rounded-xl mt-[40px] w-full ${loading ? 'cursor-not-allowed bg-creamline' : 'cursor-pointer'}`}
                                    disabled={postLogin.isLoading || loading}
                                >
                                    {!loading ? "Sign in" : null}
                                    
                                    {loading && <LoadingSvg label="Signing in" color="text-white" />}
                                </button>
                            </form>
                    }

                    <p className={`text-primaryblack mt-[20px] sm:mt-[40px] flex flex-col ${lang === "en" ? "flex-row" : "flex-row-reverse" }`}>{t("dont_have_account")}   <Link href={"/register"} className={`text-primary hover:underline ${lang === "en" ? "ml-2" : "mr-2" }`}>{t("register_now")}</Link> </p>
                </div>
            </div>
        </div>
    )
}