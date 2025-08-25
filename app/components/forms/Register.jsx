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
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if password and confirm password match
    if (signUpForm.password !== signUpForm.retype_password) {
      toast.error("Password and confirm password didn't match.");
      return;
    }

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
          localStorage.setItem('LaminaxUser', JSON.stringify(jsonData.details));
          localStorage.setItem('LaminaxAuthToken', authToken);

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
          {/* <button onClick={() => setOption(1)} className={`text-[16px] sm:text-[18px] cursor-pointer ${option === 1 ? "text-natural border-b-2 border-natural font-[650]" : "text-primarymagenta"}`}>Sign up with OTP</button> */}
          <button onClick={() => setOption(2)} className={`text-[16px] sm:text-[18px] cursor-pointer ${option === 2 ? "text-natural border-b-2 border-natural font-[650]" : "text-primarymagenta"}`}>Sign up with Password</button>
        </div>
        {/* tab forms */}
        <div className='mt-[25px] sm:mt-[50px]'>
          {
            (option === 1) ?
              <SignInWithPhone option={option} />
              :
              <form onSubmit={handleSubmit}>
                {/* Name */}
                <p className='text-[16px] sm:text-[18px] text-ash'>Name <span className='text-danger'>*</span></p>
                <input
                  required
                  type="text"
                  name="name"
                  placeholder="Enter name"
                  defaultValue={signUpForm.name || ''}
                  onChange={handleChange}
                  className="text-[16px] text-danger py-[12px] sm:py-[24px] px-[10px] sm:px-[20px] focus:outline-none border border-creamline rounded-[5px] mt-[20px] w-full"
                />

                {/* Email */}
                <p className="text-[16px] sm:text-[18px] text-ash mt-[20px]">Email Address <span className="text-danger">*</span></p>
                <input
                  required
                  type="email"
                  name="email"
                  placeholder="Enter email address"
                  defaultValue={signUpForm.email || ''}
                  onChange={handleChange}
                  className="text-[16px] text-danger py-[12px] sm:py-[24px] px-[10px] sm:px-[20px] focus:outline-none border border-creamline rounded-[5px] mt-[20px] w-full"
                />

                {/* Phone */}
                <p className="text-[16px] sm:text-[18px] text-ash mt-[20px]">Phone Number <span className="text-danger">*</span></p>
                <input
                  required
                  type="text"
                  name="phone"
                  placeholder="Enter phone number"
                  defaultValue={signUpForm.phone || ''}
                  onChange={handleChange}
                  className="text-[16px] text-danger py-[12px] sm:py-[24px] px-[10px] sm:px-[20px] focus:outline-none border border-creamline rounded-[5px] mt-[20px] w-full"
                />

                {/* Password */}
                <p className="text-[16px] sm:text-[18px] text-ash mt-[20px]">Password <span className="text-danger">*</span></p>
                <div className="relative mt-[20px]">
                  <input
                    required
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Enter your password"
                    defaultValue={signUpForm.password || ''}
                    onChange={handleChange}
                    className="text-[16px] text-danger py-[12px] sm:py-[24px] px-[10px] sm:px-[20px] focus:outline-none border border-creamline rounded-[5px] w-full pr-[40px]"
                  />
                  <div onClick={togglePasswordVisibility} className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer">
                    {showPassword ? <FiEyeOff size={24} color="#ccc" /> : <FiEye size={24} color="#ccc" />}
                  </div>
                </div>

                {/* Retype Password */}
                <p className="text-[16px] sm:text-[18px] text-ash mt-[20px]">Retype Password <span className="text-danger">*</span></p>
                <div className="relative mt-[20px]">
                  <input
                    required
                    type={showPassword ? 'text' : 'password'}
                    name="retype_password"
                    placeholder="Retype your password"
                    defaultValue={signUpForm.retype_password || ''}
                    onChange={handleChange}
                    className="text-[16px] text-danger py-[12px] sm:py-[24px] px-[10px] sm:px-[20px] focus:outline-none border border-creamline rounded-[5px] w-full pr-[40px]"
                  />
                  <div onClick={togglePasswordVisibility} className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer">
                    {showPassword ? <FiEyeOff size={24} color="#ccc" /> : <FiEye size={24} color="#ccc" />}
                  </div>
                </div>

                <button
                  type="submit"
                  className={`py-[12px] sm:py-[24px] ${option === 2 ? "bg-accent text-white" : "bg-creamline"} rounded mt-[40px] w-full ${loading ? "cursor-not-allowed bg-creamline" : "cursor-pointer"}`}
                  disabled={postUser.isLoading || loading}
                >
                  {loading ? <LoadingSvg label="Signing up" color="text-primarymagenta" /> : "Sign up"}
                </button>
              </form>
          }

          <p className='text-primarymagenta mt-[20px] sm:mt-[40px]'>Already have an account?   <Link href={"/login"} className='text-natural hover:underline'>Login</Link> </p>

        </div>
      </div>
    </div>
  )
}
