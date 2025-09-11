"use client"
import Image from 'next/image';
import Container from '../components/shared/Container';
import PageHeader from '../components/shared/PageHeader';
import PrivateRoute from '../components/shared/private/PrivateRoute';
import { useAppContext } from '../context/AppContext';
import Profile from '../components/account/Profile';
import Orders from '../components/account/Orders';
import { useState, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { usePostDataWithToken } from '../components/helpers/usePostDataWithToken';
import { useGetDataWithToken } from '../components/helpers/useGetDataWithToken';
import toast from 'react-hot-toast';
import ScreenLoader from '../components/loaders/ScreenLoader';
import { FiShoppingBag, FiHeart, FiShoppingCart, FiLogOut, FiUser } from 'react-icons/fi';
import { BiUser } from "react-icons/bi";
import { HiDotsHorizontal } from "react-icons/hi";
import { useRouter } from 'next/navigation';
import { HandshakeIcon, LocateIcon, Map, User2 } from 'lucide-react';
import Affiliate from '../components/account/Affiliate';
import BillForm from '../components/checkout/BillForm';

export default function Page() {
    const { token, handleLogout } = useAppContext();
    const router = useRouter();
    const [addressId, setAddressId] = useState(null);
    const [method, setMethod] = useState(null);
    const [selectedDistrictId, setSelectedDistrictId] = useState(null);
    // get address 
    const { data: address } = useGetDataWithToken(`address`, token);

    // get orders
    const { data: ordersData, isLoading, error } = useGetDataWithToken(`orders`, token);
    const orders = ordersData?.data;

    //   managed tab here 
    const [activeTab, setActiveTab] = useState("Orders");

    const mobileTabButtons = [
        { icon: Map, title: "Address" },
        { icon: FiShoppingBag, title: "Orders" },
        { icon: HandshakeIcon, title: "Affiliate" },
    ];

    const tabButtons = [
        { icon: FiShoppingBag, title: "Orders" },
        { icon: Map, title: "Address" },
        { icon: FiHeart, title: "Wishlist" },
        { icon: FiShoppingCart, title: "Cart" },
        { icon: HandshakeIcon, title: "Affiliate" },
    ];


    const profileTab = useMemo(() =>
        <BillForm
            address={address}
            addressId={addressId}
            setAddressId={setAddressId}
            method={method}
            setMethod={setMethod}
            selectedDistrictId={selectedDistrictId}
            setSelectedDistrictId={setSelectedDistrictId}
        />
    );
    const ordersTab = useMemo(() => <Orders orders={orders} />,);
    const affiliateTab = useMemo(() => <Affiliate />,);

    const renderActiveTab = () => {
        switch (activeTab) {
            case "Address":
                return profileTab;
            case "Orders":
            case "Wishlist":
            case "Cart":
                return ordersTab;
            case "Affiliate":
                return affiliateTab;
            default:
                return profileTab;
        }
    };

    if (isLoading) return <ScreenLoader />;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <PrivateRoute>
            {/* <PageHeader title={"My Account"} from={"Home"} to={"account"} /> */}
            <Container>
                <section className='pt-[30px] lg:pt-[60px] pb-[60px] lg:pb-[120px] flex flex-col lg:flex-row gap-[24px]'>
                    {/* Mobilebar  */}
                    <div className='relative lg:hidden'>
                        <div className='flex justify-between right-0 gap-4'>
                            {mobileTabButtons.map((tb, index) => {
                                const IconComponent = tb.icon;
                                const isActive = activeTab === tb.title;

                                return (
                                    <button
                                        onClick={() => {
                                            setActiveTab(tb.title);
                                        }}
                                        key={index}
                                        className={`${isActive && "bg-blue-50"} cursor-pointer rounded-xl w-full flex flex-col items-center gap-[10px] px-[16px] py-[16px] border-t-2 border-white transition-colors duration-200 ${isActive
                                            ? "text-primary"
                                            : "text-primaryblack hover:text-primary"
                                            }`}
                                    >
                                        <IconComponent
                                            size={20}
                                        />
                                        <span >
                                            {tb.title}
                                        </span>
                                    </button>
                                );
                            })}

                            {/* Logout Button */}
                            {/* <button
                                onClick={handleLogout}
                                className='cursor-pointer w-full flex items-center text-primary gap-[10px] px-[16px] py-[8px] border-t-2 border-white'
                            >
                                <FiLogOut className='size-[20px]' />
                                Logout
                            </button> */}
                        </div>
                    </div>
                    {/* Sidebar for desktop */}
                    <div className='hidden lg:block rounded-[10px] lg:w-[300px] h-fit lg:sticky lg:top-26'>
                        {/* user image & info here */}
                        {/* <div className='flex items-center gap-[20px]'>
                            {address?.photo ? (
                                <Image
                                    src={address?.photo}
                                    height={60}
                                    width={60}
                                    className="size-[60px] rounded-full object-cover"
                                    alt="user profile image"
                                />
                            ) : (
                                <div className='size-[60px] flex justify-center items-center bg-white rounded-full'>
                                    <BiUser className='text-[30px] text-primaryblack' />
                                </div>
                            )}

                            <div className='flex flex-col items-start gap-[20px]'>
                                <p className='text-[20px] text-primaryblack'>{address?.name}</p>
                                <button onClick={() => setActiveTab("Address")} className='text-[14px] text-primary cursor-pointer'>
                                    Edit profile
                                </button>
                            </div>
                        </div> */}

                        {/* Navigation Buttons */}
                        <div>
                            {tabButtons.map((tb, index) => {
                                const IconComponent = tb.icon;
                                const isActive = activeTab === tb.title;

                                return (
                                    <div className='border border-creamline rounded-xl pl-3 not-last:mb-3' key={index}>
                                        <button
                                            onClick={() => {
                                                if (tb.title === "Wishlist") {
                                                    router.push("/wishlist");
                                                } else if (tb.title === "Cart") {
                                                    router.push("/cart");
                                                } else {
                                                    setActiveTab(tb.title);
                                                }
                                            }}
                                            key={index}
                                            className={`cursor-pointer w-full flex items-center gap-[20px] py-[10px] transition-colors duration-200 ${isActive ? "text-primary" : "text-primaryblack hover:text-primary"
                                                }`}
                                        >
                                            <IconComponent size={20} />
                                            <span>{tb.title}</span>
                                        </button>
                                    </div>
                                );
                            })}

                            {/* Logout Button */}
                            <div className='border bg-primary border-primary rounded-xl pl-3'>
                                <button
                                    onClick={handleLogout}
                                    className='cursor-pointer w-full flex items-center text-white gap-[20px] py-[10px]'
                                >
                                    <FiLogOut className='size-[20px]' />
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>


                    {/* Main Content Area */}
                    <div className='flex-1'>
                        {renderActiveTab()}
                    </div>
                </section>
            </Container>
        </PrivateRoute>
    );
}
