"use client";
import { ChevronDown, Heart, Menu, Phone, Search, ShoppingBag, User, LogOut, Package, UserCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import Container from "../Container";
import CategoryDropdown from "./CategoryDropdown";
import GlobalSearch from "./GlobalSearch";
import { useAppContext } from "@/app/context/AppContext";

export default function DesktopNavbar({ logo, menuItems = [], categories = [], contactInfo, cartInfo, wishlistCount }) {
    const [showCategories, setShowCategories] = useState(false);
    const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [showAccountPopover, setShowAccountPopover] = useState(false);

    // Refs for click outside detection
    const categoryRef = useRef(null);
    const languageRef = useRef(null);
    const accountRef = useRef(null);

    // Get language state and setter from context
    const { lang, setLang, handleLogout } = useAppContext();

    // Check if user is logged in (you might need to adjust this based on your auth logic)
    const isLoggedIn = contactInfo?.name; // Assuming if name exists, user is logged in

    // Language options
    const languages = [
        { code: 'en', label: 'English', },
        { code: 'ar', label: 'العربية', }
    ];

    // Translation object
    const translations = {
        en: {
            searchPlaceholder: "Search anything...",
            welcome: "Welcome",
            loginRegister: "Log In / Register",
            cart: "Cart",
            listCategory: "Browse Categories",
            hotline: "Hotline 24/7",
            myProfile: "My Profile",
            myOrders: "My Orders",
            logout: "Logout"
        },
        ar: {
            searchPlaceholder: "البحث عن أي شيء...",
            welcome: "مرحباً",
            loginRegister: "تسجيل الدخول / التسجيل",
            cart: "السلة",
            listCategory: "تصفح الفئات",
            hotline: "الخط الساخن 24/7",
            myProfile: "ملفي الشخصي",
            myOrders: "طلباتي",
            logout: "تسجيل الخروج"
        }
    };

    // Get current translations
    const t = translations[lang] || translations.en;

    // Handle language change
    const handleLanguageChange = (languageCode) => {
        setLang(languageCode);
        localStorage.setItem('EnayamallLang', languageCode);
        setShowLanguageDropdown(false);
    };

    // Get current language display
    const currentLanguage = languages.find(l => l.code === lang) || languages[0];

    // Click outside handler
    useEffect(() => {
        const handleClickOutside = (event) => {
            // Close category dropdown
            if (categoryRef.current && !categoryRef.current.contains(event.target)) {
                setShowCategories(false);
            }

            // Close language dropdown
            if (languageRef.current && !languageRef.current.contains(event.target)) {
                setShowLanguageDropdown(false);
            }

            // Close account popover
            if (accountRef.current && !accountRef.current.contains(event.target)) {
                setShowAccountPopover(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <>
            <div className={`hidden lg:block relative ${lang === 'ar' ? 'rtl' : 'ltr'}`}>
                <Container>
                    {/* Top section */}
                    <div className={`flex justify-between items-center py-5 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                        {/* Logo */}
                        <Link href="/">
                            <Image src={logo} height={50} width={200} alt="Logo" />
                        </Link>

                        {/* Search */}
                        <div className="flex-1 w-full mx-8">
                            <button
                                onClick={() => setShowSearch(true)}
                                className={`w-full flex items-center gap-3 bg-gray-100 px-5 py-3 rounded-full transition-colors group ${lang === 'ar' ? 'flex-row-reverse' : ''}`}
                            >
                                <Search className="size-5 text-gray-500 group-hover:text-primary transition-colors" />
                                <span className={`flex-1 text-sm text-gray-500 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{t.searchPlaceholder}</span>
                            </button>
                        </div>

                        {/* Actions */}
                        <div className={`flex gap-4 items-center ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                            {/* Wishlist */}
                            <Link href="/wishlist">
                                <button className="cursor-pointer bg-primary text-white size-10 rounded-full flex justify-center items-center hover:bg-primary/90 transition-colors relative">
                                    <Heart className="size-5" />
                                    {wishlistCount > 0 && (
                                        <span className="absolute -top-2 -right-2 bg-secondary text-white text-xs rounded-full size-5 flex items-center justify-center">
                                            {wishlistCount}
                                        </span>
                                    )}
                                </button>
                            </Link>

                            {/* User actions */}
                            <div
                                ref={accountRef}
                                className={`flex gap-2 items-center relative ${lang === 'ar' ? 'flex-row-reverse' : ''}`}
                                onMouseEnter={() => isLoggedIn && setShowAccountPopover(true)}
                                onMouseLeave={() => setShowAccountPopover(false)}
                            >
                                <Link href={isLoggedIn ? "/account" : "/login"}>
                                    <button className="bg-primary text-white size-10 rounded-full flex justify-center items-center hover:bg-primary/90 transition-colors">
                                        <User className="size-5" />
                                    </button>
                                </Link>
                                <div className="text-gray-600 hidden xl:block">
                                    <p className={`text-sm ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{t.welcome}</p>
                                    {isLoggedIn ? (
                                        <Link href="/account" className="font-semibold hover:text-primary transition-colors">
                                            {contactInfo?.name}
                                        </Link>
                                    ) : (
                                        <Link href="/login" className="font-semibold hover:text-primary transition-colors">
                                            {t.loginRegister}
                                        </Link>
                                    )}
                                </div>

                                {/* Account Popover */}
                                {isLoggedIn && showAccountPopover && (
                                    <div className={`absolute top-9 ${lang === 'ar' ? '-left-9' : '-right-9'} mt-2 bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-[180px] z-50`}>
                                        <Link href="/account">
                                            <button className={`w-full px-4 py-3 text-sm hover:bg-gray-100 transition-colors flex items-center gap-3 text-gray-700 cursor-pointer ${lang === 'ar' ? 'flex-row-reverse text-right' : 'text-left'}`}>
                                                <UserCircle className="size-4" />
                                                <span>{t.myProfile}</span>
                                            </button>
                                        </Link>
                                        <Link href="/orders">
                                            <button className={`w-full px-4 py-3 text-sm hover:bg-gray-100 transition-colors flex items-center gap-3 text-gray-700 ${lang === 'ar' ? 'flex-row-reverse text-right' : 'text-left'}`}>
                                                <Package className="size-4" />
                                                <span>{t.myOrders}</span>
                                            </button>
                                        </Link>
                                        <hr className="my-2 border-gray-200" />
                                        <button
                                            onClick={handleLogout}
                                            className={`w-full px-4 py-3 text-sm hover:bg-gray-100 transition-colors flex items-center gap-3 text-red-600 ${lang === 'ar' ? 'flex-row-reverse text-right' : 'text-left'}`}
                                        >
                                            <LogOut className="size-4" />
                                            <span>{t.logout}</span>
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Cart action */}
                            <Link href="/cart" className={`flex gap-2 items-center ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                                <button className="bg-primary text-white size-10 rounded-full flex justify-center items-center hover:bg-primary/90 transition-colors relative cursor-pointer">
                                    <ShoppingBag className="size-5" />
                                    {cartInfo?.itemCount > 0 && (
                                        <span className="absolute -top-2 -right-2 bg-secondary text-white text-xs rounded-full size-5 flex items-center justify-center">
                                            {cartInfo.itemCount}
                                        </span>
                                    )}
                                </button>
                                <div className="text-gray-600 hidden xl:block">
                                    <p className={`text-sm ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{t.cart}</p>
                                    <p className={`font-semibold flex items-center gap-1`}>
                                        <span className="dirham-symbol">ê</span> {cartInfo?.total?.toLocaleString() || "0"}
                                    </p>
                                </div>
                            </Link>
                        </div>
                    </div>
                </Container>

                {/* Menu Section */}
                <div className="bg-primary text-white py-4">
                    <Container>
                        <div className={`flex justify-between items-center ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                            {/* Left/Right side based on language */}
                            <div className={`flex gap-8 items-center ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                                {/* Category */}
                                <div
                                    ref={categoryRef}
                                    className={`relative`}
                                    onClick={() => setShowCategories(!showCategories)}
                                >
                                    <button className={`flex gap-2 items-center cursor-pointer hover:text-gray-200 w-[200px] transition-colors ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                                        <Menu className="size-5" />
                                        <p>{t.listCategory}</p>
                                    </button>

                                    {/* Categories Dropdown */}
                                    {showCategories && (
                                        <CategoryDropdown
                                            categories={categories}
                                            onClose={() => setShowCategories(false)}
                                            className={`absolute top-full mt-5 ${lang === 'ar' ? 'right-0' : 'left-0'} z-50`}
                                        />
                                    )}
                                </div>

                                {/* Dynamic menu items */}
                                {menuItems.map((item, index) => (
                                    <Link
                                        key={index}
                                        href={item.href}
                                        className="hover:text-gray-200 transition-colors"
                                    >
                                        {lang === 'ar' && item.nameAr ? item.nameAr : item.name}
                                    </Link>
                                ))}
                            </div>

                            {/* Right/Left side based on language */}
                            <div className={`flex gap-8 items-center ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                                {contactInfo?.phone && (
                                    <div className={`flex gap-2 items-center border border-white/30 py-2 px-4 rounded-full hover:bg-white/10 transition-colors ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                                        <Phone className="size-4" />
                                        <p className="text-sm">{t.hotline} {contactInfo.phone}</p>
                                    </div>
                                )}

                                {/* Language Selector */}
                                <div className="relative" ref={languageRef}>
                                    <div
                                        className={`flex gap-2 items-center cursor-pointer hover:opacity-80 transition-opacity ${lang === 'ar' ? 'flex-row-reverse' : ''}`}
                                        onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                                    >
                                        <p className="text-sm">{currentLanguage.label}</p>
                                        <ChevronDown className={`size-4 transition-transform ${showLanguageDropdown ? 'rotate-180' : ''}`} />
                                    </div>

                                    {/* Language Dropdown */}
                                    {showLanguageDropdown && (
                                        <div className={`absolute top-full ${lang === 'ar' ? 'left-0' : 'right-0'} mt-2 bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-[120px] z-50`}>
                                            {languages.map((language) => (
                                                <button
                                                    key={language.code}
                                                    onClick={() => handleLanguageChange(language.code)}
                                                    className={`w-full px-4 py-2 text-sm hover:bg-gray-100 transition-colors flex items-center gap-2 ${lang === language.code
                                                        ? 'text-primary font-medium bg-gray-50'
                                                        : 'text-gray-700'
                                                        } ${lang === 'ar' ? 'text-right flex-row-reverse' : 'text-left'}`}
                                                >
                                                    <span>{language.label}</span>
                                                    {lang === language.code && (
                                                        <span className={`text-primary ${lang === 'ar' ? 'mr-auto' : 'ml-auto'}`}>✓</span>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Container>
                </div>
            </div>

            {/* Search Modal */}
            <GlobalSearch
                isOpen={showSearch}
                onClose={() => setShowSearch(false)}
                isMobile={false}
            />
        </>
    );
}