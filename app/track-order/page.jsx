"use client";
import Container from '../components/shared/Container';
import PageHeader from '../components/shared/PageHeader';
import arrowImage from "../resources/track/arrow.png";
import deliveredImage from "../resources/track/delivered.png";
import shippingImage from "../resources/track/shipping.png";
import confirmedImage from "../resources/track/confirmed.png";
import processingImage from "../resources/track/processing.png";
import arrowImageMute from "../resources/track/arrow_muted.png";
import deliveredImageMute from "../resources/track/delivered_mute.png";
import shippingImageMute from "../resources/track/shipping_mute.png";
import confirmedImageMute from "../resources/track/confirmed_mute.png";
import processingImageMute from "../resources/track/processing_mute.png";
import { usePostData } from '../components/helpers/usePostData';
import { useState } from 'react';
import toast from 'react-hot-toast';
import Image from 'next/image';
import LoadingSvg from '../components/shared/LoadingSvg';

export default function Page() {
  const [orderId, setOrderId] = useState('');
  const [deliveryStatus, setDeliveryStatus] = useState('');
  const [trackingResult, setTrackingResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const postTrackOrder = usePostData('track-order');

  const normalizeStatus = (status) => {
    switch ((status || '').toLowerCase()) {
      case 'processing':
        return 'Processing';
      case 'shipping':
        return 'Shipping';
      case 'delivered':
        return 'Delivered';
      case 'pending':
      default:
        return 'Pending';
    }
  };

  const handleTrack = async () => {
    if (!orderId.trim()) {
      toast.error("Please enter a valid Order ID.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("order_id", orderId.trim());

    try {
      const result = await toast.promise(
        postTrackOrder.mutateAsync(formData),
        {
          loading: 'Tracking order...',
          success: 'Order tracked successfully!',
          error: (err) => err.message || 'Failed to track order',
        }
      );
      setTrackingResult(result);
      setDeliveryStatus(normalizeStatus(result.data?.delivery_status));
    } catch (err) {
      console.error("Tracking error:", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusImage = (statusType, currentStatus) => {
    const statusOrder = ['Pending', 'Processing', 'Shipping', 'Delivered'];
    const currentIndex = statusOrder.indexOf(currentStatus);
    const statusIndex = statusOrder.indexOf(statusType);
    const isActive = currentIndex >= statusIndex;

    switch (statusType) {
      case 'Pending':
        return isActive ? processingImage : processingImageMute;
      case 'Processing':
        return isActive ? confirmedImage : confirmedImageMute;
      case 'Shipping':
        return isActive ? shippingImage : shippingImageMute;
      case 'Delivered':
        return isActive ? deliveredImage : deliveredImageMute;
      default:
        return processingImageMute;
    }
  };

  const getArrowImage = (beforeStatus, currentStatus) => {
    const statusOrder = ['Pending', 'Processing', 'Shipping', 'Delivered'];
    const currentIndex = statusOrder.indexOf(currentStatus);
    const beforeIndex = statusOrder.indexOf(beforeStatus);

    return currentIndex > beforeIndex ? arrowImage : arrowImageMute;
  };

  return (
    <section>
      {/* <PageHeader title="Track order" from="home" to="track-order" /> */}
      <Container>
        <div className='pt-[90px] pb-[120px] lg:w-1/2 lg:mx-auto text-primarymagenta min-h-[80vh]'>
          <p className='text-center text-[20px]'>
            To track your order please enter your Order ID in the box below <br />
            and press the "Track" button.
          </p>

          {/* delivery status timeline */}
          <div className='flex justify-center items-center gap-[10px] pt-[40px] pb-[60px]'>
            <Image src={getStatusImage('Pending', deliveryStatus)} alt="Pending" />
            <Image src={getArrowImage('Pending', deliveryStatus)} alt="Arrow" />
            <Image src={getStatusImage('Processing', deliveryStatus)} alt="Processing" />
            <Image src={getArrowImage('Processing', deliveryStatus)} alt="Arrow" />
            <Image src={getStatusImage('Shipping', deliveryStatus)} alt="Shipping" />
            <Image src={getArrowImage('Shipping', deliveryStatus)} alt="Arrow" />
            <Image src={getStatusImage('Delivered', deliveryStatus)} alt="Delivered" />
          </div>

          {/* Current status info */}
          {trackingResult && (
            <div className='text-center mb-[30px]'>
              <p className='text-[18px] font-semibold'>Current Status: {deliveryStatus}</p>
              {trackingResult.data?.estimated_delivery && (
                <p className='text-[16px] mt-[10px]'>
                  Estimated Delivery: {trackingResult.data.estimated_delivery}
                </p>
              )}
            </div>
          )}

          {/* Input field */}
          <p className='text-[18px]'>Order ID</p>
          <input
            type="text"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder="Enter your order ID"
            className="w-full px-[10px] sm:px-[20px] py-[10px] border border-creamline rounded-xl focus:outline-none mt-[20px] text-[16px] text-primarymagenta"
          />

          {/* Button */}
          <button
            onClick={handleTrack}
            disabled={loading}
            className={`w-full px-[10px] sm:px-[20px] py-[10px] ease-linear duration-300 rounded-xl focus:outline-none mt-[30px] text-[18px] ${
              loading
                ? 'bg-creamline cursor-not-allowed'
                : 'bg-primary text-white hover:bg-creamline hover:text-primary cursor-pointer'
            }`}
          >
            {loading ? (
              <LoadingSvg label="Track Order" color="text-primarymagenta" />
            ) : (
              "Track Order"
            )}
          </button>
        </div>
      </Container>
    </section>
  );
}
