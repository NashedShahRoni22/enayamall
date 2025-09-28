"use client";
import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { usePostData } from "../helpers/usePostData";
import toast from "react-hot-toast";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAppContext } from "@/app/context/AppContext";
import { useQueryClient } from "@tanstack/react-query";
import { usePostDataWithToken } from "../helpers/usePostDataWithToken";
import Link from "next/link";
import SignInWithPhone from "./SignInWithPhone";
import LoadingSvg from "../shared/LoadingSvg";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

export default function Register() {
  const location = usePathname();
  const [option, setOption] = useState(2);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser, setToken, lang, guestToken } = useAppContext();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({});
  const [signUpForm, setSignUpForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    retype_password: "",
    code: "",
  });

  const postUser = usePostData("register-with-email");
  const postCartSync = usePostDataWithToken("add-to-cart-from-guest");
  const queryClient = useQueryClient();

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSignUpForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Validation function
  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!signUpForm.name.trim()) {
      newErrors.name = lang === "ar" ? "الاسم مطلوب" : "Name is required";
    } else if (signUpForm.name.trim().length < 2) {
      newErrors.name =
        lang === "ar"
          ? "يجب أن يكون الاسم مكونًا من حرفين على الأقل"
          : "Name must be at least 2 characters long";
    }

    // Email validation
    if (!signUpForm.email.trim()) {
      newErrors.email =
        lang === "ar" ? "البريد الإلكتروني مطلوب" : "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(signUpForm.email)) {
      newErrors.email =
        lang === "ar"
          ? "يرجى إدخال بريد إلكتروني صالح"
          : "Please enter a valid email address";
    }

    // Phone validation (country code fixed, validate local number only)
    const localPhone = signUpForm.phone.replace(/^\+\d{1,3}/, "");
    if (!localPhone.trim()) {
      newErrors.phone =
        lang === "ar" ? "رقم الهاتف مطلوب" : "Phone number is required";
    } else if (!/^\d{7,12}$/.test(localPhone)) {
      newErrors.phone =
        lang === "ar"
          ? "الرجاء إدخال رقم هاتف صالح"
          : "Please enter a valid local phone number";
    }

    // Password validation
    if (!signUpForm.password.trim()) {
      newErrors.password =
        lang === "ar" ? "كلمة المرور مطلوبة" : "Password is required";
    } else if (signUpForm.password.length < 6) {
      newErrors.password =
        lang === "ar"
          ? "يجب أن تكون كلمة المرور مكونة من 6 أحرف على الأقل"
          : "Password must be at least 6 characters long";
    }

    // Retype password
    if (!signUpForm.retype_password.trim()) {
      newErrors.retype_password =
        lang === "ar"
          ? "يرجى تأكيد كلمة المرور"
          : "Please confirm your password";
    } else if (signUpForm.password !== signUpForm.retype_password) {
      newErrors.retype_password =
        lang === "ar" ? "كلمتا المرور غير متطابقتين" : "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("name", signUpForm.name);
    formData.append("email", signUpForm.email);
    formData.append("phone", signUpForm.phone); // full international number
    formData.append("password", signUpForm.password);
    formData.append("retype_password", signUpForm.retype_password);
    if (location === "/affiliate") {
      formData.append("referral_code", signUpForm.code);
      formData.append("affiliated", 1);
    }

    toast.promise(
      postUser.mutateAsync(formData).then(async (data) => {
        const jsonData = data?.data;
        const authToken = jsonData.token;

        localStorage.setItem("EnayamallUser", JSON.stringify(jsonData.details));
        localStorage.setItem("EnayamallAuthToken", authToken);

        setUser(jsonData.details);
        setToken(authToken);
        setLoading(false);

        setSignUpForm({
          name: "",
          email: "",
          phone: "",
          password: "",
          retype_password: "",
          code: "",
        });

        if (guestToken) {
          const cartFormData = new FormData();
          cartFormData.append("guest_token", guestToken);
          try {
            await postCartSync.mutateAsync({ formData: cartFormData, token: authToken });
            await queryClient.invalidateQueries({ queryKey: ["cart"] });
          } catch (error) {
            console.error("Cart sync failed:", error);
          }
        }

        const redirectTo = searchParams.get("redirect") || "/";
        router.push(redirectTo);
      }),
      {
        loading: lang === "ar" ? "جاري إنشاء الحساب..." : "Creating account...",
        success: lang === "ar" ? "تم إنشاء الحساب بنجاح!" : "Account created successfully!",
        error: (err) => {
          setLoading(false);
          return err.message || (lang === "ar" ? "فشل في إنشاء الحساب" : "Failed to sign up");
        },
      }
    );
  };

  return (
    <div>
      <h5 className={`text-[24px] sm:text-[26px] text-primaryblack ${lang==='ar'&&'text-right'}`}>
        {location === "/affiliate"
          ? lang === "ar"
            ? "انضم إلينا كمسوق بالعمولة"
            : "Join us as an affiliate"
          : lang === "ar"
          ? "تسجيل"
          : "Register"}
      </h5>

      <p className={`text-[16px] sm:text-[18px] text-ash mt-[30px] ${lang==='ar'&&'text-right'}`}>
        {lang === "ar"
          ? <>أنشئ حسابك. افتح التجربة. <br /> خطوة واحدة أقرب إلى شيء أفضل.</>
          : <>Create your account. Unlock the experience. <br /> One step closer to something better.</>}
      </p>

      <div className="mt-[50px]">
        <div className={`flex gap-[50px] ${lang==='ar'&&'flex-row-reverse'}`}>
          <button
            onClick={() => setOption(2)}
            className={`text-[16px] sm:text-[18px] cursor-pointer ${
              option === 2
                ? "text-primary border-b-2 border-primary font-[650]"
                : "text-primaryblack"
            }`}
          >
            {lang === "ar" ? "سجّل باستخدام كلمة المرور" : "Sign up with Password"}
          </button>
        </div>

        <div className="mt-[25px] sm:mt-[50px]">
          {option === 1 ? (
            <SignInWithPhone option={option} />
          ) : (
            <form onSubmit={handleSubmit}>
              {/* Name */}
              <label className={`flex font-medium text-gray-700 mt-[20px] justify-between ${lang === "en" ? "flex-row" : "flex-row-reverse"}`}>
                <p className={`text-[16px] sm:text-[18px] gap-2 text-ash flex ${lang === "en" ? "flex-row" : "flex-row-reverse text-right"}`}>
                  <span>{lang === "en" ? "Name" : "الاسم"}</span><span className="text-button">*</span>
                </p>
                {errors.name && <span className="text-button ml-2">{errors.name}</span>}
              </label>
              <input
                type="text"
                name="name"
                dir={lang === "ar" ? "rtl" : "ltr"}
                placeholder={lang === "ar" ? "أدخل الاسم" : "Enter name"}
                value={signUpForm.name}
                onChange={handleChange}
                className={`text-[14px] sm:text-[16px] rounded-xl text-primaryblack py-[12px] px-[10px] sm:px-[20px] focus:outline-none border ${errors.name ? "border-button" : "border-creamline"} rounded-[5px] mt-[20px] w-full`}
              />

              {/* Email */}
              <label className={`flex font-medium text-gray-700 mt-[20px] justify-between ${lang === "en" ? "flex-row" : "flex-row-reverse"}`}>
                <p className={`text-[16px] sm:text-[18px] gap-2 text-ash flex ${lang === "en" ? "flex-row" : "flex-row-reverse text-right"}`}>
                  <span>{lang === "en" ? "Email Address" : "البريد الإلكتروني"}</span><span className="text-button">*</span>
                </p>
                {errors.email && <span className="text-button ml-2">{errors.email}</span>}
              </label>
              <input
                type="email"
                name="email"
                dir={lang === "ar" ? "rtl" : "ltr"}
                placeholder={lang === "ar" ? "أدخل البريد الإلكتروني" : "Enter email address"}
                value={signUpForm.email}
                onChange={handleChange}
                className={`text-[14px] sm:text-[16px] rounded-xl text-primaryblack py-[12px] px-[10px] sm:px-[20px] focus:outline-none border ${errors.email ? "border-button" : "border-creamline"} rounded-[5px] mt-[20px] w-full`}
              />

              {/* Phone */}
              <label className={`flex font-medium text-gray-700 mt-[20px] justify-between ${lang === "en" ? "flex-row" : "flex-row-reverse"}`}>
                <p className={`text-[16px] sm:text-[18px] gap-2 text-ash flex ${lang === "en" ? "flex-row" : "flex-row-reverse text-right"}`}>
                  <span>{lang === "en" ? "Phone Number" : "رقم الهاتف"}</span><span className="text-button">*</span>
                </p>
                {errors.phone && <span className="text-button ml-2">{errors.phone}</span>}
              </label>
              <div className={`mt-[20px] ${errors.phone ? "border-button rounded-[5px]" : "border-creamline rounded-[5px]"}`}>
                <PhoneInput
                  country={"uae"}
                  value={signUpForm.phone}
                  onChange={(value) => {
                    const fullNumber = value.startsWith("+") ? value : `+${value}`;
                    setSignUpForm((prev) => ({ ...prev, phone: fullNumber }));
                    setErrors((prev) => ({ ...prev, phone: "" }));
                  }}
                  inputProps={{
                    name: "phone",
                    required: true,
                    dir: lang === "ar" ? "rtl" : "ltr",
                  }}
                  disableCountryCode={false}
                  countryCodeEditable={false}
                  containerClass="w-full"
                  inputClass="w-full text-[14px] sm:text-[16px] rounded-xl text-primaryblack py-[12px] px-[10px] sm:px-[20px] focus:outline-none"
                  buttonClass="rounded-l-xl"
                  dropdownClass="rounded-xl"
                />
              </div>

              {/* Password */}
              <label className={`flex font-medium text-gray-700 mt-[20px] justify-between ${lang === "en" ? "flex-row" : "flex-row-reverse"}`}>
                <p className={`text-[16px] sm:text-[18px] gap-2 text-ash flex ${lang === "en" ? "flex-row" : "flex-row-reverse text-right"}`}>
                  <span>{lang === "en" ? "Password" : "كلمة المرور"}</span><span className="text-button">*</span>
                </p>
                {errors.password && <span className="text-button ml-2">{errors.password}</span>}
              </label>
              <div className="relative mt-[20px]">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  dir={lang === "ar" ? "rtl" : "ltr"}
                  placeholder={lang === "ar" ? "أدخل كلمة المرور" : "Enter your password"}
                  value={signUpForm.password}
                  onChange={handleChange}
                  className={`text-[14px] sm:text-[16px] rounded-xl text-primaryblack py-[12px] px-[10px] sm:px-[20px] focus:outline-none border ${errors.password ? "border-button" : "border-creamline"} rounded-[5px] w-full pr-[40px]`}
                />
                <div onClick={togglePasswordVisibility} className={lang === "ar" ? "absolute left-4 top-1/2 transform -translate-y-1/2 cursor-pointer" : "absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer"}>
                  {showPassword ? <FiEyeOff size={24} color="#ccc" /> : <FiEye size={24} color="#ccc" />}
                </div>
              </div>

              {/* Retype Password */}
              <label className={`flex font-medium text-gray-700 mt-[20px] justify-between ${lang === "en" ? "flex-row" : "flex-row-reverse"}`}>
                <p className={`text-[16px] sm:text-[18px] gap-2 text-ash flex ${lang === "en" ? "flex-row" : "flex-row-reverse text-right"}`}>
                  <span>{lang === "en" ? "Retype Password" : "إعادة إدخال كلمة المرور"}</span><span className="text-button">*</span>
                </p>
                {errors.retype_password && <span className="text-button ml-2">{errors.retype_password}</span>}
              </label>
              <div className="relative mt-[20px]">
                <input
                  type={showPassword ? "text" : "password"}
                  name="retype_password"
                  dir={lang === "ar" ? "rtl" : "ltr"}
                  placeholder={lang === "ar" ? "أعد إدخال كلمة المرور" : "Retype your password"}
                  value={signUpForm.retype_password}
                  onChange={handleChange}
                  className={`text-[14px] sm:text-[16px] rounded-xl text-primaryblack py-[12px] px-[10px] sm:px-[20px] focus:outline-none border ${errors.retype_password ? "border-button" : "border-creamline"} rounded-[5px] w-full pr-[40px]`}
                />
                <div onClick={togglePasswordVisibility} className={lang === "ar" ? "absolute left-4 top-1/2 transform -translate-y-1/2 cursor-pointer" : "absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer"}>
                  {showPassword ? <FiEyeOff size={24} color="#ccc" /> : <FiEye size={24} color="#ccc" />}
                </div>
              </div>

              {/* Affiliate Code */}
              {location === "/affiliate" && (
                <div className="relative mt-[20px]">
                  <label className={`flex font-medium text-gray-700 justify-between ${lang === "en" ? "flex-row" : "flex-row-reverse"}`}>
                    <p className={`text-[16px] sm:text-[18px] gap-2 text-ash flex ${lang === "en" ? "flex-row" : "flex-row-reverse text-right"}`}>
                      <span>{lang === "en" ? "Referral Code" : "كود الإحالة"}</span>
                    </p>
                  </label>
                  <input
                    type="text"
                    name="code"
                    dir={lang === "ar" ? "rtl" : "ltr"}
                    placeholder={lang === "ar" ? "كود الإحالة" : "Referral code"}
                    value={signUpForm.code}
                    onChange={handleChange}
                    className={`text-[14px] sm:text-[16px] rounded-xl text-primaryblack py-[12px] px-[10px] sm:px-[20px] focus:outline-none border border-creamline mt-[20px] w-full`}
                  />
                </div>
              )}

              <button
                type="submit"
                className={`py-[12px] text-[14px] rounded-xl sm:text-[16px] bg-primary text-white mt-[40px] w-full ${loading ? "cursor-not-allowed bg-creamline" : "cursor-pointer"}`}
                disabled={postUser.isLoading || loading}
              >
                {!loading ? (lang === "ar" ? "تسجيل" : "Sign up") : null}
                {loading && <LoadingSvg label={lang === "ar" ? "جاري إنشاء الحساب" : "Creating account"} color="text-white" />}
              </button>
            </form>
          )}

          <p className={`text-primaryblack mt-[20px] sm:mt-[40px] ${lang === "ar" ? "text-right" : "text-left"}`} dir={lang === "ar" ? "rtl" : "ltr"}>
            {lang === "ar" ? "هل لديك حساب بالفعل؟" : "Already have an account?"}
            <Link href="/login" className={`text-primary hover:underline ml-2 ${lang === "ar" ? "mr-2 ml-0" : "ml-2"}`}>
              {lang === "ar"
                ? location === "/affiliate"
                  ? "تسجيل الدخول إلى حساب الشريك"
                  : "تسجيل الدخول"
                : location === "/affiliate"
                ? "Login your affiliate account"
                : "Login"}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
