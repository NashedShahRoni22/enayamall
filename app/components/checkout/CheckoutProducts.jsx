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
    const { token, guestToken, cart, cartDB, total, totalDB, totalDiscountDB, lang } = useAppContext();
    const currentCart = token ? cartDB : cart;
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [appliedCoupon, setAppliedCoupon] = useState(false);
    const [couponData, setCouponData] = useState(null);


    // Free shipping check
    const [freeShippingAmount, setFreeShippingAmount] = useState(null);

    useEffect(() => {
        async function fetchFreeShipping() {
        try {
            const res = await fetch(
            `${process.env.NEXT_PUBLIC_WEB_API_BASE_URL}amount-to-reach-for-free-shipping`
            );
            const json = await res.json();
            if (json?.status === "success") {
                setFreeShippingAmount(json.data); // 20 or null
            }
        } catch (error) {
            console.error("Error fetching free shipping:", error);
        }
        }
        fetchFreeShipping();
    }, []);
    
    // Localization texts
    const texts = {
        en: {
            product: "Product",
            subTotal: "Sub total",
            subtotal: "Subtotal",
            flatRate: "Flat Rate",
            youSaving: "Via Coupon",
            deliveryCharge: "Your Delivery charge",
            amountPayable: "Amount Payable",
            byContinuing: "By continuing you agree to",
            termsConditions: "Terms & Conditions",
            privacyPolicy: "Privacy Policy",
            refundReturn: "Refund & Return Policy",
            placeOrder: "Place order",
            placingOrder: "Placing order",
            selectShippingAddress: "Select shipping address!",
            selectPaymentMethod: "Select payment method!",
            agreeTermsConditions: "Agree to Terms & Conditions, Privacy Policy, Refund & Return Policy!",
            placingOrderText: "Placing order...",
            orderPlacedSuccess: "Order placed successfully!",
            failedSubmitOrder: "Failed to submit order"
        },
        ar: {
            product: "المنتج",
            subTotal: "المجموع الفرعي",
            subtotal: "المجموع الفرعي",
            flatRate: "تكلفة شحن ثابنة",
            youSaving: "أنت توفر",
            deliveryCharge: "رسوم التوصيل",
            amountPayable: "المبلغ المستحق",
            byContinuing: "بالمتابعة فإنك توافق على",
            termsConditions: "الشروط والأحكام",
            privacyPolicy: "سياسة الخصوصية",
            refundReturn: "سياسة الاسترداد والإرجاع",
            placeOrder: "تأكيد الطلب",
            placingOrder: "جاري تأكيد الطلب",
            selectShippingAddress: "اختر عنوان الشحن!",
            selectPaymentMethod: "اختر طريقة الدفع!",
            agreeTermsConditions: "وافق على الشروط والأحكام وسياسة الخصوصية وسياسة الاسترداد والإرجاع!",
            placingOrderText: "جاري تأكيد الطلب...",
            orderPlacedSuccess: "تم تأكيد الطلب بنجاح!",
            failedSubmitOrder: "فشل في تأكيد الطلب"
        }
    };

    const t = texts[lang] || texts.en;

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

    // place order
    const postOrder = usePostDataWithToken('order');
    const queryClient = useQueryClient();

    const handleOrderPlace = async () => {
        if (addressId === null) {
            toast.error(t.selectShippingAddress);
            return;
        }

        if (method === null) {
            toast.error(t.selectPaymentMethod);
            return;
        }

        if (acceptTerms === false) {
            toast.error(t.agreeTermsConditions);
            return;
        }

        // Determine actual shipping cost
        const actualShippingCost =
            freeShippingAmount != null && (token ? totalDB : total) > freeShippingAmount
                ? 0
                : shippingCost || 0;
                
        setLoading(true);
        const form = new FormData();
        form.append('total', totalDB - discountAmount + actualShippingCost);
        form.append('address_id', addressId);
        form.append('coupon_id', couponData?.coupon_id ? couponData?.coupon_id : null);
        form.append('coupon_discount_amount', discountAmount);
        form.append('guest_token', guestToken);
        form.append('shipping_cost', actualShippingCost);
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
                    loading: t.placingOrderText,
                    success: t.orderPlacedSuccess,
                    error: (err) => err.message || t.failedSubmitOrder,
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
        <section className='text-primaryblack flex flex-col gap-[20px]'>
            {/* products informations here  */}
            <div className='bg-creamline rounded-[10px] p-[20px]'>
                <p className='text-xl font-bold text-primaryblack mb-1'>{t.product}</p>

                <div className="bg-[#d5d5d5] h-[1px] w-full my-[10px]"></div>

                <div className='flex flex-col gap-[10px]'>
                    {currentCart?.map((c, index) => (
                        <div key={index} className='flex justify-between items-center'>
                            <div className='flex justify-between items-center w-[70%]'>
                                <p className="truncate pr-2">{lang === 'ar' ? c.ar_name : c.name}</p>
                                <p className="whitespace-nowrap">x {c.quantity}</p>
                            </div>
                            <p className='w-[30%] text-right'><span className="dirham-symbol">ê</span> {(c.price * c.quantity)}</p>
                        </div>
                    ))}
                </div>

                <div className="bg-[#d5d5d5] h-[1px] w-full my-[10px]"></div>

                <div className='flex justify-between items-center'>
                    <p className='text-[14px] sm:text-[16px] font-semibold w-[70%]'>{t.subtotal}</p>
                    <p className='text-[14px] sm:text-[16px] font-semibold w-[30%] text-right'><span className="dirham-symbol">ê</span> {(token ? totalDB : total)}</p>
                </div>
            </div>

            {/* payable informations here  */}
            <div className='bg-creamline rounded-[10px] p-[20px]'>
                <div>
                    <p className='text-xl font-bold text-primaryblack mb-4'>Shipping Cost</p>

                    {
                        shippingCost &&
                        <p className='text-[16px] text-primary flex justify-between mt-[10px]'>
                            {t.flatRate} 
                            <div>
                                {
                                    freeShippingAmount != null && (
                                        (token ? totalDB : total) > freeShippingAmount ? (
                                            <div className='flex gap-1'>
                                                <div className="relative inline-block line-through">
                                                    <span className="dirham-symbol">ê</span> {shippingCost} 
                                                </div>
                                                <p className='font-semibold text-green-800'>FREE</p>
                                            </div>
                                        ) : (
                                            <div className='flex gap-1'>
                                                <div className="relative inline-block">
                                                    <span className="dirham-symbol">ê</span> {shippingCost} 
                                                </div>
                                            </div>
                                        )
                                    )
                                }
                            </div>
                        </p>
                    }
                    

                    {/* {appliedCoupon && couponData && (
                        <p className='text-[16px] text-primary flex gap-[5px]'>
                            <span className='size-[22px] flex justify-center items-center rounded-full text-white bg-primary'>D</span>
                            {t.youSaving} <span className="dirham-symbol">ê</span> {discountAmount}
                        </p>
                    )} */}

                </div>

                <div className="bg-[#d5d5d5] h-[.5px] w-full my-[15px]"></div>

                <div className='flex justify-between'>
                    <p className='text-[18px] sm:text-[20px] font-[650]'>{t.amountPayable}</p>
                    <p className='text-[18px] sm:text-[20px] font-[650]'>
                        <span className="dirham-symbol">ê</span> {Math.max(
                            0,
                            (token ? totalDB : total) - discountAmount + (
                                freeShippingAmount != null && (token ? totalDB : total) > freeShippingAmount
                                    ? 0
                                    : (shippingCost || 0)
                            )
                        )}
                    </p>
                </div>

                {/* <div className="bg-primary h-[1px] w-full my-[20px] sm:my-[30px]"></div> */}

                {/* accept agreement  */}
                <button onClick={() => setAcceptTerms(!acceptTerms)} className='mt-[34px] mb-[50px] flex lg:items-center gap-[6px] sm:gap-[12px]'>
                    <span>
                        {
                            acceptTerms ?
                                <MdCheckCircle className="text-[20px] sm:text-[24px] text-primary" />
                                :
                                <MdOutlineRadioButtonUnchecked className="text-[20px] sm:text-[24px] text-primaryblack" />
                        }
                    </span>
                    <p className='text-left'>
                        {t.byContinuing} <Link href={"/terms-and-conditions"} className='hover:text-primary hover:underline'>{t.termsConditions}</Link>, <Link href={"/privacy-policy"} className='hover:text-primary hover:underline'>{t.privacyPolicy}</Link>, <Link href={"/return-and-refund-policy"} className='hover:text-primary hover:underline'>{t.refundReturn}</Link>
                    </p>
                </button>

                {/* place order button  */}
                <button
                    onClick={handleOrderPlace}
                    disabled={loading === true}
                    className={`text-center min-w-full rounded-lg py-[16px] ease-linear duration-300 cursor-pointer transition ${loading
                        ? 'bg-creamline text-primaryblack cursor-not-allowed'
                        : 'bg-primary text-white cursor-pointer'
                        }`}>
                    {loading ? (
                        <LoadingSvg label={t.placingOrder} color="text-primaryblack" />
                    ) : (
                        t.placeOrder
                    )}
                </button>
            </div>
        </section>
    )
}