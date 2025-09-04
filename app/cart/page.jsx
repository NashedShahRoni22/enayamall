"use client";

import { useAppContext } from "@/app/context/AppContext";
import PageHeader from "../components/shared/PageHeader";
import Container from "../components/shared/Container";
import { PiSmileySadLight } from "react-icons/pi";
import ShopNowButton from "../components/shared/ShopNowButton";
import CartCard from "../components/shared/cards/CartCard";
import Link from "next/link";
import CartTableRow from "../components/shared/cards/CartTableRow";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useApplyCoupon } from "../components/helpers/useApplyCoupon";

export default function CartPage() {
  const { token, lang, guestToken, cartDB, totalDB, removeFromCartDB, addToCartDB, addToCartDBGuest, cartDBGuest, totalDBGuest, removeFromCartDBGuest } = useAppContext();

  // Use cartDB if a token exists, otherwise use the guest cart
  const currentCart = token ? cartDB : cartDBGuest;
  const [appliedCoupon, setAppliedCoupon] = useState(false);
  const [couponData, setCouponData] = useState(null);
  const [couponInput, setCouponInput] = useState('');

  // Initialize the coupon hooks
  const applyCoupon = useApplyCoupon();

  // Function to check if coupon is applied
  const checkCouponApplied = async (guestToken) => {
    try {
      const formData = new FormData();
      formData.append('guest_token', guestToken);

      const response = await fetch(`${process.env.NEXT_PUBLIC_WEB_API_BASE_URL}check-if-coupon-applied`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.status === "success") {
        setAppliedCoupon(true);
        setCouponData(data?.data);
      } else {
        setAppliedCoupon(false);
        setCouponData(null);
      }

      return data;
    } catch (error) {
      console.error('Error checking coupon:', error);
      setAppliedCoupon(false);
      setCouponData(null);
    }
  };

  // Function to handle coupon application
  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }

    toast.promise(
      applyCoupon.mutateAsync({
        couponCode: couponInput,
        token: token,
        guestToken: guestToken
      }),
      {
        loading: 'Applying coupon...',
        success: (data) => {
          setAppliedCoupon(true);
          setCouponData(data?.data);
          setCouponInput('');
          return 'Coupon applied successfully!';
        },
        error: (err) => {
          console.error('Coupon application failed:', err);
          return err.message || 'Failed to apply coupon';
        }
      }
    );
  };

  // Check coupon status when component mounts or when guestToken changes
  useEffect(() => {
    if (guestToken) {
      checkCouponApplied(guestToken);
    }
  }, [guestToken]);

  return (
    <section>
      {/* start banner  */}
      {/* <PageHeader title={"Cart"} from={"Home"} to={"cart"} /> */}
      {
        currentCart?.length === 0 ?
          <div className="p-8 text-center text-xl min-h-[80vh] flex flex-col justify-center items-center">
            <PiSmileySadLight className="text-9xl text-secondary" />
            <p className="text-[24px] text-primarymagenta mt-[48px] mb-[24px]">Your cart is empty 🛒</p>
            <ShopNowButton />
          </div>
          :
          <Container>
            <div className={`my-[60px] flex flex-col ${lang === "en" ? "2xl:flex-row" : "2xl:flex-row-reverse"} gap-[24px]`}>
              {/* cart products here  */}
              <div className="2xl:w-2/3 overflow-x-auto border border-creamline rounded-xl bg-gray-100 p-4">
                {/* mobile card  */}
                {/* <div className="sm:hidden">
                  {currentCart?.map((item, index) => ( 
                    <CartCard
                      key={index}
                      item={item}
                      token={token}
                      removeFromCartDB={removeFromCartDB}
                      addToCartDB={addToCartDB}
                      addToCartDBGuest={addToCartDBGuest}
                      removeFromCartDBGuest={removeFromCartDBGuest}
                    />
                  ))}
                </div> */}
                {/* tablet t0 large devices card  */}

                {currentCart?.map((item, index) => (
                  <CartTableRow
                    lang={lang}
                    key={index}
                    item={item}
                    token={token}
                    removeFromCartDB={removeFromCartDB}
                    addToCartDB={addToCartDB}
                    addToCartDBGuest={addToCartDBGuest}
                    removeFromCartDBGuest={removeFromCartDBGuest}
                  />
                ))}

              </div>
              {/* coupon and subtotal  */}
              <div className="2xl:w-1/3 flex flex-col lg:flex-row 2xl:flex-col gap-[24px] lg:gap-[30px]">

                {/* sub total  */}
                <div className="py-[20px] px-[20px] bg-gray-100 rounded-[10px] flex-1 2xl:flex-none">
                  <p className={`text-[20px] font-[650] text-primarymagenta pb-2 ${lang === 'en' ? '' : 'text-right'}`}>
                    {lang === 'en' ? 'Order Summary' : 'ملخص الطلب'}
                  </p>
                  <p className={`text-[12px] md:text-[16px] py-[10px] text-primarymagenta flex justify-between items-center gap-1 ${lang === 'en' ? '' : 'flex-row-reverse'}`}>
                    <span className="font-[400]">
                      {lang === 'en' ? 'Item subtotal' : 'المجموع الفرعي'}
                    </span>
                    <span><span className="dirham-symbol text-[12px] md:text-[16px]">ê</span> {token ? totalDB : totalDBGuest}</span>
                  </p>

                  {appliedCoupon && couponData && (
                    <div className="text-[12px] md:text-[16px] text-primarymagenta flex justify-between">
                      <div className={`flex flex-col 2xl:flex-row gap-1 ${lang === 'en' ? '' : 'flex-row-reverse'}`}>
                        <p className="font-[400]">
                          {lang === 'en' ? 'Discount' : 'الخصم'}
                        </p>
                        <p className="font-bold inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 inset-ring inset-ring-green-600/20">
                          {couponData.coupon_code}
                          {" "}
                          {couponData.discount_type === 'fixed' ? (
                            <>( <span className="dirham-symbol mr-[2px]">ê</span> {couponData.discount})</>
                          ) : (
                            <>( {couponData.discount} %)</>
                          )}
                        </p>
                        {/* <p className="text-[12px] text-secondary cursor-pointer">Remove coupon</p> */}
                      </div>

                      <div className="flex flex-col gap-[24px]">
                        {couponData.discount_type === 'fixed' ? (
                          <p><span className="dirham-symbol">ê</span> {couponData.discount}</p>
                        ) : (
                          <p><span className="dirham-symbol">ê</span> {Math.round((Number((token ? totalDB : totalDBGuest).toString().replace(/,/g, "")) * couponData.discount) / 100)}</p>
                        )}
                      </div>
                    </div>
                  )}

                  <p className={`text-[16px] md:text-[18px] py-[10px] font-[550] text-primarymagenta flex justify-between items-center ${lang === 'en' ? '' : 'flex-row-reverse'}`}>
                    <span>{lang === 'en' ? 'Total' : 'الإجمالي'}</span>
                    {couponData ? (
                      <span>
                        {couponData.discount_type === "fixed" ? (
                          <span className="flex items-center gap-1">
                            <span className="dirham-symbol">ê</span>
                            {(Number((token ? totalDB : totalDBGuest).toString().replace(/,/g, "")) - couponData.discount)}
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <span className="dirham-symbol">ê</span>
                            {Math.round(Number((token ? totalDB : totalDBGuest).toString().replace(/,/g, "")) - ((Number((token ? totalDB : totalDBGuest).toString().replace(/,/g, "")) * couponData.discount) / 100))}
                          </span>
                        )}
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <span className="dirham-symbol">ê</span>
                        {Number((token ? totalDB : totalDBGuest).toString().replace(/,/g, ""))}
                      </span>
                    )}
                  </p>

                  <Link
                    href={"checkout"}
                    className="mt-[20px] cursor-pointer text-[14px] lg:text-[18px] text-white min-w-full py-[12px] bg-primary block text-center rounded-xl font-semibold"
                  >
                    {lang === 'en' ? 'Proceed to Checkout' : 'الانتقال إلى الدفع'}
                  </Link>
                </div>

                {/* coupon card  */}
                <div className="p-[20px] rounded-[10px] bg-creamline flex-1 2xl:flex-none h-fit">
                  <p className={`text-[20px] font-[650] text-primarymagenta ${lang === 'en' ? '' : 'text-right'}`}>
                    {lang === 'en' ? 'Coupon code' : 'رمز القسيمة'}
                  </p>
                  <div className={`flex gap-[8px] items-center mt-[10px] ${lang === 'en' ? '' : 'flex-row-reverse'}`}>
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className={`rounded-xl py-[12px] w-2/3 px-4 text-[14px] lg:text-[18px] text-primarymagenta bg-white focus:outline-none border border-dashed border-creamline ${lang === 'en' ? 'text-left' : 'text-right'}`}
                      placeholder={lang === 'en' ? "Enter code" : "أدخل الرمز"}
                    />
                    <button
                      onClick={handleApplyCoupon}
                      disabled={applyCoupon.isPending}
                      className="cursor-pointer text-[14px] lg:text-[18px] text-white py-[12px] w-1/3 bg-primary font-semibold rounded-xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {applyCoupon.isPending ? (lang === 'en' ? 'Applying...' : 'جارٍ التقديم...') : (lang === 'en' ? 'Apply' : 'تطبيق')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Container>
      }
    </section>
  );
}