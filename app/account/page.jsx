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

export default function Page() {
    const { token } = useAppContext();
    const router = useRouter();
    // manage bar 
    const [show, setShow] = useState(false);
    // get address 
    const { data: addressData } = useGetDataWithToken(`profile-address`, token);
    const address = addressData?.data;

    // get orders
    const { data: ordersData, isLoading, error } = useGetDataWithToken(`orders`, token);
    const orders = ordersData?.data;

    //   managed tab here 
    const [activeTab, setActiveTab] = useState("Orders");

    const mobileTabButtons = [
        { icon: FiUser, title: "Profile" },
        { icon: FiShoppingBag, title: "Orders" },
    ];

    const tabButtons = [
        { icon: FiShoppingBag, title: "Orders" },
        { icon: FiHeart, title: "Wishlist" },
        { icon: FiShoppingCart, title: "Cart" },
    ];


    const profileTab = useMemo(() => <Profile address={address} />, );
    const ordersTab = useMemo(() => <Orders orders={orders} />,);

    // Handle logout
    const postLogout = usePostDataWithToken('logout');
    const queryClient = useQueryClient();

    const handleLogout = async () => {
        try {
            await toast.promise(
                postLogout.mutateAsync({
                    formData: new FormData(),
                    token,
                }),
                {
                    loading: 'Logging out...',
                    success: 'Logged out successfully!',
                    error: (err) => err.message || 'Failed to logout',
                }
            );

            localStorage.removeItem('LaminaxUser');
            localStorage.removeItem('LaminaxAuthToken');
            queryClient.clear();
            window.location.href = '/';
        } catch (err) {
            console.error("Logout error:", err);
        }
    };

    const renderActiveTab = () => {
        switch (activeTab) {
            case "Profile":
                return profileTab;
            case "Orders":
            case "Wishlist":
            case "Cart":
                return ordersTab;
            default:
                return profileTab;
        }
    };

    if (isLoading) return <ScreenLoader />;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <PrivateRoute>
            <PageHeader title={"My Account"} from={"Home"} to={"account"} />
            <Container>
                <section className='pt-[30px] lg:pt-[60px] pb-[60px] lg:pb-[120px] flex flex-col lg:flex-row gap-[24px] lg:max-w-6xl lg:mx-auto'>
                    {/* Mobilebar  */}
                    <div className='relative lg:hidden'>
                        <div className='flex justify-end'>
                            <button className='p-1.5 bg-natural text-white rounded-[5px] cursor-pointer' onClick={() => setShow(!show)}>
                                <HiDotsHorizontal className='text-xl' />
                            </button>
                        </div>
                        {
                            show &&
                            <div className='absolute bg-creamline rounded-[5px] right-0 z-50 min-w-[150px]'>
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
                                            className={`cursor-pointer w-full flex items-center gap-[10px] px-[16px] py-[8px] border-t-2 border-white transition-colors duration-200 ${isActive
                                                ? "text-secondary"
                                                : "text-primarymagenta hover:text-secondary"
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
                                <button
                                    onClick={handleLogout}
                                    className='cursor-pointer w-full flex items-center text-secondary gap-[10px] px-[16px] py-[8px] border-t-2 border-white'
                                >
                                    <FiLogOut className='size-[20px]' />
                                    Logout
                                </button>
                            </div>
                        }
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
                                    <BiUser className='text-[50px] text-primarymagenta' />
                                </div>
                            )}

                            <div className='flex flex-col items-start gap-[20px]'>
                                <p className='text-[20px] text-primarymagenta'>{address?.name}</p>
                                <button onClick={() => setActiveTab("Profile")} className='text-[14px] text-primary cursor-pointer'>
                                    Edit profile
                                </button>
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
                                        className={`cursor-pointer w-full flex items-center gap-[20px] py-[20px] border-t-2 border-white transition-colors duration-200 ${isActive ? "text-secondary" : "text-primarymagenta hover:text-secondary"
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
