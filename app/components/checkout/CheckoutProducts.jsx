import { useAppContext } from '@/app/context/AppContext'
import { usePostDataWithToken } from '../helpers/usePostDataWithToken';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import LoadingSvg from '../shared/LoadingSvg';
import Link from 'next/link';
import { MdCheckCircle, MdOutlineRadioButtonUnchecked } from 'react-icons/md';

export default function CheckoutProducts({ addressId, method, shippingCost, acceptTerms, setAcceptTerms }) {
    const { token, guestToken, cart, cartDB, total, totalDB, totalDiscountDB } = useAppContext();
    const currentCart = token ? cartDB : cart;
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [appliedCoupon, setAppliedCoupon] = useState(false);
    const [couponData, setCouponData] = useState(null);

    // Calculate discount amount
    const discountAmount = couponData && appliedCoupon
        ? couponData.discount_type === 'fixed'
            ? couponData.discount
            : Math.round(((token ? totalDB : total) * couponData.discount) / 100)
        : 0;

    // Function to check if coupon is applied
    const checkCouponApplied = async (guestToken) => {
        try {
            const formData = new FormData();
            formData.append('guest_token', guestToken);

            const response = await fetch(`${process.env.NEXT_PUBLIC_LAMINUX_API_BASE_URL}check-if-coupon-applied`, {
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



    // place order
    const postOrder = usePostDataWithToken('order');
    const queryClient = useQueryClient();

    const handleOrderPlace = async () => {
        if (addressId === null) {
            toast.error("Select shipping address!");
            return;
        }

        if (method === null) {
            toast.error("Select payment method!");
            return;
        }

        if (acceptTerms === false) {
            toast.error("Agree to Terms & Conditions, Privacy Policy, Refund & Return Policy!");
            return;
        }

        setLoading(true);
        const form = new FormData();
        form.append('total', totalDB - discountAmount + shippingCost);
        form.append('address_id', addressId);
        form.append('coupon_id', couponData?.coupon_id ? couponData?.coupon_id : null);
        form.append('coupon_discount_amount', discountAmount);
        form.append('guest_token', guestToken);
        form.append('shipping_cost', shippingCost);
        form.append('agree_terms', acceptTerms);

        if (method === "cod") {
            form.append('payment_method', "cash_on_delivery");
        }
        else {
            form.append('payment_method', "online_payment ");
        }

        cartDB.forEach(item => {
            if (item.product_variant_id) {
                form.append('product_variant_id[]', item.product_variant_id);
                form.append('product_variant_price[]', item.price);
                form.append('product_variant_quantity[]', item.quantity);
            } else if (item.combo_id) {
                form.append('combo_id[]', item.combo_id);
                form.append('combo_price[]', item.price);
                form.append('combo_quantity[]', item.quantity);
            }
        });

        try {
            const orderResponse = await toast.promise(
                postOrder.mutateAsync({ formData: form, token }),
                {
                    loading: 'Placing order...',
                    success: 'Order placed successfully!',
                    error: (err) => err.message || 'Failed to submit order',
                }
            );

            // Navigate to success page with tracking ID
            if (method === "cod") {
                const trackingId = orderResponse?.data?.tracking_id;
                router.push(`/success/${trackingId}`);
            }
            else {
                const paymentURL = orderResponse?.payment_url;
                router.push(paymentURL);
            }
        } catch (err) {
            console.error("Submission error:", err);
            router.push("/checkout");
        } finally {
            setLoading(false);
        }

        queryClient.invalidateQueries({ queryKey: ['cart'] });
    };

    // Check coupon status when component mounts or when guestToken changes
    useEffect(() => {
        if (guestToken) {
            checkCouponApplied(guestToken);
        }
    }, [guestToken]);

    return (
        <section className='text-primarymagenta flex flex-col gap-[20px]'>
            {/* products informations here  */}
            <div className='bg-[#FCF7EE] rounded-[10px] py-[20px]  px-[20px] sm:px-[40px]'>
                {/* Header Row */}
                <div className='flex justify-between items-center'>
                    <p className='text-[16px] sm:text-[18px] font-[650] w-[70%]'>Product</p>
                    <p className='text-[16px] sm:text-[18px] font-[650] w-[30%] text-right'>Sub total</p>
                </div>

                {/* Divider */}
                <div className="bg-natural h-[1px] w-full my-[20px] sm:my-[30px]"></div>

                {/* Product List */}
                <div className='flex flex-col gap-[20px]'>
                    {currentCart?.map((c, index) => (
                        <div key={index} className='flex justify-between items-center'>
                            <div className='flex justify-between items-center w-[70%]'>
                                <p className="truncate pr-2">{c.name}</p>
                                <p className="whitespace-nowrap">x {c.quantity}</p>
                            </div>
                            <p className='w-[30%] text-right'>৳ {(c.price * c.quantity).toFixed(2)}</p>
                        </div>
                    ))}
                </div>

                {/* Divider */}
                <div className="bg-natural h-[1px] w-full my-[20px] sm:my-[30px]"></div>

                {/* Subtotal Row */}
                <div className='flex justify-between items-center'>
                    <p className='text-[16px] sm:text-[18px] w-[70%]'>Subtotal</p>
                    <p className='text-[16px] sm:text-[18px] w-[30%] text-right'>৳ {(token ? totalDB : total)} Tk</p>
                </div>
            </div>

            {/* payable informations here  */}
            <div className='bg-successbg rounded-[10px] py-[20px] px-[20px] sm:px-[40px] border border-customgreen'>
                <div>
                    <p className='text-[16px] text-customgreen flex gap-[5px] mt-[14px]'>
                        <span className='size-[22px] flex justify-center items-center rounded-full text-white bg-customgreen'>৳</span>
                        Your are saving ৳ {totalDiscountDB} TK.
                    </p>

                    {appliedCoupon && couponData && (
                        <p className='text-[16px] text-customgreen flex gap-[5px]'>
                            <span className='size-[22px] flex justify-center items-center rounded-full text-white bg-customgreen'>৳</span>
                            You are saving ৳{discountAmount} in this order.
                        </p>
                    )}

                    {
                        shippingCost &&
                        <p className='text-[16px] text-customgreen flex gap-[5px] mt-[14px]'>
                            <span className='size-[22px] flex justify-center items-center rounded-full text-white bg-customgreen'>৳</span>
                            Your Delivery charge ৳ {shippingCost} TK.
                        </p>
                    }

                </div>

                <div className="bg-customgreen h-[1px] w-full my-[20px] sm:my-[30px]"></div>

                <div className='flex justify-between'>
                    <p className='text-[20px] sm:text-[24px] font-[650]'>Amount Payable</p>
                    <p className='text-[20px] sm:text-[24px] font-[650]'>
                        ৳ {(token ? totalDB : total) - discountAmount + shippingCost} Tk
                    </p>
                </div>

                <div className="bg-customgreen h-[1px] w-full my-[20px] sm:my-[30px]"></div>

                {/* accept agreement  */}
                <button onClick={() => setAcceptTerms(!acceptTerms)} className='mt-[34px] mb-[50px] flex lg:items-center gap-[6px] sm:gap-[12px]'>
                    <span>
                        {
                            acceptTerms ?
                                <MdCheckCircle className="text-[20px] sm:text-[24px] text-customgreen" />
                                :
                                <MdOutlineRadioButtonUnchecked className="text-[20px] sm:text-[24px] text-primarymagenta" />
                        }
                    </span>
                    <p className='text-left'>By continuing you agree to <Link href={"/terms-and-conditions"} className='hover:text-natural hover:underline'>Terms & Conditions</Link>, <Link href={"/privacy-policy"} className='hover:text-natural hover:underline'>Privacy Policy</Link>, <Link href={"/return-and-refund-policy"} className='hover:text-natural hover:underline'>Refund & Return Policy</Link></p>
                </button>

                {/* place order button  */}
                <button
                    onClick={handleOrderPlace}
                    disabled={loading === true}
                    className={`text-center min-w-full py-[16px] rounded-[5px] ease-linear duration-300 cursor-pointer transition ${loading
                        ? 'bg-creamline text-primarymagenta cursor-not-allowed'
                        : 'bg-natural text-white hover:bg-accent cursor-pointer'
                        }`}>
                    {loading ? (
                        <LoadingSvg label='Placing order' color="text-primarymagenta" />
                    ) : (
                        "Place order"
                    )}
                </button>
            </div>
        </section>
    )
}
