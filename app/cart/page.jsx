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
  const { token, guestToken, cartDB, totalDB, removeFromCartDB, addToCartDB, addToCartDBGuest, cartDBGuest, totalDBGuest, removeFromCartDBGuest } = useAppContext();

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
            <div className="my-[60px] flex flex-col 2xl:flex-row gap-[24px]">
              {/* cart products here  */}
              <div className="2xl:w-2/3 overflow-x-auto border border-creamline rounded-xl">
                {/* mobile card  */}
                <div className="sm:hidden">
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
                </div>
                {/* tablet t0 large devices card  */}
                <table className="hidden sm:table w-full table-fixed text-left border-collapse">
                  <colgroup>
                    <col style={{ width: '50%' }} />  {/* Product */}
                    <col style={{ width: '16.66%' }} /> {/* Price */}
                    <col style={{ width: '16.66%' }} /> {/* Quantity */}
                    <col style={{ width: '16.66%' }} /> {/* Subtotal */}
                  </colgroup>
                  <thead>
                    <tr className="bg-creamline text-primarymagenta text-[16px] md:text-[18px] font-[550]">
                      <th className="py-[12px] lg:py-[24px] px-[15px] lg:px-[30px]">Product</th>
                      <th className="py-[12px] lg:py-[24px] px-[15px] lg:px-[30px]">Price</th>
                      <th className="py-[12px] lg:py-[24px] px-[15px] lg:px-[30px]">Quantity</th>
                      <th className="py-[12px] lg:py-[24px] px-[15px] lg:px-[30px]">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentCart?.map((item, index) => (
                      <CartTableRow
                        key={index}
                        item={item}
                        token={token}
                        removeFromCartDB={removeFromCartDB}
                        addToCartDB={addToCartDB}
                        addToCartDBGuest={addToCartDBGuest}
                        removeFromCartDBGuest={removeFromCartDBGuest}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
              {/* coupon and subtotal  */}
              <div className="2xl:w-1/3 flex flex-col lg:flex-row 2xl:flex-col gap-[24px] lg:gap-[30px]">
                

                {/* sub total  */}
                <div className="py-[20px] px-[20px] bg-creamline rounded-[10px] flex-1 2xl:flex-none">
                  <p className="text-[16px] md:text-[18px] py-[10px] text-primarymagenta flex justify-between">
                    <span className="font-[400]">Item subtotal</span>
                    <span><span className="dirham-symbol">ê</span> {token ? totalDB : totalDBGuest}</span>
                  </p>

                  {appliedCoupon && couponData && (
                    <div className="text-[16px] md:text-[18px] py-[10px] border-t border-b border-secondary text-primarymagenta flex justify-between">
                      <div className="flex flex-col 2xl:flex-row gap-[24px]">
                        <p className="font-[550]">Coupon code</p>
                        <p className="font-bold text-secondary">
                          {couponData.coupon_code}
                          {" "}
                          {couponData.discount_type === 'fixed' ?
                            <>( - {couponData.discount} <span className="dirham-symbol">ê</span>)</> :
                            <>( - {couponData.discount} %)</>
                          }
                        </p>
                      </div>

                      <div className="flex flex-col gap-[24px]">
                        {couponData.discount_type === 'fixed' ? (
                          <p>-<span className="dirham-symbol">ê</span> {couponData.discount}</p>
                        ) : (
                          <p>-<span className="dirham-symbol">ê</span> {Math.round(((token ? totalDB : totalDBGuest) * couponData.discount) / 100)}</p>
                        )}
                        {/* <p className="text-[12px] text-secondary cursor-pointer">Remove coupon</p> */}
                      </div>
                    </div>
                  )}

                  <p className="text-[16px] md:text-[18px] py-[10px] font-[550] text-primarymagenta flex justify-between">
                    <span className="">Total</span>
                    {couponData ? (
                      <span>
                        {couponData.discount_type === "fixed" ?
                          <><span className="dirham-symbol">ê</span> {(token ? totalDB : totalDBGuest) - couponData.discount}</> :
                          <><span className="dirham-symbol">ê</span> {Math.round((token ? totalDB : totalDBGuest) - (((token ? totalDB : totalDBGuest) * couponData.discount) / 100))}</>
                        }
                      </span>
                    ) : (
                      <span><span className="dirham-symbol">ê</span> {token ? totalDB : totalDBGuest}</span>
                    )}
                  </p>

                  <Link
                    href={"checkout"}
                    className="mt-[20px] cursor-pointer text-[14px] lg:text-[18px] text-white min-w-full py-[12px] bg-primary block text-center rounded-xl font-semibold"
                  >
                    Proceed to Checkout
                  </Link>
                </div>

                {/* coupon card  */}
                <div className="p-[20px] rounded-[10px] bg-creamline flex-1 2xl:flex-none h-fit">
                  <p className="text-[16px] md:text-[18px] font-[550] text-primarymagenta">Coupon code</p>
                  <div className="flex gap-[8px] items-center mt-[10px]">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="rounded-xl py-[12px] w-2/3 text-left px-4 text-[14px] lg:text-[18px] text-primarymagenta bg-white focus:outline-none border border-dashed border-creamline"
                      placeholder="Enter code"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      disabled={applyCoupon.isPending}
                      className="cursor-pointer text-[14px] lg:text-[18px] text-white py-[12px] w-1/3 bg-primary font-semibold rounded-xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {applyCoupon.isPending ? 'Applying...' : 'Apply'}
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