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
import { HandshakeIcon, User2 } from 'lucide-react';
import Affiliate from '../components/account/Affiliate';
import BillForm from '../components/checkout/BillForm';

export default function Page() {
    const { token, handleLogout } = useAppContext();
    const router = useRouter();
    const [addressId, setAddressId] = useState(null);
    const [method, setMethod] = useState(null);
    const [selectedDistrictId, setSelectedDistrictId] = useState(null);
    
    // manage bar 
    const [show, setShow] = useState(false);
    // get address 
    const { data: address } = useGetDataWithToken(`address`, token);

    // get orders
    const { data: ordersData, isLoading, error } = useGetDataWithToken(`orders`, token);
    const orders = ordersData?.data;

    //   managed tab here 
    const [activeTab, setActiveTab] = useState("Orders");

    const mobileTabButtons = [
        { icon: FiUser, title: "Profile" },
        { icon: FiShoppingBag, title: "Orders" },
        { icon: HandshakeIcon, title: "Affiliate Account" },
    ];

    const tabButtons = [
        { icon: User2, title: "Profile" },
        { icon: FiShoppingBag, title: "Orders" },
        { icon: FiHeart, title: "Wishlist" },
        { icon: FiShoppingCart, title: "Cart" },
        { icon: HandshakeIcon, title: "Affiliate Account" },
    ];


    const profileTab = useMemo(() => <BillForm
        address={address}
        addressId={addressId}
        setAddressId={setAddressId}
        method={method}
        setMethod={setMethod}
        selectedDistrictId={selectedDistrictId}
        setSelectedDistrictId={setSelectedDistrictId}
    />,);
    const ordersTab = useMemo(() => <Orders orders={orders} />,);
    const affiliateTab = useMemo(() => <Affiliate />,);

    const renderActiveTab = () => {
        switch (activeTab) {
            case "Profile":
                return profileTab;
            case "Orders":
            case "Wishlist":
            case "Cart":
                return ordersTab;
            case "Affiliate Account":
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
                                            setShow(false)
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
                    <div className='hidden lg:block bg-light py-[20px] px-[30px] rounded-[10px] lg:w-[300px] h-fit lg:sticky lg:top-26'>
                        <div className='flex items-center gap-[20px]'>
                            {/* user image here */}
                            {address?.photo ? (
                                <Image
                                    src={address?.photo}
                                    height={100}
                                    width={100}
                                    className="size-[100px] rounded-full object-cover"
                                    alt="user profile image"
                                />
                            ) : (
                                <div className='size-[100px] flex justify-center items-center bg-white rounded-full'>
                                    <BiUser className='text-[50px] text-primaryblack' />
                                </div>
                            )}

                            <div className='flex flex-col items-start gap-[20px]'>
                                <p className='text-[20px] text-primaryblack'>{address?.name}</p>
                                {/* <button onClick={() => setActiveTab("Profile")} className='text-[14px] text-primary cursor-pointer'>
                                    Edit profile
                                </button> */}
                            </div>
                        </div>

                        {/* Navigation Buttons */}
                        <div className='mt-[20px]'>
                            {tabButtons.map((tb, index) => {
                                const IconComponent = tb.icon;
                                const isActive = activeTab === tb.title;

                                return (
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
                                        className={`cursor-pointer w-full flex items-center gap-[20px] py-[20px] border-t-2 border-white transition-colors duration-200 ${isActive ? "text-primary" : "text-primaryblack hover:text-primary"
                                            }`}
                                    >
                                        <IconComponent size={20} />
                                        <span>{tb.title}</span>
                                    </button>
                                );
                            })}

                            {/* Logout Button */}
                            <button
                                onClick={handleLogout}
                                className='cursor-pointer w-full flex items-center text-secondary gap-[20px] py-[20px] border-t-2 border-white'
                            >
                                <FiLogOut className='size-[20px]' />
                                Logout
                            </button>
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
