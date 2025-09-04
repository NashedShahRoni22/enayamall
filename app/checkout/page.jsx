"use client"
import PageHeader from '../components/shared/PageHeader'
import Container from '../components/shared/Container'
import BillForm from '../components/checkout/BillForm'
import PrivateRoute from '../components/shared/private/PrivateRoute'
import CheckoutProducts from '../components/checkout/CheckoutProducts'
import { useGetDataWithToken } from '../components/helpers/useGetDataWithToken'
import { useAppContext } from '../context/AppContext'
import { useState } from 'react'
import ScreenLoader from '../components/loaders/ScreenLoader'
import { useEffect, useState as useStateForShipping } from 'react'

export default function page() {
    const { token, lang } = useAppContext();
    const [addressId, setAddressId] = useState(null);
    const [method, setMethod] = useState(null);
    const [acceptTerms, setAcceptTerms] = useState(false);
    
    const [selectedDistrictId, setSelectedDistrictId] = useState(null);
    
    const [shippingData, setShippingData] = useStateForShipping(null);
    const [shippingLoading, setShippingLoading] = useStateForShipping(false);
    
    // Fetch shipping cost only when addressId exists
    useEffect(() => {
        if (!addressId) {
            setShippingData(null);
            return;
        }

        const fetchShippingCost = async () => {
            try {
                setShippingLoading(true);
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_WEB_API_BASE_URL}get-shipping-cost?address_id=${addressId}`
                );
                
                if (!response.ok) {
                    throw new Error('Failed to fetch shipping cost');
                }
                
                const data = await response.json();
                setShippingData(data);
            } catch (error) {
                console.error('Error fetching shipping cost:', error);
                setShippingData(null);
            } finally {
                setShippingLoading(false);
            }
        };

        fetchShippingCost();
    }, [addressId]);
    
    const shippingCost = shippingData?.data?.cost ? shippingData?.data?.cost : null;
    
    // get address information
    const { data: address, isLoading, error } = useGetDataWithToken(`address`, token);
    
    if (isLoading) return <ScreenLoader/>;
    if (error) return <div>Error: {error.message}</div>;
    
    return (
        <PrivateRoute>
            {/* <PageHeader title={"Checkout"} from={"Home"} to={"checkout"} /> */}
            <Container>
                <div className={`my-[60px] flex flex-col ${lang === "en" ? "xl:flex-row" : "xl:flex-row-reverse"} gap-[24px]`}>
                    {/* left side form  */}
                    <div className='xl:w-1/2'>
                        <BillForm 
                            address={address} 
                            addressId={addressId} 
                            setAddressId={setAddressId} 
                            method={method} 
                            setMethod={setMethod} 
                            selectedDistrictId={selectedDistrictId} 
                            setSelectedDistrictId={setSelectedDistrictId} 
                        />
                    </div>
                    {/* right side details  */}
                    <div className='xl:w-1/2'>
                        <CheckoutProducts 
                            addressId={addressId} 
                            method={method} 
                            shippingCost={shippingCost} 
                            acceptTerms={acceptTerms} 
                            setAcceptTerms={setAcceptTerms} 
                        />
                    </div>
                </div>
            </Container>
        </PrivateRoute>
    )
}