"use client"
import React, { useState } from 'react'
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { usePostData } from '../helpers/usePostData';
import toast from 'react-hot-toast';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAppContext } from '@/app/context/AppContext';
import { useQueryClient } from '@tanstack/react-query';
import { usePostDataWithToken } from '../helpers/usePostDataWithToken';
import Link from 'next/link';
import SignInWithPhone from './SignInWithPhone';
import LoadingSvg from '../shared/LoadingSvg';

export default function Register() {
  const [option, setOption] = useState(2);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser, setToken } = useAppContext();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { guestToken } = useAppContext();

  // Error state for form validation
  const [errors, setErrors] = useState({});

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  //managed signup with password
  const [signUpForm, setSignUpForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    retype_password: '',
  });

  const postUser = usePostData('register-with-email');
  const postCartSync = usePostDataWithToken('add-to-cart-from-guest');
  const queryClient = useQueryClient();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSignUpForm(prev => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    setErrors(prev => ({ ...prev, [name]: "" }));
  };

  // Format phone number - only allow 11 digits
  const formatPhoneNumber = (value) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.slice(0, 11);
  };

  const handlePhoneChange = (e) => {
    const { name, value } = e.target;
    const formatted = formatPhoneNumber(value);
    setSignUpForm(prev => ({ ...prev, [name]: formatted }));

    // Clear error when user starts typing
    setErrors(prev => ({ ...prev, [name]: "" }));
  };

  // Validation function
  const validateForm = () => {
    const newErrors = {};

    if (!signUpForm.name.trim()) {
      newErrors.name = "Name is required";
    } else if (signUpForm.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters long";
    }

    if (!signUpForm.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(signUpForm.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!signUpForm.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (signUpForm.phone.length !== 11) {
      newErrors.phone = "Please enter a valid 11-digit phone number";
    }

    if (!signUpForm.password.trim()) {
      newErrors.password = "Password is required";
    } else if (signUpForm.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }

    if (!signUpForm.retype_password.trim()) {
      newErrors.retype_password = "Please confirm your password";
    } else if (signUpForm.password !== signUpForm.retype_password) {
      newErrors.retype_password = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    const formData = new FormData();
    formData.append('name', signUpForm.name);
    formData.append('email', signUpForm.email);
    formData.append('phone', signUpForm.phone);
    formData.append('password', signUpForm.password);
    formData.append('retype_password', signUpForm.retype_password);

    toast.promise(
      postUser.mutateAsync(formData)
        .then(async (data) => {
          const jsonData = data?.data;
          const authToken = jsonData.token;

          // ✅ Save to localStorage
          localStorage.setItem('EnayamallUser', JSON.stringify(jsonData.details));
          localStorage.setItem('EnayamallAuthToken', authToken);

          // ✅ Set global user state
          setUser(jsonData.details);
          setToken(authToken);

          setLoading(false);

          // ✅ Reset form
          setSignUpForm({
            name: '',
            email: '',
            phone: '',
            password: '',
            retype_password: '',
          });

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
        loading: 'Creating account...',
        success: 'Account created successfully!',
        error: (err) => {
          setLoading(false);
          return err.message || 'Failed to sign up'
        },
      }
    );
  };

  return (
    <div>
      <h5 className='text-[24px] sm:text-[26px] text-primarymagenta'>Register</h5>
      <p className='text-[16px] sm:text-[18px] text-ash mt-[30px]'>
        Create your account. Unlock the experience. <br />
        One step closer to something better.
      </p>

      {/* tabs here  */}
      <div className='mt-[50px]'>
        {/* tab buttons  */}
        <div className='flex gap-[50px]'>
          {/* <button onClick={() => setOption(1)} className={`text-[16px] sm:text-[18px] cursor-pointer ${option === 1 ? "text-primary border-b-2 border-primary font-[650]" : "text-primarymagenta"}`}>Sign up with OTP</button> */}
          <button onClick={() => setOption(2)} className={`text-[16px] sm:text-[18px] cursor-pointer ${option === 2 ? "text-primary border-b-2 border-primary font-[650]" : "text-primarymagenta"}`}>Sign up with Password</button>
        </div>
        {/* tab forms */}
        <div className='mt-[25px] sm:mt-[50px]'>
          {
            (option === 1) ?
              <SignInWithPhone option={option} />
              :
              <form onSubmit={handleSubmit}>
                {/* Name */}
                <label className="flex justify-between font-medium text-gray-700">
                  <p className='text-[16px] sm:text-[18px] text-ash'>
                    Name <span className="text-button">*</span>
                  </p>
                  {errors.name && (
                    <span className="text-button ml-2">{errors.name}</span>
                  )}
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter name"
                  value={signUpForm.name}
                  onChange={handleChange}
                  className={`text-[14px] sm:text-[16px] text-primarymagenta py-[12px] sm:py-[24px] px-[10px] sm:px-[20px] focus:outline-none border ${errors.name ? "border-button" : "border-creamline"} rounded-[5px] mt-[20px] w-full`}
                />

                {/* Email */}
                <label className="flex justify-between font-medium text-gray-700 mt-[20px]">
                  <p className='text-[16px] sm:text-[18px] text-ash'>
                    Email Address <span className="text-button">*</span>
                  </p>
                  {errors.email && (
                    <span className="text-button ml-2">{errors.email}</span>
                  )}
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter email address"
                  value={signUpForm.email}
                  onChange={handleChange}
                  className={`text-[14px] sm:text-[16px] text-primarymagenta py-[12px] sm:py-[24px] px-[10px] sm:px-[20px] focus:outline-none border ${errors.email ? "border-button" : "border-creamline"} rounded-[5px] mt-[20px] w-full`}
                />

                {/* Phone */}
                <label className="flex justify-between font-medium text-gray-700 mt-[20px]">
                  <p className='text-[16px] sm:text-[18px] text-ash'>
                    Phone Number <span className="text-button">*</span>
                  </p>
                  {errors.phone && (
                    <span className="text-button ml-2">{errors.phone}</span>
                  )}
                </label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Enter 11-digit phone number"
                  value={signUpForm.phone}
                  onChange={handlePhoneChange}
                  maxLength="11"
                  className={`text-[14px] sm:text-[16px] text-primarymagenta py-[12px] sm:py-[24px] px-[10px] sm:px-[20px] focus:outline-none border ${errors.phone ? "border-button" : "border-creamline"} rounded-[5px] mt-[20px] w-full`}
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
                <div className="relative mt-[20px]">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Enter your password"
                    value={signUpForm.password}
                    onChange={handleChange}
                    className={`text-[14px] sm:text-[16px] text-primarymagenta py-[12px] sm:py-[24px] px-[10px] sm:px-[20px] focus:outline-none border ${errors.password ? "border-button" : "border-creamline"} rounded-[5px] w-full pr-[40px]`}
                  />
                  <div onClick={togglePasswordVisibility} className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer">
                    {showPassword ? <FiEyeOff size={24} color="#ccc" /> : <FiEye size={24} color="#ccc" />}
                  </div>
                </div>

                {/* Retype Password */}
                <label className="flex justify-between font-medium text-gray-700 mt-[20px]">
                  <p className='text-[16px] sm:text-[18px] text-ash'>
                    Retype Password <span className="text-button">*</span>
                  </p>
                  {errors.retype_password && (
                    <span className="text-button ml-2">{errors.retype_password}</span>
                  )}
                </label>
                <div className="relative mt-[20px]">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="retype_password"
                    placeholder="Retype your password"
                    value={signUpForm.retype_password}
                    onChange={handleChange}
                    className={`text-[14px] sm:text-[16px] text-primarymagenta py-[12px] sm:py-[24px] px-[10px] sm:px-[20px] focus:outline-none border ${errors.retype_password ? "border-button" : "border-creamline"} rounded-[5px] w-full pr-[40px]`}
                  />
                  <div onClick={togglePasswordVisibility} className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer">
                    {showPassword ? <FiEyeOff size={24} color="#ccc" /> : <FiEye size={24} color="#ccc" />}
                  </div>
                </div>

                <button
                  type="submit"
                  className={`py-[12px] sm:py-[24px] text-[14px] sm:text-[16px] ${option === 2 ? "bg-primary text-white" : "bg-creamline"} rounded mt-[40px] w-full ${loading ? "cursor-not-allowed bg-creamline" : "cursor-pointer"}`}
                  disabled={postUser.isLoading || loading}
                >
                  {!loading ? "Sign up" : null}

                  {loading && <LoadingSvg label="Creating account" color="text-white" />}
                </button>
              </form>
          }

          <p className='text-primarymagenta mt-[20px] sm:mt-[40px]'>Already have an account?   <Link href={"/login"} className='text-primary hover:underline'>Login</Link> </p>

        </div>
      </div>
    </div>
  )
}